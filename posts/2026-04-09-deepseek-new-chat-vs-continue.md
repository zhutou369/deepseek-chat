---
title: "DeepSeek 新开对话 vs 续聊：什么时候该换窗口"
description: "用决策表判断该在同一窗口迭代还是新开对话，减少跑题和上下文污染。"
date: 2026-04-09
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-09-deepseek-new-chat-vs-continue/index.html"
coverImage: "/static/posts/covers/multi-turn.svg"
---

续聊省事儿，但窗口里堆了太多无关轮次时，模型容易被带偏。换窗口不是失败，是正常操作。

## 决策表

| 场景 | 续聊 | 新开 |

|------|:----:|:----:|

| 同主题润色第 3 版 | ✓ | |

| 从写邮件转写 SQL | | ✓ |

| 角色从客服变程序员 | | ✓ |

| 长文档已做摘要 | | ✓（贴摘要） |

![DeepSeek 新开对话与续聊选择示意](/static/posts/covers/step-guide.svg)

## 新开时首条怎么写

```

【背景摘要】（200 字内）

【当前任务】

【格式与约束】

```

参考 [多轮上下文管理](/posts/deepseek-multi-turn-memory/)。


## 延伸阅读

- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
