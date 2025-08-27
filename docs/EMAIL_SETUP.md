# メール送信設定ガイド

本番環境でパスワードリセット機能を動作させるために、メール送信サービスの設定が必要です。

## 🚀 推奨メールサービス

### 1. **Gmail (推奨)**
最も設定が簡単で、無料で利用できます。

**設定手順:**
1. Googleアカウントで2段階認証を有効にする
2. [アプリパスワード](https://support.google.com/accounts/answer/185833)を生成
3. 環境変数に設定:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-app-password-here"
FROM_NAME="半導体マーケットプレイス"
FROM_EMAIL="your-gmail@gmail.com"
```

### 2. **SendGrid**
大量送信に最適で、無料プランあり（月100通まで）

**設定手順:**
1. [SendGrid](https://sendgrid.com/)でアカウント作成
2. API Keyを生成
3. 環境変数に設定:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
FROM_NAME="半導体マーケットプレイス"
FROM_EMAIL="noreply@yourdomain.com"
```

### 3. **Amazon SES**
AWSを使用している場合に最適

**設定手順:**
1. AWS SESでドメイン認証
2. SMTP認証情報を生成
3. 環境変数に設定:
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-ses-access-key-id"
SMTP_PASS="your-ses-secret-access-key"
FROM_NAME="半導体マーケットプレイス"
FROM_EMAIL="noreply@yourdomain.com"
```

### 4. **Outlook/Hotmail**
Microsoftアカウントを使用

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-outlook@outlook.com"
SMTP_PASS="your-password"
FROM_NAME="半導体マーケットプレイス"
FROM_EMAIL="your-outlook@outlook.com"
```

## 📧 カスタムドメインメール

独自ドメインのメールアドレスを使用する場合：

```env
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-email-password"
FROM_NAME="半導体マーケットプレイス"
FROM_EMAIL="noreply@yourdomain.com"
```

## 🔧 環境別動作

### 開発環境 (`NODE_ENV=development`)
- 実際にメールは送信されません
- コンソールにメール内容が出力されます
- レスポンスにリセットURLが含まれます

### 本番環境 (`NODE_ENV=production`)
- 実際にメールが送信されます
- セキュリティのため、リセットURLはレスポンスに含まれません
- メール送信失敗時もセキュリティのため成功メッセージを返します

## 🚨 セキュリティ注意点

1. **環境変数の保護**: SMTP認証情報は絶対に公開しないこと
2. **送信制限**: 大量送信を避けるため、適切な送信制限を設ける
3. **SPF/DKIM設定**: 独自ドメイン使用時は適切にDNS設定する
4. **ログ管理**: メール送信ログから個人情報を除外する

## 🧪 テスト方法

### 1. 開発環境でのテスト
```bash
# 開発サーバー起動
npm run dev

# http://localhost:3000/forgot-password でテスト
# コンソールにリセットURLが出力される
```

### 2. 本番環境でのテスト
```bash
# 実際のメールアドレスでテスト
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🔍 トラブルシューティング

### メール送信エラー
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**解決策**: アプリパスワードを使用、または2段階認証を確認

### 送信されない
```
メール送信成功のメッセージは表示されるがメールが届かない
```
**確認点**:
- 迷惑メールフォルダを確認
- 送信元メールアドレスがブロックされていないか
- SMTP設定が正しいか

### SSL/TLS エラー
```
Error: self signed certificate in certificate chain
```
**解決策**: `SMTP_SECURE="false"`に設定し、STARTTLSを使用

## 📊 監視とアラート

本番環境では以下の監視を推奨:
- メール送信成功率
- 送信失敗アラート
- 送信量監視
- レート制限アラート

## 📝 ログ例

### 開発環境
```
=== 開発環境 - メール送信シミュレーション ===
宛先: user@example.com
件名: パスワードリセットのご案内 - 半導体マーケットプレイス
内容: HTMLメール
==========================================
```

### 本番環境
```
メール送信成功: <message-id@smtp.gmail.com>
```