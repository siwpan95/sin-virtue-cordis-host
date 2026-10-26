import { Context } from 'cordis'

// 核心插件：唯一的 ctx.game 服务（状态容器 + 注册表 + 三层判定）。
// 状态模型严格对齐《如果从原创的角度出发》设计文案 + 原始讨论记录：
//   四个离散计数器 COLD/SACR/CHAOS/PRIDE（初始 0，可超上限）+ 状态变量
//   blood(初始7) / secrets(初始0) / betrayed / chapters(特殊线标记)。
// 所有「轴 / 卡 / 结局 / 传输 / 内容源」都是挂载到该服务之上的独立插件。

export const core = (ctx) => {
  const state = {
    counters: {},
    blood: 7,            // 存活队友数（初始 7，死亡 -1）
    secrets: 0,         // 持有的秘密数
    betrayed: 0,        // 被队友背叛次数
    chapters: new Set(),// 触发的特殊线标记（复仇线/伪善/暴君线…）
    flags: [],          // 叙事 flavor 标记（不参与判定）
    choices: { '10': null, '11': null, '12': null }, // 终章裁决卡的 L/R
    history: [],
  }

  const game = {
    state,
    counters: new Map(), // id -> def
    cards: new Map(),
    modifiers: [],       // 第三层终章裁决 modifier 列表（由 ending:modifier 插件注册）

    registerCounter(def) { this.counters.set(def.id, def); state.counters[def.id] = def.initial },
    registerCard(def) { this.cards.set(def.id, def) },
    registerModifier(fn) { this.modifiers.push(fn) },
    order() { return [...this.cards.keys()].sort() },

    reset() {
      for (const def of this.counters.values()) state.counters[def.id] = def.initial
      state.blood = 7; state.secrets = 0; state.betrayed = 0
      state.chapters = new Set(); state.flags = []; state.choices = { '10': null, '11': null, '12': null }; state.history = []
    },

    choose(cardId, side) {
      const card = this.cards.get(String(cardId))
      if (!card) throw new Error('unknown card ' + cardId)
      if (side !== 'L' && side !== 'R') throw new Error('side must be L/R')
      const branch = side === 'L' ? card.L : card.R
      for (const [kind, key, val] of branch.effects || []) {
        if (kind === 'counter') state.counters[key] = (state.counters[key] ?? 0) + val
        else if (kind === 'blood') state.blood = Math.max(0, state.blood + val)
        else if (kind === 'secrets') state.secrets += val
        else if (kind === 'betrayed') state.betrayed += val
        else if (kind === 'chapters') state.chapters.add(key)
        else if (kind === 'flags') state.flags.push(key)
      }
      if (card.final) state.choices[String(cardId)] = side
      state.history.push({ cardId: String(cardId), side })
      ctx.emit('game/choose', { cardId: String(cardId), side, branch, state })
      return state
    },

    // 三层判定（严格顺序：特殊结局 > 主结局 > 终章裁决 modifier > 隐藏彩蛋），对齐设计文案 §2.7。
    judge() {
      let ending = ctx.bail('ending:special', state)            // 第一层
      if (ending) { applyHidden(ending, state); return finalize(ending) }
      ending = ctx.bail('ending:main', state)                   // 第二层
      if (!ending) ending = makeSurvivor(state)                 // 默认：幸存者（名随机）
      for (const m of this.modifiers) m(ending, state)          // 第三层：终章裁决
      applyHidden(ending, state)
      return finalize(ending)
    },
  }

  function makeSurvivor(state) {
    const names = ['普通人', '墙头草', '幸运儿']
    const name = names[Math.floor(Math.random() * names.length)]
    return { id: 'survivor', name, layer: 'default', text: '你不是英雄也不是反派，只是活下来了。' }
  }

  // 隐藏成就 / 彩蛋（不进主池，但触发后写入 badges；全灭强制改结局名）。
  function applyHidden(ending, state) {
    const badges = []
    if (state.blood >= 7) badges.push('全员存活·解锁隐藏卡「第八人」')
    if (state.secrets === 0) badges.push('无秘密通关·干净的人')
    if (state.counters.SACR >= 5 && state.counters.COLD >= 5) badges.push('完美伪善·你同时是圣人和魔鬼')
    const allLeft = state.history.length === 12 && state.history.every(h => h.side === 'L')
    if (allLeft) badges.push('全左滑·圣人 or 蠢货')
    if (state.blood === 0) { // 全灭：强制改结局名（原始讨论记录·彩蛋）
      ending.id = 'tomb_king'; ending.name = '坟场之王'; ending.layer = 'hidden'
      ending.text = '无人生还。王座上坐着一具枯骨，与满殿枯骨对望。'
    }
    ending.badges = badges
  }

  function finalize(ending) {
    const ranked = Object.entries(state.counters)
      .map(([id, v]) => ({ id, v }))
      .sort((a, b) => b.v - a.v)
    return {
      ...ending,
      counters: { ...state.counters },
      blood: state.blood,
      secrets: state.secrets,
      betrayed: state.betrayed,
      chapters: [...state.chapters],
      flags: [...state.flags],
      choices: { ...state.choices },
      topCounters: ranked.map((r) => `${r.id}=${r.v}`),
    }
  }

  ctx.provide('game', game)
}
