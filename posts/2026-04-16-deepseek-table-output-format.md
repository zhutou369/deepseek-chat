---
title: "DeepSeek 对话里表格输出的格式约束技巧"
description: "用 Markdown 表头、列定义和示例行锁定表格结构，方便复制到 Excel 或飞书文档。"
date: 2026-04-16
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-16-deepseek-table-output-format/index.html"
coverImage: "/static/posts/chat-web-basics-cover.svg"
generated: true
---

说「用表格」不够，模型可能列名乱变。先定义列，再给一行示例，稳定性会高很多。

## 表格模板

```

用 Markdown 表格输出，列必须为：| 项目 | 现状 | 建议 | 优先级 |

示例行：| 登录慢 | 高峰超时 | 错峰+重试 | P1 |

然后填充下面数据：[粘贴]

```

![DeepSeek 对话表格格式示意](/static/posts/chat-generic-step.svg)


## 延伸阅读

- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
