import { execFileSync } from 'node:child_process'

// 本地内容源 = 插件。直接用 Everything (es.exe) 在本地秒级检索素材，
// 服务于“原创选题 / 卡面文案 / 竞品参考”的作者工作流。
const ES = 'G:\\Everything-1.5.0.1418b.x64\\es.exe'

export const everything = (ctx) => {
  ctx.provide('everything', (query) => {
    try {
      const out = execFileSync(ES, [query], { encoding: 'utf8', timeout: 8000, windowsHide: true })
      return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    } catch {
      return []
    }
  })
}
