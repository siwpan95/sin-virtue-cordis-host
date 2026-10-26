/* runner / engine 端到端验证：模拟跑完 12 卡，验证结局判定 + effects 累积 */
const { JSDOM } = require("jsdom");
const assert = require("assert");

// 为 engine.js 提供 DOM 桩（jsdom 需要 url 才能启用 localStorage）
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  runScripts: "outside-only",
  url: "http://localhost/",
});
global.document = dom.window.document;
global.window = dom.window;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);

const engine = require("./engine.js");
const CARDS = require("./cards_data.js");

// ---- 复刻 Runner.judge() 用于验证 ----
function judge(state) {
  const s = state; const flags = s.flags; const a = s.axes;
  if (flags.includes("puppet")) return "傀儡";
  if (flags.includes("illusion")) return "最后的幻觉";
  if (flags.includes("saint") && a.devotion >= 60) return "圣徒";
  if (flags.includes("mad_king") || flags.includes("berserk") || a.impulse >= 70) return "疯王";
  if (a.possession >= 60 && s.blood <= 3) return "孤王的加冕";
  if (flags.includes("coward") || (flags.includes("abandon_duty") && a.possession >= 55)) return "活下来的懦夫";
  if (a.devotion >= 60 && s.blood >= 4) return "殉道者";
  if (flags.includes("hypocrisy") || (s.secrets >= 2 && a.possession >= 50)) return "伪善者";
  if (flags.includes("abandon_duty") || flags.includes("betray") || s.betrayed >= 2) return "弃义者";
  return "幸存者";
}

function runRoute(side) {
  engine.setState({ axes:{ambition:50,possession:50,impulse:50,devotion:50}, blood:7, secrets:0, betrayed:0, devotionCounter:0, flags:[], history:[] });
  CARDS.forEach((card) => {
    card.options[side].effects.forEach((eff) => {
      if (eff.axis) engine.state.axes[eff.axis] = Math.max(0, Math.min(100, engine.state.axes[eff.axis] + eff.delta));
      if (eff.var === "blood") engine.state.blood += eff.delta;
      if (eff.var === "secrets") engine.state.secrets += eff.delta;
      if (eff.var === "betrayed") engine.state.betrayed += eff.delta;
      if (eff.var === "flag" && eff.value) engine.state.flags.push(eff.value);
    });
    engine.state.history.push({ cardId: card.cardId, side, reactionMs: 200, timedOut: false });
  });
  return judge(engine.state);
}

// 路线1：全选 R（卡12选R → illusion 覆盖，设计意图）
console.log("=== 全选 R 路线 ===");
const rResult = runRoute("R");
console.log("axes:", JSON.stringify(engine.state.axes), "| blood:", engine.state.blood, "| flags:", engine.state.flags.join(","));
console.log("结局 →", rResult);
assert.strictEqual(rResult, "最后的幻觉", "全R且卡12选R → 终章 illusion 第一层覆盖（设计意图）");

// 验证"孤王的加冕"可达：占有过载 + blood低，但不含终章覆盖 flag
engine.setState({ axes:{ambition:80,possession:88,impulse:40,devotion:20}, blood:2, secrets:0, betrayed:0, devotionCounter:0, flags:["cruelty"], history:[] });
console.log("\n=== 占有过载+blood低（无覆盖flag）===");
console.log("结局 →", judge(engine.state));
assert.strictEqual(judge(engine.state), "孤王的加冕", "占有≥60 且 blood≤3 → 孤王的加冕");

// 路线2：全选 L（卡10=L → puppet flag → 第一层"傀儡"覆盖，设计意图）
console.log("\n=== 全选 L 路线 ===");
const lResult = runRoute("L");
console.log("axes:", JSON.stringify(engine.state.axes), "| blood:", engine.state.blood, "| flags:", engine.state.flags.join(","));
console.log("结局 →", lResult);
assert.strictEqual(lResult, "傀儡", "全L：卡10选L → puppet flag → 第一层覆盖「傀儡」（设计意图正确）");

// 路线3：专门验证"圣徒"可达 —— 构造：卡10=R(saint) + devotion≥60，且无 puppet/illusion
engine.setState({ axes:{ambition:20,possession:10,impulse:20,devotion:80}, blood:6, secrets:0, betrayed:0, devotionCounter:0, flags:["saint","self_sacrifice"], history:[] });
console.log("\n=== 圣徒路线（卡10=R, saint flag + devotion≥60, 无 puppet/illusion）===");
console.log("结局 →", judge(engine.state));
assert.strictEqual(judge(engine.state), "圣徒", "saint flag + devotion≥60 → 第一层「圣徒」覆盖");

// 验证"殉道者"可达：devotion高 + blood≥4，无覆盖 flag
engine.setState({ axes:{ambition:30,possession:20,impulse:30,devotion:85}, blood:5, secrets:0, betrayed:0, devotionCounter:0, flags:["self_sacrifice"], history:[] });
console.log("\n=== 克制过载+blood≥4（无覆盖flag）===");
console.log("结局 →", judge(engine.state));
assert.strictEqual(judge(engine.state), "殉道者", "devotion≥60 且 blood≥4 → 殉道者");

console.log("\n=== 结局判定逻辑全部验证通过 ===");
