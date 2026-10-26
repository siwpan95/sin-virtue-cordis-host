const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType,   TableOfContents, PageNumber, Footer, PageBreak,
  LevelFormat, ShadingType,
} = require('docx')

const A4 = 11906
const M = 1440
const CONTENT = A4 - 2 * M // 9026

const FONT = 'Microsoft YaHei'
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 21, bold: !!o.bold, color: o.color || '000000', italics: !!o.italics })
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 160 }, children: [run(t, { size: 30, bold: true })] })
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [run(t, { size: 26, bold: true })] })
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 140, after: 80 }, children: [run(t, { size: 23, bold: true })] })
const p = (t, o = {}) => new Paragraph({ spacing: { after: 90, line: 320 }, alignment: o.align, children: [run(t, o)] })
const bullets = (items) => items.map((t) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 }, spacing: { after: 50, line: 300 },
  children: [run(t, { size: 21 })],
}))
const numbered = (items) => items.map((t) => new Paragraph({
  numbering: { reference: 'numbers', level: 0 }, spacing: { after: 50, line: 300 },
  children: [run(t, { size: 21 })],
}))

const border = { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' }
const borders = { top: border, bottom: border, left: border, right: border }
const cell = (text, opts = {}) => new TableCell({
  borders,
  width: { size: opts.w, type: WidthType.DXA },
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
  margins: { top: 60, bottom: 60, left: 90, right: 90 },
  children: [new Paragraph({ spacing: { line: 260 }, children: [run(text, { size: opts.size || 18, bold: !!opts.bold })] })],
})
const row = (cells) => new TableRow({ children: cells })
const table = (header, rows, widths, headerFill = '2E75B6') => new Table({
  width: { size: CONTENT, type: WidthType.DXA },
  columnWidths: widths,
  rows: [
    row(header.map((h, i) => cell(h, { w: widths[i], bold: true, fill: headerFill, size: 18 }))),
    ...rows.map((r) => row(r.map((c, i) => cell(c, { w: widths[i] })))),
  ],
})

const content = []
content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [run('如果从原创的角度出发，这样的测试可以如何设计', { size: 36, bold: true })] }))
content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run('——「七宗罪 VS 七美德」互动叙事测试的原创设计方法 + Cordis“一切皆插件”架构方案', { size: 22, color: '555555' })] }))
content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [run('文档版本 V1.0（设计提案）　|　适用：策划 / 文案 / 前端 / 架构　|　日期：2026-09-12', { size: 18, color: '888888' })] }))

content.push(new TableOfContents('目录', { hyperlink: true, headingStyleRange: '1-3' }))
content.push(new Paragraph({ children: [new PageBreak()] }))

// 一
content.push(h1('一、背景与定位'))
content.push(p('本项目脱胎于一个常见的人格测试命题：如何把“七宗罪 VS 七美德”做成一款可传播、可重玩的互动产品。最初的讨论从“人格光谱测试”出发，但很快收敛到一个更清醒的判断——'))
content.push(bullets([
  '准确性是护城河最浅的方向：大五、黑暗三人格、HEXACO 等学术标尺早已焊死，再怎么卷也只是“又一款还行的测试”。',
  '用户最终记住的不是“它测得准”，而是“它好玩 / 它让我想截图发朋友圈”。',
  '因此定位必须反过来：测试是骨架，游戏是皮肉，趣味性是灵魂。',
]))
content.push(p('一句话定位：不是「一款好玩的测试」，而是「一款让你忘记它在测试你的互动叙事游戏」。', { bold: true }))
content.push(p('本文据此给出两件事：(1) 从原创角度出发的测试方法与方法论；(2) 推荐以 Cordis 实现“一切皆插件”的可扩展架构，并用本地 Everything + 联网搜索 + 内置 PowerShell 完成素材检索与构建。'))

