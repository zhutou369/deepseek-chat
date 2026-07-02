---
title: "DeepSeek 反向 Prompt：让 AI 先提问再回答"
description: "复杂任务先让 DeepSeek 列出澄清问题，你再逐条回答，可减少首轮跑偏和废话。"
date: 2026-08-13
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-13-deepseek-ai-asks-first-prompt/index.html"
coverImage: "/static/posts/covers/scenario-lib.svg"
---
> **30 秒结论**：适合需求模糊的任务；首条写「先问我 5 个澄清问题，等我答完再给方案」。

## 适用场景

- 写方案/报告但自己还没想清楚范围

- 活动策划、选题、用户画像等开放式任务

- 不适合：已有完整材料、只要翻译/改写的简单活

## 操作步骤

1. 发反向 Prompt（见下方）

2. 逐条简短回答模型的问题

3. 最后一轮：`根据以上回答，输出最终方案，用 Markdown 大纲`


![反向提问示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

我要做一场 30 人的内部分享，主题与 DeepSeek 网页对话技巧相关。

请先问我 5 个澄清问题（受众/时长/场地/是否演示/禁忌），

不要先给方案。等我回答后你再出大纲。

```

## 常见问题

**问：要问多少轮？**

答：一般 1 轮澄清 + 1 轮交付；超过 3 轮建议新开对话并贴摘要。

**问：问题太泛怎么办？**

答：回复：`请把第 2 题改成二选一的具体选项`。


## 延伸阅读

- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
