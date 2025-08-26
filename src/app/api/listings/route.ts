// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET(_request: NextRequest) {
  try {
    const listings = await prismaMock.listing.findMany()
    return NextResponse.json(listings)
  } catch (error) {
    console.error('Listings fetch error:', error)
    return NextResponse.json(
      { error: '出品一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    console.log('📝 Listing POST - Session email:', session.user.email)

    const data = await request.json()

    // ユーザーを取得（最新のロール情報を含む）
    let user = await prismaMock.user.findUnique({
      where: { email: session.user.email }
    })

    console.log('👤 User found for listing:', user ? { id: user.id, email: user.email, roles: user.roles } : 'No user')

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // Auto-register as seller if not already
    if (!user.roles || !user.roles.includes('seller')) {
      console.log('🔄 Auto-registering user as seller')
      try {
        user = await prismaMock.user.update({
          where: { id: user.id },
          data: {
            roles: [...(user.roles || []), 'seller']
          }
        })
        console.log('✅ User updated to seller, new roles:', user.roles)
      } catch (error) {
        console.warn('Failed to auto-register as seller:', error)
      }
    } else {
      console.log('✅ User already has seller role:', user.roles)
    }

    // Get or create SellerProfile
    let sellerProfile = await prismaMock.sellerProfile.findUnique({
      where: { userId: user.id }
    })

    if (!sellerProfile) {
      // Create default seller profile
      sellerProfile = await prismaMock.sellerProfile.create({
        data: {
          userId: user.id,
          tier: 'T0',
          listingCap: 10,
          holdDays: 7,
          kycStatus: 'pending',
          payoutsEnabled: false,
          completedSales: 0,
          totalRevenue: 0,
          avgRating: 0,
          totalRatings: 0
        }
      })
    }

    // 現在の出品数をチェック
    const currentListings = await prismaMock.listing.findMany()
    const userListings = currentListings.filter(listing => listing.sellerId === user.id)
    
    if (userListings.length >= sellerProfile.listingCap) {
      return NextResponse.json(
        { error: `出品上限に達しています。現在の上限: ${sellerProfile.listingCap}件` },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.mpn || !data.quantity || !data.pricePerUnitJPY) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // Create listing
    console.log('📦 Creating listing with data:', { mpn: data.mpn, sellerId: user.id, quantity: data.quantity, pricePerUnitJPY: data.pricePerUnitJPY })
    
    const listing = await prismaMock.listing.create({
      data: {
        mpn: data.mpn,
        quantity: data.quantity,
        dateCode: data.dateCode || '',
        sourceRoute: data.sourceRoute || 'authorized_distributor',
        warranty: data.warranty ?? true,
        pricePerUnitJPY: data.pricePerUnitJPY,
        photos: data.photos || [],
        description: data.description || '',
        status: 'pending', // 新規出品は審査待ち
        sellerId: user.id
      }
    })
    
    console.log('✅ Listing created successfully:', { id: listing.id, mpn: listing.mpn, sellerId: listing.sellerId })

    // 監査ログを作成
    await prismaMock.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'create_listing',
        targetType: 'listing',
        targetId: listing.id,
        payload: { listingData: data }
      }
    })

    // Return listing with seller info for debugging
    const listingWithSeller = await prismaMock.listing.findUnique({
      where: { id: listing.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log('📤 Returning listing:', { id: listing.id, sellerId: listing.sellerId })
    return NextResponse.json(listingWithSeller || listing)

  } catch (error) {
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: '出品の作成に失敗しました' },
      { status: 500 }
    )
  }
}