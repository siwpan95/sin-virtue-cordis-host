// 传输层 = 插件。CLI 只是其中一种“前端”，同一套 game 服务也可挂 Web / 微信 / 桌面端。
export const cli = {
  name: 'transport:cli',
  inject: ['game'],
  apply(ctx) {
    ctx.provide('cli', {
      run(script, label = 'playthrough') {
        const g = ctx.game
        g.reset()
        for (const step of script) g.choose(step.card, step.side)
        const ending = g.judge()
        console.log(`[${label}] 结局：${ending.name}｜${ending.text}`)
        console.log(`  计数器：${ending.topCounters.join('，')}｜章节线：${ending.chapters.join('、') || '无'}${ending.badges?.length ? '｜彩蛋：' + ending.badges.join('、') : ''}`)
        return ending
      },
    })
  },
}
