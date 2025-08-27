import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

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

// GET: カート内容を取得
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

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
    
    // ユーザーのカート情報を取得
    const cart = await db.collection('carts').findOne({
      userId: new ObjectId(decoded.userId)
    })

    if (!cart || !cart.items) {
      return NextResponse.json({ items: [], totalQuantity: 0, totalPrice: 0 })
    }

    // カート内の商品情報を取得
    const listingIds = cart.items.map((item: any) => new ObjectId(item.listingId))
    const listings = await db.collection('listings').find({
      _id: { $in: listingIds }
    }).toArray()

    // カートアイテムに商品詳細を追加
    const cartItems = cart.items.map((item: any) => {
      const listing = listings.find(l => l._id.equals(new ObjectId(item.listingId)))
      if (!listing) return null
      
      return {
        ...item,
        listing: {
          ...listing,
          _id: listing._id.toString()
        },
        totalPrice: item.quantity * listing.unitPriceJPY
      }
    }).filter(Boolean)

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

    return NextResponse.json({
      items: cartItems,
      totalQuantity,
      totalPrice
    })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// POST: カートに商品を追加
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

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

    const { listingId, quantity = 1 } = await request.json()

    if (!listingId || !ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { error: '無効な商品IDです' },
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

    // 商品が存在するかチェック
    const listing = await db.collection('listings').findOne({
      _id: new ObjectId(listingId)
    })

    if (!listing) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // 在庫数をチェック
    if (quantity > listing.quantity) {
      return NextResponse.json(
        { error: '在庫数を超えています' },
        { status: 400 }
      )
    }

    const userId = new ObjectId(decoded.userId)

    // カートを更新または作成
    const result = await db.collection('carts').updateOne(
      { userId },
      {
        $set: { updatedAt: new Date() },
        $push: {
          items: {
            listingId: new ObjectId(listingId),
            quantity,
            addedAt: new Date()
          }
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: 'カートに追加しました',
      success: true
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}