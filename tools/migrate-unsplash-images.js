const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const IMAGES_TXT = path.join(ROOT, "images.txt");
const OUT_DIR = path.join(ROOT, "static", "images");
const POSTS_DIR = path.join(ROOT, "posts");

function photoId(url) {
  const m = String(url).match(/photo-([a-z0-9-]+)/i);
  return m ? m[1] : null;
}

function localPath(id) {
  return `/static/images/photo-${id}.jpg`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          if (fs.existsSync(dest)) fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

async function ensure(url, map) {
  const id = photoId(url);
  if (!id) return null;
  if (map.has(id)) return map.get(id);
  const lp = localPath(id);
  const dest = path.join(OUT_DIR, `photo-${id}.jpg`);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    process.stdout.write(`dl photo-${id}.jpg ... `);
    try {
      await download(url.trim(), dest);
      console.log("ok");
    } catch (e) {
      console.log("fail", e.message);
      map.set(id, "/static/posts/covers/step-guide.svg");
      return map.get(id);
    }
  }
  map.set(id, lp);
  return lp;
}

function walkMd(dir, fn) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(p, fn);
    else if (ent.name.endsWith(".md")) fn(p);
  }
}

(async () => {
  const map = new Map();
  const urls = new Set();

  if (fs.existsSync(IMAGES_TXT)) {
    fs.readFileSync(IMAGES_TXT, "utf-8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.includes("unsplash"))
      .forEach((u) => urls.add(u));
  }

  walkMd(POSTS_DIR, (file) => {
    const m = fs.readFileSync(file, "utf-8").match(/https:\/\/images\.unsplash\.com[^\s)"']+/g);
    if (m) m.forEach((u) => urls.add(u));
  });

  for (const url of urls) await ensure(url, map);

  let txt = fs.existsSync(IMAGES_TXT) ? fs.readFileSync(IMAGES_TXT, "utf-8") : "";
  for (const [id, lp] of map) {
    txt = txt.replace(new RegExp(`https://images\\.unsplash\\.com/photo-${id}[^\\s]*`, "g"), lp);
  }
  const localOnly = [...new Set([...map.values(), ...txt.split(/\r?\n/).filter((l) => l.startsWith("/static/"))])];
  fs.writeFileSync(IMAGES_TXT, localOnly.join("\n") + "\n", "utf-8");

  walkMd(POSTS_DIR, (file) => {
    let c = fs.readFileSync(file, "utf-8");
    let orig = c;
    for (const [id, lp] of map) {
      c = c.replace(new RegExp(`https://images\\.unsplash\\.com/photo-${id}[^\\s)"']*`, "g"), lp);
    }
    c = c.replace(/\n\*[^*]+\*\s*$/gm, "");
    if (c !== orig) {
      fs.writeFileSync(file, c, "utf-8");
      console.log("updated", path.relative(ROOT, file));
    }
  });

  console.log(`Migrated ${map.size} images.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
