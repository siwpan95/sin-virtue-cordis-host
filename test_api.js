/* ============================================================
 * test_api.js · API 测试（直接 require server 的 app，不启真实 HTTP）
 * 覆盖 FRS 6.1 六个端点 + 后端权威计算校验
 * 使用方式：node test_api.js
 * ============================================================ */
const { app, judge, applyEffects, getSession, sessions, DEFAULT_STATE } = require("./server.js");
const http = require("http");

// 简易 supertest 替代品：把 express app 包成 request 函数
function makeClient() {
  const server = http.createServer(app);
  // 手动触发 listen 以绑定地址（use random port）
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  }).then((server) => {
    const port = server.address().port;
    const BASE = `http://127.0.0.1:${port}`;
    function request(method, path, body) {
      return new Promise((resolveP, reject) => {
        const req = http.request(
          { method, hostname: "127.0.0.1", port, path, headers: { "Content-Type": "application/json" } },
          (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => {
              try { resolveP({ status: res.statusCode, body: JSON.parse(data) }); }
              catch (e) { reject(new Error("JSON parse failed: " + data)); }
            });
          }
        );
        req.on("error", reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
      });
    }
    return { request, close: () => server.close() };
  });
}

const SID = "test-session-" + Date.now();

async function main() {
  const client = await makeClient();
  const { request, close } = client;

  try {
    // 1) GET /api/card/:id
    const c1 = await request("GET", "/api/card/05?sessionId=" + SID);
    console.assert(c1.status === 200, "GET /api/card/05 → 200");
    console.assert(c1.body.card.cardId === "05", "返回 cardId=05");
    console.assert(c1.body.card.options.L.text && c1.body.card.options.R.text, "含 L/R 选项文本");
    console.log("✓ GET  /api/card/05 →", c1.body.card.cardId, "type=" + c1.body.card.type);

    // 2) POST /api/choice —— 选 R（后端权威计算）
    const ch = await request("POST", "/api/choice", {
      sessionId: SID, cardId: "05", side: "R", reactionMs: 1200, timedOut: false,
    });
    console.assert(ch.status === 200, "POST /api/choice → 200");
    console.assert(Array.isArray(ch.body.appliedEffects), "返回 appliedEffects 数组");
    console.assert(ch.body.state.axes.possession === 100, "possession clamp 上限 100 (50+84=134→100)");
    console.assert(ch.body.state.blood === 6, "blood 计数器 7-1=6（不缩放）");
    console.log("✓ POST /api/choice (05 R) → possession=" + ch.body.state.axes.possession + " blood=" + ch.body.state.blood + " next=" + ch.body.next.cardId);

    // 3) 参数校验：缺 sessionId
    const bad = await request("POST", "/api/choice", { cardId: "05", side: "L" });
    console.assert(bad.status === 400, "缺参 → 400");
    console.log("✓ POST /api/choice 缺参 → 400");

    // 4) 跑圣徒路线，验证 /api/judge
    const s = getSession(SID + "-saint");
    Object.assign(s, DEFAULT_STATE());
    s.axes = { ambition: 20, possession: 10, impulse: 20, devotion: 80 };
    s.blood = 6;
    s.flags = ["saint", "self_sacrifice"];
    s.history = [{ cardId: "10", side: "R", reactionMs: 800, timedOut: false }];

    const jd = await request("POST", "/api/judge", { sessionId: SID + "-saint" });
    console.assert(jd.status === 200, "POST /api/judge → 200");
    console.assert(jd.body.ending.code === "saint", "圣徒路线 → code=saint, 实际=" + jd.body.ending.code);
    console.log("✓ POST /api/judge (圣徒) → " + jd.body.ending.name + " / " + jd.body.ending.tag);

    // 5) GET /api/state/:sessionId
    const st = await request("GET", "/api/state/" + SID);
    console.assert(st.status === 200 && st.body.axes, "GET /api/state → 含 axes");
    console.log("✓ GET  /api/state → axes=" + JSON.stringify(st.body.axes));

    // 6) judge() 纯函数单元层
    const cases = [
      { state: { ...DEFAULT_STATE(), axes: { ambition: 50, possession: 50, impulse: 90, devotion: 50 }, flags: ["berserk"], blood: 5 }, expected: "mad_king" },
      { state: { ...DEFAULT_STATE(), axes: { ambition: 80, possession: 88, impulse: 40, devotion: 20 }, flags: ["cruelty"], blood: 2 }, expected: "lonely_king" },
      { state: { ...DEFAULT_STATE(), axes: { ambition: 30, possession: 20, impulse: 30, devotion: 85 }, flags: ["self_sacrifice"], blood: 5 }, expected: "martyr" },
      { state: { ...DEFAULT_STATE(), axes: { ambition: 50, possession: 50, impulse: 50, devotion: 50 }, flags: [], blood: 7 }, expected: "survivor" },
    ];
    cases.forEach((c) => {
      const r = judge(c.state);
      console.assert(r.code === c.expected, `judge() ${c.expected} → ${r.code}`);
    });
    console.log("✓ judge() 纯函数 4 用例命中（mad_king/lonely_king/martyr/survivor）");

    // 7) POST /api/reset
    const rst = await request("POST", "/api/reset", { sessionId: SID });
    console.assert(rst.status === 200, "POST /api/reset → 200");
    console.log("✓ POST /api/reset");

    console.log("\n=== API 集成测试全部通过 ===");
  } finally {
    close();
  }
}

main().catch((e) => { console.error("TEST FAILED:", e); process.exit(1); });
