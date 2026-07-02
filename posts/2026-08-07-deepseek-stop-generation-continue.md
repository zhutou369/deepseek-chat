---
title: "DeepSeek 对话生成到一半停了怎么续写"
description: "回答中断、手动停止或弱网截断时，用「从第 N 点继续」指令续写，避免全文重写。"
date: 2026-08-07
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-07-deepseek-stop-generation-continue/index.html"
coverImage: "/static/posts/covers/multi-turn.svg"
---
> **30 秒结论**：不要重新提问；发送「请从上一段第 3 点继续，不要重复前文，接着写下半部分」。长文先让模型输出摘要再新开对话续写。

## 操作步骤

1. 确认网络稳定后，发续写指令（见下方 Prompt）

2. 若模型重复前文，加：`只输出新增内容，从「## 第二部分」开始`

3. 多次失败：让模型先列「已完成要点 1–5」，新开对话粘贴摘要继续

4. 长任务拆分见 [多轮上下文管理](/posts/deepseek-multi-turn-memory/)


![中断续写示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

你上一段回答在第 3 条表格处中断了。

请从第 3 条继续写完，不要重复第 1–2 条，保持同一表格格式。

```

## 常见问题

**问：点停止后还能接吗？**

答：可以，说明停在哪一句，要求从该句后半继续。

**问：续写风格和前面不一致？**

答：加一句：`语气、人称与上文保持一致`。


## 延伸阅读

- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [网页对话入门](/posts/deepseek-chat-web-basics/)
