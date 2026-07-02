#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "posts");
const COVERS = {
  web: "/static/posts/chat-web-basics-cover.svg",
  memory: "/static/posts/chat-memory-cover.svg",
  mobile: "/static/posts/chat-mobile-cover.svg",
  scenario: "/static/posts/chat-scenario-cover.svg",
  export: "/static/posts/chat-export-cover.svg",
};
const GENERIC = "/static/posts/chat-generic-cover.svg";

function splitFm(raw) {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  return { fm: raw.slice(0, end + 4), body: raw.slice(end + 4) };
}

function pickCover(text) {
  if (/手机|移动|app|语音|弱网|微信内置/.test(text)) return COVERS.mobile;
  if (/多轮|上下文|新开|续聊|窗口/.test(text)) return COVERS.memory;
  if (/导出|分享|隐私|脱敏|备份|cookie/.test(text)) return COVERS.export;
  if (/模板|场景|prompt|会议|面试|读书笔记/.test(text)) return COVERS.scenario;
  if (/网页|首条|入门|chat\.deepseek|对话/.test(text)) return COVERS.web;
  return GENERIC;
}

let n = 0;
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const full = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(full, "utf-8");
  const parts = splitFm(raw);
  if (!parts) continue;
  if (/coverImage:/.test(parts.fm)) continue;
  const cover = pickCover(parts.fm + parts.body);
  const lines = parts.fm.split("\n");
  const insertAt = lines.findIndex((l) => l.startsWith("permalink:")) + 1 || lines.length - 1;
  lines.splice(insertAt, 0, `coverImage: "${cover}"`);
  fs.writeFileSync(full, lines.join("\n") + parts.body, "utf-8");
  n++;
  console.log("cover", file, cover);
}
console.log(`Added coverImage to ${n} posts.`);
