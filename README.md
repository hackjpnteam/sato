# 🔌 半導体マーケットプレイス (Semiconductor Marketplace)

半導体部品の売買を行うためのB2Bマーケットプレイスプラットフォーム

## 📋 概要

このプラットフォームは、半導体部品の効率的な売買を可能にするマーケットプレイスです。出品者は余剰在庫や新品部品を出品でき、購入者は必要な部品を簡単に検索・購入できます。

### 🎯 主な機能

- **商品検索・閲覧**: 型番、メーカー、カテゴリでの高度な検索機能
- **出品管理**: 在庫情報、価格設定、商品説明の詳細管理
- **ユーザー管理**: 購入者・出品者・管理者の役割別権限システム
- **カート・注文**: スムーズな購入フロー
- **質問・回答**: 商品に対する問い合わせ機能
- **管理ダッシュボード**: 統計情報、ユーザー管理、出品管理

## 🔧 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク (App Router)
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント

### バックエンド
- **Next.js API Routes** - サーバーサイド API
- **MongoDB** - NoSQL データベース
- **JWT** - 認証システム
- **bcrypt** - パスワードハッシュ化

### その他
- **Zod** - バリデーション
- **React Hook Form** - フォーム管理
- **Lucide React** - アイコンライブラリ

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- MongoDB Atlas または ローカルMongoDB
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd semiconductor-marketplace
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local` ファイルを編集：
```bash
# MongoDB接続文字列
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sato_marketplace

# JWT秘密鍵
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js設定
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

4. 開発サーバーを起動
```bash
npm run dev
```

## 👥 ユーザー役割

### 🛒 購入者 (Buyer)
- 商品の検索・閲覧
- カートに追加・注文
- 商品への質問投稿
- **会社情報登録不要**

### 🏢 出品者 (Seller)
- 商品の出品・管理
- 質問への回答
- 売上管理
- **会社情報登録必須**

### 🔧 管理者 (Admin)
- 全ユーザー・商品の管理
- システム統計の確認
- 任意の商品削除権限
- ダッシュボードアクセス

## 📊 主要API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - 新規登録
- `GET /api/auth/me` - ユーザー情報取得

### 商品
- `GET /api/listings` - 商品一覧・検索
- `POST /api/listings` - 商品出品
- `GET /api/listings/[id]` - 商品詳細

### カート
- `GET /api/cart` - カート内容取得
- `POST /api/cart` - カートに追加

### 管理者
- `GET /api/admin/stats` - 統計情報
- `GET /api/admin/users` - ユーザー管理
- `GET /api/admin/listings` - 商品管理

## 🗄️ データベース構造

### Users コレクション
```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: String,
  role: "buyer" | "seller" | "admin",
  companyName?: String,     // 出品者のみ必須
  companyAddress?: String,
  companyPhone?: String,
  createdAt: Date
}
```

### Listings コレクション
```javascript
{
  _id: ObjectId,
  sellerId: String,
  partNumber: String,
  manufacturer: String,
  category: String,
  quantity: Number,
  unitPriceJPY: Number,
  condition: "new" | "used",
  stockSource: String,
  description: String,
  createdAt: Date
}
```

## 🔒 セキュリティ機能

- **JWT認証**: セッション管理
- **パスワードハッシュ化**: bcrypt使用
- **役割ベースアクセス制御**: RBAC実装
- **入力バリデーション**: Zodスキーマ
- **XSS対策**: Next.js組み込み保護

## 📱 レスポンシブデザイン

- **モバイルファースト**: スマートフォン対応
- **タブレット最適化**: 中サイズ画面対応
- **デスクトップ**: フル機能利用

## 🎨 デザインシステム

- **一貫したカラーパレット**: ブルー基調
- **Tailwind CSS**: ユーティリティファースト
- **Radix UI**: アクセシブルコンポーネント
- **日本語フォント**: システムフォント使用

## 🚧 開発スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint

# データベースインデックス作成
npm run indexes

# テストデータ追加
npm run test-data
```

## 📁 プロジェクト構造

```
semiconductor-marketplace/
├── app/                    # Next.js App Router
│   ├── account/           # アカウント管理
│   ├── admin/             # 管理ダッシュボード
│   ├── api/               # API Routes
│   │   ├── auth/          # 認証API
│   │   ├── admin/         # 管理者API
│   │   ├── cart/          # カートAPI
│   │   └── listings/      # 商品API
│   ├── cart/              # カートページ
│   ├── listings/          # 商品一覧・詳細
│   ├── login/             # ログインページ
│   ├── search/            # 検索ページ
│   └── sell/              # 出品ページ
├── components/            # 再利用可能コンポーネント
├── lib/                   # ユーティリティ
│   └── mongodb.ts         # データベース接続
├── scripts/               # データベーススクリプト
└── public/                # 静的ファイル
```

## 🧪 テストアカウント

開発・テスト用のアカウントを作成するには：

```bash
# 管理者アカウント作成
node scripts/create-simple-admin.js

# テストデータ追加
npm run test-data
```

## 📈 今後の改善予定

- [ ] 決済システム統合 (Stripe)
- [ ] 商品画像アップロード機能
- [ ] 在庫アラート機能
- [ ] 評価・レビューシステム
- [ ] 多言語対応 (英語)
- [ ] PWA対応
- [ ] パフォーマンス最適化

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**🤖 このプロジェクトは [Claude Code](https://claude.ai/code) で開発支援を受けています。**