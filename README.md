# Japan SME Makers — ニッポンメイカーズ

外国人向け 日本の中小ものづくり企業ディレクトリ。北海道から沖縄まで 1,179 社（うち約540社は実在検証済）、15カテゴリで検索できます。

A directory of Japanese small & medium manufacturers (SMEs), aimed at international buyers and visitors. Covers all 47 prefectures and 15 categories (cosmetics, supplements, tea, apparel, electronics, patent products, Edo Kiriko, Tsubame-Sanjo cutlery, etc.).

## 特徴 / Features
- 🇯🇵🇬🇧 日英完全対応 / Full Japanese-English UI
- 🔎 都道府県・カテゴリ・キーワードで絞り込み / Filter by prefecture, category, keyword
- 🌐 各社公式サイト・Google検索リンク / Official URL or Google search per company
- ➕ ホームページURLから会社を自動追加（OGP取得） / Add companies by URL with OGP fetch
- 📷 写真アップロード対応 / Photo upload
- ⚠ 上場・大手・外資企業の自動判定で警告 / Auto-warning for listed / large / foreign-owned firms
- 🗑 削除・復元機能 / Delete & restore
- ★ お気に入り / Favorites（LocalStorage保存）

## 技術構成 / Tech
- Pure static HTML / CSS / JavaScript（バックエンド不要）
- LocalStorage でユーザー追加・お気に入り・削除状態を保持
- 4段フォールバックの公開 CORS プロキシ（AllOrigins / corsproxy.io / codetabs / Wayback Machine）でホームページOGP取得

## ローカル実行 / Run locally
`index.html` をダブルクリック、またはブラウザにドラッグ&ドロップするだけです。
Double-click `index.html` or drop into any modern browser.

## データの精度について / Data accuracy
- 約540社は実在検証済 (`verified: true`)
- 残りは地域産業特性に基づく代表例（社名・URL等は要確認）
- 誤りに気付いたら `data*.js` / `data_urls.js` を編集してください

## ライセンス
MIT
