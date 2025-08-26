// 個別注文の取得・更新API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 個別注文取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効な注文IDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // 認証チェック
    const authResult = requireAuth(['buyer', 'seller', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const orders = db.collection('orders')
    
    const order = await orders.findOne({ _id: new ObjectId(id) })
    
    if (!order) {
      return NextResponse.json(
        { error: '注文が見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    // アクセス権限チェック（関係者または管理者のみ）
    const isAdmin = user.role === 'admin'
    const isBuyer = order.buyerUserId.toString() === user.uid
    const isSeller = order.sellerId && order.sellerId.toString() === user.uid
    
    if (!isAdmin && !isBuyer && !isSeller) {
      return NextResponse.json(
        { error: 'この注文にアクセスする権限がありません', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      ...order,
      id: order._id.toString(),
      _id: undefined
    })
    
  } catch (error) {
    console.error('Order fetch error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}

// 注文ステータス更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効な注文IDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // 認証チェック
    const authResult = requireAuth(['buyer', 'seller', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult
    
    const body = await request.json()
    const { status } = body
    
    // ステータスバリデーション
    const validStatuses = ['created', 'paid', 'canceled', 'fulfilled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: '無効なステータスです',
          code: 'INVALID_STATUS',
          validStatuses 
        },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const orders = db.collection('orders')
    const lots = db.collection('inventoryLots')
    
    // 既存の注文を取得
    const existingOrder = await orders.findOne({ _id: new ObjectId(id) })
    if (!existingOrder) {
      return NextResponse.json(
        { error: '注文が見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    // アクセス権限チェック
    const isAdmin = user.role === 'admin'
    const isBuyer = existingOrder.buyerUserId.toString() === user.uid
    const isSeller = existingOrder.sellerId && existingOrder.sellerId.toString() === user.uid
    
    if (!isAdmin && !isBuyer && !isSeller) {
      return NextResponse.json(
        { error: 'この注文を更新する権限がありません', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }
    
    // キャンセル時の在庫巻き戻し処理
    if (status === 'canceled' && existingOrder.status !== 'canceled') {
      const session = client.startSession()
      
      try {
        await session.withTransaction(async () => {
          // 在庫を巻き戻し
          await lots.updateOne(
            { _id: existingOrder.lotId },
            { 
              $inc: { availableQty: existingOrder.quantity },
              $set: { updatedAt: new Date() }
            },
            { session }
          )
          
          // 注文ステータス更新
          await orders.updateOne(
            { _id: new ObjectId(id) },
            { 
              $set: { 
                status: 'canceled',
                canceledAt: new Date(),
                updatedAt: new Date()
              }
            },
            { session }
          )
        })
        
        console.log('Order canceled with stock rollback:', { 
          requestId, 
          orderId: id,
          quantity: existingOrder.quantity,
          lotId: existingOrder.lotId.toString()
        })
        
      } finally {
        await session.endSession()
      }
      
    } else {
      // 通常のステータス更新
      await orders.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            updatedAt: new Date(),
            ...(status === 'paid' && { paidAt: new Date() }),
            ...(status === 'fulfilled' && { fulfilledAt: new Date() })
          }
        }
      )
      
      console.log('Order status updated:', { 
        requestId, 
        orderId: id,
        newStatus: status
      })
    }
    
    // 更新後の注文を取得
    const updatedOrder = await orders.findOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({
      ok: true,
      message: '注文ステータスを更新しました',
      order: {
        ...updatedOrder,
        id: updatedOrder!._id.toString(),
        _id: undefined
      }
    })
    
  } catch (error) {
    console.error('Order update error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}