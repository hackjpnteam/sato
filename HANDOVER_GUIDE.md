# 半導体マーケットプレイス エンジニア引き継ぎガイド

## 1. プロジェクト概要

### 1.1 システム概要
半導体部品の在庫売買を仲介するB2Bマーケットプレイスシステムです。Next.js 14 + PostgreSQL + Stripeで構築されています。

### 1.2 技術スタック
- **フロントエンド**: Next.js 14.2.32 (App Router)
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL + Prisma ORM
- **認証**: NextAuth.js v4 (JWT)
- **決済**: Stripe Connect
- **UI**: Tailwind CSS + Radix UI
- **開発言語**: TypeScript

## 2. 開発環境セットアップ

### 2.1 必要なツール
```bash
# Node.js (v18以上)
node --version

# npm または yarn
npm --version

# Git
git --version

# PostgreSQL (ローカル開発用)
# Docker または PostgreSQL直接インストール
```

### 2.2 環境変数設定
`.env.local`ファイルを作成し、以下を設定してください：

```env
# データベース
DATABASE_URL="postgresql://username:password@localhost:5432/semiconductor_marketplace"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECT_CLIENT_ID="ca_..."

# その他
NODE_ENV="development"
```

### 2.3 依存関係インストール
```bash
npm install
# または
yarn install
```

### 2.4 データベースセットアップ
```bash
# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:push

# シードデータ投入（オプション）
npm run db:seed

# Prisma Studio起動（データベース確認用）
npm run db:studio
```

### 2.5 開発サーバー起動
```bash
npm run dev
```

## 3. プロジェクト構造

### 3.1 ディレクトリ構成
```
semiconductor-marketplace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # 認証関連API
│   │   │   ├── listings/      # 出品関連API
│   │   │   ├── orders/        # 注文関連API
│   │   │   ├── admin/         # 管理者API
│   │   │   └── ...
│   │   ├── admin/             # 管理者画面
│   │   ├── auth/              # 認証画面
│   │   ├── buyer/             # 購入者向けページ
│   │   ├── seller/            # 出品者向けページ
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # 共通コンポーネント
│   │   ├── ui/               # 基本UIコンポーネント
│   │   ├── header.tsx        # ヘッダー
│   │   ├── footer.tsx        # フッター
│   │   └── providers.tsx     # プロバイダー
│   ├── lib/                   # ユーティリティ・設定
│   │   ├── auth.ts           # NextAuth設定
│   │   ├── prisma.ts         # Prismaクライアント
│   │   ├── utils.ts          # ユーティリティ関数
│   │   └── validate.ts       # Zodバリデーション
│   └── types/                 # TypeScript型定義
├── prisma/                    # データベーススキーマ
│   ├── schema.prisma         # Prismaスキーマ
│   └── seed.ts               # シードデータ
├── scripts/                   # データベース管理スクリプト
└── package.json
```

### 3.2 重要なファイル
- `prisma/schema.prisma`: データベーススキーマ定義
- `src/lib/auth.ts`: NextAuth.js設定
- `src/lib/prisma.ts`: Prismaクライアント設定
- `src/app/layout.tsx`: アプリケーションルートレイアウト
- `src/components/providers.tsx`: アプリケーション全体のプロバイダー

## 4. データベース設計

### 4.1 主要テーブル
- **User**: ユーザー情報（email, roles, company等）
- **SellerProfile**: 出品者プロフィール（KYC, ティア制等）
- **Listing**: 出品情報（MPN, 数量, 価格等）
- **Order**: 注文情報（購入者, 数量, 決済状況等）
- **Refund**: 返金情報
- **Payout**: 振込情報
- **AuditLog**: 監査ログ

### 4.2 重要なリレーション
```prisma
// ユーザーと出品者の関係
User -> SellerProfile (1:1)

// ユーザーと出品の関係
User -> Listing (1:many)

// 出品と注文の関係
Listing -> Order (1:many)

// 注文と返金/振込の関係
Order -> Refund (1:many)
Order -> Payout (1:many)
```

### 4.3 セラーティア制
- **T0**: 出品上限10件、入金保留7日（新規出品者）
- **T1**: 出品上限50件、入金保留3日（中級出品者）
- **T2**: 出品上限100件、入金保留0日（上級出品者）

## 5. 認証・認可システム