// 二
content.push(h1('二、原创设计方法论：从原创角度如何设计这类测试'))
content.push(h2('2.1 底层理论重构：从“道德审判”到“能量光谱”'))
content.push(bullets([
  '独立双轴计分：打破“罪与德互相抵消”的传统逻辑。例如“傲慢”与“谦卑”相关系数仅约 -0.42，一个人可以同时具备强自信与强自省，14 个维度应独立计分。',
  '引入“过度阴影”：同一根轴上，失控是“罪”，但美德用力过猛也会变成阴影（如慷慨过度成为“有求必应被吸血”，勤勉过度成为“停不下来的自我压榨”）。',
]))
content.push(h2('2.2 题型与场景创新：沉浸式情境判断（SJT）'))
content.push(bullets([
  '即时通讯 / 对话式呈现：用模拟聊天界面或朋友圈截图替代“你遇到 XX 情况会怎样”，大幅降低防备心，减少社会赞许性偏差。',
  'Would-do / Should-do 双问法：问“你第一反应会怎么做”测真实行为，问“最合适的做法是”测道德约束，二者差值即“自我损耗 / 内耗指数”。',
  '优先级排序 + 伪选项：给出互斥选项让用户排序，用“伪选项”暴露真实的即时满足倾向。',
]))
content.push(h2('2.3 题库与防作弊'))
content.push(bullets([
  '自适应题库：基础信息收集后，35 题（或 12 卡）均匀分布在维度上，按全局状态动态重编译卡池。',
  '一致性 / 测谎题：不同章节用不同包装测同一特质（金钱、时间、面子各一版），筛除随意作答，保证区分度。',
]))
content.push(h2('2.4 结果呈现与游戏化'))
content.push(bullets([
  '双雷达 / 光谱图：左侧七宗罪（本能驱动力），右侧七美德（克制力）。',
  '人格组合标签：取最高的一项“罪”与一项“德”组合（如“傲慢型勤勉者”“嫉妒型宽容者”），衍生几十种专属解读。',
  '状态化解读：结果定义为“近期的能量倾向”或“压力下的防御机制”，提供行为建议与成长方向，而非永久标签。',
]))
content.push(h2('2.5 融合两套成熟机制'))
content.push(bullets([
  '《王权》(Reigns) 式资源平衡：用 4 条双向张力轴代替分数，每条轴设“安全区 / 过载 / 亏空”，越界触发结局片段而非“答错”。',
  '《黑相集》式互动惊悚：封闭事件、多视角、变量驱动的蝴蝶效应，早期选择在后续章节回响。',
]))
content.push(h2('2.6 12 张事件卡：双系统“执政 + 遇险”'))
content.push(p('每张卡＝一个场景请求 + 左右两个非道德化选项 + 隐藏权重。选项写具体行为（加薪、冷处理、熬夜、回消息、藏证据），不写“我选贪婪 / 我选美德”，以降低社会赞许性偏差。卡结构：场景 → 左滑(行为/资源变化/变量) → 右滑(同上) → 解锁条件。下表为浓缩总表（完整版见《事件卡全表》）。'))
content.push(table(
  ['卡号', '章节', '场景', '左滑 (L)', '右滑 (R)', '解锁 / 钩子'],
  [
    ['01', 'Ch1', '加冕夜 · 前朝公主跪在脚下', '赦免 → 谦守↑，标记仁慈', '赐毒酒 → 野心↑，标记冷酷', '开局必出'],
    ['02', 'Ch1', '旧友浑身是血地敲门', '帮埋尸 → 获秘密「共犯」', '绑送守卫 → 背叛链，信任归零', '开局必出'],
    ['03', 'Ch1', '下属当众质疑你的王冠', '扇耳光 → 暗杀线', '割掌血誓 → 疯王线', '开局必出'],
    ['04', 'Ch2', '情人说怀了你的孩子', '承认 → 绿帽线', '撕衣羞辱 → 连环复仇线', '野心≥60'],
    ['05', 'Ch3', '团队只剩一份干粮', '分食 → 殉道者线，blood-1', '自吃捅人 → 生存者线，blood-1', 'chapter≥3'],
    ['06', 'Ch3', '发现队友中有人是内鬼', '审 A(清白) → blood-1', '审 B(真凶) → 半盲线', '秘密触发'],
    ['07', 'Ch3', 'A 与 B 拔刀相向', '打 A → 钥匙线，弃义', '打 B → 情义线', '双关系存在'],
    ['08', 'Ch4', '仇人跪地求饶', '原谅再绞死 → 伪善', '割头舔血 → 疯魔线', 'chapter≥4'],
    ['09', 'Ch4', '所有人指控你是凶手', '拿证据洗清 → 自私', '沉默任吊 → 赎罪线', '秘密触发'],
    ['10', 'Ch4', '魔鬼给你一个愿望', '许愿权力 → 傀儡', '许愿他们活 → 圣徒', '终章必出'],
    ['11', 'Ch5', '最后的门需一人断后', '你留下 → 孤王最后一战', '推弱者出去 → 懦夫', '终章必出'],
    ['12', 'Ch5', '你赢了，坐在王座上', '说“值得” → 王座变棺材', '走出去 → 最后的幻觉', '终章必出'],
  ],
  [700, 800, 1900, 2813, 2813, 0].map((w, i) => (i === 5 ? CONTENT - (700 + 800 + 1900 + 2813 + 2813) : w)),
))
content.push(h2('2.7 结局三层判定架构'))
content.push(p('结局由三层架构产出，优先级固定：特殊结局 → 主结局 → 终章裁决。前端只收集变量，判定逻辑集中在规则层，便于热更新与防作弊。'))
content.push(table(
  ['层级', '机制', '判定方式', '示例'],
  [
    ['第一层 · 特殊结局', 'bail（命中即锁定）', '硬性条件满足即跳过后续', '傀儡(卡10=L) / 最后的幻觉(卡10=R 且卡12=R) / 圣徒 / 复仇者'],
    ['第二层 · 主结局', 'bail（按优先级）', '四轴 + 状态变量组合', '疯王(impulse≥80) / 孤王(COLD≥6 且 blood≤3) / 殉道者 / 伪善者 / 弃义者 / 幸存者(默认)'],
    ['第三层 · 终章裁决', 'waterfall（链式修饰）', '卡11/12 对主结局做 modifier 或覆盖', '“孤王的加冕”→“孤王的最后一战”；“幸存者”→“冷酷的胜利者”'],
  ],
  [1900, 1900, 2613, 2613],
))
content.push(h2('2.8 平衡趣味性与准确性：把“量表”翻译成“游戏行为”'))
content.push(bullets([
  '每个选项带双重权重：一个影响游戏内资源（趣味性），一个写入后台特质变量（准确性）。玩家看到“我的王国崩了”，后台记录“该玩家 3 次危机均选高风险，贪婪轴+15”。',
  '用游戏逻辑去噪：一致性陷阱卡、反应时作为效度指标、状态依赖测量（资源见底时才测慷慨），让“玩”与“测”互相驯化。',
  '反馈层用叙事报告替代分数报告：专属剧情复盘 + 关系网 + “如果当时选另一个”对比，把重玩动机从“测得更准”变为“想看另一个结局长什么样”。',
]))

