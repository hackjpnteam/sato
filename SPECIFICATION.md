# 半導体マーケットプレイス システム仕様書

## 1. プロジェクト概要

### 1.1 システム名
**半導体マーケットプレイス** - 半導体部品のC2B/B2Bマーケットプレイスプラットフォーム

### 1.2 システム概要
半導体部品の在庫売買を仲介するマーケットプレイスシステム。出品者（セラー）と購入者（バイヤー）を結び、安全で効率的な取引を実現します。

### 1.3 技術スタック
- **フロントエンド**: Next.js 14.2.32 (App Router)
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL (Prisma ORM)
- **認証**: NextAuth.js v4 (JWT)
- **決済**: Stripe Connect
- **UI**: Tailwind CSS + Radix UI
- **開発言語**: TypeScript
- **デプロイ**: Vercel (想定)

## 2. システムアーキテクチャ

### 2.1 全体構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   Database      │
│   (Next.js)     │◄──►│   Routes        │◄──►│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Stripe        │    │   NextAuth      │    │   Prisma ORM    │
│   (決済)        │    │   (認証)        │    │   (DB操作)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 ディレクトリ構造
```
semiconductor-marketplace/
├── src/
│   ├── app/                    # App Router
│   │   ├── api/               # API Routes
│   │   ├── admin/             # 管理者画面
│   │   ├── auth/              # 認証画面
│   │   ├── buyer/             # 購入者向けページ
│   │   ├── seller/            # 出品者向けページ
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # 共通コンポーネント
│   ├── lib/                   # ユーティリティ・設定
│   └── types/                 # TypeScript型定義
├── prisma/                    # データベーススキーマ
├── scripts/                   # データベース管理スクリプト
└── package.json
```

## 3. データベース設計

### 3.1 主要エンティティ

#### ユーザー (User)
- **ID**: 一意識別子
- **Email**: メールアドレス（ユニーク）
- **PasswordHash**: ハッシュ化パスワード
- **Roles**: 複数ロール配列 (admin, operator, seller, buyer)
- **CompanyName**: 会社名
- **CompanyAddress**: 会社住所
- **ContactPerson**: 担当者名
- **PhoneNumber**: 電話番号
- **TaxId**: 法人番号
- **BusinessLicense**: 事業許可証番号
- **StripeCustomerId**: Stripe顧客ID

#### セラープロフィール (SellerProfile)
- **ID**: 一意識別子
- **UserId**: ユーザーID（外部キー）
- **StripeConnectId**: Stripe Connect ID
- **PayoutsEnabled**: 振込有効化フラグ
- **KycStatus**: KYCステータス (pending, verified, restricted)
- **Tier**: セラーティア (T0, T1, T2)
- **ListingCap**: 出品上限数
- **HoldDays**: 入金保留日数
- **統計情報**: 総注文数、完了注文数、平均評価等

#### 出品 (Listing)
- **ID**: 一意識別子
- **Mpn**: 部品番号（MPN）
- **Quantity**: 数量
- **DateCode**: デートコード
- **SourceRoute**: 入手経路
- **Warranty**: 保証有無
- **PricePerUnitJPY**: 単価（円）
- **Photos**: 写真URL配列
- **Description**: 説明
- **Status**: 出品ステータス (pending, listed, rejected, suspended)
- **SellerId**: 出品者ID

#### 注文 (Order)
- **ID**: 一意識別子
- **OrderNumber**: 注文番号（ユニーク）
- **BuyerId**: 購入者ID
- **ListingId**: 出品ID
- **Quantity**: 購入数量
- **UnitPriceJPY**: 購入時単価
- **TotalJPY**: 合計金額
- **ApplicationFeeJPY**: 手数料
- **SellerAmountJPY**: 売主受取額
- **StripePaymentIntentId**: Stripe決済ID
- **StripeCheckoutSessionId**: StripeチェックアウトID
- **Status**: 注文ステータス

### 3.2 セラーティア制
| ティア | 出品上限 | 入金保留日数 | 説明 |
|--------|----------|--------------|------|
| T0     | 10件     | 7日          | 新規出品者 |
| T1     | 50件     | 3日          | 中級出品者 |
| T2     | 100件    | 0日          | 上級出品者 |

## 4. API設計

### 4.1 認証API
```
POST /api/auth/register    # ユーザー登録
POST /api/auth/login       # ログイン
POST /api/auth/logout      # ログアウト
GET  /api/auth/me          # 現在のユーザー情報
```

### 4.2 出品API
```
GET    /api/listings       # 出品一覧取得
POST   /api/listings       # 出品作成
GET    /api/listings/[id]  # 出品詳細取得
PATCH  /api/listings/[id]  # 出品更新
DELETE /api/listings/[id]  # 出品削除
```

### 4.3 注文API
```
POST   /api/orders         # 注文作成
GET    /api/orders/[id]    # 注文詳細取得
PATCH  /api/orders/[id]    # 注文ステータス更新
```

