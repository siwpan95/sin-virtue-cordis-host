# 内容溯源与资料采集（Everything 本地 + 联网检索）

> 对应原始要求：「本地内容查找推荐 Everything；本地无法获得的信息可联网搜索获得」。

## 1. 本地内容检索（Everything 1.5.0.1418b.x64）

通过 `plugins/content-everything.js` 调用 `es.exe`（Everything 命令行），在 `G:\local\12test` 秒级检索到项目既有素材，确认“项目已有素材”而非凭空设计：

| 命中（节选） | 用途 |
|---|---|
| `七宗罪VS七美德_事件卡全表.docx` | 轴权重（0–100）+ 变量写入（SACR/COLD/CHAOS/PRIDE/secrets/betrayed/blood/chapters） |
| `七宗罪VS七美德_互动叙事测试_策划需求文档.docx` | 四轴语义、12 卡大纲、三层结局定义（4.2/4.3） |
| `七宗罪VS七美德_互动脚本合集.docx` | 每张卡的 L/R 即时后果文案 + Effects 元组 |
| `七宗罪VS七美德_前端开发需求规格.docx` | FRS §5.1 三层判定伪代码（本项目引擎的直接依据） |
| `七宗罪VS七美德_互动脚本范例.docx`（卡05） | QTE 8s 分支脚本范例 |
| `sin_virtue_game/`（既有 Node+Express 原型） | 平行参考实现，测试已全绿 |

本地命中 8 条（含上述 docx 与若干资产）。

## 2. 联网检索（补充本地没有的方法论）

- **七宗罪 VS 七美德测试入口（知乎，2026-08）**：描述生成「14 维人格雷达图」、展示“原罪/美德”倾向分与差值的测试形态——印证本项目“七宗罪 VS 七美德”作为人格/情境判断测试（SJT）的选题成立且已有流行形态。
  https://zhuanlan.zhihu.com/p/2068096113320759564
- **Emily Short《故事块（Storylet）空间设计地图》（机核译文）**：故事块/变量驱动的分支架构，支撑本项目“每张卡=独立插件、状态由中心服务持有”的 cordis 实现思路。
  https://www.gcores.com/articles/186429
- **独立游戏叙事设计实战：分支对话与情感节奏**（PlumePHP）：分支对话、环境叙事、重玩价值设计要点，对应本项目“12 卡多结局 + 重玩”目标。
  https://plumephp.com/indie-game-narrative-design-branching-dialogue/
- **Game Narrative Design 指南**（Pixune / GeneralistProgrammer）：叙事与玩法融合、分支变量管理，对应本项目轴/计数器/章节线的变量体系。
  https://pixune.com/blog/game-narrative-developing-a-story-that-works/

> 联网检索结果已接入 `plugins/content-websearch.js` 的 `websearch` 服务（当前为可替换桩：返回 query + stub 标记；接入真实搜索 API 插件即可返回实时结果，宿主主体零改动）。

## 3. 结论

- **本地素材**已通过 Everything 实检索确认，设计依据是项目内既有 5 份 docx，而非外部杜撰。
- **联网资料**用于校验选题与方法论（SJT / 故事块 / 资源轴），不替代本地策划文档的权威性。
- 引擎严格按《前端开发需求规格》§5.1 三层判定实现，并经 4096 条全对局穷举验证（见 `playthrough.js`）。
