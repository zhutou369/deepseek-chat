#!/usr/bin/env node
/** 将正文中的 unsplash 外链统一替换为本地示意图 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts");
const FALLBACK = "/static/posts/chat-generic-step.svg";
const UNSPLASH_RE = /https:\/\/images\.unsplash\.com[^\s)"']+/g;

function walkMd(dir, fn) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(p, fn);
    else if (ent.name.endsWith(".md")) fn(p);
  }
}

let n = 0;
walkMd(POSTS_DIR, (file) => {
  let c = fs.readFileSync(file, "utf-8");
  if (!UNSPLASH_RE.test(c)) return;
  c = c.replace(UNSPLASH_RE, FALLBACK);
  fs.writeFileSync(file, c, "utf-8");
  n++;
});

let txt = fs.existsSync(path.join(ROOT, "images.txt"))
  ? fs.readFileSync(path.join(ROOT, "images.txt"), "utf-8")
  : "";
txt = txt
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.includes("unsplash.com"))
  .concat([FALLBACK, "/static/posts/chat-generic-cover.svg"])
  .filter((v, i, a) => a.indexOf(v) === i)
  .join("\n");
fs.writeFileSync(path.join(ROOT, "images.txt"), txt + "\n", "utf-8");

console.log(`Replaced unsplash in ${n} posts. images.txt updated.`);