// 三
content.push(h1('三、推荐架构：一切皆插件（Cordis）'))
content.push(h2('3.1 为什么是 Cordis'))
content.push(p('Cordis 是 DeepSeek Harness 底层以 vendor 方式引入的插件框架（本机 PluginPlayer / dict-scene-engine 等已广泛采用）。其五个核心概念恰好匹配本项目的可扩展诉求：'))
content.push(bullets([
  '插件是实现 Service 的对象，或带 apply(ctx) 的函数；生命期由 Cordis 挂载到上下文。',
  '上下文是服务的容器：服务占据稳定的 ctx.<key>（如 ctx.game），其他插件按 key 查找，而非导入具体实现。',
  '通过 inject 声明服务依赖：声明所需服务后，等待其就绪才启动，加载顺序由依赖表达而非手动编排。',
  '类型化事件用于通信：emit / waterfall / parallel / serial / bail 五种分发模式，对应观察 / 包装 / 并行扇出 / 按序 / 首个 bail 值。',
  '注册是可逆的副作用：提示词、工具、监听器通过 ctx.effect() / ctx.on() 安装，reload 与 teardown 时按预期撤销。',
]))
content.push(h2('3.2 本项目如何“一切皆插件”'))
content.push(table(
  ['插件类别', '在本项目中的体现', '新增 / 替换成本'],
  [
    ['轴插件', 'ambition / possession / impulse / devotion 四条张力轴各为一个插件', '加轴 = 加一个文件，零改核心'],
    ['卡插件', 'card-library 注册 12 张卡；每张卡再被包成独立的 card:<id> 子插件', '加卡 = 加一条数据 / 一个插件'],
    ['结局插件', '特殊 / 主 / 修饰三层，各自独立插件（监听 ending:special / main / modifier）', '加结局 = 加一个监听器插件'],
    ['传输插件', 'transport:cli 只是其中一种前端；同一套 ctx.game 可挂 Web / 微信 / 桌面端', '换前端 = 加一个 transport 插件'],
    ['内容源插件', '本地检索 content-everything（Everything）；联网检索 content-websearch（可替换后端）', '换检索后端 = 替换该插件'],
    ['分析插件', 'analytics 仅监听 game/choose 事件做埋点，对核心逻辑零侵入', '加埋点 = 加一个事件监听器'],
  ],
  [1700, 4813, 2513],
))
content.push(h2('3.3 核心服务与事件流'))
content.push(bullets([
  'ctx.game 服务：持有状态（四轴数值 / blood / secrets / chapters / 终章选择）、注册表（axes / cards / endings），并提供 choose() 与 judge()。',
  '选择即广播：choose() 在写入权重与变量后 emit(\'game/choose\', {...})，任何插件可对其反应（埋点、防作弊、蝴蝶效应）。',
  '判定即分发：judge() 依次 = ctx.bail(\'ending:special\', state) → ctx.bail(\'ending:main\', state) → ctx.waterfall(\'ending:modifier\', {ending,state}, fallback)。三层严格不颠倒，否则会出现“最后的幻觉”被主结局覆盖的 bug。',
]))
content.push(h2('3.4 目录结构与落地（已验证可运行）'))
content.push(p('本目录已随项目落地为 cordis-host/ 验证原型，依赖仅 cordis + cosmokit，使用项目内置 node 运行通过。'))
content.push(table(
  ['文件', '职责'],
  [
    ['core.js', '核心插件：提供 ctx.game 服务 + 三层判定引擎'],
    ['plugins/axes.js', '四条张力轴插件（各一文件导出）'],
    ['plugins/cards.js', 'CARDS 数据 + card-library 插件（每张卡包成 card:<id> 子插件）'],
    ['plugins/endings.js', '特殊 / 主 / 修饰三类结局插件'],
    ['plugins/transport-cli.js', 'CLI 传输插件（同一套 game 的“前端”之一）'],
    ['plugins/analytics.js', '事件监听埋点插件'],
    ['plugins/content-everything.js', '本地内容检索插件（包装 Everything 的 es.exe）'],
    ['plugins/content-websearch.js', '联网检索插件（可替换后端的占位实现）'],
    ['index.js', '宿主：new Context() 后把“一切”作为插件挂上去并跑演示'],
  ],
  [3400, 5626],
))
content.push(p('运行方式与实测输出（使用内置 PowerShell，避免 bash 异常）：', { bold: true }))
content.push(numbered([
  'Set-Location G:\\local\\12test\\cordis-host',
  'G:\\local\\12test\\node\\npm.cmd install',
  'G:\\local\\12test\\node\\node.exe index.js',
]))
content.push(bullets([
  'demo-1：卡 10 选 L → 触发特殊结局「傀儡」（超自然选择优先级最高）。',
  'demo-2：连续暴力选择使 impulse=88 → 命中主结局「疯王」，并由终章修饰插件追加文本。',
  '[everything]：调用 Everything 在本地秒级命中 8 条“七宗罪”相关素材。',
  '[websearch]：返回占位结果（替换为真实搜索 API 插件即可联网）。',
]))
content.push(h2('3.5 扩展性与“换皮”能力'))
content.push(p('由于所有可变部分都是插件，以下变更均不需改动核心引擎：加卡、加轴、加结局、换前端、换检索后端、加埋点。这正是“一切皆插件”相对传统“巨型 switch / 硬编码配置”的最大价值——也是本项目能快速从 12 张卡扩展到每章 8–12 张概率卡、并接入社交裂变与美术 A/B 的基础。'))

