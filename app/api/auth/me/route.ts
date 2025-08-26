// 現在のユーザー情報取得API
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        user: null
      })
    }
    
    // MongoDB接続して最新のユーザー情報を取得
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const users = db.collection('users')
    
    const userData = await users.findOne(
      { _id: new ObjectId(user.uid) },
      { 
        projection: { 
          passwordHash: 0 // パスワードハッシュは除外
        } 
      }
    )
    
    if (!userData) {
      return NextResponse.json({
        user: null
      })
    }
    
    return NextResponse.json({
      user: {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt
      }
    })
    
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json({
      user: null
    })
  }
}