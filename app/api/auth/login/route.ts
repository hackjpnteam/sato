// ログインAPI
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import { LoginSchema } from '@/lib/validate'
import { signJwt, setAuthCookie } from '@/lib/auth'
import { createInternalErrorResponse } from '@/lib/guard'

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const body = await request.json()
    
    // リクエストボディのバリデーション
    const validationResult = LoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    const { email, password } = validationResult.data
    
    // メールアドレスの正規化（小文字化）
    const normalizedEmail = email.toLowerCase()
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const users = db.collection('users')
    
    // ユーザー検索
    const user = await users.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json(
        { 
          error: 'メールアドレスまたはパスワードが正しくありません',
          code: 'INVALID_CREDENTIALS' 
        },
        { status: 401 }
      )
    }
    
    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      console.warn('Invalid password attempt:', { 
        requestId, 
        email: normalizedEmail,
        userId: user._id.toString()
      })
      
      return NextResponse.json(
        { 
          error: 'メールアドレスまたはパスワードが正しくありません',
          code: 'INVALID_CREDENTIALS' 
        },
        { status: 401 }
      )
    }
    
    // JWTトークン生成
    const jwtPayload = {
      uid: user._id.toString(),
      email: user.email,
      role: user.role,
    }
    
    const token = signJwt(jwtPayload, '7d')
    
    // HttpOnly Cookieに保存
    setAuthCookie(token)
    
    // 最終ログイン時刻を更新
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    )
    
    console.log('User logged in successfully:', { 
      requestId, 
      userId: user._id.toString(),
      email: normalizedEmail,
      role: user.role
    })
    
    return NextResponse.json({
      ok: true,
      message: 'ログインしました',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
    
  } catch (error) {
    console.error('Login error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}