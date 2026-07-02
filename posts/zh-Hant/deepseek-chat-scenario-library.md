---
title: "DeepSeek 對話場景庫：寫作、編程、學習模板"
description: "收錄可直接複製的 DeepSeek 對話 Prompt 模板，覆蓋文案改寫、代碼解釋、讀書筆記與面試準備等高頻場景。"
date: 2026-07-02
updated: 2026-07-02
featured: true
locale: zh-Hant
translationKey: deepseek-chat-scenario-library
tags: ["場景模板"]
layout: "post.njk"
permalink: "/zh-Hant/posts/deepseek-chat-scenario-library/index.html"
---

本站定位是「對話場景」而非 API 接入。下面模板均可直接貼上到 DeepSeek 網頁對話使用，按需改括號內容即可。

## 寫作與內容

**公眾號開頭改寫**

```
你是資深新媒體編輯。把下面草稿改成吸引人的開頭，150 字內，保留事實不誇大：
---
[貼上原文]
```

**會議紀要提煉**

```
以下是會議錄音轉寫。請輸出：
1. 決策事項（表格：事項/負責人/截止時間）
2. 待確認問題（不超過 5 條）
---
[貼上轉寫]
```

## 編程與調試

**解釋報錯**

```
我是初級 Python 開發者。根據下面報錯和代碼片段：
1. 用通俗中文解釋原因
2. 給出最小修改方案
3. 不要重寫整個文件
---
報錯：[貼上]
代碼：[貼上]
```

**代碼審查**

```
請按「安全 / 性能 / 可讀性」三方面審查下面函數，每項最多 2 條建議：
[貼上代碼]
```

## 學習與備考

**讀書筆記**

```
我讀完《[書名]》第 [N] 章。請用：
- 3 個核心觀點
- 1 個可行動建議
- 1 個我可能誤解的點
字數總共不超過 300 字。
```

**面試題演練**

```
你扮演面試官，崗位是 [職位]。每次只問 1 題，等我回答後給簡短點評，再出下一題。開始。
```

## 如何使用本庫

1. 複製最接近的模板
2. 只改括號與附件內容
3. 首輪輸出不滿意時，用 [多輪對話技巧](/zh-Hant/posts/deepseek-multi-turn-memory/) 迭代

API 密鑰、限流等開發話題請參閱專門的 API 文檔；本站專注網頁聊天體驗。

## 相關教程

- [網頁對話入門](/zh-Hant/posts/deepseek-chat-web-basics/)
- [多輪對話管理](/zh-Hant/posts/deepseek-multi-turn-memory/)
- [手機端對話技巧](/zh-Hant/posts/deepseek-mobile-app-chat/)
