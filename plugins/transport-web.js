import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')

// 传输层 = 插件。Web 传输用 node:http 实现（零额外依赖），
// 把 ctx.game 的 choose/judge 暴露成 JSON 接口，并托管可玩的 runner.html。
export const web = {
  name: 'transport:web',
  inject: ['game'],
  apply(ctx) {
    async function send(res, code, obj) {
      const body = JSON.stringify(obj)
      res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(body)
    }
    const server = http.createServer(async (req, res) => {
      const g = ctx.game
      const url = new URL(req.url, 'http://localhost')
      const p = url.pathname
      try {
        if (p === '/' || p === '/index.html') {
          const html = await readFile(join(PUBLIC, 'runner.html'))
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          return res.end(html)
        }
        if (p === '/api/state') return send(res, 200, { state: g.state })
        if (p === '/api/reset') { g.reset(); return send(res, 200, { ok: true }) }
        if (p === '/api/cards') {
          const cards = g.order().map((id) => {
            const c = g.cards.get(id)
            return { id, chapter: c.chapter, scene: c.scene, isQte: !!c.isQte, qteMs: c.qteMs || 0,
                     L: c.L.text[0], R: c.R.text[0] }
          })
          return send(res, 200, { cards })
        }
        if (p === '/api/choose' && req.method === 'POST') {
          const body = await readJson(req)
          g.choose(body.cardId, body.side)
          return send(res, 200, { state: g.state })
        }
        if (p === '/api/judge' && req.method === 'POST') {
          return send(res, 200, { ending: g.judge() })
        }
        res.writeHead(404); res.end('not found')
      } catch (e) {
        send(res, 500, { error: String(e && e.message || e) })
      }
    })
    ctx.provide('web', {
      start(port = 3210) {
        return new Promise((resolve) => {
          server.listen(port, () => {
            ctx.logger.info(`[web] 可玩页面: http://localhost:${port}`)
            resolve(server)
          })
        })
      },
    })
  },
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => resolve(data ? JSON.parse(data) : {}))
    req.on('error', reject)
  })
}
