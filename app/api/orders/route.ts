// 注文作成API（在庫減算トランザクション）
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { OrderCreateSchema } from '@/lib/validate'
import { requireAuth, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 注文作成
export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 認証チェック（buyer、seller、admin全て可能）
    const authResult = requireAuth(['buyer', 'seller', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult
    
    const body = await request.json()
    
    // バリデーション
    const validationResult = OrderCreateSchema.safeParse(body)
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
    
    const { listingId, lotId, quantity } = validationResult.data
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    
    // トランザクション開始
    const session = client.startSession()
    
    try {
      const result = await session.withTransaction(async () => {
        const listings = db.collection('listings')
        const lots = db.collection('inventoryLots')
        const orders = db.collection('orders')
        
        // 1. 出品情報を取得
        const listing = await listings.findOne(
          { _id: new ObjectId(listingId) },
          { session }
        )
        
        if (!listing) {
          throw new Error('LISTING_NOT_FOUND')
        }
        
        if (listing.status !== 'active') {
          throw new Error('LISTING_NOT_ACTIVE')
        }
        
        // 2. 在庫ロットを取得して在庫数をチェック
        const lot = await lots.findOne(
          { _id: new ObjectId(lotId) },
          { session }
        )
        
        if (!lot) {
          throw new Error('LOT_NOT_FOUND')
        }
        
        if (lot.availableQty < quantity) {
          throw new Error('INSUFFICIENT_STOCK')
        }
        
        // 3. 在庫減算
        const stockUpdateResult = await lots.updateOne(
          { 
            _id: new ObjectId(lotId),
            availableQty: { $gte: quantity } // 再度在庫確認（競合状態対策）
          },
          { 
            $inc: { availableQty: -quantity },
            $set: { updatedAt: new Date() }
          },
          { session }
        )
        
        if (stockUpdateResult.matchedCount === 0) {
          throw new Error('STOCK_UPDATE_FAILED')
        }
        
        // 4. 注文作成
        const now = new Date()
        const unitPrice = Number(listing.unitPriceJPY)
        const totalPrice = unitPrice * quantity
        
        const newOrder = {
          buyerUserId: new ObjectId(user.uid),
          sellerId: listing.sellerId,
          listingId: new ObjectId(listingId),
          lotId: new ObjectId(lotId),
          quantity: Number(quantity),
          unitPriceJPY: unitPrice,
          totalJPY: totalPrice,
          status: 'created',
          createdAt: now,
          updatedAt: now,
        }
        
        const orderResult = await orders.insertOne(newOrder, { session })
        
        if (!orderResult.insertedId) {
          throw new Error('ORDER_CREATION_FAILED')
        }
        
        // 5. 出品の在庫数を更新（必要に応じて）
        const updatedListingQuantity = listing.quantity - quantity
        if (updatedListingQuantity <= 0) {
          // 在庫切れの場合は出品をsoldoutに変更
          await listings.updateOne(
            { _id: new ObjectId(listingId) },
            { 
              $set: { 
                status: 'soldout',
                quantity: 0,
                updatedAt: now
              }
            },
            { session }
          )
        } else {
          // 在庫数のみ更新
          await listings.updateOne(
            { _id: new ObjectId(listingId) },
            { 
              $set: { 
                quantity: updatedListingQuantity,
                updatedAt: now
              }
            },
            { session }
          )
        }
        
        return {
          orderId: orderResult.insertedId.toString(),
          totalJPY: totalPrice,
          listing: {
            partNumber: listing.partNumber,
            manufacturer: listing.manufacturer
          }
        }
      })
      
      console.log('Order created successfully:', { 
        requestId, 
        orderId: result.orderId,
        buyerId: user.uid,
        listingId,
        lotId,
        quantity,
        totalJPY: result.totalJPY
      })
      
      return NextResponse.json(
        {
          ok: true,
          message: '注文を作成しました',
          orderId: result.orderId,
          totalJPY: result.totalJPY,
          listing: result.listing
        },
        { status: 201 }
      )
      
    } finally {
      await session.endSession()
    }
    
  } catch (error: any) {
    console.error('Order creation error:', error, { requestId })
    
    // ビジネスロジックエラーのハンドリング
    switch (error.message) {
      case 'LISTING_NOT_FOUND':
        return NextResponse.json(
          { error: '出品が見つかりません', code: 'LISTING_NOT_FOUND' },
          { status: 404 }
        )
      case 'LISTING_NOT_ACTIVE':
        return NextResponse.json(
          { error: 'この出品は現在利用できません', code: 'LISTING_NOT_ACTIVE' },
          { status: 409 }
        )
      case 'LOT_NOT_FOUND':
        return NextResponse.json(
          { error: '在庫ロットが見つかりません', code: 'LOT_NOT_FOUND' },
          { status: 404 }
        )
      case 'INSUFFICIENT_STOCK':
      case 'STOCK_UPDATE_FAILED':
        return NextResponse.json(
          { error: '在庫が不足しています', code: 'INSUFFICIENT_STOCK' },
          { status: 409 }
        )
      case 'ORDER_CREATION_FAILED':
        return NextResponse.json(
          { error: '注文の作成に失敗しました', code: 'ORDER_CREATION_FAILED' },
          { status: 500 }
        )
      default:
        return createInternalErrorResponse(requestId)
    }
  }
}