### 4.4 管理者API
```
GET    /api/admin/users    # ユーザー一覧
POST   /api/admin/users    # ユーザー作成
GET    /api/sellers        # 出品者一覧
```

## 5. 認証・認可システム

### 5.1 NextAuth.js 設定
- **認証方式**: JWT (HttpOnly Cookie)
- **プロバイダー**: Credentials Provider
- **セッション戦略**: JWT
- **アダプター**: Prisma Adapter

### 5.2 ロールベースアクセス制御 (RBAC)
- **admin**: 全機能アクセス可能
- **operator**: 注文管理・出品審査
- **seller**: 出品・売上管理
- **buyer**: 購入・注文確認

### 5.3 権限チェック
```typescript
// 認証ガード関数
export function requireAuth(allowedRoles: string[]) {
  // JWT認証チェック
  // ロール権限チェック
  // アクセス制御
}
```

## 6. 決済システム

### 6.1 Stripe統合
- **購入者決済**: Stripe Payment Intents
- **出品者振込**: Stripe Connect
- **Webhook処理**: 決済状況の自動更新
- **手数料計算**: プラットフォーム手数料（8%）

### 6.2 決済フロー
1. **注文作成**: 購入者が注文
2. **決済処理**: Stripeで即座に決済
3. **在庫減算**: 注文確定時に在庫を減算
4. **振込処理**: 商品発送後に出品者へ振込

### 6.3 手数料体系
- **出品手数料**: 無料
- **販売手数料**: 売上の8%（最低100円）
- **振込手数料**: 無料
- **返金手数料**: 無料

## 7. ユーザーインターフェース

### 7.1 デザインシステム
- **フレームワーク**: Tailwind CSS
- **コンポーネント**: Radix UI + カスタムコンポーネント
- **アイコン**: Lucide React
- **フォント**: Inter (Google Fonts)

### 7.2 レスポンシブデザイン
- **モバイルファースト**: 最小320px対応
- **ブレークポイント**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **グリッドシステム**: CSS Grid + Flexbox

### 7.3 主要画面構成
- **ホームページ**: サービス紹介・登録・ログイン
- **出品者ダッシュボード**: 出品管理・売上確認
- **購入者ダッシュボード**: 注文履歴・検索
- **管理者ダッシュボード**: システム管理・監視

## 8. セキュリティ対策

### 8.1 認証・認可
- **JWT認証**: HttpOnly Cookie使用
- **パスワードハッシュ**: bcryptjs
- **CSRF保護**: NextAuth.js内蔵
- **レート制限**: API制限（実装予定）

### 8.2 データ保護
- **入力検証**: Zod スキーマバリデーション
- **SQL インジェクション**: Prisma ORM使用
- **XSS対策**: React エスケープ
- **HTTPS強制**: 本番環境

### 8.3 決済セキュリティ
- **PCI DSS準拠**: Stripe処理
- **決済情報非保存**: カード情報はStripe側のみ
- **Webhook署名検証**: Stripe Webhook

## 9. パフォーマンス最適化

### 9.1 フロントエンド
- **Next.js最適化**: App Router使用
- **画像最適化**: Next.js Image Component
- **コード分割**: 動的インポート
- **キャッシュ戦略**: 適切なキャッシュ設定

### 9.2 データベース
- **インデックス最適化**: 検索・結合用インデックス
- **クエリ最適化**: Prisma ORM効率化
- **コネクション管理**: プール設定

### 9.3 API最適化
- **レスポンス圧縮**: Gzip/Brotli
- **キャッシュヘッダー**: ETag/Last-Modified
- **ページネーション**: 大量データ対応

## 10. 監視・ログ

### 10.1 監査ログ
- **操作ログ**: 全重要操作を記録
- **アクセスログ**: ユーザーアクセス履歴
- **エラーログ**: システムエラー記録

### 10.2 監視項目
- **システム稼働率**: 99.9%以上目標
- **レスポンス時間**: 平均200ms以下
- **エラー率**: 0.1%以下
- **決済成功率**: 99%以上

## 11. 運用・保守

### 11.1 デプロイメント
- **CI/CD**: GitHub Actions + Vercel
- **環境分離**: 開発・ステージング・本番
- **ロールバック**: 即座に前版へ戻せる仕組み

### 11.2 バックアップ
- **データベース**: 日次バックアップ
- **コード**: Git管理
- **設定**: 環境変数管理

### 11.3 障害対応
- **監視アラート**: 重要指標の監視
- **障害復旧**: 自動復旧機能
- **サポート体制**: 24時間対応体制

## 12. 将来拡張計画

### 12.1 機能拡張
- **AI在庫最適化**: 需要予測・自動価格調整
- **API提供**: 外部システム連携
- **モバイルアプリ**: React Native対応

### 12.2 スケーラビリティ
- **マイクロサービス化**: サービス分割
- **CDN導入**: 静的コンテンツ配信
- **分散データベース**: 読み取り専用レプリカ

---

**文書作成日**: 2024年12月
**バージョン**: 1.0
**作成者**: 開発チーム
