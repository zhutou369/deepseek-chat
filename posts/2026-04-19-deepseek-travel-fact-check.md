---
title: "旅行攻略对话：如何让 DeepSeek 标注待核实信息"
description: "要求模型区分确定事实与需自行核实的票价、营业时间，降低幻觉带来的行程风险。"
date: 2026-04-19
tags: ["对话教程"]
layout: "post.njk"
permalink: "/posts/2026-04-19-deepseek-travel-fact-check/index.html"
coverImage: "/static/posts/covers/generic.svg"
---

AI 写的攻略很流畅，但票价和营业时间可能过期。让模型自检「待核实」项更稳妥。

## 核实约束模板

```

帮我做 [城市] 2 日游路线。

门票与营业时间若不确定请标注「待核实」。

不要编造具体价格数字；交通方式写官方渠道查询建议。

```

![DeepSeek 旅行攻略对话核实示意](/static/posts/covers/step-guide.svg)


## 延伸阅读

- [网页对话入门](/posts/deepseek-chat-web-basics/)
- [多轮上下文管理](/posts/deepseek-multi-turn-memory/)
- [场景模板库](/posts/deepseek-chat-scenario-library/)
