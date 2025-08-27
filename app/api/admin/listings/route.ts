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
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    // Build filter
    let filter: any = {}
    
    if (search) {
      filter.$or = [
        { partNumber: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (category) {
      filter.category = category
    }
    
    if (status === 'active') {
      filter.quantity = { $gt: 0 }
    } else if (status === 'soldout') {
      filter.quantity = { $lte: 0 }
    }

    // Get total count
    const totalCount = await db.collection('listings').countDocuments(filter)

    // Get listings with pagination
    const listings = await db.collection('listings')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Enrich with seller data
    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        const seller = await db.collection('users').findOne({
          _id: listing.sellerId
        })

        // Get question count
        const questionCount = await db.collection('questions').countDocuments({
          listingId: listing._id
        })

        return {
          id: listing._id.toString(),
          partNumber: listing.partNumber,
          manufacturer: listing.manufacturer,
          category: listing.category,
          quantity: listing.quantity,
          unitPriceJPY: listing.unitPriceJPY,
          condition: listing.condition,
          stockSource: listing.stockSource,
          seller: seller ? {
            id: seller._id.toString(),
            email: seller.email,
            name: seller.name || 'ー',
            companyName: seller.companyName || 'ー'
          } : null,
          questionCount,
          totalValue: listing.quantity * listing.unitPriceJPY,
          status: listing.quantity > 0 ? 'active' : 'soldout',
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt
        }
      })
    )

    // Calculate statistics
    const totalValue = enrichedListings.reduce((sum, listing) => sum + listing.totalValue, 0)
    const averagePrice = enrichedListings.length > 0 
      ? enrichedListings.reduce((sum, listing) => sum + listing.unitPriceJPY, 0) / enrichedListings.length 
      : 0

    return NextResponse.json({
      listings: enrichedListings,
      statistics: {
        totalListings: enrichedListings.length,
        totalValue,
        averagePrice,
        activeListings: enrichedListings.filter(l => l.status === 'active').length,
        soldOutListings: enrichedListings.filter(l => l.status === 'soldout').length
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Admin listings error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// DELETE listing (admin only)
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

    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
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

    // Delete the listing
    const result = await db.collection('listings').deleteOne({
      _id: new ObjectId(listingId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: '出品が見つかりません' },
        { status: 404 }
      )
    }

    // Also delete related questions
    await db.collection('questions').deleteMany({
      listingId: new ObjectId(listingId)
    })

    // Remove from carts
    await db.collection('carts').updateMany(
      { 'items.listingId': new ObjectId(listingId) },
      { $pull: { items: { listingId: new ObjectId(listingId) } } as any }
    )

    return NextResponse.json({
      message: '出品を削除しました',
      success: true
    })
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}