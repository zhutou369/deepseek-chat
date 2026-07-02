#!/usr/bin/env node
/** One-time path migration: bust CDN cache for post cover SVGs. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MAP = {
  "/static/posts/covers/web-chat.svg": "/static/posts/covers/web-chat.svg",
  "/static/posts/covers/multi-turn.svg": "/static/posts/covers/multi-turn.svg",
  "/static/posts/covers/mobile-chat.svg": "/static/posts/covers/mobile-chat.svg",
  "/static/posts/covers/scenario-lib.svg": "/static/posts/covers/scenario-lib.svg",
  "/static/posts/covers/export-privacy.svg": "/static/posts/covers/export-privacy.svg",
  "/static/posts/covers/generic.svg": "/static/posts/covers/generic.svg",
  "/static/posts/covers/step-guide.svg": "/static/posts/covers/step-guide.svg",
};

const GLOBS = ["posts", "tools", "scripts", "CONTENT-LINK-RULES.md", "autobot.js", "images.txt"];

function walkReplace(file) {
  let c = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [oldP, newP] of Object.entries(MAP)) {
    const before = c;
    c = c.split(oldP).join(newP);
    if (c !== before) n++;
  }
  if (n) {
    fs.writeFileSync(file, c, "utf8");
    console.log("updated", path.relative(ROOT, file), `(${n} paths)`);
  }
}

function walkDir(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkDir(p);
    else if (/\.(md|js|txt|njk)$/.test(ent.name)) walkReplace(p);
  }
}

for (const item of GLOBS) {
  const p = path.join(ROOT, item);
  if (!fs.existsSync(p)) continue;
  if (fs.statSync(p).isDirectory()) walkDir(p);
  else walkReplace(p);
}

console.log("Path migration done.");
