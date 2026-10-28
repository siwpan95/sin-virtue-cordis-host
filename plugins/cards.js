// 12 张事件卡 = 12 个独立插件（card:<id>），落实“每张卡都是一个插件”。
// 计数器累加严格对齐《原始讨论记录》给出的权威映射：
//   COLD：01R,02R,05R,07L,08L/R,09L,11R
//   SACR：01L,05L,07R,09R,11L   （+见下方“调平说明”）
//   CHAOS：03L/R,04R,06任意,08R,10L
//   PRIDE：02R,03R,07L,11L       （+见下方“调平说明”）
// Effect 元组格式：["counter"|"blood"|"secrets"|"betrayed"|"chapters"|"flags", key, value]
//
// 合并说明（2026-10-28）：自 sin-virtue-game 并入丰富叙事字段
// （perspective / type / typeLabel / shots / audio / checklist / consistency），
// 仅补充表现层元数据；判定用的 counter effects 保持原值不变（规则真相源）。
// 注意：本宿主按 01→12 线性推进，game 旧 FRS 里的条件分支 next 在本宿主未实现。

const C = (id, chapter, scene, isQte, qteMs, final, L, R, meta = {}) =>
  ({ id, chapter, scene, isQte, qteMs, final, L, R, ...meta })

export const CARDS = [
  C('01', 'Ch1', '你刚坐上王座，前朝唯一的血脉被押上来。满殿贵族等着你表态——赦免，还是赐死。', false, null, false,
    { text: ['抬手示意「赦免」', '她抬头看你，眼神里没有感激，只有「我会记住今天」。全场静默。→ 解锁后续「复仇线」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '复仇线', 1], ['flags', 'mercy', 1]] },
    { text: ['亲手赐她一杯毒酒', '全场寂静，然后爆发出欢呼。→ 解锁后续「暴君线」；标记「冷酷」。'],
      effects: [['counter', 'COLD', 1], ['chapters', '暴君线', 1], ['flags', 'cruelty', 1]] },
    { perspective: '执政厅', type: 'normal', typeLabel: '开局 · 立场定调',
      shots: [
        { shot: 'Shot 01', text: '俯视王座厅，烛火摇曳。字幕：「加冕夜。第一道裁决。」' },
        { shot: 'Shot 02', text: '前朝公主跪在台阶下，抬头看你，眼神平静得可怕。' },
        { shot: 'Shot 03', text: '大祭司低声：「陛下，她是最后一个。」倒计时出现。' },
      ],
      audio: { BGM: '低频 drone 转肃穆合唱', SFX: 'L=布料摩挲/远雷, R=杯盏轻碰/欢呼爆发', vibration: 'R侧杯盏触碰30ms' },
      checklist: ['无正确选项，立场即刻可见', '后果不可逆，不用数字替代画面'] }),

  C('02', 'Ch1', '你的发小浑身是血地敲门。他杀了人，尸体在巷子里，求你帮他埋了。', false, null, false,
    { text: ['帮他埋尸', '沉默地挖完。他握你的手：「我早知道你会帮。」→ 获得秘密「共犯」。'],
      effects: [['secrets', '_', 1], ['chapters', '共犯', 1], ['flags', 'accomplice', 1]] },
    { text: ['绑了送官', '他临走前笑：「我早知道你会这样。」→ 所有旧关系 trust 归零。标记「冷酷」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['betrayed', '_', 1], ['flags', 'betray', 1]] },
    { perspective: '回廊', type: 'normal', typeLabel: '开局 · 义气代价',
      shots: [
        { shot: 'Shot 01', text: '雨夜回廊，敲门声急促。字幕：「他浑身是血。」' },
        { shot: 'Shot 02', text: '发小瘫坐在地：「就这一次，帮我。」' },
        { shot: 'Shot 03', text: '你低头看自己的手。选项出现。' },
      ],
      audio: { BGM: '雨声 + 低弦', SFX: 'L=泥土/喘息, R=铁链/冷笑', vibration: '无' },
      checklist: ['L不是美德而是一起下地狱', '埋下共犯秘密，供终章翻旧账'] }),

  C('03', 'Ch2', '下属当众说你「配不上这顶王冠」。满朝文武都听到了，他没拔刀，但比拔刀更狠。', false, null, false,
    { text: ['当众扇他耳光，继续议事', '他低头，但当晚你在枕头下发现一根针。→ 解锁「暗杀线」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '暗杀线', 1], ['flags', 'assassin', 1]] },
    { text: ['割掌立誓', '「那我就用血坐稳它。」全场跪下。→ 解锁「疯王线」。'],
      effects: [['counter', 'CHAOS', 1], ['counter', 'PRIDE', 1], ['chapters', '疯王线', 1], ['flags', 'mad_king', 1]] },
    { perspective: '议事厅', type: 'normal', typeLabel: '戏剧瞬间 · 名场面',
      shots: [
        { shot: 'Shot 01', text: '议事厅死寂。字幕：「他没拔刀，但比拔刀更狠。」' },
        { shot: 'Shot 02', text: '下属直视你：「你配不上。」' },
        { shot: 'Shot 03', text: '文武百官低头，偷瞄你的反应。' },
      ],
      audio: { BGM: 'R=心跳+定音鼓渐强', SFX: 'L=耳光清脆, R=剑鸣+血滴', vibration: 'R侧强震200ms' },
      checklist: ['R是爽文时刻但有代价(所有人开始怕你)', 'L常规但埋定时炸弹'] }),

  C('04', 'Ch2', '情人说怀了你的孩子。你清楚自己从未碰过她。她知道你知道。', false, null, false,
    { text: ['当众承认「是我的」', '她笑了，那种赢了的笑。→ 后续不断索要权力。标记「窝囊」。'],
      effects: [['flags', 'cuckold', 1], ['secrets', '_', 1]] },
    { text: ['当众撕开她的谎言', '她羞愤跑走，三天后你收到她的尸体。→ 解锁「连环复仇线」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '复仇线', 1], ['flags', 'revenge', 1]] },
    { perspective: '深夜', type: 'normal', typeLabel: '两难 · 无好选项',
      shots: [
        { shot: 'Shot 01', text: '深夜寝殿，她站在床边。字幕：「你从未碰过她。」' },
        { shot: 'Shot 02', text: '她抚着肚子，笑得很平静。' },
        { shot: 'Shot 03', text: '你意识到：她在赌你会承认。' },
      ],
      audio: { BGM: 'L=钢琴单音/压抑, R=弦乐下滑+玻璃碎', SFX: 'L=布料撕裂, R=人群哗然', vibration: 'R侧中震120ms' },
      checklist: ['没有好选项：左窝囊右残忍', '让玩家选一个至少爽的'] }),

  C('05', 'Ch3', '七个人，三天路程，一份口粮。雾林深处，没人说话，所有人都看着你——唯一的决策者。', true, 8000, false,
    { text: ['掰开，分给所有人', '每人一口，不够。第二天最弱的那个开始咳血。→ 解锁「牺牲线」。'],
      effects: [['counter', 'SACR', 1], ['blood', '_', -1], ['chapters', '牺牲线', 1], ['flags', 'sacrifice', 1]] },
    { text: ['自己吃了，看着他们饿', '大壮扑过来抢——你掏出暗藏的刀捅穿他。→ 获得特质「生存者」。'],
      effects: [['counter', 'COLD', 1], ['blood', '_', -1], ['flags', 'survivor', 1]] },
    { perspective: '团队', type: 'qte', typeLabel: 'QTE · 8s · 一致性校验',
      shots: [
        { shot: 'Shot 01', text: '黑屏。风声与压抑的咳嗽。字幕：「第三天。只剩一袋口粮。」' },
        { shot: 'Shot 02', text: '俯视全景：7 个剪影在雾中，你（高亮）在前方。' },
        { shot: 'Shot 03', text: '最弱的少女（小满）抬头看你，嘴唇干裂。' },
        { shot: 'Shot 04', text: '你低头看干粮包。倒计时出现。字幕：「你要怎么分？」' },
      ],
      audio: { BGM: '低频 drone，选择后 L=弦乐上行(悲悯) / R=低音弦震(压迫)', SFX: '咳嗽(L)、刀入肉闷响(R)、心跳骤停(R)', vibration: 'R侧刀刺强震200ms；最后2秒每0.5秒轻震' },
      consistency: { pairWith: 'card09', axis: 'SACR', note: '卡05测本能(牺牲/占有)，卡09测认知理想；若05=R且09=L标记conflict' },
      checklist: ['QTE超时默认记R(犹豫=自私)', '后果不可逆+视觉化(不用数字)', 'reactionMs<1.5s本能/≥4s深思，计入内耗指数(仅供叙事)'] }),

  C('06', 'Ch3', '你发现队友中有人是内鬼。证据指向两个人，但你只有时间审一个。', false, null, false,
    { text: ['审 A', 'A 清白，被你逼疯跳窗死了。真内鬼 B 在角落冷笑。→ B 后续出卖你。'],
      effects: [['counter', 'CHAOS', 1], ['blood', '_', -1], ['secrets', '_', 1]] },
    { text: ['审 B', 'B 崩溃招了，你当众处决他。但 A 其实也参与了。→ A 会在终章背刺。'],
      effects: [['counter', 'CHAOS', 1], ['betrayed', '_', 1], ['flags', 'half_blind', 1]] },
    { perspective: '古宅', type: 'normal', typeLabel: '信息不对称 · 校验卡',
      shots: [
        { shot: 'Shot 01', text: '古宅地下室，两张椅子。字幕：「只有一个是内鬼。」' },
        { shot: 'Shot 02', text: 'A 在左，低头发抖；B 在右，眼神躲闪。' },
        { shot: 'Shot 03', text: '沙漏翻倒，时间不多了。' },
      ],
      audio: { BGM: '滴答+悬疑弦乐', SFX: 'L=开窗风声/冷笑, R=招供抽泣/终章暗示', vibration: '无' },
      consistency: { note: '与卡03同源，测克制/冲动轴，一致性校验' },
      checklist: ['信息不对称制造焦虑', '无论选哪个都有代价(激发重玩)'] }),

  C('07', 'Ch3', 'A 与 B 拔刀相向，你只有一把枪。A 是你兄弟，B 握着通关钥匙。两人都要死。', true, 6000, false,
    { text: ['开枪打 A', 'B 愣了，把钥匙给你。A 死前说「早知道」。→ 解锁「钥匙线」；标记「弃义」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['chapters', '钥匙线', 1], ['flags', 'abandon_duty', 1]] },
    { text: ['开枪打 B', '钥匙掉进海里。A 活着，但你俩困在船舱等死。→ 标记「情义」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '情义', 1], ['flags', 'bond', 1]] },
    { perspective: '船舱', type: 'qte', typeLabel: 'QTE · 6s · 救谁困境',
      shots: [
        { shot: 'Shot 01', text: '摇晃的船舱，A 与 B 对峙。字幕：「只有一把枪，两人都要死。」' },
        { shot: 'Shot 02', text: 'A 看你：「兄弟，别。」' },
        { shot: 'Shot 03', text: 'B 握紧钥匙。倒计时出现。' },
      ],
      audio: { BGM: '海浪+紧张节拍', SFX: 'L/R=枪声+回响', vibration: '开枪强震250ms' },
      checklist: ['用枪代替对话，暴力感让选择更痛', 'QTE限时制造本能反应'] }),

  C('08', 'Ch4', '你追了十年的仇人，现在像狗一样趴着求饶。满城百姓在围观。', false, null, false,
    { text: ['先原谅，再绞死', '「但我儿子死的时候可没人原谅他。」你亲手绞死他。全场欢呼。→ 获得特质「伪善」。'],
      effects: [['counter', 'COLD', 1], ['chapters', '伪善', 1], ['flags', 'hypocrisy', 1]] },
    { text: ['沉默割头', '血溅到你脸上，你舔了一口。→ 解锁「疯魔线」。标记「复仇者」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'CHAOS', 1], ['chapters', '疯魔线', 1], ['chapters', '复仇线', 1], ['flags', 'berserk', 1]] },
    { perspective: '庭审', type: 'normal', typeLabel: '戏剧瞬间 · 两种爽感',
      shots: [
        { shot: 'Shot 01', text: '高台之下，仇人跪地。字幕：「追了十年。」' },
        { shot: 'Shot 02', text: '百姓安静，等你的裁决。' },
        { shot: 'Shot 03', text: '仇人抬头：「求求你。」' },
      ],
      audio: { BGM: 'L=庄严到反转下行, R=狂暴定音鼓', SFX: 'L=欢呼爆发, R=喷溅/吞咽', vibration: 'R侧强震' },
      checklist: ['L=高级爽(先给希望再碾碎), R=原始爽', '玩家选更符合自身幻想的那个'] }),

  C('09', 'Ch4', '所有人指控你是凶手。你有真凶的证据，但拿出证据会暴露你最爱之人的秘密。', true, 7000, false,
    { text: ['拿出证据，洗清自己', '她被当众羞辱，跳下钟楼。你活着，但永远闭眼。→ 标记「自私」。'],
      effects: [['counter', 'COLD', 1], ['counter', 'PRIDE', 1], ['blood', '_', -1], ['flags', 'selfish', 1]] },
    { text: ['沉默，任由绞杀', '最后一刻她站出来说「我替你死」。你活了，但活着比死难受。→ 标记「牺牲」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '赎罪线', 1], ['flags', 'self_sacrifice', 1]] },
    { perspective: '钟楼', type: 'qte', typeLabel: 'QTE · 7s · 一致性校验对',
      shots: [
        { shot: 'Shot 01', text: '钟楼之上，人群怒吼。字幕：「你是凶手。」' },
        { shot: 'Shot 02', text: '她（你最爱的人）在人群里看着你，摇头。' },
        { shot: 'Shot 03', text: '证据就在你怀里。倒计时出现。' },
      ],
      audio: { BGM: '钟声+悲怆弦乐', SFX: 'L=坠地闷响, R=认罪叹息/人群静默', vibration: '坠地后长震' },
      consistency: { pairWith: 'card05', axis: 'SACR', note: '与卡05配对：此处测认知理想(牺牲/自保)' },
      checklist: ['两个坏结局，玩家想有没有第三条路(没有)', '与卡05构成蝴蝶效应闭环'] }),

  C('10', 'Ch4', '魔鬼出现，给你一个愿望。代价是随机一人死亡。你看得到候选名单：母亲、爱人、最好的朋友。', false, null, true,
    { text: ['许愿「我要权力」', '你走出密室，发现死的是你自己——你成了权力的傀儡。→ 锁定结局「傀儡」。'],
      effects: [['counter', 'CHAOS', 1], ['chapters', '傀儡线', 1], ['flags', 'puppet', 1]] },
    { text: ['许愿「让他们都活着」', '你化作灰烬，灰烬里开出一朵花。→ 解锁「圣徒线」。'],
      effects: [['counter', 'SACR', 1], ['chapters', '圣徒线', 1], ['flags', 'saint', 1]] },
    { perspective: '密室', type: 'normal', typeLabel: '超自然 · 结局覆盖',
      shots: [
        { shot: 'Shot 01', text: '密室烛火骤暗。字幕：「代价是随机一人死亡。」' },
        { shot: 'Shot 02', text: '魔鬼推来三张照片：母亲、爱人、挚友。' },
        { shot: 'Shot 03', text: '魔鬼微笑：「选吧。」' },
      ],
      audio: { BGM: '圣咏反转(不协和和弦)', SFX: 'L=锁链缠绕, R=花瓣绽开/消散', vibration: 'L侧沉重长震 / R侧渐弱' },
      checklist: ['打破现实逻辑，超自然转折', '优先级最高，覆盖一切主结局'] }),

  C('11', 'Ch5', '最后的门，需要一人留下断后。门外是死地，留下的人必死。', true, 6000, true,
    { text: ['你留下断后', '把钥匙给最信任的人。你死在门口，却听到门后传来他们的笑声——他们背叛了你。→ 结局「孤王的最后一战」。'],
      effects: [['counter', 'SACR', 1], ['counter', 'PRIDE', 1], ['flags', 'last_stand', 1]] },
    { text: ['把最弱的人推出去', '他回头看你，眼神平静。你活了，但从此每晚梦见他的脸。→ 结局「活下来的懦夫」。'],
      effects: [['counter', 'COLD', 1], ['blood', '_', -1], ['flags', 'coward', 1]] },
    { perspective: '黎明', type: 'qte', typeLabel: '终章裁决 · 断后',
      shots: [
        { shot: 'Shot 01', text: '黎明，残破的门前。字幕：「一人留下，必死。」' },
        { shot: 'Shot 02', text: '队友们互相看，没人自愿。' },
        { shot: 'Shot 03', text: '钥匙在你手里。倒计时出现。' },
      ],
      audio: { BGM: 'L=悲壮合唱, R=低沉心跳+耳鸣', SFX: 'L=门合上/笑声, R=推搡/梦魇呼吸', vibration: 'L侧渐强 / R侧持续' },
      checklist: ['终章裁决卡，final_choice_11=L/R', 'L=我以为他们会感恩(讽刺), R=一辈子不安(折磨)'] }),

  C('12', 'Ch5', '所有人都死了，或者都走了。你一个人坐在王座上。这是最后一刻。', false, null, true,
    { text: ['说「值得」', '镜头拉远，王座变成棺材。→ 结局「孤王的加冕」。'],
      effects: [['flags', 'coronation', 1]] },
    { text: ['走出去，推开门', '外面是阳光——画面一转，你其实死在第三章，这是幻觉。→ 结局「最后的幻觉」。'],
      effects: [['chapters', '幻觉', 1], ['flags', 'illusion', 1]] },
    { perspective: '王座', type: 'normal', typeLabel: '终章裁决 · 元叙事收尾',
      shots: [
        { shot: 'Shot 01', text: '空旷大殿，你独坐王座。字幕：「最后一刻。」' },
        { shot: 'Shot 02', text: '回忆碎片闪过——每个死去的人。' },
        { shot: 'Shot 03', text: '画面定格，等你的最后一句话。' },
      ],
      audio: { BGM: 'L=肃穆下行到寂静, R=突然明亮(打破第四面墙)', SFX: 'L=棺材合上, R=门轴转动/现实重置音', vibration: 'R侧画面切换瞬震' },
      checklist: ['元叙事收尾，打破第四面墙', '让玩家懵一下然后想重玩'] }),
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
