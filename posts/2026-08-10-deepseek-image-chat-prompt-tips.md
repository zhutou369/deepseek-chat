---
title: "DeepSeek 上传图片对话识图提问技巧"
description: "在网页对话上传截图或照片时，写好「看图任务 + 输出格式」才能得到可执行的识图结果。"
date: 2026-08-10
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-10-deepseek-image-chat-prompt-tips/index.html"
coverImage: "/static/posts/covers/web-chat.svg"
---
> **30 秒结论**：一张图一个任务；说明要让模型「读什么」（文字/图表/界面按钮）和「输出什么」（列表/表格/步骤）。

## 操作步骤

1. 上传前裁剪无关区域，保证文字清晰

2. 首条消息写清：图片类型 + 任务 + 格式

3. 涉及数字或日期：要求「不确定处标注待核实」

4. 多图对比：分两次上传，或说明「图 1 vs 图 2 差异」


![识图提问示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

这是一张产品设置页截图。请列出：

1. 可见的开关名称及开/关状态

2. 底部灰色小字里的版本号

用表格输出，看不清的写「无法辨认」。

```

## 常见问题

**问：截图模糊怎么办？**

答：放大后重截，或只截关键区域；勿一次传超长全屏。

**问：能一次传多张吗？**

答：视入口而定；不稳时一张一任务更可靠。


## 延伸阅读

- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
