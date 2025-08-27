import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      )
    }
    
    const listing = await db.collection('listings').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!listing) {
      return NextResponse.json(
        { error: '商品が見つかりませんでした' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      listing: {
        ...listing,
        _id: listing._id.toString()
      }
    })
    
  } catch (error) {
    console.error('Listing detail error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}