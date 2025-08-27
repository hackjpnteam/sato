import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development'

interface JwtPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

const updateCompanySchema = z.object({
  companyName: z.string().min(1, '会社名を入力してください'),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyDescription: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = updateCompanySchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { companyName, companyAddress, companyPhone, companyDescription } = validationResult.data
    const { db } = await connectToDatabase()

    // Update user company info
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        $set: { 
          companyName,
          companyAddress: companyAddress || '',
          companyPhone: companyPhone || '',
          companyDescription: companyDescription || '',
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: '会社情報を更新しました',
      company: { companyName, companyAddress, companyPhone, companyDescription }
    })
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}