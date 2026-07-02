---
title: "代码调试对话：如何让 DeepSeek 只改一处"
description: "用最小修改、行号引用和禁止重写整文件等约束，在对话里安全地迭代代码。"
date: 2026-04-15
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-15-deepseek-code-edit-one-place/index.html"
coverImage: "/static/posts/chat-scenario-cover.svg"
generated: true
---

开发者在对话里贴代码时，模型喜欢「顺手优化」整段。明确边界能减少合并成本。

## 最小修改指令

```

只修改 parse_config 函数中处理空值的逻辑，其余代码保持逐字不变。

修改后仅输出该函数的完整代码。

```

![DeepSeek 代码对话最小修改示意](/static/posts/chat-generic-step.svg)


## 延伸阅读

- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [网页对话入门](/posts/deepseek-chat-web-basics/)
