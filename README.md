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
- `/auth` Supabase Auth UI

## DB

`supabase/schema.sql` を Supabase SQL Editor で実行してください。
