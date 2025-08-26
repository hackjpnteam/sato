// 個別在庫ロットの取得・更新API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { InventoryLotSchema } from '@/lib/validate'
import { requireOwnerOrAdmin, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 個別在庫ロット取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効なロットIDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const lots = db.collection('inventoryLots')
    
    const lot = await lots.findOne({ _id: new ObjectId(id) })
    
    if (!lot) {
      return NextResponse.json(
        { error: '在庫ロットが見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...lot,
      id: lot._id.toString(),
      _id: undefined
    })
    
  } catch (error) {
    console.error('Inventory lot fetch error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}

// 在庫ロット更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効なロットIDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const lots = db.collection('inventoryLots')
    
    // 既存のロットを取得
    const existingLot = await lots.findOne({ _id: new ObjectId(id) })
    if (!existingLot) {
      return NextResponse.json(
        { error: '在庫ロットが見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    // 所有者または管理者権限チェック
    const authResult = requireOwnerOrAdmin(existingLot.sellerId.toString())
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const body = await request.json()
    
    // 部分更新用のスキーマ
    const PartialInventoryLotSchema = InventoryLotSchema.partial()
    
    const validationResult = PartialInventoryLotSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }
    
    const updateData = validationResult.data
    
    // 数値の正規化
    if (updateData.availableQty !== undefined) {
      updateData.availableQty = Number(updateData.availableQty)
      
      // 在庫数は0以上である必要がある
      if (updateData.availableQty < 0) {
        return NextResponse.json(
          { 
            error: '在庫数は0以上である必要があります',
            code: 'INVALID_QUANTITY' 
          },
          { status: 400 }
        )
      }
    }
    
    // 更新実行
    const result = await lots.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    
    console.log('Inventory lot updated successfully:', { 
      requestId, 
      lotId: id,
      updatedFields: Object.keys(updateData)
    })
    
    return NextResponse.json({
      ok: true,
      message: '在庫ロットを更新しました',
      lot: {
        ...result,
        id: result!._id.toString(),
        _id: undefined
      }
    })
    
  } catch (error) {
    console.error('Inventory lot update error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}