// 四
content.push(h1('四、内容检索与生产工具链'))
content.push(h2('4.1 本地内容查找：Everything'))
content.push(p('本地素材（竞品参考、文案灵感、已有 docx 设计稿、音频/美术）优先用 Everything 秒级检索，避免重复造轮子。工具路径：G:\\Everything-1.5.0.1418b.x64\\es.exe（命令行），GUI 为 Everything.exe。'))
content.push(bullets([
  '用途：检索“七宗罪”“互动叙事”“SJT”“竞品”等关键词，定位本地已有设计文档与素材。',
  '已验证：本机执行 es.exe “七宗罪” 即命中 8 条本地结果（含本项目的策划需求文档、事件卡全表、前端规格、互动脚本合集等 docx）。',
  '在架构中封装为 content-everything 插件，作者工作流中可一键拉取本地素材清单。',
]))
content.push(h2('4.2 联网检索：本地查不到 → 联网搜索'))
content.push(p('当本地无对应资料（如《王权》《黑相集》的最新机制解析、SJT 心理测量文献）时，联网搜索补足。该能力在架构中封装为 content-websearch 插件，默认返回占位，接入任意搜索 API 后端即可返回真实联网结果，主体代码无感。'))
content.push(h2('4.3 构建与运行：本机内置 PowerShell'))
content.push(p('本项目内置 G:\\local\\12test\\PowerShell\\pwsh.exe（便携 PowerShell 7）。鉴于本机 bash 环境异常，统一使用内置 PowerShell 执行 npm / node / 解压等命令；涉及引号与多语句时，优先写临时 .ps1 脚本再运行，避免内联转义歧义。'))

