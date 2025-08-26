// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prismaMock } from '@/lib/prisma-mock'

export async function POST() {
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

    console.log('🔍 Current user roles before update:', user.roles)
    
    // 既にsellerロールを持っているかチェック
    if (user.roles && user.roles.includes('seller')) {
      console.log('❌ User already has seller role')
      return NextResponse.json(
        { error: '既に出品者です' },
        { status: 400 }
      )
    }

    // ユーザーにsellerロールを追加
    const newRoles = [...(user.roles || []), 'seller']
    console.log('🔄 Updating user roles to:', newRoles)
    const updatedUser = await prismaMock.user.update({
      where: { id: user.id },
      data: {
        roles: newRoles
      }
    })
    console.log('✅ User roles updated to:', updatedUser.roles)

    // SellerProfileを作成
    const sellerProfile = await prismaMock.sellerProfile.create({
      data: {
        userId: user.id,
        tier: 'T0',
        listingCap: 10,
        holdDays: 7,
        payoutsEnabled: false,
        kycStatus: 'pending',
        totalOrders: 0,
        fulfilledOrders: 0,
        canceledOrders: 0,
        averageRating: 0,
        ratingCount: 0
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      sellerProfile: sellerProfile
    })

  } catch (error) {
    console.error('出品者登録エラー:', error)
    return NextResponse.json(
      { error: '出品者登録に失敗しました' },
      { status: 500 }
    )
  }
}