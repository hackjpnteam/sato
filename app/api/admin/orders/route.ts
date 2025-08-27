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
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    })

    if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    // Build filter
    let filter: any = {
      items: { $exists: true, $not: { $size: 0 } }
    }
    
    if (status) {
      filter.status = status
    }

    // Get total count
    const totalCount = await db.collection('carts').countDocuments(filter)

    // Get carts (orders) with pagination
    const carts = await db.collection('carts')
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Enrich with user and listing data
    const enrichedOrders = await Promise.all(
      carts.map(async (cart) => {
        const user = await db.collection('users').findOne({
          _id: cart.userId
        })

        const items = await Promise.all(
          (cart.items || []).map(async (item: any) => {
            const listing = await db.collection('listings').findOne({
              _id: item.listingId
            })
            return {
              listingId: item.listingId.toString(),
              quantity: item.quantity,
              addedAt: item.addedAt,
              listing: listing ? {
                partNumber: listing.partNumber,
                manufacturer: listing.manufacturer,
                unitPriceJPY: listing.unitPriceJPY,
                category: listing.category
              } : null
            }
          })
        )

        const totalAmount = items.reduce((sum, item) => {
          return sum + (item.listing?.unitPriceJPY || 0) * item.quantity
        }, 0)

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

        return {
          id: cart._id.toString(),
          userId: cart.userId.toString(),
          user: user ? {
            email: user.email,
            name: user.name || 'ー',
            companyName: user.companyName || 'ー'
          } : null,
          items,
          totalItems,
          totalAmount,
          status: cart.status || 'pending',
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt
        }
      })
    )

    // Calculate revenue statistics
    const totalRevenue = enrichedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const averageOrderValue = enrichedOrders.length > 0 ? totalRevenue / enrichedOrders.length : 0

    return NextResponse.json({
      orders: enrichedOrders,
      statistics: {
        totalRevenue,
        averageOrderValue,
        totalOrders: enrichedOrders.length
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}