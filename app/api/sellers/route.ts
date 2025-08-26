// 出品者一覧・登録API
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { SellerSchema } from '@/lib/validate'
import { requireSeller, createInternalErrorResponse } from '@/lib/guard'
import { ObjectId } from 'mongodb'

// 出品者一覧取得
export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const { searchParams } = new URL(request.url)
    const companyName = searchParams.get('companyName')
    const verified = searchParams.get('verified')
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const sellers = db.collection('sellers')
    
    // クエリ構築
    const query: Record<string, unknown> = {}
    
    if (companyName) {
      // 会社名の部分一致検索（大小文字無視）
      query.companyName = { $regex: companyName, $options: 'i' }
    }
    
    if (verified === 'true') {
      query.verified = true
    } else if (verified === 'false') {
      query.verified = false
    }
    
    // 結果取得（作成日時降順）
    const results = await sellers
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
    
    // 総件数取得
    const total = await sellers.countDocuments(query)
    
    console.log('Sellers fetched:', { 
      requestId, 
      query, 
      count: results.length,
      total 
    })
    
    return NextResponse.json({
      sellers: results.map(seller => ({
        ...seller,
        id: seller._id.toString(),
        _id: undefined
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + results.length < total
      }
    })
    
  } catch (error: unknown) {
    console.error('Sellers fetch error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}

// 出品者登録
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
    const validationResult = SellerSchema.safeParse(body)
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
    
    const data = validationResult.data
    
    // MongoDB接続
    const client = await clientPromise
    const db = client.db('semiconductor-marketplace')
    const sellers = db.collection('sellers')
    
    // 既存の出品者情報をチェック
    const existingSeller = await sellers.findOne({ 
      ownerUserId: new ObjectId(user.uid) 
    })
    
    if (existingSeller) {
      return NextResponse.json(
        { 
          error: '既に出品者として登録されています',
          code: 'SELLER_ALREADY_EXISTS',
          sellerId: existingSeller._id.toString()
        },
        { status: 409 }
      )
    }
    
    // 出品者登録
    const now = new Date()
    const newSeller = {
      ...data,
      ownerUserId: new ObjectId(user.uid),
      verified: false, // デフォルトは未認証（管理者のみ変更可能）
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await sellers.insertOne(newSeller)
    
    if (!result.insertedId) {
      console.error('Seller registration failed:', { requestId, userId: user.uid })
      return createInternalErrorResponse(requestId)
    }
    
    // 作成された出品者を取得
    const createdSeller = await sellers.findOne({ _id: result.insertedId })
    
    console.log('Seller registered successfully:', { 
      requestId, 
      sellerId: result.insertedId.toString(),
      ownerUserId: user.uid,
      companyName: data.companyName
    })
    
    return NextResponse.json(
      {
        ok: true,
        message: '出品者として登録しました',
        seller: {
          ...createdSeller,
          id: createdSeller!._id.toString(),
          _id: undefined
        }
      },
      { status: 201 }
    )
    
  } catch (error: unknown) {
    console.error('Seller registration error:', error, { requestId })
    return createInternalErrorResponse(requestId)
  }
}