### 5.1 NextAuth.js設定
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [CredentialsProvider],
  callbacks: {
    jwt: // JWTトークン処理
    session: // セッション処理
  }
}
```

### 5.2 ロールベースアクセス制御
- **admin**: 全機能アクセス可能
- **operator**: 注文管理・出品審査
- **seller**: 出品・売上管理
- **buyer**: 購入・注文確認

### 5.3 認証ガード
```typescript
// src/lib/guard.ts
export function requireAuth(allowedRoles: string[]) {
  // JWT認証チェック
  // ロール権限チェック
  // アクセス制御
}
```

## 6. API設計

### 6.1 API Routes構造
```
src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth.js
│   ├── register/route.ts         # ユーザー登録
│   └── me/route.ts               # 現在のユーザー
├── listings/
│   ├── route.ts                  # 出品一覧・作成
│   └── [id]/route.ts             # 出品詳細・更新・削除
├── orders/
│   ├── route.ts                  # 注文作成
│   └── [id]/route.ts             # 注文詳細・更新
└── admin/
    └── users/route.ts            # ユーザー管理
```

### 6.2 共通パターン
```typescript
// API Route の基本構造
export async function GET(request: NextRequest) {
  try {
    // 1. 認証チェック
    const authResult = requireAuth(['buyer', 'seller', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    // 2. パラメータ取得
    const { searchParams } = new URL(request.url)
    
    // 3. バリデーション
    const validationResult = SomeSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json({ error: 'バリデーションエラー' }, { status: 400 })
    }
    
    // 4. ビジネスロジック実行
    const result = await someBusinessLogic()
    
    // 5. レスポンス返却
    return NextResponse.json({ data: result })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: '内部エラー' }, { status: 500 })
  }
}
```

## 7. 決済システム

### 7.1 Stripe統合
- **購入者決済**: Stripe Payment Intents
- **出品者振込**: Stripe Connect
- **Webhook処理**: 決済状況の自動更新

### 7.2 決済フロー
1. 注文作成 → Stripe Payment Intent作成
2. 決済実行 → 在庫減算（トランザクション）
3. 商品発送 → 振込処理（Stripe Connect）

### 7.3 手数料計算
```typescript
// 手数料計算例
const totalAmount = quantity * unitPrice
const applicationFee = Math.max(totalAmount * 0.08, 100) // 8%、最低100円
const sellerAmount = totalAmount - applicationFee
```

## 8. フロントエンド設計

### 8.1 コンポーネント構造
```
src/components/
├── ui/                    # 基本UIコンポーネント（Radix UI）
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── header.tsx            # ヘッダーコンポーネント
├── footer.tsx            # フッターコンポーネント
└── providers.tsx         # アプリケーション全体のプロバイダー
```

### 8.2 ページ構造
```
src/app/
├── page.tsx              # ホームページ
├── listings/
│   ├── page.tsx          # 出品一覧
│   └── [id]/page.tsx     # 出品詳細
├── admin/
│   ├── page.tsx          # 管理者ダッシュボード
│   ├── listings/page.tsx # 出品管理
│   └── orders/page.tsx   # 注文管理
└── seller/
    ├── onboarding/page.tsx # 出品者オンボーディング
    └── guide/page.tsx      # 出品者ガイド
```

### 8.3 状態管理
- **React Hooks**: useState, useEffect, useSession
- **NextAuth.js**: 認証状態管理
- **フォーム管理**: React Hook Form + Zod

## 9. 開発ワークフロー

### 9.1 ブランチ戦略
```
main (本番環境)
├── develop (開発環境)
│   ├── feature/user-management
│   ├── feature/listing-system
│   └── bugfix/authentication
└── hotfix/critical-fix
```

### 9.2 開発手順
1. **機能ブランチ作成**: `git checkout -b feature/new-feature`
2. **開発・テスト**: ローカル環境で動作確認
3. **プルリクエスト**: GitHubでレビュー依頼
4. **マージ**: レビュー承認後developブランチにマージ
5. **デプロイ**: developブランチからステージング環境へ
6. **本番リリース**: mainブランチにマージ後本番デプロイ

### 9.3 テスト戦略
```bash
# 型チェック
npm run type-check

# リンター
npm run lint

# ビルドテスト
npm run build

