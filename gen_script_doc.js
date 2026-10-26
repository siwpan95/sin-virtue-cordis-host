/* ============================================================
 * gen_script_doc.js · 互动脚本合集文档生成器（七章模板 × 12 张卡）
 * 产出：七宗罪VS七美德_互动脚本合集.docx
 *
 * 七章模板（每张卡）：
 *   一、基础信息  二、表现规格  三、分镜脚本(Shot List)
 *   四、数据判定  五、音频震动  六、文案清单  七、验收点
 *
 * 依赖：docx (npm i docx)。若不可用则回退为 markdown 文本。
 * ============================================================ */
const fs = require("fs");
let docx;
try { docx = require("docx"); } catch (e) { docx = null; }

const CARDS = require("./cards_data.js");

// ---------- 把一张卡渲染为"七章结构"的块 ----------
function cardToSections(card) {
  const blocks = [];
  const P = (text) => blocks.push({ type: "paragraph", text });
  const H = (text) => blocks.push({ type: "heading", text });

  // 一、基础信息
  H("一、基础信息");
  P(`卡号：${card.cardId}　|　章节：${card.chapter}　|　视角：${card.perspective}`);
  P(`类型：${card.type === "qte" ? "QTE（限时 " + (card.qteMs / 1000) + " 秒）" : "剧情选择"}`);
  P(`标签：${card.typeLabel || "—"}`);
  P(`场景：${card.scene}`);

  // 二、表现规格
  H("二、表现规格");
  P(`手势：左右滑动 / 点击两侧选项 = 选择${card.type === "qte" ? "；QTE 限时内必须做出选择" : ""}`);
  if (card.type === "qte") {
    P(`倒计时：${card.qteMs}ms。超时默认记 R（设计意图：犹豫本身成为一种选择）。`);
  }
  P(`无障碍：选项可键盘 Tab 聚焦、Enter/Space 确认；后果动画尊重 prefers-reduced-motion。`);
  P(`后果动画：选择后立即播放分支专属动画（详见第三章），禁用"数字跳动"式反馈。`);

  // 三、分镜脚本
  H("三、分镜脚本（Shot List）");
  (card.shots || []).forEach((s, i) => {
    P(`　${s.shot}　时长自适配　[画面] ${s.text}`);
  });
  P(`　[选择] 出现 L / R 两个选项，伴随各自的 consequence 预览（可选：hover 时轻声）。`);
  P(`　[后果] 选择后播放对应分支动画，详见第四章 effects 映射。`);

  // 四、数据判定
  H("四、数据判定");
  ["L", "R"].forEach((side) => {
    const b = card.options[side];
    P(`${side === "L" ? "左" : "右"}滑 —— ${b.text}`);
    P(`　即时后果：${b.consequence}`);
    P(`　Effects：${JSON.stringify(b.effects)}`);
  });
  if (card.consistency) {
    P(`　一致性校验：${card.consistency.pairWith || ""}　${card.consistency.axis || ""}　${card.consistency.note || ""}`);
  }
  P(`　变量写入说明：axis 类（ambition/possession/impulse/devotion）取值 [0,100]，由后端 clamp；var 类（blood/secrets/betrayed/flags）为事件计数器，整数不缩放。`);

  // 五、音频震动
  H("五、音频震动规格");
  const a = card.audio || {};
  P(`BGM：${a.BGM || "—"}`);
  P(`SFX：${a.SFX || "—"}`);
  P(`震动：${a.vibration || "无"}（移动端仅在 QTE 关键帧触发，避免滥用）`);

  // 六、文案清单
  H("六、文案清单");
  P(`场景主文案：${card.scene}`);
  P(`L 选项：${card.options.L.text}`);
  P(`R 选项：${card.options.R.text}`);
  P(`L 后果：${card.options.L.consequence}`);
  P(`R 后果：${card.options.R.consequence}`);

  // 七、验收点
  H("七、验收点（DoD）");
  (card.checklist || []).forEach((item) => P(`　☐ ${item}`));
  P(""); // 分隔
  return blocks;
}

// ---------- 输出 ----------
function buildDoc() {
  const children = [];
  children.push({ type: "title", text: "七宗罪 VS 七美德 · 互动叙事测试" });
  children.push({ type: "subtitle", text: "12 张事件卡互动脚本合集（七章模板）" });
  children.push({ type: "paragraph", text: "设计原则：趣味性优先。测试维度退到后台，每张卡都是一个不可逆的戏剧瞬间。权重口径 0–100 级（原始 0–10 级 ×6，方向不变），与《前端开发需求规格》2.1 节对齐。" });
  children.push({ type: "paragraph", text: "" });

  CARDS.forEach((card, idx) => {
    children.push({ type: "cardHeading", text: `◆ 卡 ${card.cardId}　${card.chapter} · ${card.perspective}　${card.typeLabel ? "（" + card.typeLabel + "）" : ""}` });
    cardToSections(card).forEach((b) => children.push(b));
  });

  return children;
}

// ---------- 渲染为 docx 或 markdown ----------
function renderDocx(structure) {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
  } = docx;
  const children = [];
  const FONT = { name: "Microsoft YaHei", size: 22 }; // 11pt

  structure.forEach((b) => {
    if (b.type === "title") {
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
        children: [new TextRun({ text: b.text, bold: true, size: 40, font: "Microsoft YaHei", color: "8B0000" })] }));
    } else if (b.type === "subtitle") {
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 },
        children: [new TextRun({ text: b.text, size: 24, color: "888888" })] }));
    } else if (b.type === "cardHeading") {
      children.push(new Paragraph({ spacing: { before: 300, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C9A24B" } },
        children: [new TextRun({ text: b.text, bold: true, size: 28, color: "C9A24B" })] }));
    } else if (b.type === "heading") {
      children.push(new Paragraph({ spacing: { before: 160, after: 60 },
        children: [new TextRun({ text: b.text, bold: true, size: 24, color: "333333" })] }));
    } else {
      children.push(new Paragraph({ spacing: { after: 60 }, ...FONT,
        children: [new TextRun({ text: b.text, ...FONT })] }));
    }
  });

  const doc = new Document({ styles: { default: { document: { run: FONT } } }, sections: [{ children }] });
  return Packer.toBuffer(doc).then((buf) => fs.writeFileSync("七宗罪VS七美德_互动脚本合集.docx", buf));
}

function renderMarkdown(structure) {
  const lines = [];
  structure.forEach((b) => {
    if (b.type === "title") lines.push(`# ${b.text}\n`);
    else if (b.type === "subtitle") lines.push(`*${b.text}*\n`);
    else if (b.type === "cardHeading") lines.push(`\n## ${b.text}\n`);
    else if (b.type === "heading") lines.push(`### ${b.text}\n`);
    else lines.push(b.text + "\n");
  });
  fs.writeFileSync("七宗罪VS七美德_互动脚本合集.md", lines.join("\n"));
}

const structure = buildDoc();
if (docx) {
  renderDocx(structure).then(() => console.log("✓ 生成 docx 成功"));
} else {
  renderMarkdown(structure);
  console.log("⚠ docx 未安装，已生成 markdown 回退版本");
}
