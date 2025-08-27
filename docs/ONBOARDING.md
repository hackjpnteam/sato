# ONBOARDING

## Day 1: 環境セットアップ

### 前提条件
- Node.js 18+ がインストール済み
- Git がインストール済み
- VSCode (推奨エディタ)

### セットアップ手順

#### 1. リポジトリのクローン
```bash
git clone https://github.com/hackjpnteam/sato.git
cd sato
```

#### 2. 依存関係のインストール
```bash
npm install
```

#### 3. 環境変数の設定
```bash
# .env.example をコピー
cp .env.example .env.local

# .env.local を編集（各自の開発環境に合わせて）
# MongoDB Atlas の接続文字列を設定
# JWT_SECRET を設定
```

#### 4. 開発サーバーの起動確認
```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして動作確認

#### 5. 権限付与の依頼
- [ ] GitHub リポジトリへのアクセス権限
- [ ] Vercel プロジェクトへのアクセス権限  
- [ ] MongoDB Atlas プロジェクトへのアクセス権限
- [ ] Stripe アカウントへのアクセス権限（必要に応じて）

## Week 1: プロジェクト理解

### 主要ドメインのコードリーディング

#### 1. 認証システム (`app/api/auth/`)
- JWT トークンベース認証
- Cookie によるセッション管理
- ユーザー役割（buyer/seller/admin）

#### 2. 出品システム (`app/api/listings/`)
- 商品の作成・取得・更新・削除
- 検索・フィルタリング機能
- 出品者の会社情報必須チェック

#### 3. カートシステム (`app/api/cart/`)
- カートへの追加・削除
- 在庫チェック
- 購入フロー

#### 4. 管理システム (`app/api/admin/`)
- 統計情報の取得
- ユーザー・出品・注文の管理
- 権限ベースのアクセス制御

### 実践タスク

#### 小タスク例
1. **UI改善**: 既存ページの見た目調整
2. **バグ修正**: 軽微なバグの修正
3. **機能追加**: 小さな機能の追加
4. **テスト追加**: 既存機能のテスト作成

#### PR → デプロイ体験
1. feature ブランチでの開発
2. Pull Request の作成
3. コードレビューのやり取り
4. CI パイプラインの確認
5. Vercel でのデプロイ確認

## Week 2-4: 本格的な開発参加

### 中規模タスクの担当
- 新機能の設計・実装
- 既存機能のリファクタリング
- パフォーマンス改善

### レビューワーとしての参加
- 他の開発者の PR レビュー
- 設計相談への参加

## チェックリスト

### 開発環境
- [ ] `npm run dev` でローカル起動できる
- [ ] `npm run build` でビルドが通る
- [ ] `npm run lint` でリンターが通る
- [ ] ESLint の設定が VSCode で動作している
- [ ] Pre-push フックが正常に動作している

### 知識・理解
- [ ] プロジェクトの全体像を把握している
- [ ] 主要な API エンドポイントを理解している
- [ ] データベース設計を理解している
- [ ] 認証・認可の仕組みを理解している
- [ ] デプロイフローを理解している

### 権限・アクセス
- [ ] GitHub でのコミット・プッシュができる
- [ ] Vercel でデプロイ状況を確認できる
- [ ] MongoDB Atlas でデータベースを確認できる
- [ ] Slack / Discord での連絡ができる

### 開発ルール
- [ ] コミットメッセージの規則を理解している
- [ ] ブランチ命名規則を理解している
- [ ] PR テンプレートを理解している
- [ ] コードレビューのマナーを理解している

## よくある質問

### Q: ローカルで MongoDB に接続できない
A: 
1. MongoDB Atlas の IP Allowlist を確認
2. MONGODB_URI の接続文字列を確認
3. ネットワーク設定を確認

### Q: 認証が正常に動作しない
A:
1. JWT_SECRET が設定されているか確認
2. Cookie の設定（domain, path）を確認
3. ブラウザの開発者ツールで Cookie を確認

### Q: ビルドエラーが発生する
A:
1. `npm run lint` を実行してエラーを確認
2. TypeScript のエラーメッセージを確認
3. 環境変数が正しく設定されているか確認

### Q: 会社情報の設定で出品できない
A:
1. アカウントページで会社情報を登録
2. seller ロールが付与されているか確認
3. 必須フィールドがすべて入力されているか確認

## リソース

### ドキュメント
- [README.md](../README.md) - プロジェクト概要
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 開発ガイドライン
- [ARCHITECTURE.md](./ARCHITECTURE.md) - アーキテクチャ詳細

### 外部リンク
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)