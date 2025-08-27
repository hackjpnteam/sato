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

const questionSchema = z.object({
  content: z.string().min(1, '質問内容を入力してください').max(1000, '質問は1000文字以内で入力してください')
})

// GET: 商品の質問一覧を取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '無効な商品IDです' },
        { status: 400 }
      )
    }

    // 質問一覧を取得（回答も含む）
    const questions = await db.collection('questions').find({
      listingId: new ObjectId(params.id)
    })
    .sort({ createdAt: -1 })
    .toArray()

    // ユーザー情報を取得
    const userIds = [...new Set(questions.map(q => q.userId))]
    const users = await db.collection('users').find({
      _id: { $in: userIds.map(id => new ObjectId(id)) }
    }, {
      projection: { name: 1, companyName: 1 }
    }).toArray()

    const userMap = new Map(users.map(u => [u._id.toString(), u]))

    // 質問に回答を紐付け
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await db.collection('answers').find({
          questionId: question._id
        })
        .sort({ createdAt: 1 })
        .toArray()

        // 回答者の情報も取得
        const answerUserIds = answers.map(a => new ObjectId(a.userId))
        const answerUsers = await db.collection('users').find({
          _id: { $in: answerUserIds }
        }, {
          projection: { name: 1, companyName: 1 }
        }).toArray()

        const answerUserMap = new Map(answerUsers.map(u => [u._id.toString(), u]))

        return {
          ...question,
          _id: question._id.toString(),
          user: userMap.get(question.userId.toString()),
          answers: answers.map(answer => ({
            ...answer,
            _id: answer._id.toString(),
            user: answerUserMap.get(answer.userId.toString())
          }))
        }
      })
    )

    return NextResponse.json({
      questions: questionsWithAnswers
    })
  } catch (error) {
    console.error('Questions GET error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい質問を投稿
export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '無効な商品IDです' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validationResult = questionSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // 商品が存在するかチェック
    const listing = await db.collection('listings').findOne({
      _id: new ObjectId(params.id)
    })

    if (!listing) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // 質問を作成
    const question = {
      listingId: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
      content: validationResult.data.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('questions').insertOne(question)

    return NextResponse.json({
      message: '質問を投稿しました',
      questionId: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error('Questions POST error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}