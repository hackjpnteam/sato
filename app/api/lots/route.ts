// 在庫ロット一覧・作成API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { InventoryLotSchema } from '@/lib/validate'
import { requireSeller, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 在庫ロット一覧取得
export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { searchParams } = new URL(request.url)
    const partNumber = searchParams.get('partNumber')
    const dateCode = searchParams.get('dateCode')
    const source = searchParams.get('source')
    const sellerId = searchParams.get('sellerId')
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const lots = db.collection('inventoryLots')
    
    // クエリ構築
    const query: Record<string, unknown> = {}
    
    if (partNumber) {
      query.partNumber = { $regex: partNumber, $options: 'i' }
    }
    
    if (dateCode) {
      query.dateCode = dateCode
    }
    
    if (source) {
      query.source = source
    }
    
    if (sellerId && ObjectId.isValid(sellerId)) {
      query.sellerId = new ObjectId(sellerId)
    }
    
    // 在庫がある物のみ表示
    query.availableQty = { $gt: 0 }
    
    // 結果取得（在庫数降順）
    const results = await lots
      .find(query)
      .sort({ availableQty: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
    
    // 総件数取得
    const total = await lots.countDocuments(query)
    
    console.log('Inventory lots fetched:', { 
      requestId, 
      query, 
      count: results.length,
      total 
    })
    
    return NextResponse.json({
      lots: results.map(lot => ({
        ...lot,
        id: lot._id.toString(),
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
    console.error('Inventory lots fetch error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}

// 在庫ロット作成
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
    const validationResult = InventoryLotSchema.safeParse(body)
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
      availableQty: Number(data.availableQty),
    }
    
    // 在庫数は0以上である必要がある
    if (normalizedData.availableQty < 0) {
      return NextResponse.json(
        { 
          error: '在庫数は0以上である必要があります',
          code: 'INVALID_QUANTITY' 
        },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const lots = db.collection('inventoryLots')
    
    // 在庫ロット作成
    const now = new Date()
    const newLot = {
      ...normalizedData,
      sellerId: new ObjectId(user.uid),
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await lots.insertOne(newLot)
    
    if (!result.insertedId) {
      console.error('Inventory lot creation failed:', { requestId, userId: user.uid })
      return createInternalErrorResponse(requestId)
    }
    
    // 作成された在庫ロットを取得
    const createdLot = await lots.findOne({ _id: result.insertedId })
    
    console.log('Inventory lot created successfully:', { 
      requestId, 
      lotId: result.insertedId.toString(),
      sellerId: user.uid,
      partNumber: data.partNumber,
      availableQty: data.availableQty
    })
    
    return NextResponse.json(
      {
        ok: true,
        message: '在庫ロットを作成しました',
        lot: {
          ...createdLot,
          id: createdLot!._id.toString(),
          _id: undefined
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Inventory lot creation error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}