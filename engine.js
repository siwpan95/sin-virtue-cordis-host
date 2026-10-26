/* ============================================================
 * 七宗罪 VS 七美德 · 互动叙事原型引擎 (engine.js)
 * 数据驱动：一张卡 = 一个 CardConfig 对象，引擎统一渲染/计时/分支/埋点
 * 对齐《前端开发需求规格》2.1 GameState / CardConfig / ChoiceBranch / Effect
 * 权重口径：0-100 级（原始 0-10 级值 ×6，方向不变）
 * ============================================================ */
(function (global) {
  'use strict';

  const $ = (sel) => {
    if (typeof document === 'undefined') return null;
    const el = document.querySelector(sel);
    if (el) return el;
    // DOM 桩：缺失元素返回空对象，避免测试/缺失节点环境抛错
    return { style: {}, className: '', textContent: '', innerHTML: '',
      children: [], appendChild() {}, querySelector() { return null; },
      querySelectorAll() { return []; }, getBoundingClientRect() { return {}; },
      addEventListener() {}, removeEventListener() {}, setAttribute() {}, dataset: {} };
  };
  const $$ = (sel) => (typeof document !== 'undefined' ? Array.from(document.querySelectorAll(sel)) : []);

  // ---------- 状态（对应 FRS GameState，简化版） ----------
  const state = {
    axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 }, // 0-100
    blood: 7,
    secrets: 0,
    betrayed: 0,
    devotionCounter: 0, // SACR 事件计数器（不缩放）
    flags: [],
    history: [],         // 每张卡选择记录 {cardId, side, reactionMs, timedOut}
  };

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // ---------- 工具：应用 effects（后端权威；此处原型模拟） ----------
  function applyEffects(effects) {
    if (!effects) return;
    effects.forEach((eff) => {
      if (eff.axis) {
        state.axes[eff.axis] = clamp(state.axes[eff.axis] + eff.delta, 0, 100);
      }
      if (eff.var) {
        if (eff.var === 'blood' || eff.var === 'secrets' || eff.var === 'betrayed' || eff.var === 'devotionCounter') {
          state[eff.var] = (state[eff.var] || 0) + (eff.delta || 0);
        }
        if (eff.var === 'flag' && eff.value) state.flags.push(eff.value);
      }
    });
  }

  // ---------- 埋点（原型期打印到 console） ----------
  const analytics = [];
  function track(event, payload) {
    const rec = { t: Date.now(), event, ...payload };
    analytics.push(rec);
    if (typeof console !== 'undefined') console.log('[track]', rec);
  }

  // ---------- 渲染 ----------
  let cardData = null;
  let startTime = 0;
  let timerId = null;
  let timedOut = false;
  let bound = false;

  function render(card) {
    cardData = card;
    timedOut = false;
    startTime = Date.now();
    track('card_present', { cardId: card.cardId, chapter: card.chapter });

    $('#scene').textContent = card.scene;
    $('#location').textContent = `${card.chapter} · ${card.perspective}`;
    $('#cardType').textContent = card.typeLabel || '';
    $('#bloodCount').textContent = state.blood;

    // 分镜
    const shotsEl = $('#shots');
    shotsEl.innerHTML = '';
    (card.shots || []).forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'shot';
      div.style.animationDelay = (i * 0.35) + 's';
      div.innerHTML = `<span class="shot-label">${s.shot}</span>${s.text}`;
      shotsEl.appendChild(div);
    });

    // 选项
    $('#optL .opt-text').textContent = card.options.L.text;
    $('#optR .opt-text').textContent = card.options.R.text;
    $('#conL').textContent = card.options.L.consequence;
    $('#conR').textContent = card.options.R.consequence;
    $('#optL').className = 'option option-l';
    $('#optR').className = 'option option-r';

    // QTE
    const qte = card.type === 'qte';
    const qteWrap = $('#qteWrap');
    qteWrap.style.display = qte ? 'block' : 'none';
    if (qte) startTimer(card.qteMs || 8000);
    else clearTimer();

    $('#result').style.display = 'none';
    $('#nextBtn').style.display = 'none';
    $('#choices').style.display = 'flex';
    updateAxes();
  }

  function startTimer(ms) {
    clearTimer();
    const ring = $('#qteRing');
    const label = $('#qteLabel');
    if (!ring) return;
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = '0';
    void ring.getBoundingClientRect(); // reflow
    ring.style.transition = `stroke-dashoffset ${ms}ms linear`;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = '283'; });
    label.textContent = (ms / 1000).toFixed(0) + 's';
    timerId = setTimeout(() => {
      timedOut = true;
      track('card_timeout', { cardId: cardData.cardId });
      choose('R', true); // 超时默认记 R
    }, ms);
  }
  function clearTimer() {
    if (timerId) clearTimeout(timerId);
    timerId = null;
  }

  // ---------- 选择 ----------
  function choose(side, isTimeout) {
    clearTimer();
    if (!cardData) return;
    const reactionMs = Date.now() - startTime;
    const branch = cardData.options[side];
    track('card_choose', {
      cardId: cardData.cardId, side, reactionMs,
      timedOut: !!isTimeout,
      instinct: reactionMs < 1500 ? 'fast' : (reactionMs >= 4000 ? 'slow' : 'mid'),
    });

    applyEffects(branch.effects);
    state.history.push({ cardId: cardData.cardId, side, reactionMs, timedOut: !!isTimeout });

    // 后果展示
    $('#choices').style.display = 'none';
    const res = $('#result');
    res.style.display = 'block';
    res.className = 'result show ' + (side === 'L' ? 'res-l' : 'res-r');
    res.innerHTML = `
      <div class="result-side">${side === 'L' ? '左 · ' + cardData.options.L.text : '右 · ' + cardData.options.R.text}</div>
      <div class="result-cons">${branch.consequence}</div>
      <div class="result-vars">${formatVars(branch.effects)}</div>
      ${isTimeout ? '<div class="result-timeout">⏱ 超时，系统按你的犹豫判定为此选项</div>' : ''}
    `;

    renderSilhouettes();
    updateAxes();
    $('#nextBtn').style.display = 'inline-block';
    cardData = null; // 锁定，防止重复选择
  }

  function formatVars(effects) {
    if (!effects || !effects.length) return '';
    return effects.map((e) => {
      if (e.axis) return `${axisName(e.axis)} ${e.delta > 0 ? '+' : ''}${e.delta}`;
      if (e.var === 'blood' && e.delta < 0) return `存活 -${Math.abs(e.delta)}`;
      if (e.var === 'flag' && e.value) return `标记「${e.value}」`;
      return '';
    }).filter(Boolean).join('　·　');
  }
  function axisName(a) {
    return { ambition: '野心', possession: '占有', impulse: '冲动', devotion: '克制' }[a] || a;
  }

  function updateAxes() {
    ['ambition', 'possession', 'impulse', 'devotion'].forEach((a) => {
      const v = state.axes[a];
      const bar = $(`#bar-${a}`);
      const val = $(`#val-${a}`);
      if (bar) {
        bar.style.width = v + '%';
        bar.className = 'axis-fill ' + (v > 75 ? 'overload' : (v < 25 ? 'deplete' : ''));
      }
      if (val) val.textContent = v;
    });
  }

  function renderSilhouettes() {
    const wrap = $('#silhouettes');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('div');
      s.className = 'silhouette' + (i < state.blood ? '' : ' dead');
      s.textContent = '🧑';
      wrap.appendChild(s);
    }
  }

  // ---------- 公开 API ----------
  function init(card) {
    renderSilhouettes();
    render(card);
    bind();
  }
  function bind() {
    if (bound) return;
    bound = true;
    $('#optL').addEventListener('click', () => choose('L'));
    $('#optR').addEventListener('click', () => choose('R'));
    // 手势：左右滑动
    const stage = $('#stage');
    let startX = 0;
    if (stage) {
      stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        const dx = (e.changedTouches[0].clientX) - startX;
        if (Math.abs(dx) > 40) choose(dx < 0 ? 'L' : 'R');
      });
    }
    const nextBtn = $('#nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      track('card_advance', { cardId: state.history[state.history.length - 1].cardId });
      if (typeof window.onAdvance === 'function') window.onAdvance();
    });
  }

  const API = {
    init, render, choose, state, analytics, track,
    setState(patch) { Object.assign(state, patch); renderSilhouettes(); updateAxes(); },
    getAnalytics() { return analytics; },
  };
  if (typeof window !== 'undefined') globalThis.PrototypeEngine = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
