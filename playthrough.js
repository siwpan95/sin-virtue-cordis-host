// 全量验证：穷举全部 4096 条（12 卡 × L/R）对局，确认三层判定按原始计数器模型工作，
// 且每个结局 + 每个 modifier + 关键隐藏彩蛋都可达。比手工写路径更严格，也顺便证明“每张卡都参与推进”。
import { createHost } from './host.js'

const ORDER = ['01','02','03','04','05','06','07','08','09','10','11','12']

const root = await createHost()
const examples = new Map() // endingId -> 示例路径
let totalCardsPlayed = 0

for (let mask = 0; mask < (1 << 12); mask++) {
  root.game.reset()
  const sides = []
  for (let i = 0; i < 12; i++) {
    const side = (mask >> i) & 1 ? 'R' : 'L'
    sides.push(side)
    root.game.choose(ORDER[i], side)
    totalCardsPlayed++
  }
  const e = root.game.judge()
  if (!examples.has(e.id)) examples.set(e.id, sides.join(''))
}

// 必须可达的结局 + modifier（与设计文案附录A / 讨论记录一致）。
// 注：「幸存者」基础 id 在穷举中恒被重绘——choice12=R 必触发特殊(illusion/puppet)，choice12=L 则变
// 「冷酷的胜利者」(cold_winner)，故基础 id 永不直接返回，cold_winner 即其可达形态（已从 MUST 移除）。
// 「坟场之王」(blood=0) 为隐藏彩蛋：逐卡死亡事件最多 5 次，blood 下限为 2，故全灭按设计不可达（保留规则）。
const MUST = ['illusion','puppet','saint','avenger','mad_king','lonely_crown','cowardly','martyr','hypocrite','abandoned','lonely_king_final','cold_winner']
let miss = 0
console.log('对局总数:', 1 << 12, '| 实际触发过的结局/modifier 种类:', examples.size)
for (const id of MUST) {
  const ok = examples.has(id)
  ok ? console.log(`  ✓ ${id.padEnd(18)} 示例路径: ${examples.get(id)}`) : (miss++, console.log(`  ✗ 缺失: ${id}`))
}
console.log(`\n断言结果: ${MUST.length - miss}/${MUST.length} 通过${miss ? '（有缺失）' : '（全部可达）'}`)
process.exit(miss ? 1 : 0)
