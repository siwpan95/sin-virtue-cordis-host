import { createHost } from './host.js'

// 12 张卡顺序（下标 0→卡01 … 11→卡12），便于写演示路径。
const ORDER = ['01','02','03','04','05','06','07','08','09','10','11','12']
const seq = (...sides) => sides.map((side, i) => ({ card: ORDER[i], side }))

async function main() {
  const root = await createHost()
  console.log('—— 七宗罪 VS 七美德 · cordis “一切皆插件” 宿主启动（原始计数器模型）——')

  // 演示 1：超自然选择触发「傀儡」特殊结局（卡10 选 L）
  root.cli.run([{ card: '10', side: 'L' }], 'demo-傀儡(卡10=L)')

  // 演示 2：全右选 → 「最后的幻觉」（卡10=R 且 卡12=R）
  root.cli.run(seq('R','R','R','R','R','R','R','R','R','R','R','R'), 'demo-最后的幻觉(全R)')

  // 演示 3：本地内容检索（Everything）—— 作者工作流：确认设计素材已在本地
  const local = root.everything('七宗罪')
  console.log(`[everything] 本地命中 ${local.length} 条，示例：${local.slice(0, 3).join(' | ')}`)

  // 演示 4：联网检索（占位后端，可替换为真实搜索 API 插件，主体零改动）
  const r = await root.websearch('七宗罪 互动叙事 人格测试 SJT 设计')
  console.log(`[websearch] ${JSON.stringify(r)}`)

  if (process.argv.includes('--serve')) {
    await root.web.start(3210) // 保持运行，浏览器打开 http://localhost:3210
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
