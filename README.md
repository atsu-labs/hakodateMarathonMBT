# hakodateMarathonMBT

Vite + Vue（フロントエンド）とHono（バックエンド）で構築された、2つの独立したシングルページアプリケーション（SPA）です。PC用の管理ページとモバイル閲覧用ページを提供します。Cloudflare WorkersとD1データベースにデプロイ可能です。

## アプリケーション構成

### PC管理ページ（/admin）
- ダッシュボード
- アイテム管理機能
- デスクトップ向けUI

### モバイル閲覧ページ（/）
- ホーム画面
- アイテム一覧
- モバイル最適化UI

## プロジェクト構造

```
.
├── frontend-admin/    # PC管理用SPA（Vue + Vite）
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.vue
│   │   │   └── ItemManagement.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── vite.config.js
├── frontend-mobile/   # モバイル閲覧用SPA（Vue + Vite）
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.vue
│   │   │   └── ItemList.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── vite.config.js
├── frontend/          # 旧フロントエンド（後方互換性のため保持）
├── backend/           # Cloudflare Workers用Honoバックエンド
│   ├── src/
│   │   └── index.js
│   ├── database/
│   │   └── schema.sql
│   ├── public/        # ビルドされたフロントエンドファイル（生成されます）
│   │   ├── admin/     # PC管理ページ
│   │   └── mobile/    # モバイル閲覧ページ
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

### 推奨: バックエンド開発サーバーを実行
```bash
# フロントエンドをビルドしてから実行
npm run build
npm run dev
```

バックエンドが起動したら：
- PC管理ページ: `http://localhost:8787/admin`
- モバイル閲覧ページ: `http://localhost:8787/`

### フロントエンド開発サーバーを個別に実行

#### PC管理ページの開発：
```bash
npm run dev:admin
```
`http://localhost:5173`でアクセス可能

#### モバイル閲覧ページの開発：
```bash
npm run dev:mobile
```
`http://localhost:5173`でアクセス可能

> **注意**: フロントエンドを個別に実行する場合、APIリクエストのため、別ターミナルでバックエンドも起動する必要があります。

## ビルド

両方のフロントエンド（管理用とモバイル用）をビルドします：
```bash
npm run build
```

これにより：
1. ViteでPC管理用Vueフロントエンドをビルド → `backend/public/admin/`
2. ViteでモバイルVueフロントエンドをビルド → `backend/public/mobile/`

## デプロイ

Cloudflare Workersにデプロイします：
```bash
npm run deploy
```

これによりフロントエンドをビルドし、アプリケーション全体をCloudflare Workersにデプロイします。

## 使用技術

- **フロントエンド**: Vite、Vue 3、Vue Router
- **バックエンド**: Hono
- **データベース**: Cloudflare D1（SQLite）
- **プラットフォーム**: Cloudflare Workers
- **パッケージマネージャー**: npm with workspaces

## APIエンドポイント

- `GET /api/hello` - ウェルカムメッセージを返します
- `GET /api/items` - D1データベースから全てのアイテムを取得します
- `POST /api/items` - D1データベースに新しいアイテムを追加します（ボディ: `{ "name": "item name" }`）

## 注意事項

- PC管理ページは`/admin`パスから、モバイルページはルート`/`から提供されます
- フロントエンドは`backend/public/admin/`と`backend/public/mobile/`ディレクトリから静的ファイルとして提供されます
- バックエンドはAPIルート（`/api/*`）と両方のSPAを処理します
- D1データベースバインディングは`wrangler.toml`で設定されます
- 各SPAは独立したVue Routerインスタンスを持ち、異なるベースパスで動作します