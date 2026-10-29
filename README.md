# 七宗罪 VS 七美德 · Cordis “一切皆插件” 宿主（主仓）

## 仓库角色定位（投资组合分级 ②）

> 本仓在 siwpan 投资组合（D:/projects/repos，共 133 仓）中定级为 **② 保留**，领域 **原型/学习/杂项**。
> **角色**：架构原型。
> **维护策略**：② 旗舰 / 枢纽仓库打磨保留，作为能力展示或收敛点；② 保留类仓库低优先维持、不主动扩张。
> 投资组合统一分级索引：`D:/projects/repos/PORTFOLIO_TIERING.md`。

本目录是《七宗罪 VS 七美德》互动叙事测试原型的**主仓**，用
[Cordis](https://github.com/cordiverse/cordis)（`@deepseek-ai/cordis@4.x`）实现
“**一切皆插件**”架构。对应《如果从原创的角度出发，这样的测试可以如何设计》设计文档第三章。

> **合并说明（2026-10-28）**：原 `sin-virtue-game` 仓已**退役**，其内容已并入本仓：
> - 卡牌的丰富叙事字段（分镜 / 音频 / 视角 / 验收点 / 一致性校验）并入 `plugins/cards.js`；
> - 设计文档（FRS、策划需求、原始讨论记录、测试设计等）迁入 `docx/`；
> - 互动脚本合集生成器迁入 `docgen/gen_script_doc.js`。
> 规则以本仓的 **counter 模型**为准（`sin-virtue-game` 的 0–100 轴模型已弃用，详见“规则真相源”小节）。

## 规则真相源

- **核心服务 `ctx.game`**（`core.js`）：唯一的状态容器 + 注册表 + 三层判定 `judge()`。
- **四计数器** `COLD / SACR / CHAOS / PRIDE`（初始 0，可超上限）——见 `plugins/counters.js`。
- **轴/卡/结局/传输/内容源/分析** 各为独立插件：
  - 轴插件：`ambition / possession / impulse / devotion` 四个张力轴，每个独立成插件。
  - 卡插件：`card-library` 把 12 张卡注册进 `ctx.game.cards`，每张卡再被包成独立的 `card:<id>` 子插件。
  - 结局插件：特殊 / 主 / 修饰三层，分别监听 `ending:special`(bail) / `ending:main`(bail) / `ending:modifier`(waterfall)。
  - 传输插件：`transport:cli` + `transport:web`——同一套 `game` 服务可挂任意前端（Web / 微信 / 桌面）。
  - 内容源插件：本地检索用 Everything（`content-everything`），联网检索用可替换后端的 `content-websearch`。
  - 分析插件：`analytics` 仅监听 `game/choose` 事件做埋点，对核心逻辑零侵入。

> ⚠️ **与已退役的 `sin-virtue-game` 规则差异（重要）**：两个仓曾长期“双线漂移”。
> 本仓用 counter 模型 + 已调平阈值（`plugins/cards.js` 末尾“调平说明”），
> `sin-virtue-game` 用 0–100 轴模型 + 旗标触发。同一局游戏两端**可能给出不同结局**
> （疯王/懦夫/伪善者/弃义者 4 个结局的可达性在两端不同）。合并后**以本仓为准**，
> `sin-virtue-game` 不再维护。

## 运行

```bash
npm install            # 安装 cordis + cosmokit + docx
npm run demo           # CLI 演示（傀儡 / 幻觉 / 本地检索 / 联网检索占位）
npm start              # 启动宿主
npm start -- --serve   # 启动并常驻 Web：浏览器打开 http://localhost:3210
```

Web 前端（`public/runner.html`，由 `transport:web` 托管）走 `ctx.game` 权威判定，
展示四计数器 + 存活/秘密/背叛 + 结局彩蛋。

## 测试

```bash
npm test              # playthrough.js：穷举 4096 条（12 卡 × L/R）对局，
                      # 断言每个结局 + modifier + 关键隐藏彩蛋均可达
npm run smoke         # smoke.js：起 Web 服务做真实 HTTP 全链路自检
```

`playthrough.js` 比手写用例更严格，也顺便证明“每张卡都参与推进”。

## 生成互动脚本合集（docx）

```bash
npm run gen:doc       # 产出 docx/七宗罪VS七美德_互动脚本合集.docx
                      # （七章模板 × 12 张卡，读 plugins/cards.js 的 CARDS）
```

## 扩展方式（均不改核心）

- 加一张卡：在 `plugins/cards.js` 的 `CARDS` 加一条（叙事字段已对齐 game），或 drop 一个 `card` 插件。
- 加一个结局：新增一个监听 `ending:*` 的插件（`plugins/endings.js`）。
- 换前端：新增一个 `transport:*` 插件，复用 `ctx.game`。
- 换检索后端：替换 `content-websearch` 插件即可，主体无感。

## 目录结构

```
sin-virtue-cordis-host/
├── index.js              # 启动入口（demo + 可选 --serve）
├── host.js               # createHost()：组装“一切皆插件”宿主
├── core.js               # ctx.game 核心服务（状态 + 注册表 + judge()）
├── plugins/
│   ├── counters.js       # 4 个计数器插件（COLD/SACR/CHAOS/PRIDE）
│   ├── cards.js          # 12 张卡（card-library + 调平说明）★ 规则真相源
│   ├── endings.js        # special / main / modifier 三层结局插件
│   ├── transport-cli.js  # CLI 前端
│   ├── transport-web.js  # Web 前端（node:http，托管 public/runner.html）
│   ├── content-everything.js / content-websearch.js  # 内容源插件
│   └── analytics.js      # 埋点插件（零侵入）
├── public/runner.html    # 可玩 Web 前端
├── playthrough.js        # 穷举 4096 对局的可达性断言（npm test）
├── smoke.js              # Web 全链路自检
├── docgen/gen_script_doc.js  # docx 脚本合集生成器（npm run gen:doc）
└── docx/                 # 设计文档 + 生成的脚本合集（含 FRS/策划/原始讨论记录）
```
