# 七宗罪 VS 七美德 · Cordis “一切皆插件” 宿主（验证原型）

本目录是用 [Cordis](https://github.com/cordiverse/cordis)（`@deepseek-ai/cordis@4.x`）实现的
“**一切皆插件**”架构验证原型，对应《如果从原创的角度出发，这样的测试可以如何设计》设计文档第三章。

## 设计要点

- **核心服务 `ctx.game`**：唯一的状态容器 + 注册表 + 三层判定 `judge()`。
- **轴插件**：`ambition / possession / impulse / devotion` 四个张力轴，每个独立成插件。
- **卡插件**：`card-library` 把 12 张卡注册进 `ctx.game.cards`，每张卡再被包成独立的 `card:<id>` 子插件。
- **结局插件**：特殊 / 主 / 修饰三层，分别监听 `ending:special`(bail) / `ending:main`(bail) / `ending:modifier`(waterfall)。
- **传输插件**：`transport:cli` 只是其中一种前端；同一套 `game` 服务可挂 Web / 微信 / 桌面端。
- **内容源插件**：本地检索用 Everything（`content-everything`），联网检索用可替换后端的 `content-websearch`。
- **分析插件**：`analytics` 仅监听 `game/choose` 事件做埋点，对核心逻辑零侵入。

## 运行

```powershell
# 使用项目内置的 PowerShell / node（避免 bash 异常环境）
Set-Location G:\local\12test\cordis-host
G:\local\12test\node\npm.cmd install      # 安装 cordis + cosmokit
G:\local\12test\node\node.exe index.js    # 运行演示
```

## 演示输出（已验证）

- `demo-1 傀儡`：卡 10 选 L → 触发特殊结局“傀儡”（超自然选择优先级最高）。
- `demo-2 疯王`：连续暴力选择使 `impulse=88` → 命中主结局“疯王”，并由终章修饰插件追加文本。
- `[everything]`：调用 Everything (`es.exe`) 在本地秒级命中“七宗罪”相关文件。
- `[websearch]`：返回占位结果（替换为真实搜索 API 插件即可联网）。

## 扩展方式（均不改核心）

- 加一张卡：在 `plugins/cards.js` 的 `CARDS` 加一条，或 drop 一个 `card` 插件。
- 加一个结局：新增一个监听 `ending:*` 的插件。
- 换前端：新增一个 `transport:*` 插件，复用 `ctx.game`。
- 换检索后端：替换 `content-websearch` 插件即可，主体无感。
