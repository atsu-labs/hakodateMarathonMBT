# hakodateMarathonMBT

Vite + Vue（フロントエンド）とHono（バックエンド）で構築されたシングルページアプリケーション（SPA）です。Cloudflare WorkersとD1データベースにデプロイ可能です。

## プロジェクト構造

```
.
├── frontend/          # Vite + Vue フロントエンド
│   ├── src/
│   │   ├── components/
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── vite.config.js
├── backend/           # Cloudflare Workers用Honoバックエンド
│   ├── src/
│   │   └── index.js
│   ├── database/
│   │   └── schema.sql
│   ├── public/        # ビルドされたフロントエンドファイル（生成されます）
│   └── wrangler.toml
└── package.json       # ルートワークスペース設定
```

## セットアップ

1. 依存関係をインストールします：
```bash
npm install
```

2. D1データベースを作成します（Cloudflareアカウントが必要です）：
```bash
cd backend
npx wrangler d1 create hakodate-marathon-db
```

3. 前のステップで取得したCloudflareアカウントIDとD1データベースIDを`backend/wrangler.toml`に設定します。

4. データベーススキーマを初期化します：
```bash
cd backend
npx wrangler d1 execute hakodate-marathon-db --file=./database/schema.sql
```

## 開発

### バックエンド開発サーバーを実行（フロントエンドプロキシを含む）：
```bash
npm run dev
```

### フロントエンド開発サーバーを個別に実行：
```bash
npm run dev:frontend
```

### バックエンド開発サーバーを個別に実行：
```bash
npm run dev:backend
```

アプリケーションは`http://localhost:8787`（バックエンド）または`http://localhost:5173`（フロントエンド開発サーバー）で利用可能です。

## ビルド

フロントエンドとバックエンドの両方をビルドします：
```bash
npm run build
```

これにより：
1. ViteでVueフロントエンドをビルド
2. 静的ファイルを`backend/public/`に出力

## デプロイ

Cloudflare Workersにデプロイします：
```bash
npm run deploy
```

これによりフロントエンドをビルドし、アプリケーション全体をCloudflare Workersにデプロイします。

## 使用技術

- **フロントエンド**: Vite、Vue 3
- **バックエンド**: Hono
- **データベース**: Cloudflare D1（SQLite）
- **プラットフォーム**: Cloudflare Workers
- **パッケージマネージャー**: npm with workspaces

## APIエンドポイント

- `GET /api/hello` - ウェルカムメッセージを返します
- `GET /api/items` - D1データベースから全てのアイテムを取得します
- `POST /api/items` - D1データベースに新しいアイテムを追加します（ボディ: `{ "name": "item name" }`）

## 注意事項

- フロントエンドは`backend/public/`ディレクトリから静的ファイルとして提供されます
- バックエンドはAPIルート（`/api/*`）とSPAの両方を処理します
- D1データベースバインディングは`wrangler.toml`で設定されます