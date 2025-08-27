import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  name: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      passwordHash: hashedPassword,
      name: name || '',
      role: 'buyer',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: '登録が完了しました',
      userId: result.insertedId
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}