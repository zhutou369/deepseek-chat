#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "posts");
const DRY_RUN = process.argv.includes("--dry-run");

const PILLARS = [
  {
    path: "/posts/deepseek-chat-web-basics/",
    label: "网页对话入门",
    keywords: ["首条", "入门", "网页", "第一次", "模型", "chat.deepseek"],
  },
  {
    path: "/posts/deepseek-multi-turn-memory/",
    label: "多轮上下文管理",
    keywords: ["多轮", "上下文", "新开", "续聊", "窗口", "记忆"],
  },
  {
    path: "/posts/deepseek-mobile-app-chat/",
    label: "手机端对话技巧",
    keywords: ["手机", "移动", "app", "弱网", "语音", "浏览器"],
  },
  {
    path: "/posts/deepseek-chat-scenario-library/",
    label: "场景模板库",
    keywords: ["模板", "prompt", "场景", "会议纪要", "面试", "读书笔记"],
  },
  {
    path: "/posts/deepseek-chat-export-share/",
    label: "导出与隐私",
    keywords: ["导出", "分享", "隐私", "脱敏", "备份", "cookie"],
  },
];

const SECTION = "## 延伸阅读";

function splitFm(raw) {
  if (!raw.startsWith("---")) return { fm: "", body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: raw };
  return { fm: raw.slice(0, end + 4), body: raw.slice(end + 4).replace(/^\s+/, "") };
}

function score(text) {
  const lower = text.toLowerCase();
  return PILLARS.map((p) => {
    let s = 0;
    for (const kw of p.keywords) {
      if (lower.includes(kw.toLowerCase())) s += 2;
    }
    return { p, s };
  }).sort((a, b) => b.s - a.s);
}

function hasSection(body) {
  return body.includes(SECTION) || body.includes("## 相关教程");
}

function isPillar(fm) {
  return /translationKey:/.test(fm) && /featured:\s*true/.test(fm);
}

function pickPillars(fm, body) {
  const text = `${fm}\n${body}`;
  const ranked = score(text);
  const own = fm.match(/permalink:\s*"[^"]*\/posts\/([^/]+)\//);
  const ownSlug = own ? own[1] : "";
  const picked = [];
  for (const { p, s } of ranked) {
    if (p.path.includes(ownSlug)) continue;
    if (s > 0 || picked.length < 2) picked.push(p);
    if (picked.length >= 3) break;
  }
  while (picked.length < 2) {
    const next = PILLARS.find((p) => !picked.includes(p) && !p.path.includes(ownSlug));
    if (!next) break;
    picked.push(next);
  }
  return picked.slice(0, 3);
}

function buildSection(pillars) {
  const lines = pillars.map((p) => `- [${p.label}](${p.path})`);
  return `${SECTION}\n\n${lines.join("\n")}\n`;
}

let changed = 0;
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".md") || file.includes("/")) continue;
  const full = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(full, "utf-8");
  const { fm, body } = splitFm(raw);
  if (!fm || hasSection(body) || isPillar(fm)) continue;
  const pillars = pickPillars(fm, body);
  const next = `${fm}\n${body.trimEnd()}\n\n${buildSection(pillars)}`;
  if (!DRY_RUN) fs.writeFileSync(full, next, "utf-8");
  changed++;
  console.log(DRY_RUN ? "[dry]" : "ok", file);
}

for (const loc of ["en", "zh-Hant", "ms", "ja"]) {
  const dir = path.join(POSTS_DIR, loc);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { fm, body } = splitFm(raw);
    if (!fm || hasSection(body)) continue;
    const pillars = pickPillars(fm, body);
    const locPath = loc === "zh-Hant" ? "/zh-Hant" : `/${loc}`;
    const section = `${SECTION}\n\n${pillars
      .map((p) => `- [${p.label}](${locPath}${p.path.replace("/posts/", "/posts/")})`)
      .join("\n")}\n`;
    const next = `${fm}\n${body.trimEnd()}\n\n${section}`;
    if (!DRY_RUN) fs.writeFileSync(full, next, "utf-8");
    changed++;
  }
}

console.log(`Done. ${changed} files ${DRY_RUN ? "would change" : "updated"}.`);