# テスト実行（実装予定）
npm test
```

## 10. デプロイメント

### 10.1 環境設定
- **開発環境**: localhost
- **ステージング環境**: Vercel Preview
- **本番環境**: Vercel Production

### 10.2 デプロイ手順
1. **Vercel連携**: GitHubリポジトリとVercel連携
2. **環境変数設定**: Vercelダッシュボードで環境変数設定
3. **自動デプロイ**: mainブランチへのプッシュで自動デプロイ
4. **プレビューデプロイ**: プルリクエストでプレビュー環境自動作成

### 10.3 本番環境チェックリスト
- [ ] 環境変数が正しく設定されている
- [ ] データベースが本番環境に接続されている
- [ ] Stripeキーが本番用に変更されている
- [ ] ドメインが正しく設定されている
- [ ] SSL証明書が有効である

## 11. 監視・ログ

### 11.1 ログ出力
```typescript
// 構造化ログの例
console.log('Order created:', {
  orderId: order.id,
  buyerId: order.buyerId,
  amount: order.totalJPY,
  timestamp: new Date().toISOString()
})
```

### 11.2 監視項目
- **システム稼働率**: 99.9%以上目標
- **レスポンス時間**: 平均200ms以下
- **エラー率**: 0.1%以下
- **決済成功率**: 99%以上

### 11.3 アラート設定
- エラーレートの急増
- レスポンス時間の悪化
- データベース接続エラー
- Stripe Webhook失敗

## 12. トラブルシューティング

### 12.1 よくある問題

#### データベース接続エラー
```bash
# PostgreSQL起動確認
sudo systemctl status postgresql

# 接続テスト
psql -h localhost -U username -d semiconductor_marketplace
```

#### NextAuth.js認証エラー
```bash
# セッションクリア
rm -rf .next
npm run dev
```

#### Stripe連携エラー
```bash
# Webhook署名検証確認
# 環境変数チェック
echo $STRIPE_SECRET_KEY
```

### 12.2 デバッグ方法
```typescript
// デバッグログ有効化
const debug = process.env.NODE_ENV === 'development'

if (debug) {
  console.log('Debug info:', { data, timestamp: new Date() })
}
```

### 12.3 パフォーマンス問題
- **データベース**: インデックス確認、クエリ最適化
- **フロントエンド**: バンドルサイズ確認、画像最適化
- **API**: レスポンス時間測定、キャッシュ確認

## 13. 今後の開発計画

### 13.1 短期計画（1-3ヶ月）
- [ ] 検索機能の改善
- [ ] モバイル対応の強化
- [ ] 通知システムの実装
- [ ] パフォーマンス最適化

### 13.2 中期計画（3-6ヶ月）
- [ ] AI在庫最適化機能
- [ ] 外部API連携
- [ ] 多言語対応
- [ ] モバイルアプリ開発

### 13.3 長期計画（6ヶ月以上）
- [ ] マイクロサービス化
- [ ] グローバル展開
- [ ] 高度な分析機能
- [ ] サードパーティ統合

## 14. コミュニケーション

### 14.1 チーム連絡先
- **プロジェクトマネージャー**: [PM名] ([email])
- **テックリード**: [テックリード名] ([email])
- **デザイナー**: [デザイナー名] ([email])

### 14.2 ドキュメント
- **要件定義書**: `REQUIREMENTS.md`
- **システム仕様書**: `SPECIFICATION.md`
- **API仕様書**: [Swagger/OpenAPI]
- **データベース設計書**: `prisma/schema.prisma`

### 14.3 会議・報告
- **デイリースクラム**: 平日 9:00-9:15
- **スプリントレビュー**: 2週間ごと
- **技術レビュー**: 随時（Slack #tech-review）
- **月次報告**: 月末

## 15. その他の重要情報

### 15.1 コーディング規約
- **TypeScript**: strict mode有効
- **ESLint**: Next.js推奨設定
- **Prettier**: コードフォーマット統一
- **コミットメッセージ**: Conventional Commits使用

### 15.2 セキュリティ
- **依存関係**: 定期的な脆弱性チェック
- **アクセス制御**: 最小権限の原則
- **データ保護**: 個人情報の適切な処理
- **監査ログ**: 全重要操作の記録

### 15.3 バックアップ・復旧
- **データベース**: 日次自動バックアップ
- **コード**: Gitでバージョン管理
- **設定**: 環境変数で管理
- **復旧手順**: ドキュメント化済み

---

**作成日**: 2024年12月
**作成者**: 開発チーム
**最終更新**: 2024年12月
**バージョン**: 1.0

このガイドを参考に、スムーズな引き継ぎと継続的な開発を進めてください。
何か質問があれば、いつでも連絡してください。
