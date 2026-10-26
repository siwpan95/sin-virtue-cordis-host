// 分析 / 埋点插件：仅监听 'game/choose' 事件，对核心逻辑零侵入。
// 体现 cordis 事件总线的“可观测性即插件”理念。
export const analytics = (ctx) => {
  ctx.on('game/choose', ({ cardId, side }) => {
    ctx.logger.debug(`choice ${cardId}=${side}`) // 插件用 cordis 日志；演示用 console.log 亦可
  })
}
