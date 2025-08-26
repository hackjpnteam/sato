// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('🔍 Individual listing fetch for ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: '商品IDが必要です' },
        { status: 400 }
      )
    }

    // Get listing with seller information
    console.log('📎 Searching for listing with ID:', id)
    const listing = await prismaMock.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            contactPerson: true,
            companyAddress: true
          }
        }
      }
    })
    
    console.log('👁️ Listing found:', listing ? { id: listing.id, mpn: listing.mpn, sellerId: listing.sellerId } : 'Not found')

    if (!listing) {
      console.log('❌ Listing not found, returning 404')
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // Transform data to match expected format
    const formattedListing = {
      id: listing.id,
      mpn: listing.mpn,
      manufacturer: 'Unknown', // We don't store manufacturer separately in our schema
      quantity: listing.quantity,
      dateCode: listing.dateCode || 'Unknown',
      sourceRoute: getSourceRouteLabel(listing.sourceRoute),
      warranty: listing.warranty,
      pricePerUnitJPY: listing.pricePerUnitJPY,
      photos: listing.photos || [],
      description: listing.description || '',
      status: listing.status,
      seller: {
        id: listing.seller.id,
        company: listing.seller.companyName || listing.seller.name || 'Unknown Company',
        email: listing.seller.email,
        contactName: listing.seller.contactPerson || listing.seller.name || 'Contact Person',
        address: listing.seller.companyAddress || 'Address not provided'
      },
      createdAt: new Date(listing.createdAt)
    }

    console.log('✅ Returning formatted listing:', { id: formattedListing.id, mpn: formattedListing.mpn })
    return NextResponse.json(formattedListing)

  } catch (error) {
    console.error('Individual listing fetch error:', error)
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    )
  }
}

function getSourceRouteLabel(sourceRoute: string): string {
  switch (sourceRoute) {
    case 'authorized_distributor':
      return '正規代理店'
    case 'manufacturer_direct':
      return 'メーカー直送'
    case 'secondary_market':
      return '二次市場'
    case 'excess_inventory':
      return '余剰在庫'
    default:
      return sourceRoute
  }
}