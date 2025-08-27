# ARCHITECTURE

## システム全体図

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)      │◄──►│   (MongoDB)     │
│                 │    │                  │    │                 │
│ ・Pages/Routes  │    │ ・/api/auth      │    │ ・users         │
│ ・Components    │    │ ・/api/listings  │    │ ・listings      │
│ ・State Mgmt    │    │ ・/api/cart      │    │ ・carts         │
└─────────────────┘    │ ・/api/admin     │    │ ・questions     │
                       └──────────────────┘    └─────────────────┘
                                │
                         ┌──────▼──────┐
                         │   External  │
                         │   Services  │
                         │             │
                         │ ・Stripe    │
                         │ ・Vercel    │
                         └─────────────┘
```

## フロントエンド

### Next.js App Router
- **React 18** Server Components / Client Components の使い分け
- **App Router**: ファイルベースルーティング
- **TypeScript**: 型安全な開発

### 主要ページ
```
app/
├── page.tsx              # ホームページ
├── search/               # 商品検索
├── listings/             # 商品一覧・詳細
│   └── [id]/            # 動的ルート
├── cart/                # カート
├── account/             # アカウント管理
├── admin/               # 管理ダッシュボード
├── login/               # ログイン
└── sell/                # 出品
```

### 状態管理
- **React State**: useState, useEffect
- **Context API**: 認証状態の共有（必要に応じて）
- **Server State**: API からのデータフェッチ

### スタイリング
- **Tailwind CSS**: ユーティリティファースト
- **Radix UI**: アクセシブルなUIコンポーネント
- **Lucide React**: アイコンライブラリ

## バックエンド

### Next.js API Routes
- **Runtime**: Node.js（認証のため Edge 不可）
- **Dynamic Routes**: `export const dynamic = 'force-dynamic'`
- **Revalidation**: `export const revalidate = 0`

### API エンドポイント構成
```
app/api/
├── auth/
│   ├── login/           # ログイン
│   ├── register/        # 新規登録
│   ├── me/              # ユーザー情報取得
│   ├── update-profile/  # プロフィール更新
│   └── logout/          # ログアウト
├── listings/
│   ├── route.ts         # 商品一覧・作成
│   └── [id]/           # 商品詳細・更新・削除
├── cart/
│   └── route.ts         # カート操作
├── admin/
│   ├── stats/          # 統計情報
│   ├── users/          # ユーザー管理
│   ├── listings/       # 商品管理
│   └── orders/         # 注文管理
└── user/
    └── listings/       # ユーザーの出品管理
```

### 認証・認可システム

#### JWT認証
```typescript
// トークン生成
const token = jwt.sign(
  { userId, email, role },
  JWT_SECRET,
  { expiresIn: '7d' }
)

// Cookie設定
cookies().set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
})
```

#### 役割ベースアクセス制御 (RBAC)
- **buyer**: 商品閲覧・購入
- **seller**: 商品出品・管理（会社情報必須）
- **admin**: 全体管理・削除権限

### バリデーション
- **Zod**: 入力データのスキーマ検証
```typescript
const schema = z.object({
  partNumber: z.string().min(1),
  quantity: z.number().min(0),
  unitPriceJPY: z.number().min(0)
})
```

## データベース

### MongoDB Atlas
- **NoSQL**: ドキュメント指向データベース
- **Collections**: users, listings, carts, questions

### スキーマ設計

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: string,           // 一意
  passwordHash: string,    // bcrypt ハッシュ
  name: string,
  role: "buyer" | "seller" | "admin",
  emailVerified: boolean,
  
  // 出品者用（seller のみ）
  companyName?: string,    // 必須（出品時）
  companyAddress?: string,
  companyPhone?: string,
  companyDescription?: string,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### Listings Collection
```javascript
{
  _id: ObjectId,
  sellerId: string,        // users._id への参照
  
  // 商品情報
  partNumber: string,      // 部品番号
  manufacturer: string,    // メーカー名
  category: string,        // カテゴリ
  description?: string,
  
  // 在庫・価格
  quantity: number,        // 在庫数
  unitPriceJPY: number,   // 単価（円）
  minimumOrderQuantity: number,
  
  // 条件
  condition: "new" | "used" | "refurbished",
  stockSource: string,     // 在庫源
  dateCode?: string,       // デートコード
  warranty?: string,       // 保証期間
  leadTime?: string,       // 納期
  
  // コンプライアンス
  rohs: boolean,
  reach: boolean,
  certificationsCompliance?: string,
  
  // メタデータ
  images: string[],        // 画像URL配列（未実装）
  createdAt: Date,
  updatedAt: Date
}
```

#### Carts Collection
```javascript
{
  _id: ObjectId,
  userId: string,          // users._id への参照
  items: [
    {
      listingId: ObjectId, // listings._id への参照
      quantity: number,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Questions Collection（未実装）
```javascript
{
  _id: ObjectId,
  listingId: ObjectId,     // listings._id への参照
  askerId: ObjectId,       // users._id への参照
  question: string,
  answer?: string,
  answeredAt?: Date,
  createdAt: Date
}
```

### インデックス
```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Listings
db.listings.createIndex({ "sellerId": 1 })
db.listings.createIndex({ "partNumber": "text", "manufacturer": "text" })
db.listings.createIndex({ "category": 1 })
db.listings.createIndex({ "createdAt": -1 })

// Carts
db.carts.createIndex({ "userId": 1 }, { unique: true })
```

## ホスティング・インフラ

### Vercel
- **Static Generation**: 静的コンテンツの生成・配信
- **Serverless Functions**: API Routes の実行
- **Edge Network**: 世界中のCDNで高速配信
- **自動デプロイ**: GitHub連携での CI/CD

### MongoDB Atlas
- **Managed Service**: マネージドMongoDB
- **自動スケーリング**: 負荷に応じた自動スケール
- **バックアップ**: 自動バックアップ・復元機能
- **セキュリティ**: IP制限・TLS暗号化

## セキュリティ

### 認証・認可
- JWT + HttpOnly Cookie
- CSRF対策（SameSite設定）
- Password Hashing（bcrypt）

### 入力検証
- Zod スキーマによる厳密な型チェック
- SQL Injection 対策（MongoDB使用）
- XSS対策（Next.js組み込み）

### API セキュリティ
- Rate Limiting（実装予定）
- CORS設定
- 環境変数での機密情報管理

## パフォーマンス

### フロントエンド最適化
- Next.js Image Optimization
- Code Splitting（自動）
- Static Generation / ISR

### バックエンド最適化
- MongoDB Connection Pooling
- クエリ最適化（インデックス活用）
- レスポンスキャッシング

### 監視・メトリクス
- Vercel Analytics
- MongoDB Atlas Monitoring
- Core Web Vitals 監視

## 今後の拡張計画

### 決済システム
```javascript
// Stripe統合予定
{
  paymentIntents: "Stripe Payment Intent ID",
  checkoutSessions: "Stripe Checkout Session",
  webhooks: "支払い完了通知"
}
```

### 画像管理
```javascript
// Cloudinary / AWS S3 統合予定
{
  images: [
    {
      url: "string",
      alt: "string", 
      width: "number",
      height: "number"
    }
  ]
}
```

### 通知システム
- Email通知（在庫アラート、注文通知）
- Push通知（PWA対応時）

### 検索強化
- Elasticsearch / Algolia 統合
- ファセット検索
- 類似商品検索