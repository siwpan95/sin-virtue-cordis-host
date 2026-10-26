/* ============================================================
 * server.js · Node + Express 轻量后端
 * 对齐《前端开发需求规格》5.1：effects 由后端权威计算，前端只做表现回放
 *
 * 设计要点：
 *  - POST /api/choice   → 入参 { sessionId, cardId, side, reactionMs, timedOut }
 *                        返回 { effects[], axes, blood, flags, next }
 *                        effects 由后端根据 cards 配置计算，前端不再本地算
 *  - POST /api/judge    → 入参 { sessionId } → 返回结局对象（三层判定）
 *  - GET  /api/card/:id → 返回单卡渲染数据（前端按需拉取，避免打包全量）
 *  - GET  /api/state    → 调试用，返回当前 session 快照
 *
 * 会话存储：内存 Map（原型期）。正式版替换为 Redis / DB。
 * 防作弊：reactionMs 由后端记录入站时间差二次校验；超时由前端上报 timedOut
 * ============================================================ */
const express = require("express");
const CARDS = require("./cards_data.js");

const app = express();
app.use(express.json());

// ---------- 内存会话存储（原型期；正式版换 Redis） ----------
const sessions = new Map();
const DEFAULT_STATE = () => ({
  axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 },
  blood: 7,
  secrets: 0,
  betrayed: 0,
  devotionCounter: 0,
  flags: [],
  history: [],
  // 用于防作弊：记录上次 card_present 的服务端时间
  lastPresentAt: 0,
  sessionStart: Date.now(),
});

function getSession(id) {
  if (!sessions.has(id)) sessions.set(id, DEFAULT_STATE());
  return sessions.get(id);
}
function cardById(id) {
  return CARDS.find((c) => c.cardId === String(id));
}

// ---------- 权威计算：应用 effects（唯一真理源） ----------
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function applyEffects(state, effects) {
  const applied = [];
  (effects || []).forEach((eff) => {
    if (eff.axis) {
      const before = state.axes[eff.axis];
      const after = clamp(before + eff.delta, 0, 100);
      state.axes[eff.axis] = after;
      applied.push({ kind: "axis", axis: eff.axis, before, after, delta: eff.delta });
    } else if (eff.var === "blood" || eff.var === "secrets" || eff.var === "betrayed" || eff.var === "devotionCounter") {
      const before = state[eff.var] || 0;
      state[eff.var] = before + (eff.delta || 0);
      applied.push({ kind: "var", name: eff.var, before, after: state[eff.var] });
    } else if (eff.var === "flag" && eff.value) {
      if (!state.flags.includes(eff.value)) state.flags.push(eff.value);
      applied.push({ kind: "flag", value: eff.value });
    }
  });
  return applied;
}

// ---------- 结局判定（三层，对齐 FRS 第五章） ----------
function judge(state) {
  const s = state;
  const a = s.axes;
  const has = (v) => s.flags.includes(v);

  // 第一层：特殊/覆盖结局（优先级最高）
  if (has("puppet")) return { name: "傀儡", tag: "覆盖结局", code: "puppet" };
  if (has("illusion")) return { name: "最后的幻觉", tag: "元叙事结局", code: "illusion" };
  if (has("saint") && a.devotion >= 60) return { name: "圣徒", tag: "超然结局", code: "saint" };

  // 第二层：主结局（按优先级）
  if (has("mad_king") || has("berserk") || a.impulse >= 70) {
    return { name: "疯王", tag: "冲动过载", code: "mad_king" };
  }
  if (a.possession >= 60 && s.blood <= 3) {
    return { name: "孤王的加冕", tag: "占有过载 + 孤立", code: "lonely_king" };
  }
  if (has("coward") || (has("abandon_duty") && a.possession >= 55)) {
    return { name: "活下来的懦夫", tag: "自私结局", code: "coward" };
  }
  if (a.devotion >= 60 && s.blood >= 4) {
    return { name: "殉道者", tag: "克制过载", code: "martyr" };
  }
  if (has("hypocrisy") || (s.secrets >= 2 && a.possession >= 50)) {
    return { name: "伪善者", tag: "秘密过载", code: "hypocrite" };
  }
  if (has("abandon_duty") || has("betray") || s.betrayed >= 2) {
    return { name: "弃义者", tag: "关系崩解", code: "betrayer" };
  }
  return { name: "幸存者", tag: "普通结局", code: "survivor" };
}

