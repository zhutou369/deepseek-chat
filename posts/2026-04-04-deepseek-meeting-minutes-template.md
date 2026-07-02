---
title: "DeepSeek 对话模板：会议纪要一键整理"
description: "粘贴会议转写或速记，用固定 Prompt 输出决策表、待办和待确认问题。"
date: 2026-04-04
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-04-deepseek-meeting-minutes-template/index.html"
coverImage: "/static/posts/covers/scenario-lib.svg"
generated: true
---

会议结束后最耗时的是从杂乱记录里提炼行动项。用模板让模型只做结构化整理，不要发挥。

## 会议纪要模板

```

以下是会议录音转写。请输出：

1. 决策事项（表格：事项/负责人/截止时间）

2. 待办（不超过 8 条，动词开头）

3. 待确认问题（不超过 5 条）

不要补充会议未提及的内容。

---

[粘贴转写]

```

更多模板见 [场景模板库](/posts/deepseek-chat-scenario-library/)。

![DeepSeek 会议纪要对话模板示意](/static/posts/covers/step-guide.svg)

## 多轮校对

首轮后常用跟进：

- 「把待办按优先级 P0/P1 重排」

- 「负责人列改为姓名缩写，我稍后替换」


## 延伸阅读

- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [导出与隐私](/posts/deepseek-chat-export-share/)
