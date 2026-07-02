---
title: "DeepSeek 对话语气正式/口语一键切换"
description: "同一段落要在客户邮件与内部群聊间切换语气时，用风格标签 Prompt 快速改写。"
date: 2026-08-28
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-08-28-deepseek-tone-formal-casual-switch/index.html"
coverImage: "/static/posts/covers/scenario-lib.svg"
---
> **30 秒结论**：保留事实不变，只改语气；用「正式书面 / 口语同事 / 客服礼貌」三档标签 + 字数上限。

## 操作步骤

1. 粘贴原文

2. 指定目标语气与禁忌（不用表情、不用「亲」等）

3. 要求「只改语气，不增删事实」

4. 多轮微调：`第 2 句再正式一点`


![语气切换示意](/static/posts/covers/step-guide.svg)

## 可直接复制的 Prompt

```

把下面段落改成「对客户的书面邮件」语气：

- 用您，不用口语

- 不超过 120 字

- 不添加我未提供的事实

[粘贴原文]

```

## 常见问题

**问：同一段落混用正式和口语？**

答：要求：`统一为正式语气，并标出原先口语词替换成什么`。

**问：对客户 vs 对同事？**

答：分两次改写，标签写清受众与禁忌词。


## 延伸阅读

- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
