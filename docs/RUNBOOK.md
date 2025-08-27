# RUNBOOK

## 障害一次対応

### 1. 事象確認
- **環境確認**: 本番 / ステージング
- **影響範囲**: 全体 / 特定機能 / 特定ユーザー
- **エンドポイント**: どのAPIやページで発生しているか
- **時刻**: 障害発生時刻とパターン

### 2. ログ確認
- **Vercel Logs**: Functions → Runtime Logs
- **Vercel Edge Logs**: Edge Network のログ
- **MongoDB Atlas Logs**: Database のアクセスログ
- **Sentry**: エラートラッキング（設定時）
- **ブラウザ DevTools**: クライアントサイドエラー

### 3. 影響・対応手順
1. **影響度判定**: Critical / High / Medium / Low
2. **暫定対応**: 即座の影響軽減措置
3. **恒久対応**: 根本原因の修正
4. **事後対応**: 再発防止策

## 代表的な対応手順

### ロールバック
```bash
# Vercel ダッシュボード
Vercel → Project → Deployments → 前回の成功デプロイ → Promote to Production
```

### 環境変数変更
```bash
# Vercel ダッシュボード
Vercel Project → Settings → Environment Variables → 変数を更新 → Redeploy
```

### Stripe Webhook再送
```bash
# Stripe ダッシュボード
Stripe → Events → 該当イベント → Retry webhook
```

### データベース緊急対応
```javascript
// MongoDB Atlas で直接実行
db.users.findOne({email: "target@example.com"})
db.listings.updateMany({sellerId: "xxxx"}, {$set: {status: "disabled"}})
```

## よくあるトラブルシューティング

### DYNAMIC_SERVER_USAGE エラー
```typescript
// 症状: DynamicServerError: Route "/api/xxx" has a dynamic server usage error
// 原因: Edge Runtime で cookies() を使用

// 修正例
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = cookies() // モジュール内で使用
  // ...
}
```

### 5xx / Timeout エラー
1. **依存サービス確認**: MongoDB Atlas, Vercel の status
2. **重いクエリ確認**: データベースの Slow Query Log
3. **メモリ/CPU確認**: Vercel Function の制限

### 認証関連エラー
```bash
# JWT_SECRET 確認
# Cookie 設定確認（domain, path, httpOnly）
# トークンの有効期限確認
```

### MongoDB 接続エラー
```bash
# MONGODB_URI 確認
# Atlas IP Allowlist 確認
# Connection Pool の枯渇確認
```

## 緊急連絡先

### エスカレーション手順
1. **L1**: 初期対応者
2. **L2**: 技術リード（30分以内）
3. **L3**: プロダクトオーナー（1時間以内）

### 連絡手段
- **Slack**: #incident-channel
- **電話**: 緊急時のみ
- **Email**: team@hackjpn.com

## 障害後の事後処理

### 1. インシデントレポート作成
- 発生時刻・検知時刻・復旧時刻
- 根本原因
- 影響範囲
- 対応内容
- 再発防止策

### 2. ポストモーテム
- 事象の timeline
- 良かった点・改善点
- Action Item の割り当て

## 定期メンテナンス

### 月次チェック項目
- [ ] MongoDB Atlas のメトリクス確認
- [ ] Vercel の使用量確認
- [ ] セキュリティアップデート適用
- [ ] バックアップの確認

### 四半期チェック項目
- [ ] 依存ライブラリのアップデート
- [ ] パフォーマンス指標の確認
- [ ] セキュリティスキャン実行
- [ ] ドキュメントの更新