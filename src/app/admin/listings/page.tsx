// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Listing {
  id: string
  mpn: string
  seller: {
    id: string
    name: string
    email: string
  }
  quantity: number
  pricePerUnitJPY: number
  status: 'pending' | 'approved' | 'rejected' | 'listed'
  createdAt: string
  description: string
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // モックデータ
    const mockListings: Listing[] = [
      {
        id: '1',
        mpn: 'SN74LVC14APWR',
        seller: { id: 'seller1', name: 'デモ電子部品商社', email: 'seller@demo.com' },
        quantity: 500,
        pricePerUnitJPY: 120,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        description: 'Texas Instruments製 ロジックIC'
      },
      {
        id: '2',
        mpn: 'STM32F103C8T6',
        seller: { id: 'seller2', name: 'マイクロ部品販売', email: 'micro@demo.com' },
        quantity: 200,
        pricePerUnitJPY: 350,
        status: 'approved',
        createdAt: '2024-01-14T15:20:00Z',
        description: 'STMicroelectronics製 32bit ARMマイクロコントローラー'
      },
      {
        id: '3',
        mpn: 'LM317T',
        seller: { id: 'seller1', name: 'デモ電子部品商社', email: 'seller@demo.com' },
        quantity: 1000,
        pricePerUnitJPY: 80,
        status: 'listed',
        createdAt: '2024-01-13T09:45:00Z',
        description: 'Texas Instruments製 可変電源IC'
      },
      {
        id: '4',
        mpn: 'ESP32-WROOM-32',
        seller: { id: 'seller3', name: 'IC商店', email: 'ic@demo.com' },
        quantity: 100,
        pricePerUnitJPY: 890,
        status: 'rejected',
        createdAt: '2024-01-12T14:15:00Z',
        description: 'Espressif Systems製 WiFi+Bluetooth MCUモジュール'
      }
    ]

    setListings(mockListings)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = listings

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.mpn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter)
    }

    setFilteredListings(filtered)
  }, [listings, searchQuery, statusFilter])

  const handleApprove = async (id: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, status: 'approved' as const } : listing
    ))
  }

  const handleReject = async (id: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, status: 'rejected' as const } : listing
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />審査待ち</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />承認済み</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />拒否</Badge>
      case 'listed':
        return <Badge className="bg-blue-100 text-blue-800"><Package className="w-3 h-3 mr-1" />掲載中</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    listed: listings.filter(l => l.status === 'listed').length,
    rejected: listings.filter(l => l.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">出品管理</h1>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">出品管理</h1>
        <p className="text-gray-600">出品の審査・管理</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">総出品数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">審査待ち</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">承認済み</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.listed}</div>
            <div className="text-sm text-gray-600">掲載中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">拒否</div>
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="型番または出品者で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">審査待ち</option>
              <option value="approved">承認済み</option>
              <option value="listed">掲載中</option>
              <option value="rejected">拒否</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 出品リスト */}
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{listing.mpn}</h3>
                    {getStatusBadge(listing.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">出品者</p>
                      <p className="font-medium">{listing.seller.name}</p>
                      <p className="text-xs text-gray-500">{listing.seller.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">数量・価格</p>
                      <p className="font-medium">{listing.quantity.toLocaleString()}個</p>
                      <p className="text-sm">{formatCurrency(listing.pricePerUnitJPY)}/個</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">出品日時</p>
                      <p className="font-medium">
                        {new Date(listing.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(listing.createdAt).toLocaleTimeString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{listing.description}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    詳細
                  </Button>
                  {listing.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(listing.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        承認
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(listing.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        拒否
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">該当する出品がありません</h3>
            <p className="text-gray-600">検索条件を変更して再度お試しください</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}