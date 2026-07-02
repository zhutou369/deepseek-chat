---
title: "DeepSeek 聊天记录如何脱敏后分享给同事"
description: "分享对话片段前的脱敏清单、替换规则和团队内协作写法，避免泄露客户与密钥信息。"
date: 2026-04-06
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-06-deepseek-chat-desensitize-share/index.html"
coverImage: "/static/posts/covers/export-privacy.svg"
---

把对话转给同事很方便，但原文里常有手机号、公司名或未公开数据。先脱敏再分享是基本习惯。

## 脱敏检查清单

- [ ] 手机、邮箱、证件号已删除或替换

- [ ] 客户/公司改为「客户 A」「某公司」

- [ ] API Key、密码、内网地址已移除

- [ ] 截图无侧边栏账号信息

完整说明见 [导出与隐私](/posts/deepseek-chat-export-share/)。

![DeepSeek 对话脱敏分享示意](/static/posts/covers/step-guide.svg)

## 让模型协助脱敏

```

把下面对话记录中的敏感信息替换为占位符（姓名→[姓名]，公司→[公司]），

保持结构和结论不变，用 Markdown 输出。

[粘贴记录]

```


## 延伸阅读

- [导出与隐私](/posts/deepseek-chat-export-share/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
