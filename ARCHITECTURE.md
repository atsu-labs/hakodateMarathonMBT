# アーキテクチャ概要

このプロジェクトは、2つの独立したSPA（シングルページアプリケーション）で構成されています。

## 2つのSPA構成

### 1. PC管理ページ（frontend-admin）

**URL**: `/admin`

**目的**: デスクトップ環境での管理操作

**機能**:
- ダッシュボード（`/admin/`）
  - システム統計情報の表示
  - 総アイテム数の表示
  - 最終更新時刻の表示
- アイテム管理（`/admin/items`）
  - アイテムの追加
  - アイテム一覧の表示
  - アイテムの管理

**技術スタック**:
- Vue 3
- Vue Router（ベースパス: `/admin`）
- Vite
- デスクトップ向けレスポンシブデザイン

**ビルド出力**: `backend/public/admin/`

### 2. モバイル閲覧ページ（frontend-mobile）

**URL**: `/`（ルート）

**目的**: スマートフォンでの閲覧

**機能**:
- ホーム（`/`）
  - ウェルカムメッセージ
  - アプリ概要
  - ナビゲーション
- アイテム一覧（`/items`）
  - アイテムの閲覧
  - モバイル最適化された表示

**技術スタック**:
- Vue 3
- Vue Router（ベースパス: `/`）
- Vite
- モバイルファーストデザイン
- タッチ操作最適化

**ビルド出力**: `backend/public/mobile/`

## バックエンドルーティング

Honoバックエンドは以下のように両SPAをルーティングします：

```javascript
// API routes
app.get('/api/*', ...)
app.post('/api/*', ...)

// Admin SPA (PC管理ページ)
app.use('/*', serveStatic({ root: './' }))
app.get('/admin/*', serveStatic({ path: './admin/index.html' }))

// Mobile SPA (モバイル閲覧ページ) - デフォルト
app.get('*', serveStatic({ path: './mobile/index.html' }))
```

## 開発ワークフロー

### 両方のSPAを同時に開発

1. 両方のフロントエンドをビルド:
   ```bash
   npm run build
   ```

2. バックエンド開発サーバーを起動:
   ```bash
   npm run dev
   ```

3. アクセス:
   - PC管理ページ: http://localhost:8787/admin
   - モバイルページ: http://localhost:8787/

### 個別のSPA開発

#### PC管理ページのみ開発:
```bash
npm run dev:admin
# http://localhost:5173 でアクセス
```

#### モバイルページのみ開発:
```bash
npm run dev:mobile
# http://localhost:5173 でアクセス
```

> **注意**: 個別開発時もAPIアクセスのため、別ターミナルでバックエンドを起動する必要があります。

## デプロイ

両方のSPAは単一のCloudflare Workersインスタンスにデプロイされます：

```bash
npm run deploy
```

これにより:
1. `frontend-admin`が`backend/public/admin/`にビルド
2. `frontend-mobile`が`backend/public/mobile/`にビルド
3. バックエンドとすべての静的アセットがCloudflare Workersにデプロイ

## ディレクトリ構造

```
hakodateMarathonMBT/
├── frontend-admin/          # PC管理SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.vue
│   │   │   └── ItemManagement.vue
│   │   ├── App.vue
│   │   ├── main.js         # Vue Router設定（/admin ベース）
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js      # outDir: ../backend/public/admin
│   └── package.json
├── frontend-mobile/         # モバイル閲覧SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.vue
│   │   │   └── ItemList.vue
│   │   ├── App.vue
│   │   ├── main.js         # Vue Router設定（/ ベース）
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js      # outDir: ../backend/public/mobile
│   └── package.json
└── backend/
    ├── public/
    │   ├── admin/          # ビルドされたPC管理SPA
    │   └── mobile/         # ビルドされたモバイルSPA
    └── src/
        └── index.js        # ルーティング設定
```

## 利点

1. **明確な責任分離**: 管理機能と閲覧機能が完全に分離
2. **最適化されたUX**: 各デバイスタイプに最適化されたUI/UX
3. **独立した開発**: 各SPAを独立して開発・テスト可能
4. **単一デプロイ**: 単一のバックエンドで両方のSPAを提供
5. **コード再利用**: APIクライアントなどの共通コードを共有可能
