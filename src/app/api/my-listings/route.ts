// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // ユーザーを取得
    const user = await prismaMock.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // sellerロールを持っているかチェック
    console.log('🔍 my-listings: User roles found:', user.roles)
    if (!user.roles || !user.roles.includes('seller')) {
      console.log('❌ my-listings: User does not have seller role')
      return NextResponse.json(
        { error: '出品者ロールが必要です' },
        { status: 403 }
      )
    }
    console.log('✅ my-listings: User has seller role, proceeding')

    // ユーザーの出品一覧を取得
    const allListings = await prismaMock.listing.findMany()
    const userListings = allListings.filter(listing => listing.sellerId === user.id)

    return NextResponse.json(userListings)

  } catch (error) {
    console.error('My listings fetch error:', error)
    return NextResponse.json(
      { error: '出品一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}