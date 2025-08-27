# Architecture Decision Records (ADR)

このディレクトリには、プロジェクトの重要な技術的意思決定を記録します。

## ADR とは

Architecture Decision Record (アーキテクチャ決定記録) は、ソフトウェア開発において行われた重要な技術的決定とその理由を文書化したものです。

## 記録対象

以下のような重要な技術判断を ADR として記録してください：

- **フレームワーク・ライブラリの選択**
- **データベース設計の決定**
- **アーキテクチャパターンの採用**
- **セキュリティ方針の決定**
- **パフォーマンス戦略の選択**
- **デプロイ戦略の決定**

## ADR テンプレート

新しい ADR を作成する際は、以下のテンプレートを使用してください：

```markdown
# ADR-001: [決定のタイトル]

## ステータス
承認済み | 検討中 | 廃止

## 背景・課題
何の問題を解決する必要があったか

## 決定内容
何を決定したか

## 選択肢
検討した他の選択肢

## 理由
なぜこの決定をしたか

## 結果・影響
この決定による影響や制約

## 関連リンク
参考資料や関連ドキュメント

## 記録日
YYYY-MM-DD

## 記録者
決定者・記録者の名前
```

## ファイル命名規則

```
ADR-001-next-js-app-router-adoption.md
ADR-002-mongodb-over-postgresql.md
ADR-003-jwt-authentication-strategy.md
```

## 既存の重要な決定（今後ADR化予定）

1. **Next.js App Router の採用**
   - Pages Router ではなく App Router を選択
   - Server Components の活用

2. **MongoDB の採用** 
   - PostgreSQL ではなく MongoDB Atlas を選択
   - NoSQL による柔軟なスキーマ

3. **JWT + Cookie 認証**
   - NextAuth ではなく独自実装
   - HttpOnly Cookie による安全な保存

4. **Vercel でのホスティング**
   - AWS/GCP ではなく Vercel を選択
   - Next.js との親和性重視

これらの決定について、詳細な ADR を今後作成していく予定です。