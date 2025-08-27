'use client'

import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const { totalQuantity } = useCart()
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap">
                半導体マーケット
              </h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              🏡 ホーム
            </a>
            <a href="/search" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              🔍 部品検索
            </a>
            <a href="/listings" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              📦 出品一覧
            </a>
            <div className="ml-4 pl-4 border-l border-gray-200">
              <a href="/cart" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm relative">
                🛍️ カート
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </a>
              <a href="/account" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                👨‍💼 アカウント
              </a>
            </div>
          </nav>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <a href="/search" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              🔍
            </a>
            <a href="/listings" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              📦
            </a>
            <a href="/cart" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative">
              🛍️
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </a>
            <a href="/account" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              👨‍💼
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}