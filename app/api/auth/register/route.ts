// ユーザー登録API
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import { RegisterSchema } from '@/lib/validate'
import { createInternalErrorResponse } from '@/lib/guard'

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const body = await request.json()
    
    // リクエストボディのバリデーション
    const validationResult = RegisterSchema.safeParse(body)
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
    
    const { email, password, name } = validationResult.data
    
    // メールアドレスの正規化（小文字化）
    const normalizedEmail = email.toLowerCase()
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const users = db.collection('users')
    
    // メールアドレス重複チェック
    const existingUser = await users.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'このメールアドレスは既に登録されています',
          code: 'EMAIL_EXISTS' 
        },
        { status: 409 }
      )
    }
    
    // パスワードハッシュ化
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // ユーザー作成
    const now = new Date()
    const newUser = {
      email: normalizedEmail,
      passwordHash,
      name: name || null,
      role: 'buyer', // デフォルトロール
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await users.insertOne(newUser)
    
    if (!result.insertedId) {
      console.error('User creation failed:', { requestId, email: normalizedEmail })
      return createInternalErrorResponse(requestId)
    }
    
    console.log('User created successfully:', { 
      requestId, 
      userId: result.insertedId.toString(),
      email: normalizedEmail 
    })
    
    return NextResponse.json(
      { 
        ok: true,
        message: 'ユーザー登録が完了しました',
        userId: result.insertedId.toString()
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Registration error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}