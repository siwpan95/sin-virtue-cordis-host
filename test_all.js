/* ============================================================
 * test_all.js · 统一测试入口（一键跑全部测试）
 * 使用：node test_all.js
 * ============================================================ */
const { spawnSync } = require("child_process");

const suites = [
  { name: "engine 单元测试", file: "test_engine.js" },
  { name: "结局判定 端到端", file: "test_runner.js" },
  { name: "API 集成测试", file: "test_api.js" },
  { name: "api_client 测试", file: "test_api_client.js" },
];

let failed = 0;
suites.forEach((s) => {
  console.log("\n" + "=" .repeat(50));
  console.log("▶ " + s.name);
  console.log("=" .repeat(50));
  const r = spawnSync(process.execPath, [s.file], { stdio: "inherit" });
  if (r.status !== 0) { failed++; console.log(`\n✗ ${s.name} 失败 (exit ${r.status})`); }
  else { console.log(`\n✓ ${s.name} 通过`); }
});

console.log("\n" + "=" .repeat(50));
console.log(failed === 0 ? "★ 全部测试套件通过 ★" : `✗ ${failed} 个套件失败`);
console.log("=" .repeat(50));
process.exit(failed === 0 ? 0 : 1);
