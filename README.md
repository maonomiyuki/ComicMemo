# ComicMemo MVP

漫画作画向けのスマホ優先タスク管理PWAです。Next.js + Supabaseで実装しています。

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 画面

- `/` Dashboard
- `/log` 今日の報告
- `/tasks` チェックリスト編集
- `/settings` プロジェクト設定
- `/auth` メールOTPログイン

## DB

`supabase/schema.sql` を Supabase SQL Editor で実行してください。

## GitHub Pages 公開手順

1. GitHub の `Settings -> Pages` を開く。
2. `Source` を **GitHub Actions** に変更する（`Deploy from a branch` は使わない）。
3. main へ push すると `.github/workflows/deploy-pages.yml` が動作し、`out/` を Pages にデプロイする。
4. 公開URL: `https://maonomiyuki.github.io/ComicMemo/`

### 補足

- `next.config.ts` で `output: 'export'`, `basePath: '/ComicMemo'`, `assetPrefix: '/ComicMemo/'`, `trailingSlash: true` を有効化しています（GitHub Actions実行時）。
- そのため Pages 配下でも CSS/JS/画像のパスが崩れない構成です。