// 结局三段拼接（叙事层，不影响判定）
function endingNarrative(ending, state) {
  const top = Object.entries(state.axes).sort((a, b) => b[1] - a[1])[0];
  const axisName = { ambition: "野心", possession: "占有", impulse: "冲动", devotion: "克制" }[top[0]];
  return {
    ...ending,
    topAxis: { name: axisName, value: top[1] },
    blood: state.blood,
    flags: state.flags,
  };
}

// ---------- 路由 ----------

// 获取/初始化一张卡（前端按需渲染）
app.get("/api/card/:id", (req, res) => {
  const card = cardById(req.params.id);
  if (!card) return res.status(404).json({ error: "card not found", cardId: req.params.id });
  const { sessionId } = req.query;
  if (sessionId) getSession(sessionId).lastPresentAt = Date.now();
  // 只返回前端渲染所需，隐藏部分敏感配置（如 consistency）可选
  const { consistency, ...safeCard } = card;
  res.json({ card: safeCard, weightsNote: "权重由服务端在 /api/choice 权威下发" });
});

// 提交一次选择 → 返回权威 effects + 新状态 + 下一卡
app.post("/api/choice", (req, res) => {
  const { sessionId, cardId, side, reactionMs, timedOut } = req.body || {};
  if (!sessionId || !cardId || !["L", "R"].includes(side)) {
    return res.status(400).json({ error: "invalid params", require: ["sessionId", "cardId", "side∈{L,R}"] });
  }
  const state = getSession(sessionId);
  const card = cardById(cardId);
  if (!card) return res.status(404).json({ error: "card not found", cardId });

  // 防作弊：reactionMs 合理性校验（前端上报与服务端间隔交叉验证）
  const serverElapsed = state.lastPresentAt ? Date.now() - state.lastPresentAt : null;
  const instinct = reactionMs < 1500 ? "fast" : (reactionMs >= 4000 ? "slow" : "mid");
  const sanity = {
    clientReactionMs: reactionMs,
    serverElapsedMs: serverElapsed,
    drift: serverElapsed != null ? Math.abs((reactionMs || 0) - serverElapsed) : null,
    note: "drift>5000ms 且 reactionMs<300ms 视为可疑（原型期仅记录不拦截）",
  };

  const branch = card.options[side];
  const applied = applyEffects(state, branch.effects);
  state.history.push({ cardId: String(cardId), side, reactionMs: reactionMs || 0, timedOut: !!timedOut });

  // 计算下一卡（简化版：顺序推进；条件分支见 cards 的 next.condition）
  let nextCardId = null;
  const next = card.next || {};
  if (next.force && next.target === "ending") nextCardId = "ending";
  else if (side === "R" && next.R) nextCardId = next.R;       // 右选分支
  else if (side === "L" && next.L) nextCardId = next.L;       // 左选分支
  else {
    const idx = CARDS.findIndex((c) => c.cardId === String(cardId));
    nextCardId = idx >= 0 && idx + 1 < CARDS.length ? CARDS[idx + 1].cardId : "ending";
  }

  state.lastPresentAt = Date.now();

  res.json({
    cardId: String(cardId),
    side,
    appliedEffects: applied,   // 前端据此做动画，不得自行推算
    state: {
      axes: state.axes, blood: state.blood, secrets: state.secrets,
      betrayed: state.betrayed, flags: state.flags,
    },
    next: { cardId: nextCardId, forceEnding: nextCardId === "ending" },
    sanity,
  });
});

// 结算结局
app.post("/api/judge", (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });
  const state = getSession(sessionId);
  const ending = endingNarrative(judge(state), state);
  res.json({
    ending,
    debug: {
      history: state.history,
      axes: state.axes,
      blood: state.blood,
      flags: state.flags,
    },
  });
});

// 调试：会话快照
app.get("/api/state/:sessionId", (req, res) => {
  const state = getSession(req.params.sessionId);
  res.json({ sessionId: req.params.sessionId, ...state, _sessionsCount: sessions.size });
});

// 重置（开发用）
app.post("/api/reset", (req, res) => {
  const { sessionId } = req.body || {};
  if (sessionId) sessions.delete(sessionId);
  res.json({ ok: true, sessionId: sessionId || null });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
}
module.exports = { app, judge, applyEffects, getSession, sessions, DEFAULT_STATE };
