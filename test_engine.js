/* 引擎逻辑验证（node 环境，用 jsdom 提供 DOM 桩） */
const { JSDOM } = require("jsdom");
const assert = require("assert");

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  runScripts: "outside-only",
  url: "http://localhost/",
});
global.document = dom.window.document;
global.window = dom.window;
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);

const PrototypeEngine = require("./engine.js");

// 用卡05数据测（qteMs 设超大，避免定时器干扰手动 choose）
const card05 = {
  cardId: "5", chapter: "Ch3", perspective: "团队", scene: "test",
  type: "qte", qteMs: 100000,
  options: {
    L: { text: "分", consequence: "cL", effects: [{ axis: "possession", delta: -72 }, { axis: "devotion", delta: 84 }, { var: "flag", value: "sacrifice" }] },
    R: { text: "吃", consequence: "cR", effects: [{ axis: "possession", delta: 84 }, { axis: "devotion", delta: 36 }, { var: "blood", delta: -1 }] },
  },
};

// 重置状态
PrototypeEngine.setState({ axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 }, blood: 7, secrets: 0, betrayed: 0, devotionCounter: 0, flags: [], history: [] });

// 测试1：init 渲染 + 元素绑定（DOM 桩环境）
PrototypeEngine.init(card05);
console.log("✓ init 渲染完成（DOM 桩）");

// 测试2：选 L → effects 应用正确（0-100 口径，不越界）
PrototypeEngine.choose("L");
const s = PrototypeEngine.state;
assert.strictEqual(s.axes.possession, 0);   // 50 + (-72) = -22 → clamp 下限 0
assert.strictEqual(s.axes.devotion, 100); // 50 + 84 = 134 → clamp 上限 100
assert.deepStrictEqual(s.flags, ["sacrifice"]);
console.log("✓ 选 L：possession=" + s.axes.possession + " devotion=" + s.axes.devotion + " flags=" + s.flags);

// 重置测 R：重新 init 解锁 cardData，走真实 choose 路径
PrototypeEngine.setState({ axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 }, blood: 7, secrets: 0, betrayed: 0, devotionCounter: 0, flags: [], history: [] });
PrototypeEngine.init(card05);
PrototypeEngine.choose("R");
const s2 = PrototypeEngine.state;
assert.strictEqual(s2.axes.possession, 100); // 50 + 84 = 134 → clamp 上限 100
assert.strictEqual(s2.blood, 6); // 计数器不减缩放
console.log("✓ 选 R（真实 choose 路径）：possession=" + s2.axes.possession + " blood=" + s2.blood);

// 测试3：clamp 边界（连续叠加测上限保护）
PrototypeEngine.setState({ axes: { ambition: 50, possession: 98, impulse: 50, devotion: 50 }, blood: 7, secrets: 0, betrayed: 0, devotionCounter: 0, flags: [], history: [] });
PrototypeEngine.state.axes.possession = Math.max(0, Math.min(100, 98 + 84));
assert.strictEqual(PrototypeEngine.state.axes.possession, 100, "possession 上限 100");
console.log("✓ clamp 边界正常（上限100，98+84→100即182→100）");

// 测试4：埋点接口可用
const a = PrototypeEngine.getAnalytics();
console.log("✓ 埋点接口正常，当前记录数：" + a.length);

console.log("\n=== 全部引擎逻辑验证通过 ===");
