import { Context } from 'cordis'
import { core } from './core.js'
import * as counters from './plugins/counters.js'
import { cardLibrary } from './plugins/cards.js'
import * as endings from './plugins/endings.js'
import { cli } from './plugins/transport-cli.js'
import { web } from './plugins/transport-web.js'
import { analytics } from './plugins/analytics.js'
import { everything } from './plugins/content-everything.js'
import { websearch } from './plugins/content-websearch.js'

// 组装“一切皆插件”的宿主：new Context() 后把计数器/卡/结局/传输/内容源/分析都作为插件挂上。
// 抽出 createHost 以便 index.js（启动 Web + 演示）与 playthrough.js（自动化全量验证）复用。
export async function createHost() {
  const root = new Context()
  await root.plugin(core)
  await root.plugin(counters.cold)
  await root.plugin(counters.sacr)
  await root.plugin(counters.chaos)
  await root.plugin(counters.pride)
  await root.plugin(cardLibrary)
  await root.plugin(endings.special)   // 第一层：特殊结局
  await root.plugin(endings.main)      // 第二层：主结局
  await root.plugin(endings.modifiers) // 第三层：终章裁决 modifier
  await root.plugin(cli)
  await root.plugin(web)               // Web 传输（node:http，无额外依赖）
  await root.plugin(analytics)
  await root.plugin(everything)
  await root.plugin(websearch)
  return root
}
