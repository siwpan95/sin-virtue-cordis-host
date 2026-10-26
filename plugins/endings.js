// 结局系统 = 一组插件（ending:special / ending:main / ending:modifier），
// 与《如果从原创的角度出发》设计文案 §2.7 + 附录A + 原始讨论记录逐条对应。
// 每个结局条件都是一个独立监听器，新增结局只加插件、不动引擎。
import { MAD_CHAOS } from './cards.js'

// 第一层 · 特殊结局（最高优先级，命中即锁定，bail 返回第一个非 undefined）。
export const special = {
  name: 'ending:special',
  apply(ctx) {
    ctx.on('ending:special', (s) => {
      if (s.choices['10'] === 'R' && s.choices['12'] === 'R')
        return { id: 'illusion', name: '最后的幻觉', layer: 'special', text: '你早就死了，这是临终幻觉。' }
    })
    ctx.on('ending:special', (s) => {
      if (s.choices['10'] === 'L')
        return { id: 'puppet', name: '傀儡', layer: 'special', text: '你活了，但成了权力的容器。' }
    })
    ctx.on('ending:special', (s) => {
      if (s.choices['10'] === 'R' && s.counters.SACR >= 6)
        return { id: 'saint', name: '圣徒', layer: 'special', text: '自我牺牲到极致，你化作灰烬，灰烬里开出一朵花。' }
    })
    ctx.on('ending:special', (s) => {
      if (s.chapters.has('复仇线') && s.counters.COLD >= 5)
        return { id: 'avenger', name: '复仇者', layer: 'special', text: '你追仇到底，也终被仇恨吞噬。' }
    })
  },
}

// 第二层 · 主结局（按优先级判定；与设计文案附录A / 讨论记录一致）。
export const main = {
  name: 'ending:main',
  apply(ctx) {
    ctx.on('ending:main', (s) => {
      if (s.counters.CHAOS >= MAD_CHAOS)
        return { id: 'mad_king', name: '疯王', layer: 'main', text: '你的王冠是用别人的骨头做的。' }
    })
    ctx.on('ending:main', (s) => {
      // blood 阈值由 ≤3 放宽到 ≤4：原始「卡11=L(孤王最后一战, modifier)」与「孤王加冕需 blood≤3
      // （须卡11=R 失血）」自相矛盾——11L 是“留下断后”的 noble 选择，不牺牲队友，blood 无法降到 3。
      // 放宽到 ≤4 后 11=L 亦可进入该谱系，modifier 才能生效（调平说明，文档 §5.2 授权）。
      if (s.counters.COLD >= 6 && s.blood <= 4)
        return { id: 'lonely_crown', name: '孤王的加冕', layer: 'main', text: '你赢了，但赢的是一座空城。' }
    })
    ctx.on('ending:main', (s) => {
      if (s.choices['11'] === 'R' && s.counters.COLD >= 4)
        return { id: 'cowardly', name: '活下来的懦夫', layer: 'main', text: '你每天都在后悔，但每天都还在呼吸。' }
    })
    ctx.on('ending:main', (s) => {
      if (s.counters.SACR >= 5 && s.blood >= 4)
        return { id: 'martyr', name: '殉道者', layer: 'main', text: '他们踩着你的尸体走向光明。' }
    })
    ctx.on('ending:main', (s) => {
      // 原始规则为「含「伪善」 或 secrets≥3 & COLD≥3」。但卡08-L 恒打「伪善」标记，
      // 会在每一局都抢在「弃义者(⑥)」「幸存者(⑦→冷酷的胜利者)」之前触发，使二者永不可达。
      // 按调平（文档 §5.2 授权）收窄为「secrets≥3 & COLD≥3」：既贴合“秘密多+算计”的语义，
      // 又让 弃义者 / 幸存者 谱系可达；伪善者本身仍可由秘密+冷酷双高路径触发。
      if (s.secrets >= 3 && s.counters.COLD >= 3)
        return { id: 'hypocrite', name: '伪善者', layer: 'main', text: '你连善良都是武器。' }
    })
    ctx.on('ending:main', (s) => {
      if (s.counters.PRIDE >= 5 && s.betrayed >= 2)
        return { id: 'abandoned', name: '弃义者', layer: 'main', text: '你谁都不信，最后谁都离你而去。' }
    })
  },
}

// 第三层 · 终章裁决（modifier，对主结局变形/覆盖），与讨论记录“终章裁决”表逐条对应。
export const modifiers = {
  name: 'ending:modifier', inject: ['game'],
  apply(ctx) {
    ctx.game.registerModifier((ending, state) => {
      if (state.choices['11'] === 'L') {
        if (ending.id === 'lonely_crown') { ending.id = 'lonely_king_final'; ending.name = '孤王的最后一战' }
        if (ending.id === 'martyr') ending.text += '（你死前笑了）'
      }
      if (state.choices['11'] === 'R' && ending.id !== 'cowardly')
        ending.text += '但最后你还是把最弱的那个人推了出去。'
      if (state.choices['12'] === 'L') {
        if (ending.id === 'survivor') { ending.id = 'cold_winner'; ending.name = '冷酷的胜利者' }
        if (ending.id === 'martyr') ending.text += '（你死前说值得，但没人听到）'
      }
      if (state.choices['12'] === 'R' && ending.id === 'lonely_crown')
        ending.text += '你推开门，外面是阳光——然后画面一转，你其实死在第三章。'
    })
  },
}
