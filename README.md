# 七宗罪 VS 七美德 · 互动叙事测试原型

一款"趣味性优先"的互动叙事游戏原型：**一款让你忘记它在测试你的互动叙事游戏**。
测试维度退到后台，每张卡都是一个不可逆的戏剧瞬间。12 张卡，4 张 QTE 限时，7 种基础结局 + 3 种覆盖结局。

## 架构

```
┌──────────────┐    HTTP / JSON    ┌──────────────────┐
│  前端引擎     │ ──submitChoice──▶ │  Node/Express    │
│  runner.html │ ◀──appliedEffects── │  后端 (server)   │
│  engine.js   │                   │  • 权威计算 effects│
│  api_client  │ ──judge─────────▶ │  • 结局三层判定   │
└──────────────┘                   └──────────────────┘
                                            │
                                            ▼
                                      sessions (内存/Redis)
```

**关键设计（对齐 FRS 5.1）**：effects 由后端权威计算，前端只做表现回放。客户端篡改无效。

## 目录结构

```
sin_virtue_game/
├── runner.html          # ★ 可交互原型入口（浏览器直接打开）
├── engine.js            # 核心引擎：状态/渲染/QTE/选择/埋点/clamp
├── api_client.js        # 前端适配器：调后端，离线降级本地
├── style.css            # 暗黑电影感 UI（移动端竖屏优先）
│
├── server.js            # ★ Express 后端：6 个 API + 结局判定
├── cards_data.js        # 12 张卡数据（gen_cards.js 生成，勿手改）
├── gen_cards.js         # ★ 单一事实源：改卡改这里再重新生成
│
├── gen_script_doc.js    # 互动脚本合集生成器（七章模板 × 12 卡 → docx）
├── 七宗罪VS七美德_互动脚本合集.docx   # ★ Word 交付物（生成产物）
│
├── test_all.js          # ★ 一键全量测试
├── test_engine.js       # 引擎单元测试
├── test_runner.js       # 结局判定端到端
├── test_api.js          # API 集成测试（真实 HTTP）
├── test_api_client.js   # api_client 测试（mock fetch）
└── package.json         # npm scripts
```

## 快速开始

### 1. 跑原型（浏览器，纯前端模式）
直接双击打开 `runner.html` 即可（离线模式，本地计算 effects）。

> 手机预览：`python3 -m http.server 8080` → `http://localhost:8080/runner.html`

### 2. 启动后端（Node/Express）
```bash
npm install        # 安装 express + docx
npm run syntax     # 全部 .js 语法检查
npm start          # 起服务，默认 :3000
```
可用端点：
- `GET  /api/card/:id?sessionId=...` — 拉取单卡
- `POST /api/choice` — 提交选择，返回权威 effects + 新状态 + 下一卡
- `POST /api/judge` — 结算结局（三层架构）
- `GET  /api/state/:sessionId` — 会话快照（调试）
- `POST /api/reset` — 重置

### 3. 前后端联调
让 `runner.html` 走后端（详见下方"接入后端"）：
```js
const api = new APIClient({ base: "http://localhost:3000" });
api.submitChoice(cardId, side, reactionMs, timedOut, localFallback)
   .then(({ source, response }) => { /* source: 'server' | 'local' */ });
```
后端不可达时自动降级本地，**开发/演示零停机**。

### 4. 运行测试
```bash
npm test           # 等价于 node test_all.js，跑全部 4 个套件
```
也可单独跑：`npm run test:engine` / `test:runner` / `test:api` / `test:client`

### 5. 生成 Word 脚本合集
```bash
npm run gen:doc    # 产出 七宗罪VS七美德_互动脚本合集.docx
```
每张卡按七章模板：基础信息 / 表现规格 / 分镜脚本 / 数据判定 / 音频震动 / 文案清单 / 验收点。

### 6. 改卡
**只改 `gen_cards.js`**（用 `card()` + `makeOptions()` 工厂，结构统一），再：
```bash
npm run gen:cards  # 产出干净的 cards_data.js 并自检结构完整性
```

## 设计要点

### 权重口径：0-100 级
原始 0-10 级值 ×6，方向不变（如 +14 → +84）。四轴初始 50，安全区 25-75，越界触发过载/亏空并由 clamp 锁定 [0,100]。

### 变量分两类
- **四轴资源**（`ambition/possession/impulse/devotion`）：0-100，可叠加，clamp 保护
- **事件计数器**（`blood/secrets/betrayed/flags/devotionCounter`）：整数，不缩放

### 结局判定（三层，优先级从高到低）
1. **覆盖结局**（第一层）：`puppet`(卡10-L) / `illusion`(卡12-R) / `saint`(卡10-R + devotion≥60)
2. **主结局**（第二层）：疯王 / 孤王的加冕 / 活下来的懦夫 / 殉道者 / 伪善者 / 弃义者
3. **默认**：幸存者

判定逻辑见 `server.js` 的 `judge()` 与 `test_runner.js`（路线验证）。

### 一致性校验配对
- 卡 05（本能：牺牲/占有）↔ 卡 09（认知理想：牺牲/自保）
- 卡 03（冲动）↔ 卡 06（冲动/克制）

## 测试覆盖（全部通过 ✅）

| 套件 | 验证内容 |
|---|---|
| `test_engine.js` | init/render/choose、effects 应用、clamp [0,100]、blood 不缩放、埋点 |
| `test_runner.js` | 全 R → 幻觉、全 L → 傀儡、圣徒路线、殉道者路线、孤王可达 |
| `test_api.js` | 6 端点 + 后端权威计算（possession clamp 100、blood 6） |
| `test_api_client.js` | 在线走后端 / 离线降级本地 / sessionId |

## 已知限制（原型期）
- 会话存储为内存 Map，重启丢失 → 正式版换 Redis
- effects 后端权威已就绪，但 `runner.html` 默认走离线本地（接入后端需加 2-3 行配置，见上）
- 无真实音频资源，仅标注 BGM/SFX/vibration 规格
- 结局文本为设计稿，可配合 Word 脚本合集迭代
