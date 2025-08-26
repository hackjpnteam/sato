// 個別出品の取得・更新・削除API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ListingSchema } from '@/lib/validate'
import { requireOwnerOrAdmin, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 個別出品取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効な出品IDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const listings = db.collection('listings')
    
    const listing = await listings.findOne({ _id: new ObjectId(id) })
    
    if (!listing) {
      return NextResponse.json(
        { error: '出品が見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...listing,
      id: listing._id.toString(),
      _id: undefined
    })
    
  } catch (error) {
    console.error('Listing fetch error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}

// 出品更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効な出品IDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const listings = db.collection('listings')
    
    // 既存の出品を取得
    const existingListing = await listings.findOne({ _id: new ObjectId(id) })
    if (!existingListing) {
      return NextResponse.json(
        { error: '出品が見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    // 所有者または管理者権限チェック
    const authResult = requireOwnerOrAdmin(existingListing.sellerId.toString())
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const body = await request.json()
    
    // 部分更新用のスキーマ（必須項目をオプショナルに）
    const PartialListingSchema = ListingSchema.partial()
    
    const validationResult = PartialListingSchema.safeParse(body)
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
    
    const updateData = validationResult.data
    
    // 数値の正規化
    if (updateData.quantity !== undefined) {
      updateData.quantity = Number(updateData.quantity)
    }
    if (updateData.unitPriceJPY !== undefined) {
      updateData.unitPriceJPY = Number(updateData.unitPriceJPY)
    }
    
    // 更新実行
    const result = await listings.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    
    console.log('Listing updated successfully:', { 
      requestId, 
      listingId: id,
      updatedFields: Object.keys(updateData)
    })
    
    return NextResponse.json({
      ok: true,
      message: '出品を更新しました',
      listing: {
        ...result,
        id: result!._id.toString(),
        _id: undefined
      }
    })
    
  } catch (error) {
    console.error('Listing update error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}

// 出品削除（論理削除：statusをpausedに変更）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '無効な出品IDです', code: 'INVALID_ID' },
        { status: 400 }
      )
    }
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const listings = db.collection('listings')
    
    // 既存の出品を取得
    const existingListing = await listings.findOne({ _id: new ObjectId(id) })
    if (!existingListing) {
      return NextResponse.json(
        { error: '出品が見つかりません', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }
    
    // 所有者または管理者権限チェック
    const authResult = requireOwnerOrAdmin(existingListing.sellerId.toString())
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    // 論理削除（ステータスをpausedに変更）
    await listings.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'paused',
          updatedAt: new Date()
        }
      }
    )
    
    console.log('Listing paused successfully:', { 
      requestId, 
      listingId: id
    })
    
    return NextResponse.json({
      ok: true,
      message: '出品を一時停止しました'
    })
    
  } catch (error) {
    console.error('Listing deletion error:', error, { requestId, id: params.id })
    return createInternalErrorResponse(requestId)
  }
}