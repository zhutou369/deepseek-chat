---
title: "DeepSeek 对话中如何让回答变短或变长"
description: "用字数上限、条目数量和分步展开指令控制输出长度，避免首轮就得到难以消化的长文。"
date: 2026-04-08
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-08-deepseek-answer-length-control/index.html"
coverImage: "/static/posts/covers/web-chat.svg"
---

同样一个问题，不加约束时模型倾向写长。长度控制要写在首条或第二轮，不要等写完再砍。

## 变短常用句

- 「总共不超过 200 字」

- 「只给 3 条，每条一行」

- 「先结论后理由，理由最多 2 句」

- 「删除例子，只保留步骤」

![DeepSeek 对话输出长度控制示意](/static/posts/covers/step-guide.svg)

## 变长但不水

- 「在保持结构不变的前提下，每点展开到 80 字」

- 「补充 1 个反例和 1 个检查清单」

- 「分两段输出，先输出上半部分」


## 延伸阅读

- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
