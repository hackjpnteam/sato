import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

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

// GET: ユーザーの出品一覧を取得
export async function GET(request: Request) {
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

    const { db } = await connectToDatabase()

    // ユーザーの出品一覧を取得
    const listings = await db.collection('listings').find({
      sellerId: decoded.userId
    })
    .sort({ createdAt: -1 })
    .toArray()

    // 各出品の質問数を取得
    const listingsWithStats = await Promise.all(
      listings.map(async (listing) => {
        const questionCount = await db.collection('questions').countDocuments({
          listingId: listing._id
        })

        return {
          ...listing,
          _id: listing._id.toString(),
          questionCount
        }
      })
    )

    return NextResponse.json({
      listings: listingsWithStats
    })
  } catch (error) {
    console.error('User listings GET error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// DELETE: 出品を削除
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId || !ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { error: '無効な出品IDです' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // 出品が存在し、かつユーザーのものかチェック
    const listing = await db.collection('listings').findOne({
      _id: new ObjectId(listingId),
      sellerId: decoded.userId
    })

    if (!listing) {
      return NextResponse.json(
        { error: '出品が見つからないか、削除する権限がありません' },
        { status: 404 }
      )
    }

    // 出品を削除
    await db.collection('listings').deleteOne({
      _id: new ObjectId(listingId)
    })

    // 関連する質問と回答も削除
    const questions = await db.collection('questions').find({
      listingId: new ObjectId(listingId)
    }).toArray()

    if (questions.length > 0) {
      const questionIds = questions.map(q => q._id)
      
      // 回答を削除
      await db.collection('answers').deleteMany({
        questionId: { $in: questionIds }
      })

      // 質問を削除
      await db.collection('questions').deleteMany({
        listingId: new ObjectId(listingId)
      })
    }

    // カートからも削除
    await db.collection('carts').updateMany(
      {},
      {
        $pull: {
          items: { listingId: new ObjectId(listingId) }
        }
      }
    )

    return NextResponse.json({
      message: '出品を削除しました'
    })
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}