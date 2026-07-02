#!/usr/bin/env node
/** Rewrite post cover/step SVGs as valid UTF-8 (fixes corrupted files on Windows). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "static", "posts");

const files = {
  "chat-web-basics-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek web chat basics">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e3a5f"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="100" fill="#93c5fd" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">WEB CHAT</text>
  <text x="80" y="145" fill="#f8fafc" font-family="Segoe UI,sans-serif" font-size="28" font-weight="700">Web Chat Basics</text>
  <text x="80" y="180" fill="#94a3b8" font-family="Segoe UI,sans-serif" font-size="16">First message / model / format</text>
  <rect x="220" y="220" width="360" height="180" rx="14" fill="#ffffff" fill-opacity="0.95"/>
  <rect x="220" y="220" width="360" height="44" rx="14" fill="#e2e8f0"/>
  <text x="310" y="250" fill="#334155" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">chat.deepseek.com</text>
  <rect x="250" y="290" width="300" height="36" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>
  <text x="265" y="314" fill="#64748b" font-family="Segoe UI,sans-serif" font-size="14">Type your first message...</text>
  <rect x="250" y="340" width="300" height="40" rx="8" fill="#2563eb"/>
  <text x="380" y="366" fill="#ffffff" font-family="Segoe UI,sans-serif" font-size="15" font-weight="600">Send</text>
</svg>
`,
  "chat-memory-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek multi-turn context">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="100" fill="#c4b5fd" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">MULTI-TURN</text>
  <text x="80" y="145" fill="#f8fafc" font-family="Segoe UI,sans-serif" font-size="28" font-weight="700">Context Memory</text>
  <text x="80" y="180" fill="#a5b4fc" font-family="Segoe UI,sans-serif" font-size="16">New chat / continue / length</text>
  <rect x="180" y="210" width="440" height="200" rx="12" fill="#ffffff" fill-opacity="0.95"/>
  <rect x="200" y="230" width="120" height="28" rx="6" fill="#dbeafe"/><text x="215" y="249" fill="#1d4ed8" font-size="13" font-family="Segoe UI,sans-serif">Turn 1</text>
  <rect x="200" y="270" width="380" height="28" rx="6" fill="#f1f5f9"/><text x="215" y="289" fill="#64748b" font-size="13" font-family="Segoe UI,sans-serif">Summarize the material below...</text>
  <rect x="200" y="310" width="120" height="28" rx="6" fill="#ede9fe"/><text x="215" y="329" fill="#6d28d9" font-size="13" font-family="Segoe UI,sans-serif">Turn 2</text>
  <rect x="200" y="350" width="380" height="28" rx="6" fill="#f1f5f9"/><text x="215" y="369" fill="#64748b" font-size="13" font-family="Segoe UI,sans-serif">Edit paragraph 2 only</text>
</svg>
`,
  "chat-mobile-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek mobile chat">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#134e4a"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="100" fill="#6ee7b7" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">MOBILE</text>
  <text x="80" y="145" fill="#f8fafc" font-family="Segoe UI,sans-serif" font-size="28" font-weight="700">Mobile Chat Tips</text>
  <text x="80" y="180" fill="#99f6e4" font-family="Segoe UI,sans-serif" font-size="16">Browser / voice / weak network</text>
  <rect x="300" y="120" width="200" height="300" rx="24" fill="#0f172a" stroke="#34d399" stroke-width="3"/>
  <rect x="315" y="150" width="170" height="220" rx="8" fill="#f8fafc"/>
  <rect x="325" y="340" width="150" height="32" rx="16" fill="#e2e8f0"/>
  <text x="355" y="361" fill="#64748b" font-size="12" font-family="Segoe UI,sans-serif">Message...</text>
</svg>
`,
  "chat-scenario-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek prompt templates">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#9a3412"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="100" fill="#fdba74" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">TEMPLATES</text>
  <text x="80" y="145" fill="#fff7ed" font-family="Segoe UI,sans-serif" font-size="28" font-weight="700">Scenario Library</text>
  <text x="80" y="180" fill="#fed7aa" font-family="Segoe UI,sans-serif" font-size="16">Meeting / interview / notes</text>
  <rect x="200" y="210" width="400" height="50" rx="8" fill="#ffffff" fill-opacity="0.95"/><text x="220" y="242" fill="#9a3412" font-size="15" font-family="Segoe UI,sans-serif">Meeting minutes</text>
  <rect x="200" y="275" width="400" height="50" rx="8" fill="#ffffff" fill-opacity="0.9"/><text x="220" y="307" fill="#9a3412" font-size="15" font-family="Segoe UI,sans-serif">Python error explain</text>
  <rect x="200" y="340" width="400" height="50" rx="8" fill="#ffffff" fill-opacity="0.85"/><text x="220" y="372" fill="#9a3412" font-size="15" font-family="Segoe UI,sans-serif">Interview mock prompt</text>
</svg>
`,
  "chat-export-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek export and privacy">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1f2937"/><stop offset="100%" stop-color="#374151"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="100" fill="#9ca3af" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">EXPORT</text>
  <text x="80" y="145" fill="#f9fafb" font-family="Segoe UI,sans-serif" font-size="28" font-weight="700">Export and Privacy</text>
  <text x="80" y="180" fill="#d1d5db" font-family="Segoe UI,sans-serif" font-size="16">Redact / share / backup</text>
  <rect x="240" y="220" width="320" height="180" rx="12" fill="#ffffff" fill-opacity="0.95"/>
  <rect x="260" y="245" width="280" height="8" rx="4" fill="#e5e7eb"/><rect x="260" y="265" width="220" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="260" y="300" width="120" height="36" rx="8" fill="#059669"/><text x="285" y="323" fill="#ffffff" font-size="14" font-family="Segoe UI,sans-serif">Export MD</text>
  <rect x="400" y="300" width="120" height="36" rx="8" fill="#dc2626"/><text x="425" y="323" fill="#ffffff" font-size="14" font-family="Segoe UI,sans-serif">Redact</text>
</svg>
`,
  "chat-generic-cover.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="DeepSeek chat guide">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0c4a6e"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="80" y="120" fill="#7dd3fc" font-family="Segoe UI,sans-serif" font-size="16" font-weight="600">DEEPSEEK CHAT</text>
  <text x="80" y="165" fill="#f0f9ff" font-family="Segoe UI,sans-serif" font-size="30" font-weight="700">Chat Tutorial</text>
  <text x="80" y="205" fill="#bae6fd" font-family="Segoe UI,sans-serif" font-size="16">Tips / templates / workflows</text>
  <circle cx="580" cy="280" r="90" fill="#0ea5e9" fill-opacity="0.25"/>
  <rect x="480" y="230" width="200" height="140" rx="16" fill="#ffffff" fill-opacity="0.95"/>
  <rect x="500" y="255" width="160" height="12" rx="6" fill="#e0f2fe"/><rect x="500" y="280" width="120" height="12" rx="6" fill="#e0f2fe"/>
  <rect x="500" y="320" width="160" height="28" rx="8" fill="#0284c7"/><text x="530" y="339" fill="#ffffff" font-size="13" font-family="Segoe UI,sans-serif">Start chat</text>
</svg>
`,
  "chat-generic-step.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="400" viewBox="0 0 720 400" role="img" aria-label="DeepSeek chat steps">
  <rect width="720" height="400" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="32" y="48" fill="#0f172a" font-family="Segoe UI,sans-serif" font-size="18" font-weight="700">Step-by-step</text>
  <circle cx="56" cy="100" r="18" fill="#2563eb"/><text x="50" y="106" fill="#ffffff" font-size="14" font-weight="700" font-family="Segoe UI,sans-serif">1</text>
  <text x="88" y="106" fill="#334155" font-size="15" font-family="Segoe UI,sans-serif">Open chat.deepseek.com and start a new chat</text>
  <circle cx="56" cy="170" r="18" fill="#2563eb"/><text x="50" y="176" fill="#ffffff" font-size="14" font-weight="700" font-family="Segoe UI,sans-serif">2</text>
  <text x="88" y="176" fill="#334155" font-size="15" font-family="Segoe UI,sans-serif">State task, format, and constraints in the first message</text>
  <circle cx="56" cy="240" r="18" fill="#2563eb"/><text x="50" y="246" fill="#ffffff" font-size="14" font-weight="700" font-family="Segoe UI,sans-serif">3</text>
  <text x="88" y="246" fill="#334155" font-size="15" font-family="Segoe UI,sans-serif">Iterate or open a new chat when the topic changes</text>
  <rect x="32" y="290" width="656" height="80" rx="10" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="48" y="320" fill="#64748b" font-size="13" font-family="Segoe UI,sans-serif">Tip: one main task per chat window.</text>
  <text x="48" y="348" fill="#64748b" font-size="13" font-family="Segoe UI,sans-serif">See site guides for web basics and multi-turn memory.</text>
</svg>
`,
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, svg] of Object.entries(files)) {
  const dest = path.join(OUT, name);
  fs.writeFileSync(dest, svg.trim() + "\n", "utf8");
  const buf = fs.readFileSync(dest);
  if (buf.includes(0)) throw new Error(`null byte in ${name}`);
  console.log("ok", name, buf.length);
}
