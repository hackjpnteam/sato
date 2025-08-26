// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Search, User, ShoppingCart, Package } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              半導体マーケット
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/listings" className="hover:text-primary">
                出品一覧
              </Link>
              <Link href="/sell" className="hover:text-primary">
                出品する
              </Link>
              {session?.user?.roles?.includes('seller') && (
                <Link href="/seller/listings" className="hover:text-primary">
                  出品管理
                </Link>
              )}
              {(session?.user?.roles?.includes('admin') || session?.user?.roles?.includes('operator')) && (
                <Link href="/admin" className="hover:text-primary">
                  管理画面
                </Link>
              )}
            </nav>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="型番で検索（例：SN74LVC14APWR）"
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <span>読み込み中...</span>
            ) : session ? (
              <>
                <Link href="/orders" className="hover:text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                {session.user?.roles?.includes('seller') && (
                  <Link href="/sell" className="hover:text-primary">
                    <Button size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      出品する
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <div className="flex items-center space-x-2 hover:text-blue-600">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{session.user?.email}</span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    ログイン
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    新規登録
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}