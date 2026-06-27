---
title: "DeepSeek API 密钥申请、限流与 429 错误处理"
description: "说明 DeepSeek API Key 申请流程、常见限流规则、Token 用量观察方式，以及遇到 429 Too Many Requests 时的实务处理。"
date: 2026-06-27
updated: 2026-06-27
featured: true
tags: ["posts"]
layout: "post.njk"
permalink: "/posts/deepseek-api-key-and-limits/index.html"
---

接入 DeepSeek API 前，先把密钥管理与限流规则搞清楚，能避免上线后大量 429 错误。

## API Key 申请与安全存放

1. 登录 DeepSeek 开发者平台，创建项目并生成 API Key。
2. Key 只显示一次，请立即存入密钥管理服务（如 GitHub Secrets、Vault、云厂商 Secret Manager）。
3. 不要把 Key 写进前端 JavaScript 或公开 Git 仓库。
4. 生产与测试环境使用不同 Key，方便轮换与追踪用量。

## 理解限流（Rate Limit）

429 错误表示请求频率或并发超出配额。常见限制维度包括：

- 每分钟请求数（RPM）
- 每分钟 Token 数（TPM）
- 单次请求最大 Token

开发阶段建议：

- 在请求头或响应中记录 `x-ratelimit-*` 类字段（若平台提供）。
- 对批量任务加入队列，而不是同时发送数百个请求。
- 长文本任务拆段处理，避免单次 Prompt 过大。

## 429 发生时怎么做

1. **立即停止重试风暴**：连续重试会让限流时间更长。
2. **读取 Retry-After**：若响应头提供等待秒数，按指示延迟。
3. **指数退避**：例如 1s → 2s → 4s，并设定最大重试次数（3–5 次）。
4. **降级策略**：高峰期切换到更小模型或缓存相似问题的回答。

## 用量与成本观察

- 记录每次请求的 `prompt_tokens` 与 `completion_tokens`。
- 为不同功能模块分开统计，找出 Token 消耗异常的接口。
- 定期轮换 Key，并删除不再使用的旧 Key。

## 上线前检查清单

- [ ] Key 未暴露在前端或公开仓库
- [ ] 已设定请求超时（建议 30–60 秒）
- [ ] 已实现 429/503 重试与熔断
- [ ] 有基本日志：状态码、耗时、Token 用量
