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

export async function GET() {
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

    // Check if user is admin or seller
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

    // Get statistics
    const [
      totalUsers,
      totalListings,
      totalOrders,
      recentUsers,
      recentListings,
      topSellingItems
    ] = await Promise.all([
      // Total users count
      db.collection('users').countDocuments(),
      
      // Total listings count
      db.collection('listings').countDocuments(),
      
      // Total orders (carts with items)
      db.collection('carts').countDocuments({ items: { $exists: true, $not: { $size: 0 } } }),
      
      // Recent users (last 7 days)
      db.collection('users').find({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ createdAt: -1 }).limit(5).toArray(),
      
      // Recent listings (last 7 days)
      db.collection('listings').find({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ createdAt: -1 }).limit(5).toArray(),
      
      // Top selling items (by questions count)
      db.collection('listings').find({})
        .sort({ questionCount: -1 })
        .limit(5)
        .toArray()
    ])

    // Calculate revenue (sum of all listing prices * quantities in carts)
    const cartsWithItems = await db.collection('carts').find({
      items: { $exists: true, $not: { $size: 0 } }
    }).toArray()

    let totalRevenue = 0
    for (const cart of cartsWithItems) {
      for (const item of cart.items || []) {
        const listing = await db.collection('listings').findOne({
          _id: item.listingId
        })
        if (listing) {
          totalRevenue += (listing.unitPriceJPY || 0) * (item.quantity || 0)
        }
      }
    }

    // Get monthly statistics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [monthlyUsers, monthlyListings] = await Promise.all([
      db.collection('users').countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      }),
      db.collection('listings').countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      })
    ])

    // Category distribution
    const categoryStats = await db.collection('listings').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$unitPriceJPY', '$quantity'] } }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray()

    return NextResponse.json({
      overview: {
        totalUsers,
        totalListings,
        totalOrders,
        totalRevenue,
        monthlyUsers,
        monthlyListings
      },
      recentUsers: recentUsers.map(u => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name || 'ー',
        role: u.role,
        createdAt: u.createdAt
      })),
      recentListings: recentListings.map(l => ({
        id: l._id.toString(),
        partNumber: l.partNumber,
        manufacturer: l.manufacturer,
        price: l.unitPriceJPY,
        quantity: l.quantity,
        createdAt: l.createdAt
      })),
      topSellingItems: topSellingItems.map(l => ({
        id: l._id.toString(),
        partNumber: l.partNumber,
        manufacturer: l.manufacturer,
        price: l.unitPriceJPY,
        questionCount: l.questionCount || 0
      })),
      categoryStats: categoryStats.map(cat => ({
        category: cat._id || 'その他',
        count: cat.count,
        totalValue: cat.totalValue
      }))
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}