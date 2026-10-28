/* ============================================================
 * docgen/gen_script_doc.js · 互动脚本合集文档生成器（七章模板 × 12 张卡）
 * 产出：docx/七宗罪VS七美德_互动脚本合集.docx
 *
 * 七章模板（每张卡）：
 *   一、基础信息  二、表现规格  三、分镜脚本(Shot List)
 *   四、数据判定  五、音频震动  六、文案清单  七、验收点
 *
 * 数据来源：plugins/cards.js 的 CARDS（counter 模型，规则真相源）。
 * 依赖：docx（见 package.json）。若不可用则回退为 markdown 文本。
 * 合并自 sin-virtue-game/gen_script_doc.js（2026-10-28 改写为 ESM 并适配本仓卡结构）。
 * ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CARDS } from "../plugins/cards.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "docx");

let docx = null;
try {
  docx = await import("docx");
} catch (e) {
  docx = null;
}

// ---------- 把 cordis 卡结构规范化为生成器好读的 shape ----------
function normalize(card) {
  const opt = (b) => ({
    text: Array.isArray(b.text) ? b.text[0] : b.text,
    consequence: Array.isArray(b.text) ? b.text.slice(1).join(" ") : (b.consequence || ""),
    effects: b.effects || [],
  });
  return {
    cardId: card.id,
    chapter: card.chapter,
    perspective: card.perspective,
    type: card.type,
    typeLabel: card.typeLabel,
    scene: card.scene,
    qteMs: card.qteMs,
    shots: card.shots || [],
    audio: card.audio || {},
    checklist: card.checklist || [],
    consistency: card.consistency || null,
    L: opt(card.L),
    R: opt(card.R),
  };
}

// ---------- 把一张卡渲染为"七章结构"的块 ----------
function cardToSections(card) {
  const blocks = [];
  const P = (text) => blocks.push({ type: "paragraph", text });
  const H = (text) => blocks.push({ type: "heading", text });

  H("一、基础信息");
  P(`卡号：${card.cardId}　|　章节：${card.chapter}　|　视角：${card.perspective}`);
  P(`类型：${card.type === "qte" ? "QTE（限时 " + (card.qteMs / 1000) + " 秒）" : "剧情选择"}`);
  P(`标签：${card.typeLabel || "—"}`);
  P(`场景：${card.scene}`);

  H("二、表现规格");
  P(`手势：左右滑动 / 点击两侧选项 = 选择${card.type === "qte" ? "；QTE 限时内必须做出选择" : ""}`);
  if (card.type === "qte") {
    P(`倒计时：${card.qteMs}ms。超时默认记 R（设计意图：犹豫本身成为一种选择）。`);
  }
  P(`无障碍：选项可键盘 Tab 聚焦、Enter/Space 确认；后果动画尊重 prefers-reduced-motion。`);
  P(`后果动画：选择后立即播放分支专属动画（详见第三章），禁用"数字跳动"式反馈。`);

  H("三、分镜脚本（Shot List）");
  card.shots.forEach((s) => P(`　${s.shot}　时长自适配　[画面] ${s.text}`));
  P(`　[选择] 出现 L / R 两个选项，伴随各自的 consequence 预览（可选：hover 时轻声）。`);
  P(`　[后果] 选择后播放对应分支动画，详见第四章 effects 映射。`);

  H("四、数据判定");
  ["L", "R"].forEach((side) => {
    const b = card[side];
    P(`${side === "L" ? "左" : "右"}滑 —— ${b.text}`);
    P(`　即时后果：${b.consequence}`);
    P(`　Effects：${JSON.stringify(b.effects)}`);
  });
  if (card.consistency) {
    P(`　一致性校验：${card.consistency.pairWith || ""}　${card.consistency.axis || ""}　${card.consistency.note || ""}`);
  }
  P(`　变量写入说明：counter 类（COLD/SACR/CHAOS/PRIDE）为 0+ 整数累加，可超上限；blood/secrets/betrayed 为事件计数器；chapters/flags 为叙事标记（flags 仅 flavor，不参与判定）。`);

  H("五、音频震动规格");
  const a = card.audio;
  P(`BGM：${a.BGM || "—"}`);
  P(`SFX：${a.SFX || "—"}`);
  P(`震动：${a.vibration || "无"}（移动端仅在 QTE 关键帧触发，避免滥用）`);

  H("六、文案清单");
  P(`场景主文案：${card.scene}`);
  P(`L 选项：${card.L.text}`);
  P(`R 选项：${card.R.text}`);
  P(`L 后果：${card.L.consequence}`);
  P(`R 后果：${card.R.consequence}`);

  H("七、验收点（DoD）");
  card.checklist.forEach((item) => P(`　☐ ${item}`));
  P("");
  return blocks;
}

function buildDoc() {
  const children = [];
  children.push({ type: "title", text: "七宗罪 VS 七美德 · 互动叙事测试" });
  children.push({ type: "subtitle", text: "12 张事件卡互动脚本合集（七章模板）" });
  children.push({ type: "paragraph", text: "设计原则：趣味性优先。测试维度退到后台，每张卡都是一个不可逆的戏剧瞬间。规则采用 counter 模型（COLD/SACR/CHAOS/PRIDE，0+ 整数），与《原始讨论记录》及本仓 plugins/endings.js 对齐。" });
  children.push({ type: "paragraph", text: "" });

  CARDS.map(normalize).forEach((card) => {
    children.push({ type: "cardHeading", text: `◆ 卡 ${card.cardId}　${card.chapter} · ${card.perspective}　${card.typeLabel ? "（" + card.typeLabel + "）" : ""}` });
    cardToSections(card).forEach((b) => children.push(b));
  });
  return children;
}

async function renderDocx(structure) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = docx;
  const children = [];
  const FONT = { name: "Microsoft YaHei", size: 22 };

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
  const buf = await Packer.toBuffer(doc);
  const out = path.join(OUT_DIR, "七宗罪VS七美德_互动脚本合集.docx");
  fs.writeFileSync(out, buf);
  console.log("✓ 生成 docx 成功：", out);
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
  const out = path.join(OUT_DIR, "七宗罪VS七美德_互动脚本合集.md");
  fs.writeFileSync(out, lines.join("\n"));
  console.log("⚠ docx 未安装，已生成 markdown 回退版本：", out);
}

const structure = buildDoc();
if (docx) {
  await renderDocx(structure);
} else {
  renderMarkdown(structure);
}
