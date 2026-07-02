---
title: "DeepSeek 对话里贴链接让 AI 总结网页要点"
description: "在对话中提供 URL 或粘贴正文时，如何写好总结任务才能得到可核实的要点列表。"
date: 2026-08-19
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-19-deepseek-url-summary-in-chat/index.html"
coverImage: "/static/posts/covers/web-chat.svg"
---
> **30 秒结论**：链接无法访问时改粘贴正文；总结任务要写清条数、是否引用原句、不确定如何处理。

## 操作步骤

1. 优先粘贴关键段落（比裸链更稳）

2. 若只给 URL：说明「若无法访问请直说，不要编造」

3. 要求输出：`3 条要点 + 1 条待核实` 格式

4. 长文分段总结，见 [多轮上下文管理](/posts/deepseek-multi-turn-memory/)


![链接总结示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

以下是文章链接：[URL]

若你能访问：用 5 条 bullet 总结，每条 ≤30 字，并注明是否含推测。

若不能访问：请告诉我，我会粘贴正文。

```

## 常见问题

**问：模型编造链接内容？**

答：必须加「无法访问则明确说明」；重要决策以原文为准。

**问：和 PDF 上传总结区别？**

答：PDF 见 [4 月教程](/posts/2026-04-14-deepseek-pdf-upload-summary/)；链接适合短网页。


## 延伸阅读

- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
