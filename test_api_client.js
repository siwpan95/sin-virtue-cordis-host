/* ============================================================
 * test_api_client.js · api_client 单元测试（node 环境，mock fetch）
 * 验证：在线走后端、离线降级本地、sessionId 生成
 * ============================================================ */
const assert = require("assert");
const APIClient = require("./api_client.js");

// 模拟 fetch
let fetchCalls = [];
let shouldFail = false;
global.fetch = function (url, opts) {
  fetchCalls.push({ url: String(url), opts });
  if (shouldFail) return Promise.reject(new Error("network down"));
  return Promise.resolve({
    ok: true,
    json: async () => ({ appliedEffects: [{ kind: "axis", axis: "possession", before: 50, after: 100, delta: 84 }],
      state: { axes: { ambition: 50, possession: 100, impulse: 50, devotion: 32 }, blood: 6, secrets: 0, betrayed: 0, flags: [] },
      next: { cardId: "06", forceEnding: false },
      sanity: { clientReactionMs: 1200, serverElapsedMs: 1500, drift: 300, note: "ok" } }),
  });
};

// localFallback 模拟（对应 runner 里的本地计算）
function localFallback(payload) {
  return { cardId: payload.cardId, side: payload.side, appliedEffects: [], state: { axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 }, blood: 7, secrets: 0, betrayed: 0, flags: [] }, next: { cardId: "06", forceEnding: false } };
}

async function main() {
  // 1) sessionId 生成
  const c = new APIClient({ base: "http://localhost:3000" });
  assert.ok(/^sess-/.test(c.sessionId), "sessionId 以 sess- 开头");
  console.log("✓ generateSessionId →", c.sessionId);

  // 2) 在线：submitChoice 走后端
  fetchCalls = [];
  const online = await c.submitChoice("05", "R", 1200, false, localFallback);
  assert.strictEqual(online.source, "server", "在线 → source=server");
  assert.strictEqual(online.response.state.axes.possession, 100, "后端权威 possession=100");
  assert.strictEqual(c.online, true, "online=true");
  console.log("✓ 在线模式 → source=server, possession=100");
  assert.ok(fetchCalls[0].url.includes("/api/choice"), "请求 /api/choice");
  console.log("✓ 请求路径正确：" + fetchCalls[0].url);

  // 3) 离线：降级本地
  shouldFail = true;
  const offline = await c.submitChoice("05", "L", 3000, false, localFallback);
  assert.strictEqual(offline.source, "local", "离线 → source=local");
  assert.strictEqual(c.online, false, "online=false");
  console.log("✓ 离线降级 → source=local（后端不可达时仍可玩）");

  // 4) judge：离线返回 null
  const j = await c.judge();
  assert.strictEqual(j, null, "离线 judge → null（前端自行判定）");
  console.log("✓ 离线 judge → null（前端兜底）");

  console.log("\n=== api_client 测试全部通过 ===");
}

main().catch((e) => { console.error("TEST FAILED:", e); process.exit(1); });
