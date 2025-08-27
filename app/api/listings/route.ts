import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { z } from 'zod'

// GET /api/listings - 出品一覧・検索
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    
    // Search parameters
    const q = searchParams.get('q')
    const manufacturer = searchParams.get('manufacturer')
    const category = searchParams.get('category')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const stockStatus = searchParams.get('stockStatus')
    
    // Build query
    const query: any = {}
    
    // Text search (part number or manufacturer)
    if (q) {
      query.$or = [
        { partNumber: { $regex: q, $options: 'i' } },
        { manufacturer: { $regex: q, $options: 'i' } }
      ]
    }
    
    // Manufacturer filter
    if (manufacturer) {
      query.manufacturer = { $regex: manufacturer, $options: 'i' }
    }
    
    // Category filter
    if (category) {
      query.category = category
    }
    
    // Price range filter
    if (priceMin || priceMax) {
      query.unitPriceJPY = {}
      if (priceMin) query.unitPriceJPY.$gte = parseInt(priceMin)
      if (priceMax) query.unitPriceJPY.$lte = parseInt(priceMax)
    }
    
    // Stock status filter
    if (stockStatus === 'in_stock') {
      query.quantity = { $gt: 100 }
    } else if (stockStatus === 'limited') {
      query.quantity = { $gt: 0, $lte: 100 }
    } else if (stockStatus === 'pre_order') {
      query.quantity = 0
    }
    
    // Execute query with pagination
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const listings = await db.collection('listings')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray()
    
    const total = await db.collection('listings').countDocuments(query)
    
    return NextResponse.json({
      listings: listings.map(listing => ({
        ...listing,
        _id: listing._id.toString()
      })),
      total,
      limit,
      offset
    })
    
  } catch (error) {
    console.error('Listings GET error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// Validation schema for creating listings
const createListingSchema = z.object({
  partNumber: z.string().min(1, '部品番号は必須です'),
  manufacturer: z.string().min(1, 'メーカー名は必須です'),
  quantity: z.number().min(0, '数量は0以上である必要があります'),
  unitPriceJPY: z.number().min(0, '価格は0以上である必要があります'),
  dateCode: z.string().optional(),
  stockSource: z.enum(['authorized', 'open_market']),
  condition: z.enum(['new', 'used']),
  warranty: z.string().optional(),
  category: z.string().optional(),
  images: z.array(z.string()).optional().default([])
})

// POST /api/listings - 新規出品作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = createListingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      )
    }

    // TODO: Get user from token
    const sellerId = 'temp-seller-id' // This should come from JWT token
    
    const { db } = await connectToDatabase()
    
    const listing = {
      ...validationResult.data,
      sellerId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('listings').insertOne(listing)
    
    return NextResponse.json({
      message: '出品を作成しました',
      listingId: result.insertedId.toString()
    }, { status: 201 })
    
  } catch (error) {
    console.error('Listings POST error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}