// 五
content.push(h1('五、项目现状与落地指引'))
content.push(h2('5.1 目录总览（G:\\local\\12test）'))
content.push(table(
  ['路径', '说明'],
  [
    ['sin_virtue_game/', '前后端可上线骨架：engine.js / cards_data.js / server.js(Express 权威计算) / runner.html / Dockerfile / 测试套件'],
    ['cordis-host/', '“一切皆插件”架构验证原型（本文第三章），已跑通傀儡 / 疯王 / Everything 演示'],
    ['七宗罪VS七美德_策划需求文档.docx', '策划需求模板（定位 / 玩法框架 / 卡规范 / 结局系统 / 功能需求）'],
    ['七宗罪VS七美德_事件卡全表.docx', '12 张卡横版全表（权重口径已统一 0–100）'],
    ['七宗罪VS七美德_前端开发需求规格.docx', 'FRS：数据模型 / 状态机 / 接口契约 / 判定算法'],
    ['七宗罪VS七美德_互动脚本合集.docx', '12 张卡七章模板互动脚本'],
    ['卡05_互动脚本范例.docx', '单卡完整分镜 / QTE / 音效 / 验收点范例'],
    ['cordis* / aiceo / OpenExecutive / paper / sin_virtue_game (.zip)', '参考与依赖压缩包（cordis 源码、引擎参考实现等）'],
    ['ffmpeg-9.0.1 / FFmpeg-master / node / PowerShell', '本地工具链'],
  ],
  [4200, 4826],
))
content.push(h2('5.2 如何运行'))
content.push(bullets([
  '原型（sin_virtue_game）：解压 → npm install → npm start（起后端 :3000）；或双击 runner.html 离线玩。',
  '插件架构（cordis-host）：见第三章 3.4 的运行步骤。',
]))
content.push(h2('5.3 已知边界与风险'))
content.push(bullets([
  '娱乐性质的自察工具，不作临床诊断用途；结局页需加免责声明。',
  '避免过度阴暗：极端暴力 / 自伤描写需软处理，符合平台审核规范。',
  '口径统一：事件卡全表权重已统一为 0–100，与 FRS 的 GameState.axes([0,100]) 一致；新增卡须沿用同一单位。',
]))

