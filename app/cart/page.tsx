'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

// Fallback components
const Button = ({ children, onClick, className = '', disabled = false, variant = 'default' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : variant === 'danger'
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </button>
)

export default function CartPage() {
  const { items, totalQuantity, totalPrice, loading, updateQuantity, removeFromCart } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleQuantityUpdate = async (listingId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setUpdatingItems(prev => new Set([...prev, listingId]))
    try {
      await updateQuantity(listingId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(listingId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (listingId: string) => {
    setRemovingItems(prev => new Set([...prev, listingId]))
    try {
      const success = await removeFromCart(listingId)
      if (success) {
        // アイテムが削除された場合の処理は useCart で自動的に行われる
      }
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(listingId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">🔄 カートを読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          🛒 ショッピングカート
        </h1>
        <p className="text-gray-600">
          {totalQuantity > 0 ? `${totalQuantity}個の商品` : 'カートは空です'}
        </p>
      </div>

      {items.length === 0 ? (
        // 空のカート
        <div className="bg-white rounded-2xl p-12 text-center border">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            カートに商品がありません
          </h2>
          <p className="text-gray-600 mb-8">
            お気に入りの半導体部品を見つけてカートに追加しましょう
          </p>
          <div className="space-y-3">
            <a
              href="/search"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 部品を探す
            </a>
            <br />
            <a
              href="/listings"
              className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              📋 出品一覧を見る
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* カートアイテム一覧 */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.listingId} className="bg-white rounded-2xl p-6 border shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* 商品画像 */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-2xl">🔌</div>
                    </div>
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 break-all">
                          {item.listing.partNumber}
                        </h3>
                        <p className="text-sm text-gray-600">{item.listing.manufacturer}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.listingId)}
                        disabled={removingItems.has(item.listingId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="カートから削除"
                      >
                        {removingItems.has(item.listingId) ? '⏳' : '🗑️'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.listing.condition === 'new' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.listing.condition === 'new' ? '✨ 新品' : '🔧 中古'}
                      </span>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {item.listing.stockSource === 'authorized' ? '🏢 正規代理店' : '🏪 二次市場'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* 数量調整 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">数量:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityUpdate(item.listingId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.listingId)}
                            className="px-2 py-1 hover:bg-gray-50 transition-colors text-sm"
                          >
                            −
                          </button>
                          <div className="px-3 py-1 text-sm border-l border-r border-gray-300">
                            {updatingItems.has(item.listingId) ? '⏳' : item.quantity}
                          </div>
                          <button
                            onClick={() => handleQuantityUpdate(item.listingId, item.quantity + 1)}
                            disabled={updatingItems.has(item.listingId)}
                            className="px-2 py-1 hover:bg-gray-50 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 価格 */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ¥{item.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          ¥{item.listing.unitPriceJPY.toLocaleString()} × {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <a
                        href={`/listings/${item.listing._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        📄 商品詳細を見る
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 注文サマリー */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📊 注文サマリー</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品数:</span>
                    <span className="font-medium">{totalQuantity}個</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">小計:</span>
                    <span className="font-medium">¥{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">送料:</span>
                    <span className="font-medium">計算中</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">合計:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ¥{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full py-3 text-lg font-bold">
                    ⚡ 今すぐ購入
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3"
                    onClick={() => window.history.back()}
                  >
                    ← 買い物を続ける
                  </Button>
                </div>

                <div className="mt-6 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    <span>SSL暗号化通信で安全</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📦</span>
                    <span>匿名配送対応</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>品質保証付き</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}