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

// PUT: カート内のアイテム数量を更新
export async function PUT(request: Request, { params }: { params: { itemId: string } }) {
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

    const { quantity } = await request.json()

    if (!ObjectId.isValid(params.itemId)) {
      return NextResponse.json(
        { error: '無効なアイテムIDです' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: '数量は1以上を指定してください' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(decoded.userId)
    const itemId = new ObjectId(params.itemId)

    // カートアイテムの数量を更新
    const result = await db.collection('carts').updateOne(
      { 
        userId,
        'items.listingId': itemId
      },
      {
        $set: { 
          'items.$.quantity': quantity,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'カートアイテムが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'カートアイテムを更新しました',
      success: true
    })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// DELETE: カートからアイテムを削除
export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
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

    if (!ObjectId.isValid(params.itemId)) {
      return NextResponse.json(
        { error: '無効なアイテムIDです' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(decoded.userId)
    const itemId = new ObjectId(params.itemId)

    // カートからアイテムを削除
    const result = await db.collection('carts').updateOne(
      { userId },
      {
        $pull: { 
          items: { listingId: itemId }
        },
        $set: { updatedAt: new Date() }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'カートが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'カートからアイテムを削除しました',
      success: true
    })
  } catch (error) {
    console.error('Remove cart item error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}