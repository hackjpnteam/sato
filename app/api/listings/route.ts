// 出品一覧・作成API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ListingSchema } from '@/lib/validate'
import { requireSeller, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 出品一覧取得
export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') // 部品番号検索
    const maker = searchParams.get('maker') // メーカー検索
    const status = searchParams.get('status') || 'active' // ステータス
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const listings = db.collection('listings')
    
    // クエリ構築
    const query: Record<string, unknown> = { status }
    
    if (q) {
      // 部品番号の前方一致検索（大小文字無視）
      query.partNumber = { $regex: `^${q}`, $options: 'i' }
    }
    
    if (maker) {
      // メーカー名の部分一致検索
      query.manufacturer = { $regex: maker, $options: 'i' }
    }
    
    // 結果取得（作成日時降順）
    const results = await listings
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
    
    // 総件数取得
    const total = await listings.countDocuments(query)
    
    console.log('Listings fetched:', { 
      requestId, 
      query, 
      count: results.length,
      total 
    })
    
    return NextResponse.json({
      listings: results.map(listing => ({
        ...listing,
        id: listing._id.toString(),
        _id: undefined
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + results.length < total
      }
    })
    
  } catch (error) {
    console.error('Listings fetch error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}

// 出品作成
export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 認証・認可チェック（セラー権限必須）
    const authResult = requireSeller()
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult
    
    const body = await request.json()
    
    // バリデーション
    const validationResult = ListingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    
    // 数値の正規化
    const normalizedData = {
      ...data,
      quantity: Number(data.quantity),
      unitPriceJPY: Number(data.unitPriceJPY),
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const listings = db.collection('listings')
    
    // 出品作成
    const now = new Date()
    const newListing = {
      ...normalizedData,
      sellerId: new ObjectId(user.uid),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await listings.insertOne(newListing)
    
    if (!result.insertedId) {
      console.error('Listing creation failed:', { requestId, userId: user.uid })
      return createInternalErrorResponse(requestId)
    }
    
    // 作成された出品を取得
    const createdListing = await listings.findOne({ _id: result.insertedId })
    
    console.log('Listing created successfully:', { 
      requestId, 
      listingId: result.insertedId.toString(),
      sellerId: user.uid,
      partNumber: data.partNumber
    })
    
    return NextResponse.json(
      {
        ok: true,
        message: '出品を作成しました',
        listing: {
          ...createdListing,
          id: createdListing!._id.toString(),
          _id: undefined
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Listing creation error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}