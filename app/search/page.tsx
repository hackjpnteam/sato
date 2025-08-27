'use client'

import { useState, useEffect } from 'react'

interface Listing {
  _id: string
  partNumber: string
  manufacturer: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode?: string
  warranty?: string
  category?: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [category, setCategory] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [stockStatus, setStockStatus] = useState('')
  const [results, setResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Initial load of all products
  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          setResults(data.listings || [])
        }
      } catch (error) {
        console.error('Load products error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllProducts()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearchPerformed(true)
    
    try {
      const searchParams = new URLSearchParams()
      if (searchQuery.trim()) searchParams.set('q', searchQuery.trim())
      if (manufacturer.trim()) searchParams.set('manufacturer', manufacturer.trim())
      if (category) searchParams.set('category', category)
      if (priceMin) searchParams.set('priceMin', priceMin)
      if (priceMax) searchParams.set('priceMax', priceMax)
      if (stockStatus) searchParams.set('stockStatus', stockStatus)

      const response = await fetch(`/api/listings?${searchParams.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.listings || [])
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    setManufacturer('')
    setCategory('')
    setPriceMin('')
    setPriceMax('')
    setStockStatus('')
    setResults([])
    setSearchPerformed(false)
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">部品検索</h1>
        
        {/* Search Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部品番号・メーカー名
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ESP32-WROOM-32, Espressif Systems など"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  {loading ? '検索中...' : '検索'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メーカー名
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Espressif Systems"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">すべて</option>
                  <option value="microcontroller">マイコン</option>
                  <option value="sensor">センサー</option>
                  <option value="memory">メモリ</option>
                  <option value="power">電源IC</option>
                  <option value="analog">アナログIC</option>
                  <option value="rf">RF・無線</option>
                  <option value="interface">インターフェース</option>
                  <option value="passive">受動部品</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  価格帯（円）
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="最小"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                  <span className="text-gray-500 self-center">-</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="最大"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  在庫状況
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">すべて</option>
                  <option value="in_stock">在庫あり</option>
                  <option value="limited">残りわずか</option>
                  <option value="pre_order">予約受付中</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mr-2 text-sm"
              >
                クリア
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">検索中...</div>
          </div>
        )}

        {searchPerformed && !loading && (
          <div className="mb-4">
            <p className="text-gray-600">
              {results.length > 0 
                ? `${results.length}件の部品が見つかりました` 
                : '条件に一致する部品は見つかりませんでした'
              }
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {results.map((listing) => (
              <div key={listing._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
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
                  <h3 className="text-lg font-semibold text-gray-900 break-all">{listing.partNumber}</h3>
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
                    href={`/listings/${listing._id}`}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center text-sm"
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