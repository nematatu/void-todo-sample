# Void Todo Sample App (`void-todo-sample`)

Cloudflare と VoidZero によって発表されたフルスタック Vite フレームワーク **[Void](https://void.cloud)** (`void` + `@void/react` + `Vite+`) を使用したサンプル Todo アプリケーションです。

## ✨ 特徴 (Void の主要機能ショーケース)

- **Pages Routing (`pages/index.tsx` & `pages/index.server.ts`)**
  - `loader` によるサーバーサイドデータ取得と `InferProps<typeof loader>` によるゼロアノテーションの Props 型推論
  - 名前付き `actions` (`?create`, `?toggle`, `?delete`, `?clearCompleted`) と `@void/react` の `<Form>` / `useForm` / `action()` による型安全なミューテーション
- **File-based Server Routing (`routes/api/todos/`)**
  - Hono ベースの `defineHandler` と `defineHandler.withValidator()` による REST API エンドポイント (`GET /api/todos`, `POST /api/todos`, `PATCH /api/todos/:id`, `DELETE /api/todos/:id`)
- **Database & Schema-Derived Validation (`db/schema.ts`)**
  - `void/schema-d1` (Drizzle ORM + Cloudflare D1) による SQLite テーブル定義
  - `void/drizzle-zod` (`createInsertSchema`, `createUpdateSchema`) による DB スキーマからのバリデータ自動導出
- **Typed Fetch (`void/client`)**
  - `fetch("/api/todos")` でエンドポイントのパス・HTTPメソッド・レスポンス型をコンパイル時に完全検証

## 🚀 セットアップとローカル起動

Node.js `24.21.0` 以上が必要です。

```bash
# 依存パッケージのインストール
pnpm install

# ローカル D1 データベースのマイグレーション＆初期シードデータの投入
pnpm db:seed

# 開発サーバーの起動 (http://localhost:5173)
pnpm dev
```

## 🛠️ よく使うコマンド

```bash
# 型生成 (.void/) と TypeScript 型チェック
pnpm typecheck

# スキーマ変更から SQL マイグレーションを生成
pnpm db:generate

# 本番ビルド
pnpm build

# Cloudflare Workers へのワンコマンドデプロイ (D1 自動プロビジョニング＆マイグレーション適用)
npx void deploy
```

## 📂 ディレクトリ構成

```text
.
├── db/
│   ├── migrations/          # `void db generate` で生成される Drizzle SQL マイグレーション
│   ├── schema.ts            # D1 (SQLite) テーブル定義 & Zod バリデータスキーマ (`@schema`)
│   └── seed.ts              # `void db seed` 用の初期データ投入スクリプト
├── pages/
│   ├── index.server.ts      # サーバー Loader & Named Actions (`default`, `toggle`, `delete`, `clearCompleted`)
│   └── index.tsx            # React UI コンポーネント (`@void/react` の `Form`, `useForm`, `action`)
├── routes/
│   └── api/
│       └── todos/
│           ├── index.ts     # GET / POST `/api/todos`
│           └── [id].ts      # PATCH / DELETE `/api/todos/:id`
├── vite.config.ts           # `voidPlugin()` & `voidReact()` 設定
└── void.config.ts           # Void / Cloudflare Workers 設定
```
