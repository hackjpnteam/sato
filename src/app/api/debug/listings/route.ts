// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextResponse } from 'next/server'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET() {
  try {
    // Get all listings with seller info
    const listings = await prismaMock.listing.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true
          }
        }
      }
    })

    console.log('🔍 Debug: All listings in database:', listings)
    
    return NextResponse.json({
      count: listings.length,
      listings: listings
    })
  } catch (error) {
    console.error('Debug listings fetch error:', error)
    return NextResponse.json(
      { error: 'Debug fetch failed', details: error },
      { status: 500 }
    )
  }
}