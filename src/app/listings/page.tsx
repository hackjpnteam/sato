// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Package, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Listing {
  id: string
  mpn: string
  quantity: number
  dateCode: string
  sourceRoute: string
  warranty: boolean
  pricePerUnitJPY: number
  photos: string[]
  description: string
  status: string
  sellerId: string
  createdAt: string
}

// ソースルートラベルの変換
const getSourceRouteLabel = (sourceRoute: string) => {
  switch (sourceRoute) {
    case 'authorized_distributor':
      return '正規代理店'
    case 'manufacturer_direct':
      return 'メーカー直送'
    case 'secondary_market':
      return '二次市場'
    case 'excess_inventory':
      return '余剰在庫'
    default:
      return sourceRoute
  }
}

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [filterWarranty, setFilterWarranty] = useState('all')
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // APIから出品データを取得
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          console.log('📋 Fetched listings:', data)
          setListings(data)
        } else {
          setError('出品一覧の取得に失敗しました')
        }
      } catch (error) {
        console.error('Listings fetch error:', error)
        setError('出品一覧の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  useEffect(() => {
    let filtered = listings

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.mpn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 保証フィルター
    if (filterWarranty !== 'all') {
      filtered = filtered.filter(listing =>
        filterWarranty === 'with' ? listing.warranty : !listing.warranty
      )
    }

    // ソート
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price_low':
        filtered.sort((a, b) => a.pricePerUnitJPY - b.pricePerUnitJPY)
        break
      case 'price_high':
        filtered.sort((a, b) => b.pricePerUnitJPY - a.pricePerUnitJPY)
        break
    }

    setFilteredListings(filtered)
  }, [searchQuery, sortBy, filterWarranty, listings])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">エラーが発生しました</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            再読み込み
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">半導体部品を探す</h1>
            <p className="text-gray-600">
              {filteredListings.length}件の部品が見つかりました
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-sm text-gray-600 mb-2">お探しの部品が見つからない場合は</p>
            <Link href="/sell">
              <Button className="w-full lg:w-auto">
                <Package className="mr-2 h-4 w-4" />
                出品してみませんか？
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white border rounded-lg p-4 lg:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="型番で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="並び順" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">新着順</SelectItem>
              <SelectItem value="oldest">古い順</SelectItem>
              <SelectItem value="price_low">価格安い順</SelectItem>
              <SelectItem value="price_high">価格高い順</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterWarranty} onValueChange={setFilterWarranty}>
            <SelectTrigger>
              <SelectValue placeholder="保証" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="with">メーカー保証あり</SelectItem>
              <SelectItem value="without">メーカー保証なし</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full lg:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            詳細検索
          </Button>
        </div>
      </div>

      {/* 出品リスト */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base lg:text-lg line-clamp-1">{listing.mpn}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1">
                  {listing.warranty && (
                    <Badge variant="secondary" className="text-xs">保証あり</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">{getSourceRouteLabel(listing.sourceRoute)}</Badge>
                </div>
              </div>
              <CardDescription className="line-clamp-2 text-sm">
                {listing.description || `${listing.mpn}の部品です`}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl lg:text-2xl font-bold text-primary">
                    {formatCurrency(listing.pricePerUnitJPY)}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500">/ 個</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-xs lg:text-sm">
                  <div className="flex items-center text-gray-600">
                    <Package className="mr-1 h-3 w-3 flex-shrink-0" />
                    在庫: {listing.quantity.toLocaleString()}個
                  </div>
                  {listing.dateCode && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                      {listing.dateCode}
                    </div>
                  )}
                </div>

                <div className="text-xs lg:text-sm text-gray-600">
                  出品者ID: {listing.sellerId}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      詳細を見る
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    お気に入り
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 px-4">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">該当する部品が見つかりません</h3>
          <p className="text-gray-600 mb-6 text-sm lg:text-base">
            検索条件を変更して再度お試しください
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => {
              setSearchQuery('')
              setFilterWarranty('all')
              setSortBy('newest')
            }} className="w-full sm:w-auto">
              条件をリセット
            </Button>
            <Link href="/sell" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                この部品を出品する
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Sell CTA at bottom */}
      {filteredListings.length > 0 && (
        <div className="mt-8 lg:mt-12 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 lg:p-8">
          <h2 className="text-xl lg:text-2xl font-bold mb-4">お探しの部品が見つからない場合</h2>
          <p className="text-gray-600 mb-6 text-sm lg:text-base">
            ご希望の部品を出品してくださる方をお待ちしています。
            お気軽に出品してみませんか？
          </p>
          <Link href="/sell">
            <Button size="lg" className="w-full sm:w-auto">
              <Package className="mr-2 h-5 w-5" />
              部品を出品する
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}