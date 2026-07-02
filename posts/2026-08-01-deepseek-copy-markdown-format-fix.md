---
title: "DeepSeek 对话复制到 Word/飞书格式乱码怎么办"
description: "从 DeepSeek 复制 Markdown、表格或代码到 Word/飞书时格式错乱，用「先 Markdown 后粘贴」和分段复制两步搞定。"
date: 2026-08-01
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-01-deepseek-copy-markdown-format-fix/index.html"
coverImage: "/static/posts/covers/scenario-lib.svg"
---
> **30 秒结论**：先让 DeepSeek 输出「纯文本表格」或「无代码块 Markdown」，再粘贴到目标工具；复杂排版用中间备忘录中转。

## 操作步骤

1. 在对话里加约束：`请用 Markdown 表格输出，不要代码块围栏`

2. 复制前点「复制为 Markdown」（若有）或全选后粘贴到 Typora / 备忘录

3. 从备忘录再粘贴到 Word/飞书，选择「保留源格式」或「合并格式」

4. 代码片段单独复制，在 Word 里用「等宽字体」段落样式


![复制格式处理示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

把下面内容整理成 Markdown 表格，列：事项/负责人/截止日期。

不要 ``` 代码块，不要 HTML，总共不超过 15 行：

[粘贴模型上一段回答]

```

## 常见问题

**问：表格变成一行纯文本？**

答：让模型重出「用 | 分隔的 Markdown 表格」，或粘贴到支持 Markdown 的编辑器再导出。

**问：代码缩进丢了？**

答：要求「每行前缀保留 4 个空格」，或导出为 .md 文件再打开。


## 延伸阅读

- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [网页对话入门](/posts/deepseek-chat-web-basics/)
