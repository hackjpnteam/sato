import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// メール設定を環境変数から取得
function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '', // アプリパスワードまたはOAuth2トークン
    },
  }
}

// メール送信用のtransporterを作成
function createTransporter() {
  const config = getEmailConfig()
  
  if (!config.auth.user || !config.auth.pass) {
    throw new Error('SMTP認証情報が設定されていません。SMTP_USERとSMTP_PASSを環境変数に設定してください。')
  }

  return nodemailer.createTransporter(config)
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// メール送信関数
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // 開発環境では実際に送信せずコンソール出力
  if (process.env.NODE_ENV === 'development') {
    console.log('\n=== 開発環境 - メール送信シミュレーション ===')
    console.log(`宛先: ${to}`)
    console.log(`件名: ${subject}`)
    console.log(`内容: ${text || 'HTMLメール'}`)
    console.log('==========================================\n')
    return { success: true, messageId: 'dev-mode' }
  }

  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"${process.env.FROM_NAME || '半導体マーケットプレイス'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // HTMLタグを除去してテキスト版作成
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('メール送信成功:', info.messageId)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('メール送信エラー:', error)
    return { success: false, error: error.message }
  }
}

// パスワードリセットメール送信
export async function sendPasswordResetEmail(email: string, resetUrl: string, userName: string = '') {
  const subject = 'パスワードリセットのご案内 - 半導体マーケットプレイス'
  
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワードリセット</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 パスワードリセット</h1>
        </div>
        
        <div class="content">
            <p>こんにちは${userName ? `、${userName}さん` : ''}、</p>
            
            <p>半導体マーケットプレイスのアカウント（${email}）でパスワードリセットのリクエストを受け付けました。</p>
            
            <p>以下のボタンをクリックして、新しいパスワードを設定してください：</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">パスワードをリセット</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ 重要な注意事項</strong><br>
                • このリンクの有効期限は30分間です<br>
                • パスワードリセットを依頼していない場合は、このメールを無視してください<br>
                • セキュリティのため、このメールを他の人に転送しないでください
            </div>
            
            <p>リンクが機能しない場合は、以下のURLを直接ブラウザにコピー＆ペーストしてください：</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
            </p>
        </div>
        
        <div class="footer">
            <p>半導体マーケットプレイス<br>
            このメールに心当たりがない場合は、無視してください。</p>
        </div>
    </div>
</body>
</html>`

  const text = `
パスワードリセットのご案内

こんにちは${userName ? `、${userName}さん` : ''}、

半導体マーケットプレイスのアカウント（${email}）でパスワードリセットのリクエストを受け付けました。

以下のリンクから新しいパスワードを設定してください：
${resetUrl}

⚠️ 重要：
- このリンクの有効期限は30分間です
- パスワードリセットを依頼していない場合は、このメールを無視してください

半導体マーケットプレイス
`

  return await sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}

// ウェルカムメール送信
export async function sendWelcomeEmail(email: string, userName: string) {
  const subject = 'アカウント登録完了 - 半導体マーケットプレイス'
  
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>アカウント登録完了</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ようこそ！</h1>
        </div>
        
        <div class="content">
            <p>こんにちは、${userName}さん</p>
            
            <p>半導体マーケットプレイスへのご登録ありがとうございます！</p>
            
            <p>アカウントが正常に作成されました。これで以下のサービスをご利用いただけます：</p>
            
            <ul>
                <li>📦 半導体部品の検索・購入</li>
                <li>🏪 部品の出品・販売</li>
                <li>💬 出品者への質問・相談</li>
                <li>📊 取引履歴の確認</li>
            </ul>
            
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>
        
        <div class="footer">
            <p>半導体マーケットプレイス</p>
        </div>
    </div>
</body>
</html>`

  return await sendEmail({
    to: email,
    subject,
    html,
  })
}