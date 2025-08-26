// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET(_request: NextRequest) {
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

    // sellerロールを持っていない場合はエラー
    if (!user.roles || !user.roles.includes('seller')) {
      return NextResponse.json(
        { error: '出品者ロールが必要です' },
        { status: 403 }
      )
    }

    // SellerProfileを取得
    const sellerProfile = await prismaMock.sellerProfile.findUnique({
      where: { userId: user.id }
    })

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'セラープロフィールが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(sellerProfile)

  } catch (error) {
    console.error('セラープロフィール取得エラー:', error)
    return NextResponse.json(
      { error: 'セラープロフィールの取得に失敗しました' },
      { status: 500 }
    )
  }
}