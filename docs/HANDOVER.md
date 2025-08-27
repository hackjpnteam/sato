# HANDOVER（引き継ぎ）

## 1. プロジェクト概要
- **名称**: 半導体在庫売買サイト（Next.js / Vercel / MongoDB Atlas / Stripe / NextAuth）
- **目的**: 半導体の在庫売買のB2B/B2Cマーケット
- **技術スタック**: Next.js 14 (App Router), TypeScript, MongoDB, JWT認証, Tailwind CSS
- **リポジトリ**: https://github.com/hackjpnteam/sato

## 2. 主要連絡先 / 権限
- **プロダクトオーナー**: 戸村 光（team@hackjpn.com）
- **Vercel オーナー**: （追記）
- **MongoDB Atlas オーナー**: （追記）
- **Stripe オーナー**: （追記）
- **Oncall**: （追記）

## 3. 環境とデプロイ
- **本番URL**: （追記）
- **ステージングURL**: （追記）
- **デプロイ**: GitHub → Vercel 自動デプロイ
- **ENV管理**: 
  - ローカル: `.env.example` → `.env.local`
  - 本番: Vercel Project Environment Variables
- **機密情報の取扱い**: （Vault/1Password 等 - 追記）

## 4. アーキテクチャ要点
- **App Router**: Next.js 14 の最新ルーティング
- **主要API**: 
  - `/api/auth/*` - JWT認証システム
  - `/api/listings` - 商品出品・検索
  - `/api/cart` - カート機能
  - `/api/admin/*` - 管理機能
- **DB構造**: 
  - `users` - ユーザー情報（buyer/seller/admin）
  - `listings` - 商品出品
  - `carts` - カート内容
  - `questions` - 商品への質問
- **認証**: JWT + Cookie ベース
- **決済**: Stripe連携（今後実装予定）

## 5. 運用の勘所（必読）
- **認証は Node ランタイムで Cookie 参照**（Edge不可）
- **API は `export const dynamic = 'force-dynamic'` + `revalidate = 0` 必須**
- **トップレベルで `cookies()`/`headers()`/`auth()` を呼ばない**
- **`request.cookies` 使用禁止** → `cookies()` from `next/headers` を使用
- **DB のインデックス/制約**: （追記 - インデックス設計書）

## 6. よくある障害と対処
- **DYNAMIC_SERVER_USAGE エラー** → `cookies()` + `force-dynamic` + `runtime="nodejs"`
- **Set スプレッド構文エラー** → 書き換え or `downlevelIteration: true`
- **Stripe Webhook エラー** → シークレット確認/再送手順
- **認証エラー** → JWT_SECRET 確認、Cookie 設定確認
- **MongoDB 接続エラー** → MONGODB_URI 確認、Atlas IP制限確認

## 7. 未決事項 / TODO
- [ ] Cart スキーマの型厳密化（`as any` 解消）
- [ ] 商品画像アップロード機能
- [ ] Stripe 決済統合
- [ ] 在庫アラート機能
- [ ] パフォーマンス最適化
- [ ] テストカバレッジ向上

## 8. 監視/ログ
- **Vercel Logs**: デプロイ・実行ログ
- **Sentry**: （設定予定 - リンク追記）
- **Datadog**: （設定予定 - リンク追記）
- **アラート設定**: （追記）

## 9. セキュリティ
- **JWT認証**: 秘密鍵管理重要
- **パスワードハッシュ**: bcrypt 使用
- **RBAC**: role ベースアクセス制御
- **入力バリデーション**: Zod スキーマ
- **XSS対策**: Next.js 組み込み保護

## 10. バックアップ・復旧
- **MongoDB Atlas**: 自動バックアップ設定確認
- **コード**: Git 履歴
- **設定**: Vercel 環境変数のバックアップ
- **復旧手順**: （追記）