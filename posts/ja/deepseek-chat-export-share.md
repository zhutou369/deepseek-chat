---
title: "DeepSeek 会話のエクスポート・共有とプライバシー"
description: "会話のバックアップ、安全な共有、ローカルデータの削除によるプライバシー保護。"
date: 2026-07-02
updated: 2026-07-02
featured: true
locale: ja
translationKey: deepseek-chat-export-share
tags: ["プライバシー"]
layout: "post.njk"
permalink: "/ja/posts/deepseek-chat-export-share/index.html"
---

チャットには顧客情報や未公開文案が含まれることがあります。**エクスポート・共有前にマスキング**を。

## バックアップ方法

1. **手動コピー** — 単一回答向け
2. **Markdown 要約** — 長い会話はモデルに全文要約を依頼
3. **スクリーンショット** — サイドバーのアカウント情報に注意

公式のエクスポート／共有リンクがあれば優先し、公開範囲を確認してください。

## 共有前チェックリスト

- [ ] 電話・メール・ID を削除
- [ ] 社名を「A社」等に置換
- [ ] API キー・パスワード・社内 URL を除去
- [ ] 公開範囲（公開リンク vs チーム内）

## ブラウザとアカウント

- 共有 PC ではログアウトし `chat.deepseek.com` の Cookie を削除
- 本番シークレットはチャットに貼らない
- 社内ネットワークの監査に注意

## ローカル痕跡の削除

1. ブラウザ設定 → プライバシー → サイトデータ削除
2. モバイル：タスクキル、必要なら WebView キャッシュ削除
3. クリップボード同期の有無を確認

## 関連ガイド

- [ウェブチャット入門](/ja/posts/deepseek-chat-web-basics/)
- [マルチターン文脈](/ja/posts/deepseek-multi-turn-memory/)
- [シナリオ集](/ja/posts/deepseek-chat-scenario-library/)
