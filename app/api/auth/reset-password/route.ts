import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { sendPasswordResetEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

// パスワードリセット要求
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // ユーザーが存在するかチェック
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      // セキュリティのため、ユーザーが存在しなくても成功を返す
      return NextResponse.json({
        message: 'パスワードリセットの指示をメールで送信しました'
      })
    }

    // リセットトークンを生成
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000) // 30分後

    // トークンをデータベースに保存
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpires,
          updatedAt: new Date()
        }
      }
    )

    // パスワードリセットメールを送信
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    try {
      const emailResult = await sendPasswordResetEmail(email, resetUrl, user.name)
      
      if (!emailResult.success && process.env.NODE_ENV === 'production') {
        // 本番環境でメール送信に失敗した場合はエラーを返す
        console.error('パスワードリセットメール送信失敗:', emailResult.error)
        return NextResponse.json(
          { error: 'メール送信に失敗しました。しばらく後に再度お試しください。' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'パスワードリセットの指示をメールで送信しました',
        // 開発環境でのみリセットURLを返す
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      })
      
    } catch (emailError) {
      console.error('メール送信処理エラー:', emailError)
      
      // 本番環境ではメール送信エラーでも成功を返す（セキュリティのため）
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({
          message: 'パスワードリセットの指示をメールで送信しました'
        })
      }
      
      // 開発環境では詳細なエラーとURLを返す
      return NextResponse.json({
        message: 'メール送信に失敗しましたが、開発環境のため以下のURLを使用できます',
        resetUrl,
        error: emailError.message
      })
    }

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// パスワードリセット実行
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'トークンと新しいパスワードが必要です' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上である必要があります' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // トークンでユーザーを検索し、期限をチェック
    const user = await db.collection('users').findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json(
        { error: '無効なトークンまたは期限切れです' },
        { status: 400 }
      )
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // パスワードを更新し、リセットトークンを削除
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: ""
        }
      }
    )

    return NextResponse.json({
      message: 'パスワードが正常に変更されました'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}