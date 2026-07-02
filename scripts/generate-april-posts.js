#!/usr/bin/env node
/**
 * 生成 2026 年 4 月起 20 篇对话向教程 + 2 篇视频教程
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "posts");
const STEP = "/static/posts/chat-generic-step.svg";
const COVERS = {
  web: "/static/posts/chat-web-basics-cover.svg",
  memory: "/static/posts/chat-memory-cover.svg",
  mobile: "/static/posts/chat-mobile-cover.svg",
  scenario: "/static/posts/chat-scenario-cover.svg",
  export: "/static/posts/chat-export-cover.svg",
  generic: "/static/posts/chat-generic-cover.svg",
};

const LINKS = {
  web: "[网页对话入门](/posts/deepseek-chat-web-basics/)",
  memory: "[多轮上下文管理](/posts/deepseek-multi-turn-memory/)",
  mobile: "[手机端对话技巧](/posts/deepseek-mobile-app-chat/)",
  scenario: "[场景模板库](/posts/deepseek-chat-scenario-library/)",
  export: "[导出与隐私](/posts/deepseek-chat-export-share/)",
};

function fm({ title, description, date, slug, cover, featured, generated, videoBvid }) {
  const lines = [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
    `date: ${date}`,
    `tags: ["对话教程"]`,
    `layout: "post.njk"`,
    `permalink: "/posts/${slug}/index.html"`,
    `coverImage: "${cover}"`,
  ];
  if (featured) lines.push("featured: true");
  if (generated) lines.push("generated: true");
  if (videoBvid) lines.push(`videoBvid: "${videoBvid}"`);
  lines.push("---", "");
  return lines.join("\n");
}

function section(title, paras, imgAlt) {
  let s = `## ${title}\n\n${paras.join("\n\n")}\n`;
  if (imgAlt) s += `\n![${imgAlt}](${STEP})\n`;
  return s;
}

function related(...keys) {
  return `\n## 延伸阅读\n\n${keys.map((k) => `- ${LINKS[k]}`).join("\n")}\n`;
}

const articles = [
  {
    date: "2026-04-01",
    slug: "2026-04-01-deepseek-first-message-no-fluff",
    title: "DeepSeek 网页对话首条消息怎么写才不出废话",
    description: "用四要素模板写好首条消息，让 DeepSeek 首轮就给出可执行的短回答，而不是泛泛长文。",
    cover: COVERS.web,
    intro: "打开 `chat.deepseek.com` 后，很多人第一句就问「帮我写一篇文章」。模型只能猜场景，于是输出又长又空。首条消息写清楚，比多聊十轮更有效。",
    body: [
      section(
        "首条消息四要素",
        [
          "把下面四项写进同一条消息：",
          "1. **场景**：你是谁、要做什么（如「电商运营写详情页」）",
          "2. **任务**：具体产出（改写、总结、对比三方案）",
          "3. **格式**：列表、表格、字数上限",
          "4. **约束**：不要编造、不确定写「待核实」",
          "可先阅读 " + LINKS.web + " 里的完整示例。",
        ],
        "DeepSeek 首条消息四要素示意"
      ),
      section(
        "三个可直接复制的开头",
        [
          "```",
          "我是 HR，要把下面 JD 改成对外招聘文案，300 字内，语气专业但不生硬：",
          "[粘贴 JD]",
          "```",
          "```",
          "请把下面用户反馈分成「产品/物流/售后」三类，每类最多 5 条，用表格输出：",
          "[粘贴反馈]",
          "```",
          "只回答「是/否 + 一句理由」，不要展开背景知识：",
          "[你的问题]",
          "```",
        ]
      ),
      section(
        "首轮不满意怎么改",
        [
          "不要重问一遍，用增量指令：",
          "- 「缩短到 150 字」",
          "- 「第 2 点换成更口语的说法」",
          "- 「先给大纲，等我确认再写正文」",
          "若任务完全换了，建议新开对话，见 " + LINKS.memory + "。",
        ]
      ),
    ],
    related: ["web", "memory", "scenario"],
  },
  {
    date: "2026-04-02",
    slug: "2026-04-02-deepseek-context-too-long",
    title: "DeepSeek 多轮聊天上下文太长怎么办",
    description: "对话变长后回答变慢、漏细节或前后矛盾时，用摘要续聊、拆分批次和周期性重申约束来稳住输出。",
    cover: COVERS.memory,
    intro: "多轮聊天会把历史都塞进上下文。窗口接近上限时，模型会「忘记」早期的硬约束，或把旧结论和新区混在一块。",
    body: [
      section(
        "判断该续聊还是新开",
        [
          "| 情况 | 建议 |",
          "|------|------|",
          "| 同一任务迭代润色 | 续聊 |",
          "| 换主题（写作→写代码） | 新开 |",
          "| 模型引用已否定的结论 | 新开 + 摘要 |",
          "| 单次粘贴超长文档 | 分批处理 |",
        ],
        "DeepSeek 多轮上下文管理示意"
      ),
      section(
        "摘要续聊三步",
        [
          "1. 让模型输出「当前结论摘要」，限 200 字",
          "2. 新开对话，首条粘贴摘要 + 未完成任务",
          "3. 重申格式与禁止事项",
          "详细流程见 " + LINKS.memory + "。",
        ]
      ),
      section(
        "长文档分批模板",
        [
          "```",
          "下面是第 1/3 批用户评论。请先归纳标签体系，再分类这批数据。",
          "下一批我会继续用同一标签，请不要改定义。",
          "[粘贴第 1 批]",
          "```",
        ]
      ),
    ],
    related: ["memory", "web", "export"],
  },
  {
    date: "2026-04-03",
    slug: "2026-04-03-deepseek-mobile-data-saving",
    title: "手机浏览器使用 DeepSeek 对话的省流技巧",
    description: "在移动网络下减少重复加载、控制单次输出长度，并在弱网中断后无损续写。",
    cover: COVERS.mobile,
    intro: "通勤路上用手机改文案很常见，但流量和信号都不稳定。Prompt 更短、输出更可控，比开桌面模式更省流。",
    body: [
      section(
        "省流设置习惯",
        [
          "- 浏览器访问 `chat.deepseek.com`，添加到主屏幕减少反复打开首页",
          "- 单条消息只做一个子任务",
          "- 先「3 条要点」，满意再「展开第 2 条」",
          "更多移动端技巧见 " + LINKS.mobile + "。",
        ],
        "DeepSeek 手机浏览器对话省流示意"
      ),
      section(
        "弱网续写指令",
        [
          "若回答中途断开，发送：",
          "```",
          "请从上一段第 3 点继续输出，不要重复前文。",
          "若上文不完整，先根据已有内容补一句过渡。",
          "```",
        ]
      ),
    ],
    related: ["mobile", "memory", "web"],
  },
  {
    date: "2026-04-04",
    slug: "2026-04-04-deepseek-meeting-minutes-template",
    title: "DeepSeek 对话模板：会议纪要一键整理",
    description: "粘贴会议转写或速记，用固定 Prompt 输出决策表、待办和待确认问题。",
    cover: COVERS.scenario,
    intro: "会议结束后最耗时的是从杂乱记录里提炼行动项。用模板让模型只做结构化整理，不要发挥。",
    body: [
      section(
        "会议纪要模板",
        [
          "```",
          "以下是会议录音转写。请输出：",
          "1. 决策事项（表格：事项/负责人/截止时间）",
          "2. 待办（不超过 8 条，动词开头）",
          "3. 待确认问题（不超过 5 条）",
          "不要补充会议未提及的内容。",
          "---",
          "[粘贴转写]",
          "```",
          "更多模板见 " + LINKS.scenario + "。",
        ],
        "DeepSeek 会议纪要对话模板示意"
      ),
      section(
        "多轮校对",
        [
          "首轮后常用跟进：",
          "- 「把待办按优先级 P0/P1 重排」",
          "- 「负责人列改为姓名缩写，我稍后替换」",
        ]
      ),
    ],
    related: ["scenario", "memory", "export"],
  },
  {
    date: "2026-04-05",
    slug: "2026-04-05-deepseek-python-error-plain",
    title: "DeepSeek 对话模板：Python 报错通俗解释",
    description: "贴报错栈和代码片段，让 DeepSeek 用中文解释原因并给出最小修改，而不是重写整个项目。",
    cover: COVERS.scenario,
    intro: "调试时最怕模型「顺手」重写几百行。把任务限定为「解释 + 最小改动」，效率更高。",
    body: [
      section(
        "报错解释模板",
        [
          "```",
          "我是初级 Python 开发者。根据下面报错和代码：",
          "1. 用通俗中文解释原因（不超过 120 字）",
          "2. 给出最小修改方案（只改必要行）",
          "3. 不要重写整个文件",
          "---",
          "报错：[粘贴]",
          "代码：[粘贴相关函数]",
          "```",
        ],
        "DeepSeek Python 报错对话模板示意"
      ),
      section(
        "追问技巧",
        [
          "- 「如果仍报错，可能还有哪些原因？各给 1 条排查步骤」",
          "- 「把修改后的完整函数贴出来，其余代码不变」",
        ]
      ),
    ],
    related: ["scenario", "web", "memory"],
  },
  {
    date: "2026-04-06",
    slug: "2026-04-06-deepseek-chat-desensitize-share",
    title: "DeepSeek 聊天记录如何脱敏后分享给同事",
    description: "分享对话片段前的脱敏清单、替换规则和团队内协作写法，避免泄露客户与密钥信息。",
    cover: COVERS.export,
    intro: "把对话转给同事很方便，但原文里常有手机号、公司名或未公开数据。先脱敏再分享是基本习惯。",
    body: [
      section(
        "脱敏检查清单",
        [
          "- [ ] 手机、邮箱、证件号已删除或替换",
          "- [ ] 客户/公司改为「客户 A」「某公司」",
          "- [ ] API Key、密码、内网地址已移除",
          "- [ ] 截图无侧边栏账号信息",
          "完整说明见 " + LINKS.export + "。",
        ],
        "DeepSeek 对话脱敏分享示意"
      ),
      section(
        "让模型协助脱敏",
        [
          "```",
          "把下面对话记录中的敏感信息替换为占位符（姓名→[姓名]，公司→[公司]），",
          "保持结构和结论不变，用 Markdown 输出。",
          "[粘贴记录]",
          "```",
        ]
      ),
    ],
    related: ["export", "scenario", "memory"],
  },
  {
    date: "2026-04-07",
    slug: "2026-04-07-deepseek-wechat-inapp-browser",
    title: "DeepSeek 微信内置浏览器登录与对话差异",
    description: "说明在微信内打开 chat.deepseek.com 时登录态、缓存和输入体验与系统浏览器的区别及应对方法。",
    cover: COVERS.mobile,
    intro: "微信群里的链接常在微信内置浏览器打开。它和 Chrome/Safari 的 Cookie、登录态并不完全共享。",
    body: [
      section(
        "常见差异",
        [
          "| 项目 | 微信内置 | 系统浏览器 |",
          "|------|----------|------------|",
          "| 登录态 | 独立 Cookie | 独立 Cookie |",
          "| 输入体验 | 键盘易挡界面 | 相对完整 |",
          "| 收藏入口 | 需手动添加 | 可加主屏幕 |",
        ],
        "DeepSeek 微信内置浏览器对话示意"
      ),
      section(
        "推荐做法",
        [
          "1. 重要长对话在系统浏览器完成",
          "2. 微信内仅做短问答",
          "3. 登录异常时复制链接到浏览器打开",
          "详见 " + LINKS.mobile + "。",
        ]
      ),
    ],
    related: ["mobile", "web", "export"],
  },
  {
    date: "2026-04-08",
    slug: "2026-04-08-deepseek-answer-length-control",
    title: "DeepSeek 对话中如何让回答变短或变长",
    description: "用字数上限、条目数量和分步展开指令控制输出长度，避免首轮就得到难以消化的长文。",
    cover: COVERS.web,
    intro: "同样一个问题，不加约束时模型倾向写长。长度控制要写在首条或第二轮，不要等写完再砍。",
    body: [
      section(
        "变短常用句",
        [
          "- 「总共不超过 200 字」",
          "- 「只给 3 条，每条一行」",
          "- 「先结论后理由，理由最多 2 句」",
          "- 「删除例子，只保留步骤」",
        ],
        "DeepSeek 对话输出长度控制示意"
      ),
      section(
        "变长但不水",
        [
          "- 「在保持结构不变的前提下，每点展开到 80 字」",
          "- 「补充 1 个反例和 1 个检查清单」",
          "- 「分两段输出，先输出上半部分」",
        ]
      ),
    ],
    related: ["web", "memory", "scenario"],
  },
  {
    date: "2026-04-09",
    slug: "2026-04-09-deepseek-new-chat-vs-continue",
    title: "DeepSeek 新开对话 vs 续聊：什么时候该换窗口",
    description: "用决策表判断该在同一窗口迭代还是新开对话，减少跑题和上下文污染。",
    cover: COVERS.memory,
    intro: "续聊省事儿，但窗口里堆了太多无关轮次时，模型容易被带偏。换窗口不是失败，是正常操作。",
    body: [
      section(
        "决策表",
        [
          "| 场景 | 续聊 | 新开 |",
          "|------|:----:|:----:|",
          "| 同主题润色第 3 版 | ✓ | |",
          "| 从写邮件转写 SQL | | ✓ |",
          "| 角色从客服变程序员 | | ✓ |",
          "| 长文档已做摘要 | | ✓（贴摘要） |",
        ],
        "DeepSeek 新开对话与续聊选择示意"
      ),
      section(
        "新开时首条怎么写",
        [
          "```",
          "【背景摘要】（200 字内）",
          "【当前任务】",
          "【格式与约束】",
          "```",
          "参考 " + LINKS.memory + "。",
        ]
      ),
    ],
    related: ["memory", "web", "scenario"],
  },
  {
    date: "2026-04-10",
    slug: "2026-04-10-deepseek-voice-input-correction",
    title: "DeepSeek 语音输入对话的识别纠错方法",
    description: "语音输入后快速校对术语、英文专名和数字，减少因识别错误导致的答非所问。",
    cover: COVERS.mobile,
    intro: "手机语音输入适合头脑风暴，但专业名词常被听错。发送前花 10 秒校对，能少改一整轮。",
    body: [
      section(
        "发送前校对清单",
        [
          "- 产品名、库名是否拼写正确",
          "- 数字、版本号是否被听成近音字",
          "- 英文术语后加中文注释：「Kubernetes（K8s 容器编排）」",
        ],
        "DeepSeek 语音输入对话纠错示意"
      ),
      section(
        "识别错了怎么补救",
        [
          "```",
          "上一条语音里「X」应为「Y」，请按正确术语重新回答，不要重复解释。",
          "```",
        ]
      ),
    ],
    related: ["mobile", "web", "memory"],
  },
  {
    date: "2026-04-11",
    slug: "2026-04-11-deepseek-interview-prompt",
    title: "DeepSeek 对话场景：面试模拟考官 Prompt",
    description: "用单题单评模式模拟技术或业务面试，控制节奏并积累可复述的回答要点。",
    cover: COVERS.scenario,
    intro: "面试演练最怕模型一次抛出十道题。让 AI 扮演考官，**每次只问一题**，你答完再给点评。",
    body: [
      section(
        "面试模拟模板",
        [
          "```",
          "你扮演面试官，岗位是 [职位]。",
          "规则：每次只问 1 题；等我回答后给简短点评（优点/改进点各 1 条），再出下一题。",
          "难度从基础到进阶，共 8 题。开始。",
          "```",
          "更多场景见 " + LINKS.scenario + "。",
        ],
        "DeepSeek 面试模拟对话示意"
      ),
    ],
    related: ["scenario", "web", "memory"],
  },
  {
    date: "2026-04-12",
    slug: "2026-04-12-deepseek-reading-notes-three-part",
    title: "DeepSeek 对话场景：读书笔记三段式输出",
    description: "读完一章后用固定结构要观点、行动建议和易误解点，方便复习和分享。",
    cover: COVERS.scenario,
    intro: "读书笔记怕写成流水账。三段式输出强制模型给可复习的结构。",
    body: [
      section(
        "三段式模板",
        [
          "```",
          "我读完《[书名]》第 [N] 章。请用：",
          "- 3 个核心观点",
          "- 1 个可行动建议",
          "- 1 个我可能误解的点",
          "总共不超过 300 字，不要剧透后续章节。",
          "```",
        ],
        "DeepSeek 读书笔记对话示意"
      ),
    ],
    related: ["scenario", "memory", "export"],
  },
  {
    date: "2026-04-13",
    slug: "2026-04-13-deepseek-r1-when-to-enable",
    title: "DeepSeek 深度思考 R1 模式什么时候开",
    description: "区分日常快问快答与需要推理链的复杂问题，避免简单任务也开 R1 导致等待变长。",
    cover: COVERS.web,
    intro: "深度思考（R1）会先展示推理再给出答案，适合多条件约束和逻辑题；写邮件、改标题通常不必开。",
    body: [
      section(
        "适合开 R1 的场景",
        [
          "- 多步骤数学或逻辑推导",
          "- 需要在多个方案间做权衡",
          "- 规则多、约束冲突的决策草稿",
        ],
        "DeepSeek R1 深度思考模式使用示意"
      ),
      section(
        "不必开 R1 的场景",
        [
          "- 文案改写、翻译、格式转换",
          "- 已有明确模板的会议纪要",
          "- 仅需创意头脑风暴",
          "网页基础操作见 " + LINKS.web + "。",
        ]
      ),
    ],
    related: ["web", "memory", "scenario"],
  },
  {
    date: "2026-04-14",
    slug: "2026-04-14-deepseek-pdf-upload-summary",
    title: "上传 PDF 让 DeepSeek 总结的正确姿势",
    description: "大文档先说明要问什么、输出格式和页码范围，避免模型泛泛概括遗漏关键条款。",
    cover: COVERS.generic,
    intro: "上传 PDF 后若只问「总结一下」，得到的多半是目录式废话。任务越具体，摘要越可用。",
    body: [
      section(
        "推荐首条结构",
        [
          "```",
          "附件是 [文档类型]。请只回答：",
          "1. [具体问题 1]",
          "2. [具体问题 2]",
          "输出表格，不要编造附件没有的数据；不确定写「文中未提及」。",
          "```",
        ],
        "DeepSeek PDF 文档对话总结示意"
      ),
    ],
    related: ["web", "scenario", "export"],
  },
  {
    date: "2026-04-15",
    slug: "2026-04-15-deepseek-code-edit-one-place",
    title: "代码调试对话：如何让 DeepSeek 只改一处",
    description: "用最小修改、行号引用和禁止重写整文件等约束，在对话里安全地迭代代码。",
    cover: COVERS.scenario,
    intro: "开发者在对话里贴代码时，模型喜欢「顺手优化」整段。明确边界能减少合并成本。",
    body: [
      section(
        "最小修改指令",
        [
          "```",
          "只修改 parse_config 函数中处理空值的逻辑，其余代码保持逐字不变。",
          "修改后仅输出该函数的完整代码。",
          "```",
        ],
        "DeepSeek 代码对话最小修改示意"
      ),
    ],
    related: ["scenario", "memory", "web"],
  },
  {
    date: "2026-04-16",
    slug: "2026-04-16-deepseek-table-output-format",
    title: "DeepSeek 对话里表格输出的格式约束技巧",
    description: "用 Markdown 表头、列定义和示例行锁定表格结构，方便复制到 Excel 或飞书文档。",
    cover: COVERS.web,
    intro: "说「用表格」不够，模型可能列名乱变。先定义列，再给一行示例，稳定性会高很多。",
    body: [
      section(
        "表格模板",
        [
          "```",
          "用 Markdown 表格输出，列必须为：| 项目 | 现状 | 建议 | 优先级 |",
          "示例行：| 登录慢 | 高峰超时 | 错峰+重试 | P1 |",
          "然后填充下面数据：[粘贴]",
          "```",
        ],
        "DeepSeek 对话表格格式示意"
      ),
    ],
    related: ["web", "scenario", "memory"],
  },
  {
    date: "2026-04-17",
    slug: "2026-04-17-deepseek-language-mix-control",
    title: "中英混输对话的语言控制方法",
    description: "在术语保留英文、正文用中文等场景下，用一条指令锁定输出语言与专有名词写法。",
    cover: COVERS.web,
    intro: "技术文档常中英混用。若不说明，模型可能在同一段里随机切换语言。",
    body: [
      section(
        "语言锁定示例",
        [
          "```",
          "请用简体中文回答。专有名词保留英文原文（如 Kubernetes、RBAC），",
          "首次出现附中文括号说明。代码与命令保持英文。",
          "```",
        ],
        "DeepSeek 中英混输对话语言控制示意"
      ),
    ],
    related: ["web", "scenario", "mobile"],
  },
  {
    date: "2026-04-18",
    slug: "2026-04-18-deepseek-weekly-plan-dialogue",
    title: "用 DeepSeek 对话拆解一周学习计划",
    description: "把目标、可用时间和基础水平写清，让模型输出按天任务表而非空泛励志话。",
    cover: COVERS.scenario,
    intro: "问「帮我制定学习计划」会得到鸡汤。换成「每天 1 小时、共 7 天、目标 Python 读写 CSV」才可执行。",
    body: [
      section(
        "周计划模板",
        [
          "```",
          "目标：7 天内学会用 Python 读写 CSV 并做简单统计。",
          "我每天可投入 1 小时，零基础。",
          "请输出 Markdown 表格：日期/学习内容/练习/验收标准。",
          "不要安排超过 1 小时的任务。",
          "```",
        ],
        "DeepSeek 学习计划对话示意"
      ),
    ],
    related: ["scenario", "web", "memory"],
  },
  {
    date: "2026-04-19",
    slug: "2026-04-19-deepseek-travel-fact-check",
    title: "旅行攻略对话：如何让 DeepSeek 标注待核实信息",
    description: "要求模型区分确定事实与需自行核实的票价、营业时间，降低幻觉带来的行程风险。",
    cover: COVERS.generic,
    intro: "AI 写的攻略很流畅，但票价和营业时间可能过期。让模型自检「待核实」项更稳妥。",
    body: [
      section(
        "核实约束模板",
        [
          "```",
          "帮我做 [城市] 2 日游路线。",
          "门票与营业时间若不确定请标注「待核实」。",
          "不要编造具体价格数字；交通方式写官方渠道查询建议。",
          "```",
        ],
        "DeepSeek 旅行攻略对话核实示意"
      ),
    ],
    related: ["web", "memory", "scenario"],
  },
  {
    date: "2026-04-20",
    slug: "2026-04-20-deepseek-customer-service-roleplay",
    title: "客服话术对话模拟：单场景单轮训练",
    description: "模拟投诉、催单、退换货等客服场景，练习短句回复和升级话术。",
    cover: COVERS.scenario,
    intro: "客服训练重在短、稳、可复述。让模型扮演顾客，你练回复，再要模型打分。",
    body: [
      section(
        "客服模拟模板",
        [
          "```",
          "你扮演购买了 [产品] 的顾客，因 [问题] 来投诉。",
          "我每次回复一句客服话术，你根据语气继续追问或表示满意。",
          "每 3 轮后给评分：共情/解决问题/是否越权承诺。",
          "```",
        ],
        "DeepSeek 客服话术对话模拟示意"
      ),
    ],
    related: ["scenario", "memory", "mobile"],
  },
];

const videos = [
  {
    date: "2026-04-22",
    slug: "deepseek-chat-video-web-tutorial",
    title: "DeepSeek 网页对话入门视频教程（附步骤清单）",
    description: "配合 B 站视频讲解 chat.deepseek.com 首条消息、模型按钮与多轮迭代，文末附可打印步骤清单。",
    cover: COVERS.web,
    videoBvid: "BV1ZpdZYBE6E",
    featured: true,
    body: [
      section(
        "视频讲什么",
        [
          "上方嵌入视频涵盖：网页端按钮作用、清空提示词、背景信息与目标写法、上下文与清除记忆等。建议 1.25 倍速观看，遇到界面变化以 `chat.deepseek.com` 为准。",
          "官方入口：[chat.deepseek.com](https://chat.deepseek.com/)",
        ],
        "DeepSeek 网页对话视频教程配套示意"
      ),
      section(
        "看完后的三步练习",
        [
          "1. 新开对话，用四要素写一条首条消息（见 " + LINKS.web + "）",
          "2. 故意要求「缩短到 100 字」，练长度控制",
          "3. 换新任务时新开窗口（见 " + LINKS.memory + "）",
        ]
      ),
      section(
        "延伸阅读",
        [
          "- " + LINKS.web,
          "- " + LINKS.scenario,
          "- " + LINKS.export,
        ]
      ),
    ],
    related: [],
  },
  {
    date: "2026-04-24",
    slug: "deepseek-chat-video-mobile-tutorial",
    title: "DeepSeek 手机端对话视频教程：通勤场景实战",
    description: "结合视频演示手机浏览器访问、语音输入纠错与弱网续写，适合路上快速改文案。",
    cover: COVERS.mobile,
    videoBvid: "BV1UZFfeMEvd",
    featured: true,
    body: [
      section(
        "视频讲什么",
        [
          "视频介绍 DeepSeek 常见使用技巧，含移动端访问与实用场景。观看时注意辨别「网页对话」与「本地部署」章节，本站专注前者。",
        ],
        "DeepSeek 手机端对话视频教程配套示意"
      ),
      section(
        "通勤场景练习",
        [
          "1. 手机浏览器打开 `chat.deepseek.com` 并添加到主屏幕",
          "2. 用语音输入一条标题改写需求，发送前校对专名",
          "3. 复制结果到备忘录备份（见 " + LINKS.export + "）",
          "完整文字版：" + LINKS.mobile,
        ]
      ),
    ],
    related: [],
  },
];

function writePost(item, opts = {}) {
  const parts = [
    fm({
      title: item.title,
      description: item.description,
      date: item.date,
      slug: item.slug,
      cover: item.cover,
      featured: item.featured,
      generated: opts.generated !== false && !item.featured,
      videoBvid: item.videoBvid,
    }),
    item.intro ? item.intro + "\n" : "",
    ...(item.body || []),
  ];
  if (item.related && item.related.length) parts.push(related(...item.related));
  const file = path.join(OUT, `${item.slug}.md`);
  if (fs.existsSync(file)) {
    console.log("skip exists", item.slug);
    return;
  }
  fs.writeFileSync(file, parts.join("\n"), "utf-8");
  console.log("wrote", item.slug);
}

for (const a of articles) writePost(a);
for (const v of videos) writePost(v, { generated: false });
console.log("Done.");
