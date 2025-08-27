'use client'

import { useState, useEffect } from 'react'

interface Listing {
  id: string
  partNumber: string
  manufacturer: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode?: string
  warranty?: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          setListings(data.listings || [])
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">出品一覧</h1>
        
        {listings.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">出品がありません</h2>
            <p className="text-gray-600 mb-6">
              現在出品されている商品はありません。新規登録してセラー権限を取得し、最初の出品を行ってください。
            </p>
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ホームに戻る
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {/* Product Image */}
                <div className="aspect-square w-full mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="text-xs font-medium text-gray-700">{listing.manufacturer}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{listing.partNumber}</h3>
                  <p className="text-sm text-gray-600">{listing.manufacturer}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">数量:</span>
                    <span className="font-medium">{listing.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">単価:</span>
                    <span className="font-medium">¥{listing.unitPriceJPY.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">状態:</span>
                    <span className="font-medium">{listing.condition === 'new' ? '新品' : '中古'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">入手経路:</span>
                    <span className="font-medium">
                      {listing.stockSource === 'authorized' ? '正規代理店' : '二次市場'}
                    </span>
                  </div>
                  {listing.dateCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">デートコード:</span>
                      <span className="font-medium">{listing.dateCode}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <a 
                    href={`/listings/${listing.id}`}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
                  >
                    詳細を見る
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}