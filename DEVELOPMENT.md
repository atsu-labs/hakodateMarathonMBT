# 開発ガイド

このガイドでは、Hakodate Marathon MBTアプリケーションの開発とデプロイに関する詳細な手順を提供します。

## 前提条件

- Node.js（v18以上）
- npm（v9以上）
- Cloudflareアカウント（デプロイ用）
- Wrangler CLI（依存関係に含まれています）

## 初期セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

これにより、フロントエンドとバックエンドの両方のワークスペースの依存関係がインストールされます。

### 2. Cloudflare D1データベースのセットアップ

デプロイまたはプロダクションモードで実行する前に、D1データベースを作成する必要があります：

```bash
cd backend
npx wrangler d1 create hakodate-marathon-db
```

このコマンドは次のような出力を生成します：

```
✅ Successfully created DB 'hakodate-marathon-db'!

[[d1_databases]]
binding = "DB"
database_name = "hakodate-marathon-db"
database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
```

### 3. Wrangler設定の更新

`backend/wrangler.toml`を編集して、次のフィールドを更新します：

```toml
account_id = "your-cloudflare-account-id"

[[d1_databases]]
binding = "DB"
database_name = "hakodate-marathon-db"
database_id = "your-database-id-from-step-2"
```

### 4. データベーススキーマの初期化

D1データベースにデータベーススキーマを適用します：

```bash
cd backend
npx wrangler d1 execute hakodate-marathon-db --file=./database/schema.sql
```

ローカル開発の場合は、次のように`--local`フラグを使用することもできます：

```bash
npx wrangler d1 execute hakodate-marathon-db --local --file=./database/schema.sql
```

## 開発ワークフロー

### アプリケーションの実行

#### オプション1: ビルドされたフロントエンドでバックエンドを実行（推奨）

このモードでは、Honoバックエンドを通じてフロントエンドのプロダクションビルドを提供します：

```bash
# 最初にフロントエンドをビルド
npm run build

# バックエンド開発サーバーを起動
npm run dev
```

アプリケーションは`http://localhost:8787`でアクセスできます。

#### オプション2: フロントエンドとバックエンドを個別に実行

ホットモジュールリプレースメントによる高速なフロントエンド開発の場合：

ターミナル1（フロントエンド）：
```bash
npm run dev:frontend
```

ターミナル2（バックエンド）：
```bash
npm run dev:backend
```

このモードでは：
- フロントエンド開発サーバーは`http://localhost:5173`で実行されます
- バックエンドAPIサーバーは`http://localhost:8787`で実行されます
- 必要に応じてCORSを設定するか、フロントエンド開発サーバーのプロキシを使用します

### アプリケーションのビルド

フロントエンドとバックエンドの両方をビルドします：

```bash
npm run build
```

これにより：
1. ViteでVueフロントエンドをビルド
2. 静的ファイルを`backend/public/`に出力

### プロジェクト構造

```
hakodateMarathonMBT/
├── frontend/                 # Vue + Vite フロントエンド
│   ├── src/
│   │   ├── components/      # Vueコンポーネント
│   │   │   └── HelloWorld.vue
│   │   ├── assets/          # 静的アセット（画像など）
│   │   ├── App.vue          # ルートコンポーネント
│   │   ├── main.js          # エントリーポイント
│   │   └── style.css        # グローバルスタイル
│   ├── public/              # 公開静的ファイル
│   ├── index.html           # HTMLテンプレート
│   ├── vite.config.js       # Vite設定
│   └── package.json
│
├── backend/                 # Cloudflare Workers用Honoバックエンド
│   ├── src/
│   │   └── index.js         # HonoアプリとAPIルート
│   ├── database/
│   │   └── schema.sql       # D1データベーススキーマ
│   ├── public/              # ビルドされたフロントエンドファイル（Viteで生成）
│   ├── wrangler.toml        # Cloudflare Workers設定
│   └── package.json
│
├── package.json             # ルートワークスペース設定
└── README.md
```

## APIエンドポイント

バックエンドは以下のAPIエンドポイントを提供します：

### GET /api/hello

ウェルカムメッセージを返します。

**レスポンス：**
```json
{
  "message": "Hello from Hono on Cloudflare Workers!"
}
```

### GET /api/items

D1データベースから全てのアイテムを取得します。

**レスポンス：**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Sample Item 1",
      "created_at": "2024-01-01 00:00:00"
    }
  ]
}
```

### POST /api/items

D1データベースに新しいアイテムを追加します。

**リクエストボディ：**
```json
{
  "name": "New Item"
}
```

**レスポンス：**
```json
{
  "success": true,
  "message": "Item added"
}
```

## デプロイ

### Cloudflare Workersへのデプロイ

```bash
npm run deploy
```

このコマンドは：
1. フロントエンドをビルド
2. アプリケーション全体をCloudflare Workersにデプロイ

### 初回デプロイ

1. Cloudflareにログインしていることを確認します：
```bash
cd backend
npx wrangler login
```

2. アプリケーションをデプロイします：
```bash
npm run deploy
```

3. アプリケーションは次のURLで利用可能になります：
```
https://hakodate-marathon-mbt.<your-subdomain>.workers.dev
```

## トラブルシューティング

### D1データベースが見つからない

データベースが見つからないというエラーが表示される場合：

1. データベースが作成されたことを確認します：
```bash
cd backend
npx wrangler d1 list
```

2. `wrangler.toml`に正しい`database_id`が設定されていることを確認します

3. ローカル開発の場合は、`--local`フラグを使用します：
```bash
npx wrangler dev --local
```

### 開発中のCORSの問題

フロントエンドとバックエンドを個別に実行していてCORSの問題が発生した場合：

1. `http://localhost:5173`のフロントエンド開発サーバーを使用します（バックエンドへプロキシします）
2. または、`backend/src/index.js`のバックエンドにCORSヘッダーを追加します：

```javascript
import { cors } from 'hono/cors'

app.use('/api/*', cors())
```

### ビルドが失敗する

ビルドが失敗した場合：

1. ビルドディレクトリをクリアします：
```bash
rm -rf backend/public/*
```

2. 依存関係を再インストールします：
```bash
rm -rf node_modules package-lock.json
npm install
```

3. 再ビルドします：
```bash
npm run build
```

## APIのテスト

curlまたは任意のHTTPクライアントを使用してAPIエンドポイントをテストできます：

```bash
# helloエンドポイントをテスト
curl http://localhost:8787/api/hello

# 全てのアイテムを取得
curl http://localhost:8787/api/items

# 新しいアイテムを追加
curl -X POST http://localhost:8787/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item"}'
```

## 追加リソース

- [Viteドキュメント](https://vitejs.dev/)
- [Vue 3ドキュメント](https://vuejs.org/)
- [Honoドキュメント](https://hono.dev/)
- [Cloudflare Workersドキュメント](https://developers.cloudflare.com/workers/)
- [Cloudflare D1ドキュメント](https://developers.cloudflare.com/d1/)
