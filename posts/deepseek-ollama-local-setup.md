---
title: "使用 Ollama 在本地运行 DeepSeek 模型"
description: "在 Windows 与 macOS 上通过 Ollama 拉取 DeepSeek 模型、检查输出质量，并排查常见的内存不足问题。"
date: 2026-06-27
updated: 2026-06-27
featured: true
tags: ["posts"]
layout: "post.njk"
permalink: "/posts/deepseek-ollama-local-setup/index.html"
---

本地部署 DeepSeek 适合需要离线测试、敏感数据不便上云，或想控制推理成本的场景。Ollama 是目前最简单的入门方式之一。

## 环境准备

- **macOS**：Apple Silicon 建议 16GB 内存以上。
- **Windows**：建议 NVIDIA 显卡 + 最新驱动；仅 CPU 也可运行小模型，但速度较慢。
- 硬盘预留至少 10–30GB，视模型大小而定。

## 安装 Ollama

1. 前往 Ollama 官网下载对应系统安装包。
2. 安装完成后，在终端执行 `ollama --version` 确认可用。
3. 首次拉取模型需下载数 GB 文件，请保持网络稳定。

## 拉取 DeepSeek 模型

```bash
ollama pull deepseek-r1:7b
```

也可依硬件选择其他标签（如 1.5b、14b）。模型越大，效果通常越好，但 RAM/VRAM 需求更高。

测试对话：

```bash
ollama run deepseek-r1:7b
```

## 中文输出检查

本地模型可在 Prompt 开头加入：

```
请使用简体中文回答。若原文为英文，保留专有名词英文。
```

若回答质量不稳定，可换用较新的模型版本，或在 Prompt 中给出输出示例（Few-Shot）。

## 常见问题

### OOM（内存不足）

- 改用更小模型（如 7b → 1.5b）
- 关闭其他占用 GPU 的程序
- Windows 上确认使用的是 GPU 版 Ollama

### 速度很慢

- 确认是否在使用 GPU
- 减少上下文长度
- 批量任务改用 API 而非本地推理

## 何时该用本地，何时该用 API

| 场景 | 建议 |
|------|------|
| 敏感内部文件 | 本地 |
| 高并发线上服务 | API |
| 快速验证 Prompt | 本地小模型 |
| 最强推理能力 | 云端大模型 API |
