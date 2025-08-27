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

const answerSchema = z.object({
  content: z.string().min(1, '回答内容を入力してください').max(1000, '回答は1000文字以内で入力してください')
})

// POST: 質問に回答
export async function POST(request: Request, { params }: { params: { id: string, questionId: string } }) {
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

    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.questionId)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validationResult = answerSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // 質問が存在するかチェック
    const question = await db.collection('questions').findOne({
      _id: new ObjectId(params.questionId),
      listingId: new ObjectId(params.id)
    })

    if (!question) {
      return NextResponse.json(
        { error: '質問が見つかりません' },
        { status: 404 }
      )
    }

    // 商品の出品者かチェック
    const listing = await db.collection('listings').findOne({
      _id: new ObjectId(params.id)
    })

    if (!listing) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // 出品者のみが回答可能
    if (listing.sellerId !== decoded.userId) {
      return NextResponse.json(
        { error: '出品者のみが回答できます' },
        { status: 403 }
      )
    }

    // 回答を作成
    const answer = {
      questionId: new ObjectId(params.questionId),
      userId: new ObjectId(decoded.userId),
      content: validationResult.data.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('answers').insertOne(answer)

    return NextResponse.json({
      message: '回答を投稿しました',
      answerId: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error('Answers POST error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}