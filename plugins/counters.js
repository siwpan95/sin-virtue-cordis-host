// 四计数器模型（对齐《如果从原创的角度出发》设计文案 + 原始讨论记录）。
// 每个计数器各为一个独立插件，落实“一切皆插件”——加计数器 = 加一个文件，零改核心。
// 初始均为 0，可超上限（如连续暴力 COLD 可累加到 8）。

export const cold = {
  name: 'counter:COLD', inject: ['game'],
  apply(ctx) { ctx.game.registerCounter({ id: 'COLD', label: '冷酷', initial: 0 }) },
}
export const sacr = {
  name: 'counter:SACR', inject: ['game'],
  apply(ctx) { ctx.game.registerCounter({ id: 'SACR', label: '牺牲', initial: 0 }) },
}
export const chaos = {
  name: 'counter:CHAOS', inject: ['game'],
  apply(ctx) { ctx.game.registerCounter({ id: 'CHAOS', label: '混乱', initial: 0 }) },
}
export const pride = {
  name: 'counter:PRIDE', inject: ['game'],
  apply(ctx) { ctx.game.registerCounter({ id: 'PRIDE', label: '傲慢', initial: 0 }) },
}