// 六
content.push(h1('六、后续迭代建议'))
content.push(numbered([
  '扩充至每章 8–12 张概率卡，提升重玩差异（卡池按全局状态动态重编译）。',
  '加入“好友罪孽匹配度”社交对比，强化裂变与截图传播。',
  '美术风格 A/B：暗黑童话 / 塔罗 / 赛博朋克三套方向验证。',
  '接入真实联网检索后端，让 content-websearch 插件返回真实竞品与文献。',
  '将 cordis-host 的插件契约沉淀为正式 SDK，使策划 drag-drop 一张卡即上线一个分支。',
]))

// 附录
content.push(h1('附录 A：结局三层判定速查'))
content.push(table(
  ['结局', '触发条件', '一句话基调'],
  [
    ['傀儡', '卡10 选 L（许愿权力）', '你活了，但成了权力的容器'],
    ['最后的幻觉', '卡10=R 且 卡12=R', '你早就死了，只是不愿闭眼'],
    ['圣徒', '卡10=R 且 SACR≥6', '自我牺牲到极致，神圣结局'],
    ['复仇者', '含「复仇线」且 COLD≥5', '追仇到底，也被仇恨吞噬'],
    ['疯王', 'impulse≥80', '你的王冠是用别人的骨头做的'],
    ['孤王的加冕', 'COLD≥6 且 blood≤3', '你赢了，但赢的是一座空城'],
    ['活下来的懦夫', '卡11=R 且 COLD≥4', '你每天后悔，但每天还在呼吸'],
    ['殉道者', 'SACR≥6 且 blood≥4', '他们踩着你的尸体走向光明'],
    ['伪善者', '含「伪善」或 secrets≥3 且 COLD≥3', '你连善良都是武器'],
    ['弃义者', 'PRIDE≥5 且 betrayed≥2', '谁都不信，最后谁都离你而去'],
    ['幸存者', '以上均未触发（默认）', '不是英雄也不是反派，只是活下来'],
  ],
  [1900, 3913, 3213],
))
content.push(h1('附录 B：原始设计讨论精华（演进脉络）'))
content.push(p('本设计文档的方法论源自一轮从理论到落地的讨论，其演进脉络如下，供追溯：'))
content.push(bullets([
  '起点：人格光谱测试（35 题、14 维对照）→ 引入现代心理学（SJT、大五、黑暗三人格）做原创重构。',
  '转折：引入《王权》《黑相集》机制，从“答题”改为“执政 + 遇险”，用资源曲线与反常结局反推人格光谱。',
  '深化：写出 12 张示范事件卡，明确“执政 + 遇险”双系统与蝴蝶效应闭环。',
  '权衡：讨论“趣味 vs 准确”的悖论 → 结论：机制层把量表翻译成游戏行为，数据层用游戏逻辑去噪。',
  '定调：放弃“保真”、拥抱“戏剧化失真”；趣味性优先才能脱离同质化竞争——测试维度退为后台好奇心钩子。',
  '落地：12 张“卧槽时刻”卡 → 结局三层判定逻辑 → 策划需求模板 → 事件卡全表 + 前端 FRS → 可交互原型 + Node/Express 后端 + Docker。',
  '收口：本方案在既有原型基础上，进一步建议以 Cordis“一切皆插件”架构承载全部可变部分，获得可扩展与可换皮能力。',
]))
content.push(new Paragraph({ spacing: { before: 200 }, children: [run('（本文档为设计提案；所有代码原型位于 G:\\local\\12test\\cordis-host，可运行验证。）', { size: 18, italics: true, color: '888888' })] }))

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font: FONT }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 23, bold: true, font: FONT }, paragraph: { spacing: { before: 140, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: A4, height: 16838 }, margin: { top: M, right: M, bottom: M, left: M } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run('第 ', { size: 16, color: '888888' }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '888888' }), run(' 页', { size: 16, color: '888888' })] })] }) },
    children: content,
  }],
})

Packer.toBuffer(doc).then((buf) => {
  require('fs').writeFileSync('G:\\local\\12test\\如果从原创的角度出发，这样的测试可以如何设计.docx', buf)
  console.log('written', buf.length)
})
