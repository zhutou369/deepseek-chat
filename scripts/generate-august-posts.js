#!/usr/bin/env node
/**
 * 生成 2026 年 8 月 10 篇对话向教程（见 CONTENT-CALENDAR-2026-08.md）
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "posts");
const STEP = "/static/posts/covers/step-guide.svg";
const COVERS = {
  web: "/static/posts/covers/web-chat.svg",
  memory: "/static/posts/covers/multi-turn.svg",
  mobile: "/static/posts/covers/mobile-chat.svg",
  scenario: "/static/posts/covers/scenario-lib.svg",
  export: "/static/posts/covers/export-privacy.svg",
  generic: "/static/posts/covers/generic.svg",
};

const LINKS = {
  web: "[网页对话入门](/posts/deepseek-chat-web-basics/)",
  memory: "[多轮上下文管理](/posts/deepseek-multi-turn-memory/)",
  mobile: "[手机端对话技巧](/posts/deepseek-mobile-app-chat/)",
  scenario: "[场景模板库](/posts/deepseek-chat-scenario-library/)",
  export: "[导出与隐私](/posts/deepseek-chat-export-share/)",
  videoWeb: "[网页对话视频教程](/posts/deepseek-chat-video-web-tutorial/)",
  videoMobile: "[手机端视频教程](/posts/deepseek-chat-video-mobile-tutorial/)",
};

function fm({ title, description, date, slug, cover }) {
  return [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
    `date: ${date}`,
    `tags: ["对话教程"]`,
    `layout: "post.njk"`,
    `permalink: "/posts/${slug}/index.html"`,
    `coverImage: "${cover}"`,
    "---",
    "",
  ].join("\n");
}

function block(lines) {
  return lines.join("\n\n") + "\n";
}

function faq(items) {
  return (
    "## 常见问题\n\n" +
    items.map(([q, a]) => `**问：${q}**\n\n答：${a}`).join("\n\n") +
    "\n"
  );
}

function related(...keys) {
  return `\n## 延伸阅读\n\n${keys.map((k) => `- ${LINKS[k]}`).join("\n")}\n`;
}

const articles = [
  {
    date: "2026-08-01",
    slug: "2026-08-01-deepseek-copy-markdown-format-fix",
    title: "DeepSeek 对话复制到 Word/飞书格式乱码怎么办",
    description: "从 DeepSeek 复制 Markdown、表格或代码到 Word/飞书时格式错乱，用「先 Markdown 后粘贴」和分段复制两步搞定。",
    cover: COVERS.scenario,
    body: [
      "> **30 秒结论**：先让 DeepSeek 输出「纯文本表格」或「无代码块 Markdown」，再粘贴到目标工具；复杂排版用中间备忘录中转。\n",
      block([
        "## 操作步骤",
        "1. 在对话里加约束：`请用 Markdown 表格输出，不要代码块围栏`",
        "2. 复制前点「复制为 Markdown」（若有）或全选后粘贴到 Typora / 备忘录",
        "3. 从备忘录再粘贴到 Word/飞书，选择「保留源格式」或「合并格式」",
        "4. 代码片段单独复制，在 Word 里用「等宽字体」段落样式",
        `\n![复制格式处理示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "把下面内容整理成 Markdown 表格，列：事项/负责人/截止日期。",
        "不要 ``` 代码块，不要 HTML，总共不超过 15 行：",
        "[粘贴模型上一段回答]",
        "```",
      ]),
      faq([
        ["表格变成一行纯文本？", "让模型重出「用 | 分隔的 Markdown 表格」，或粘贴到支持 Markdown 的编辑器再导出。"],
        ["代码缩进丢了？", "要求「每行前缀保留 4 个空格」，或导出为 .md 文件再打开。"],
      ]),
      related("scenario", "web"),
    ],
  },
  {
    date: "2026-08-04",
    slug: "2026-08-04-deepseek-web-login-spinner-fix",
    title: "DeepSeek 网页对话登录不上或一直转圈怎么排查",
    description: "chat.deepseek.com 登录转圈、验证码失败或微信内打不开时，按浏览器、网络、账号三步排查。",
    cover: COVERS.web,
    body: [
      "> **30 秒结论**：优先用系统浏览器（Chrome/Safari）打开官方入口；微信内打不开就「在浏览器打开」；仍失败则清站点 Cookie 后重登。\n",
      block([
        "## 操作步骤",
        "1. 确认地址为 `chat.deepseek.com`（勿用来路不明短链）",
        "2. 微信内：右上角 → 在浏览器打开",
        "3. 转圈超过 30 秒：换网络（关 VPN 或换 4G/5G 试一次）",
        "4. 设置 → 隐私 → 删除 `chat.deepseek.com` Cookie 后重新登录",
        "5. 手机端详见 " + LINKS.mobile + "；入门见 " + LINKS.web,
        `\n![登录排查示意](${STEP})`,
      ]),
      faq([
        ["验证码收不到？", "检查短信拦截、换手机号或稍后重试；勿频繁点击发送。"],
        ["登录成功但对话空白？", "清缓存或无痕窗口重试，见 " + LINKS.mobile + " 常见问题表。"],
      ]),
      related("web", "mobile"),
    ],
  },
  {
    date: "2026-08-07",
    slug: "2026-08-07-deepseek-stop-generation-continue",
    title: "DeepSeek 对话生成到一半停了怎么续写",
    description: "回答中断、手动停止或弱网截断时，用「从第 N 点继续」指令续写，避免全文重写。",
    cover: COVERS.memory,
    body: [
      "> **30 秒结论**：不要重新提问；发送「请从上一段第 3 点继续，不要重复前文，接着写下半部分」。长文先让模型输出摘要再新开对话续写。\n",
      block([
        "## 操作步骤",
        "1. 确认网络稳定后，发续写指令（见下方 Prompt）",
        "2. 若模型重复前文，加：`只输出新增内容，从「## 第二部分」开始`",
        "3. 多次失败：让模型先列「已完成要点 1–5」，新开对话粘贴摘要继续",
        "4. 长任务拆分见 " + LINKS.memory,
        `\n![中断续写示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "你上一段回答在第 3 条表格处中断了。",
        "请从第 3 条继续写完，不要重复第 1–2 条，保持同一表格格式。",
        "```",
      ]),
      faq([
        ["点停止后还能接吗？", "可以，说明停在哪一句，要求从该句后半继续。"],
        ["续写风格和前面不一致？", "加一句：`语气、人称与上文保持一致`。"],
      ]),
      related("memory", "web"),
    ],
  },
  {
    date: "2026-08-10",
    slug: "2026-08-10-deepseek-image-chat-prompt-tips",
    title: "DeepSeek 上传图片对话识图提问技巧",
    description: "在网页对话上传截图或照片时，写好「看图任务 + 输出格式」才能得到可执行的识图结果。",
    cover: COVERS.web,
    body: [
      "> **30 秒结论**：一张图一个任务；说明要让模型「读什么」（文字/图表/界面按钮）和「输出什么」（列表/表格/步骤）。\n",
      block([
        "## 操作步骤",
        "1. 上传前裁剪无关区域，保证文字清晰",
        "2. 首条消息写清：图片类型 + 任务 + 格式",
        "3. 涉及数字或日期：要求「不确定处标注待核实」",
        "4. 多图对比：分两次上传，或说明「图 1 vs 图 2 差异」",
        `\n![识图提问示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "这是一张产品设置页截图。请列出：",
        "1. 可见的开关名称及开/关状态",
        "2. 底部灰色小字里的版本号",
        "用表格输出，看不清的写「无法辨认」。",
        "```",
      ]),
      faq([
        ["截图模糊怎么办？", "放大后重截，或只截关键区域；勿一次传超长全屏。"],
        ["能一次传多张吗？", "视入口而定；不稳时一张一任务更可靠。"],
      ]),
      related("web", "scenario"),
    ],
  },
  {
    date: "2026-08-13",
    slug: "2026-08-13-deepseek-ai-asks-first-prompt",
    title: "DeepSeek 反向 Prompt：让 AI 先提问再回答",
    description: "复杂任务先让 DeepSeek 列出澄清问题，你再逐条回答，可减少首轮跑偏和废话。",
    cover: COVERS.scenario,
    body: [
      "> **30 秒结论**：适合需求模糊的任务；首条写「先问我 5 个澄清问题，等我答完再给方案」。\n",
      block([
        "## 适用场景",
        "- 写方案/报告但自己还没想清楚范围",
        "- 活动策划、选题、用户画像等开放式任务",
        "- 不适合：已有完整材料、只要翻译/改写的简单活",
        "## 操作步骤",
        "1. 发反向 Prompt（见下方）",
        "2. 逐条简短回答模型的问题",
        "3. 最后一轮：`根据以上回答，输出最终方案，用 Markdown 大纲`",
        `\n![反向提问示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "我要做一场 30 人的内部分享，主题与 DeepSeek 网页对话技巧相关。",
        "请先问我 5 个澄清问题（受众/时长/场地/是否演示/禁忌），",
        "不要先给方案。等我回答后你再出大纲。",
        "```",
      ]),
      faq([
        ["要问多少轮？", "一般 1 轮澄清 + 1 轮交付；超过 3 轮建议新开对话并贴摘要。"],
        ["问题太泛怎么办？", "回复：`请把第 2 题改成二选一的具体选项`。"],
      ]),
      related("scenario", "memory"),
    ],
  },
  {
    date: "2026-08-16",
    slug: "2026-08-16-deepseek-multi-version-copy-one-shot",
    title: "DeepSeek 同一文案要多个版本怎么一轮出稿",
    description: "标题、朋友圈、邮件等同主题多版本，用表格约束风格差异，一轮拿到 A/B/C 稿。",
    cover: COVERS.scenario,
    body: [
      "> **30 秒结论**：在一条消息里规定版本数、每版字数、风格标签（干货/轻松/正式），用表格列出版本名与正文。\n",
      block([
        "## 操作步骤",
        "1. 粘贴原始文案或要点",
        "2. 指定 3–5 个版本及风格差异",
        "3. 要求「版本名 | 正文 | 字数」表格",
        "4. 选定版本后：`只保留版本 B，扩写到 200 字`",
        `\n![多版本文案示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "根据下面卖点，写 3 个标题版本：",
        "- A 干货数字风，≤18 字",
        "- B 疑问句，≤20 字",
        "- C 口语化，≤16 字",
        "用表格输出：版本 | 标题 | 字数",
        "[粘贴卖点]",
        "```",
      ]),
      faq([
        ["版本太像怎么办？", "加：`三版开头用词不得重复`。"],
        ["能同时要中英两版吗？", "可以，表格加「语言」列分别约束。"],
      ]),
      related("scenario", "web"),
    ],
  },
  {
    date: "2026-08-19",
    slug: "2026-08-19-deepseek-url-summary-in-chat",
    title: "DeepSeek 对话里贴链接让 AI 总结网页要点",
    description: "在对话中提供 URL 或粘贴正文时，如何写好总结任务才能得到可核实的要点列表。",
    cover: COVERS.web,
    body: [
      "> **30 秒结论**：链接无法访问时改粘贴正文；总结任务要写清条数、是否引用原句、不确定如何处理。\n",
      block([
        "## 操作步骤",
        "1. 优先粘贴关键段落（比裸链更稳）",
        "2. 若只给 URL：说明「若无法访问请直说，不要编造」",
        "3. 要求输出：`3 条要点 + 1 条待核实` 格式",
        "4. 长文分段总结，见 " + LINKS.memory,
        `\n![链接总结示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "以下是文章链接：[URL]",
        "若你能访问：用 5 条 bullet 总结，每条 ≤30 字，并注明是否含推测。",
        "若不能访问：请告诉我，我会粘贴正文。",
        "```",
      ]),
      faq([
        ["模型编造链接内容？", "必须加「无法访问则明确说明」；重要决策以原文为准。"],
        ["和 PDF 上传总结区别？", "PDF 见 [4 月教程](/posts/2026-04-14-deepseek-pdf-upload-summary/)；链接适合短网页。"],
      ]),
      related("web", "scenario"),
    ],
  },
  {
    date: "2026-08-22",
    slug: "2026-08-22-deepseek-mobile-night-reading-tips",
    title: "DeepSeek 夜间用手机对话：护眼与字号设置",
    description: "晚上用手机看 DeepSeek 长回答时，结合系统深色模式、字体放大与分段阅读减轻疲劳。",
    cover: COVERS.mobile,
    body: [
      "> **30 秒结论**：开系统深色模式 + 浏览器「添加到主屏幕」；让模型「分段输出，每段不超过 120 字」；刺眼时调低屏幕亮度而非盯白底长文。\n",
      block([
        "## 操作步骤",
        "1. iOS/Android 开启系统深色模式",
        "2. Safari/Chrome 将 `chat.deepseek.com` 添加到主屏幕",
        "3. 系统设置 → 显示 → 调大字体（辅助功能）",
        "4. 对话里要求：`用短段落，每段 3 行以内`",
        "5. 通勤场景可配合 " + LINKS.videoMobile,
        `\n![夜间阅读示意](${STEP})`,
      ]),
      faq([
        ["网页没有深色按钮？", "依赖系统/浏览器深色；或让模型输出时减少大段亮屏阅读时间。"],
        ["长时间阅读伤眼？", "定时休息；重要内容复制到备忘录白天再改，见 " + LINKS.export + "。"],
      ]),
      related("mobile", "export"),
    ],
  },
  {
    date: "2026-08-25",
    slug: "2026-08-25-deepseek-find-old-chat-history",
    title: "DeepSeek 找不到以前的对话记录怎么办",
    description: "换设备、清缓存或侧边栏找不到旧会话时，用官方历史入口与本地备份习惯降低丢失风险。",
    cover: COVERS.export,
    body: [
      "> **30 秒结论**：对话多在账号云端，但清 Cookie/换浏览器可能导致列表异常；重要对话及时复制导出，见导出教程。\n",
      block([
        "## 操作步骤",
        "1. 确认已登录同一账号（手机号/邮箱）",
        "2. 在侧边栏搜索关键词（若入口提供）",
        "3. 换回原浏览器或关闭无痕模式",
        "4. 仍没有：可能未同步或已被删除——今后按 " + LINKS.export + " 定期备份",
        "5. 勿在公共电脑依赖「自动保存」",
        `\n![历史记录示意](${STEP})`,
      ]),
      faq([
        ["换手机后记录没了？", "先登录同一账号并联网等待同步；无同步则只能依赖既往导出。"],
        ["清缓存会删记录吗？", "一般删的是本地登录态，重登后应恢复；极端情况见官方说明。"],
      ]),
      related("export", "memory"),
    ],
  },
  {
    date: "2026-08-28",
    slug: "2026-08-28-deepseek-tone-formal-casual-switch",
    title: "DeepSeek 对话语气正式/口语一键切换",
    description: "同一段落要在客户邮件与内部群聊间切换语气时，用风格标签 Prompt 快速改写。",
    cover: COVERS.scenario,
    body: [
      "> **30 秒结论**：保留事实不变，只改语气；用「正式书面 / 口语同事 / 客服礼貌」三档标签 + 字数上限。\n",
      block([
        "## 操作步骤",
        "1. 粘贴原文",
        "2. 指定目标语气与禁忌（不用表情、不用「亲」等）",
        "3. 要求「只改语气，不增删事实」",
        "4. 多轮微调：`第 2 句再正式一点`",
        `\n![语气切换示意](${STEP})`,
      ]),
      block([
        "## 可直接复制的 Prompt",
        "```",
        "把下面段落改成「对客户的书面邮件」语气：",
        "- 用您，不用口语",
        "- 不超过 120 字",
        "- 不添加我未提供的事实",
        "[粘贴原文]",
        "```",
      ]),
      faq([
        ["同一段落混用正式和口语？", "要求：`统一为正式语气，并标出原先口语词替换成什么`。"],
        ["对客户 vs 对同事？", "分两次改写，标签写清受众与禁忌词。"],
      ]),
      related("scenario", "memory"),
    ],
  },
];

for (const a of articles) {
  const file = path.join(OUT, `${a.slug}.md`);
  if (fs.existsSync(file)) {
    console.log("skip exists", a.slug);
    continue;
  }
  const content = fm(a) + a.body.join("\n");
  fs.writeFileSync(file, content, "utf-8");
  console.log("wrote", a.slug);
}
console.log("Done.");
