# デプロイメントノート

## 実装概要

このプロジェクトは、単一のバックエンドで2つの独立したSPA（シングルページアプリケーション）を提供するように更新されました。

### 実装されたSPA

1. **PC管理ページ** (`/admin`)
   - ビルド先: `backend/public/admin/`
   - ベースパス: `/admin`
   - 用途: デスクトップ環境での管理操作

2. **モバイル閲覧ページ** (`/`)
   - ビルド先: `backend/public/mobile/`
   - ベースパス: `/`
   - 用途: スマートフォンでの閲覧

## デプロイ前の確認事項

### 1. ビルドの実行

デプロイ前に必ず両方のフロントエンドをビルドしてください：

```bash
npm run build
```

このコマンドは以下を実行します：
- `frontend-admin` を `backend/public/admin/` にビルド
- `frontend-mobile` を `backend/public/mobile/` にビルド

### 2. Cloudflare Workers設定

`backend/wrangler.toml` に以下が正しく設定されていることを確認：

```toml
[site]
bucket = "./public"
```

この設定により、Wranglerは `backend/public/` ディレクトリ全体（`admin/` と `mobile/` の両方を含む）を静的アセットとして扱います。

### 3. D1データベース設定

`backend/wrangler.toml` のD1データベース設定を確認：

```toml
[[d1_databases]]
binding = "DB"
database_name = "hakodate-marathon-db"
database_id = "your-database-id-here"
```

## デプロイ手順

### 本番環境へのデプロイ

```bash
npm run deploy
```

このコマンドは以下を実行します：
1. 両方のフロントエンドをビルド（`npm run build`）
2. Cloudflare Workersにデプロイ（`wrangler deploy`）

### デプロイ後の確認

デプロイ完了後、以下のURLで動作確認を行ってください：

1. **PC管理ページ**: `https://your-worker.workers.dev/admin`
   - ダッシュボードが表示されること
   - アイテム管理ページにアクセスできること
   - APIが正常に動作すること

2. **モバイルページ**: `https://your-worker.workers.dev/`
   - ホーム画面が表示されること
   - アイテム一覧にアクセスできること
   - モバイルUIが適切に表示されること

3. **API**: `https://your-worker.workers.dev/api/hello`
   - JSONレスポンスが返ること

## ローカル開発とテスト

### ビルド済みSPAのテスト

```bash
# 1. ビルド
npm run build

# 2. ローカルで起動
npm run dev

# 3. ブラウザでアクセス
# - PC管理: http://localhost:8787/admin
# - モバイル: http://localhost:8787/
```

### 個別SPA開発

#### PC管理ページの開発:
```bash
# ターミナル1: バックエンド
cd backend
npm run dev

# ターミナル2: フロントエンド
npm run dev:admin
# http://localhost:5173 でアクセス
```

#### モバイルページの開発:
```bash
# ターミナル1: バックエンド
cd backend
npm run dev

# ターミナル2: フロントエンド
npm run dev:mobile
# http://localhost:5173 でアクセス
```

## 既知の制限事項

### 開発環境での制限

1. **serveStatic の制限**: 
   - Honoの `serveStatic` は Cloudflare Workers環境で `__STATIC_CONTENT_MANIFEST` を必要とします
   - ローカル開発では、この manifest は Wrangler によって自動生成されます
   - 両SPAが正常に動作することを確認するには、ビルド後にバックエンドを起動する必要があります

2. **CORS設定**:
   - フロントエンドとバックエンドを個別に実行する場合、CORSの問題が発生する可能性があります
   - 必要に応じて `backend/src/index.js` にCORSミドルウェアを追加してください

### 本番環境での考慮事項

1. **キャッシュ戦略**: 
   - 静的アセット（CSS、JS）には長期キャッシュを設定
   - `index.html` には短期キャッシュまたはno-cacheを設定

2. **カスタムドメイン**:
   - カスタムドメインを使用する場合、両方のSPAが正しいパスで動作することを確認
   - 特に `/admin` パスが正しくルーティングされることを確認

## トラブルシューティング

### SPAが表示されない

1. ビルドが正しく実行されたか確認:
   ```bash
   ls -la backend/public/admin/
   ls -la backend/public/mobile/
   ```

2. `wrangler.toml` の `[site]` 設定を確認

3. デプロイログを確認:
   ```bash
   cd backend
   npx wrangler deploy --verbose
   ```

### APIが動作しない

1. D1データベースが正しく設定されているか確認
2. `wrangler.toml` のデータベースバインディングを確認
3. Cloudflareダッシュボードでデータベースの状態を確認

### ルーティングの問題

1. バックエンドの `index.js` でルーティング順序を確認
2. API routes が静的ファイル提供より先に定義されているか確認

## 追加リソース

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

## サポート

問題が発生した場合は、以下を含めてissueを作成してください：
- エラーメッセージ
- 実行したコマンド
- 環境情報（OS、Node.jsバージョンなど）
- ブラウザのコンソールエラー（該当する場合）
