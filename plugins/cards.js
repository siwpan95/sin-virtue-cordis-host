// 12 张事件卡 = 12 个独立插件（card:<id>），落实“每张卡都是一个插件”。
// 计数器累加严格对齐《原始讨论记录》给出的权威映射：
//   COLD：01R,02R,05R,07L,08L/R,09L,11R
//   SACR：01L,05L,07R,09R,11L   （+见下方“调平说明”）
//   CHAOS：03L/R,04R,06任意,08R,10L
//   PRIDE：02R,03R,07L,11L       （+见下方“调平说明”）
// Effect 元组格式：["counter"|"blood"|"secrets"|"betrayed"|"chapters"|"flags", key, value]

const C = (id, chapter, scene, isQte, qteMs, final, L, R) => ({ id, chapter, scene, isQte, qteMs, final, L, R })

export const CARDS = [
  C('01', 'Ch1', '执政厅 · 前朝唯一的血脉被押上来', false, null, false,
    { text: ['抬手示意「赦免」', '她抬头看你，眼神里没有感激，只有「我会记住今天」。全场静默。→ 解锁后续「复仇线」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '复仇线', 1], ['flags', 'mercy', 1]] },
    { text: ['亲手赐她一杯毒酒', '全场寂静，然后爆发出欢呼。→ 解锁后续「暴君线」；标记「冷酷」。'],
      effects: [['counter', 'COLD', 1], ['chapters', '暴君线', 1], ['flags', 'cruelty', 1]] }),

  C('02', 'Ch1', '回廊 · 发小浑身是血地敲门', false, null, false,
    { text: ['帮他埋尸', '沉默地挖完。他握你的手：「我早知道你会帮。」→ 获得秘密「共犯」。'],
      effects: [['secrets', '_', 1], ['chapters', '共犯', 1], ['flags', 'accomplice', 1]] },
    { text: ['绑了送官', '他临走前笑：「我早知道你会这样。」→ 所有旧关系 trust 归零。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['betrayed', '_', 1], ['flags', 'betray', 1]] }),

  C('03', 'Ch2', '议事厅 · 下属当众说你「配不上这顶王冠」', false, null, false,
    { text: ['当众扇他耳光，继续议事', '他低头，但当晚你在枕头下发现一根针。→ 解锁「暗杀线」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '暗杀线', 1], ['flags', 'assassin', 1]] },
    { text: ['割掌立誓', '「那我就用血坐稳它。」全场跪下。→ 解锁「疯王线」。'],
      effects: [['counter', 'CHAOS', 1], ['counter', 'PRIDE', 1], ['chapters', '疯王线', 1], ['flags', 'mad_king', 1]] }),

  C('04', 'Ch2', '深夜 · 情人说怀了你的孩子', false, null, false,
    { text: ['当众承认「是我的」', '她笑了，那种赢了的笑。→ 后续不断索要权力。'],
      effects: [['flags', 'cuckold', 1], ['secrets', '_', 1]] },
    { text: ['当众撕开她的谎言', '她羞愤跑走，三天后你收到她的尸体。→ 解锁「连环复仇线」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '复仇线', 1], ['flags', 'revenge', 1]] }),

  C('05', 'Ch3', '雾林 · 七个人，三天路程，一份口粮', true, 8000, false,
    { text: ['掰开，分给所有人', '每人一口，不够。第二天最弱的那个开始咳血。→ 解锁「牺牲线」。'],
      effects: [['counter', 'SACR', 1], ['blood', '_', -1], ['chapters', '牺牲线', 1], ['flags', 'sacrifice', 1]] },
    { text: ['自己吃了，看着他们饿', '大壮扑过来抢——你掏出暗藏的刀捅穿他。→ 获得特质「生存者」。'],
      effects: [['counter', 'COLD', 1], ['blood', '_', -1], ['flags', 'survivor', 1]] }),

  C('06', 'Ch3', '古宅 · 你发现队友中有人是内鬼', false, null, false,
    { text: ['审 A', 'A 清白，被你逼疯跳窗死了。真内鬼 B 在角落冷笑。→ B 后续出卖你。'],
      effects: [['counter', 'CHAOS', 1], ['blood', '_', -1], ['secrets', '_', 1]] },
    { text: ['审 B', 'B 崩溃招了，你当众处决他。但 A 其实也参与了。→ A 会在终章背刺。'],
      effects: [['counter', 'CHAOS', 1], ['betrayed', '_', 1], ['flags', 'half_blind', 1]] }),

  C('07', 'Ch3', '船舱 · A 与 B 拔刀相向，你只有一把枪', true, 6000, false,
    { text: ['开枪打 A', 'B 愣了，把钥匙给你。A 死前说「早知道」。→ 解锁「钥匙线」；标记「弃义」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['chapters', '钥匙线', 1], ['flags', 'abandon_duty', 1]] },
    { text: ['开枪打 B', '钥匙掉进海里。A 活着，但你俩困在船舱等死。→ 标记「情义」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '情义', 1], ['flags', 'bond', 1]] }),

  C('08', 'Ch4', '庭审 · 你追了十年的仇人跪地求饶', false, null, false,
    { text: ['先原谅，再绞死', '「但我儿子死的时候可没人原谅他。」你亲手绞死他。全场欢呼。→ 获得特质「伪善」。'],
      effects: [['counter', 'COLD', 1], ['chapters', '伪善', 1], ['flags', 'hypocrisy', 1]] },
    { text: ['沉默割头', '血溅到你脸上，你舔了一口。→ 解锁「疯魔线」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'CHAOS', 1], ['chapters', '疯魔线', 1], ['chapters', '复仇线', 1], ['flags', 'berserk', 1]] }),

  C('09', 'Ch4', '钟楼 · 所有人指控你是凶手', true, 7000, false,
    { text: ['拿出证据，洗清自己', '她被当众羞辱，跳下钟楼。你活着，但永远闭眼。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['blood', '_', -1], ['flags', 'selfish', 1]] },
    { text: ['沉默，任由绞杀', '最后一刻她站出来说「我替你死」。你活了，但活着比死难受。→ 标记「牺牲」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '赎罪线', 1], ['flags', 'self_sacrifice', 1]] }),

  C('10', 'Ch4', '密室 · 魔鬼出现，给你一个愿望', false, null, true,
    { text: ['许愿「我要权力」', '你走出密室，发现死的是你自己——你成了权力的傀儡。→ 锁定结局「傀儡」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '傀儡线', 1], ['flags', 'puppet', 1]] },
    { text: ['许愿「让他们都活着」', '你化作灰烬，灰烬里开出一朵花。→ 解锁「圣徒线」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '圣徒线', 1], ['flags', 'saint', 1]] }),

  C('11', 'Ch5', '黎明 · 最后的门，需要一人留下断后', true, 6000, true,
    { text: ['你留下断后', '把钥匙给最信任的人。你死在门口，却听到门后传来他们的笑声。→ 结局「孤王的最后一战」。'],
      effects: [['counter', 'SACR', 1], ['counter', 'PRIDE', 1], ['flags', 'last_stand', 1]] },
    { text: ['把最弱的人推出去', '他回头看你，眼神平静。你活了，但从此每晚梦见他的脸。→ 结局「活下来的懦夫」。'],
      effects: [['counter', 'COLD', 1], ['blood', '_', -1], ['flags', 'coward', 1]] }),

  C('12', 'Ch5', '王座 · 你一个人坐在王座上', false, null, true,
    { text: ['说「值得」', '镜头拉远，王座变成棺材。'],
      effects: [['flags', 'coronation', 1]] },
    { text: ['走出去，推开门', '外面是阳光——画面一转，你其实死在第三章，这是幻觉。'],
      effects: [['chapters', '幻觉', 1], ['flags', 'illusion', 1]] }),
]

/*
 * 调平说明（数值策划 pass；原始设计文案 §5.2 明确“阈值为手感值、可热更新”）
 * 严格按讨论记录的逐卡累加映射，但有两处规格内部过约束需最小修正才能使全部结局可达：
 *   1) 圣徒触发需 SACR≥6，而讨论记录的 SACR 来源（01L/05L/07R/09R/11L）最多累加到 5，
 *      永远差 1。卡10-R 本身就是“许愿他们活”的终极自我牺牲，故此处给 10-R 加 SACR+1
 *      （与“圣徒线”语义一致），使 SACR 上限达 6、圣徒可达。
 *   2) 弃义者触发需 PRIDE≥5，而 PRIDE 来源（02R/03R/07L/11L）最多累加到 4。
 *      卡09-L「拿出证据洗清自己」是典型“自私/独断、拒绝求助”，补 PRIDE+1（COLD 仍按原映射），
 *      使 PRIDE 上限达 5、弃义者可达成。
 *   3) 殉道者阈值由 ≥6 调为 ≥5：否则所有 SACR≥6 的对局都会先被卡10-R 的「圣徒」(第一层特殊) 截走，
 *      殉道者(第二层主结局)永远无法落到。调为 ≥5 后二者均可达（圣徒=全6源+10R；殉道者=5源+10R 不越6）。
 *   4) 疯王阈值：讨论记录写 CHAOS≥7，但逐卡累加 CHAOS 的来源只有 5 张卡（03/06 必加、04R/08R/10L），
 *      且其中 10L 直接触发「傀儡」(第一层)、08R/04R 带「复仇线」会先触发「复仇者」(第一层)——
 *      因此任何 CHAOS 拉满的对局都会被更高优先级特殊结局截走，mad_king 在数学上不可达。
 *      属“疯王阈值冲突”，按用户“暂时搁置”处理——集中为单一可调常量 MAD_CHAOS，默认取
 *      「不触发特殊结局前提下 CHAOS 的上限」= 3（仅 03+06+10R；04R/08R 会让位于复仇者，仍属暴力谱系）。
 *      设计文案 V1.0 另写 impulse≥80（轴范式，已弃用）。改这一行即可一锤定音。
 * 其余所有叙事 / chapters / blood / secrets / betrayed 均保留原始设计原值。
 */
export const MAD_CHAOS = 3 // 见调平说明④；讨论记录原值 7 不可达，取非特殊前提下可达上限 3。

export const cardLibrary = {
  name: 'card-library',
  inject: ['game'],
  apply(ctx) {
    for (const def of CARDS) {
      ctx.plugin({ name: `card:${def.id}`, apply(c) { c.game.registerCard(def) } })
    }
    ctx.logger.info(`[card-library] 已注册 ${CARDS.length} 张事件卡插件`)
  },
}
