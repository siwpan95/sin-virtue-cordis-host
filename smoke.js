import { createHost } from './host.js'

const root = await createHost()
const server = await root.web.start(3211)
const base = 'http://localhost:3211'
const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.json())
const get = (p) => fetch(base + p).then(r => r.json())

const cards = (await get('/api/cards')).cards
console.log('cards:', cards.length, '| first:', cards[0].id, cards[0].L, '/', cards[0].R)

await post('/api/reset')
for (const c of cards) await post('/api/choose', { cardId: c.id, side: c.id === '10' ? 'L' : (['11', '12'].includes(c.id) ? 'R' : 'L') })
const st = (await get('/api/state')).state
console.log('after play — counters:', JSON.stringify(st.counters), 'blood:', st.blood)
const direct = root.game.judge()
console.log('direct judge:', direct && direct.name, direct && direct.text)
const judgeResp = await post('/api/judge')
console.log('judge raw:', JSON.stringify(judgeResp).slice(0, 300))
const ending = judgeResp.ending
console.log('ending:', ending && ending.name, '|', ending && ending.text, '| badges:', ending && ending.badges)
server.close()
process.exit(0)
