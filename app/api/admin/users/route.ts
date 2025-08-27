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

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role') || ''

    // Build filter
    let filter: any = {}
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ]
    }
    if (roleFilter) {
      filter.role = roleFilter
    }

    // Get total count
    const totalCount = await db.collection('users').countDocuments(filter)

    // Get users with pagination
    const users = await db.collection('users')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Get listing counts for each user
    const userIds = users.map(u => u._id)
    const listingCounts = await db.collection('listings').aggregate([
      { $match: { sellerId: { $in: userIds } } },
      { $group: { _id: '$sellerId', count: { $sum: 1 } } }
    ]).toArray()

    const listingCountMap = new Map(
      listingCounts.map(lc => [lc._id.toString(), lc.count])
    )

    return NextResponse.json({
      users: users.map(u => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name || 'ー',
        role: u.role,
        companyName: u.companyName || 'ー',
        companyPhone: u.companyPhone || 'ー',
        emailVerified: u.emailVerified || false,
        listingCount: listingCountMap.get(u._id.toString()) || 0,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// UPDATE user role
export async function PATCH(request: Request) {
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

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'ユーザーIDとロールが必要です' },
        { status: 400 }
      )
    }

    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: '無効なロールです' },
        { status: 400 }
      )
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role,
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
      message: 'ユーザーロールを更新しました',
      success: true
    })
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}