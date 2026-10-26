// 联网内容源 = 插件。默认返回占位，真实检索后端（任意搜索 API）以“替换本插件”的方式接入，
// 主体完全不感知 —— 这正是“一切皆插件”想表达的可替换性。
export const websearch = (ctx) => {
  ctx.provide('websearch', async (query) => {
    ctx.logger.info(`[websearch] 接入真实检索后端前返回占位：${query}`) // 占位说明
    return { query, status: 'stub', note: '替换为真实搜索 API 插件即可返回联网结果' }
  })
}
