// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  Search, 
  Download, 
  Eye,
  Calendar,
  CreditCard,
  User,
  Building2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Order {
  id: string
  buyer: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  seller: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  listing: {
    id: string
    mpn: string
    description: string
  }
  quantity: number
  unitPrice: number
  totalAmount: number
  stripeFee: number
  netAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  deliveryAddress: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // モックデータ
    const mockOrders: Order[] = [
      {
        id: 'order_001',
        buyer: {
          id: 'buyer1',
          name: '田中太郎',
          email: 'tanaka@example.com',
          companyName: 'エレクトロニクス株式会社'
        },
        seller: {
          id: 'seller1',
          name: 'デモ電子部品商社',
          email: 'seller@demo.com',
          companyName: 'デモ電子部品商社株式会社'
        },
        listing: {
          id: 'listing_001',
          mpn: 'SN74LVC14APWR',
          description: 'Texas Instruments製 ロジックIC'
        },
        quantity: 100,
        unitPrice: 120,
        totalAmount: 12000,
        stripeFee: 960,
        netAmount: 11040,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2024-01-15T10:30:00Z',
        deliveryAddress: '東京都渋谷区...'
      },
      {
        id: 'order_002',
        buyer: {
          id: 'buyer2',
          name: '佐藤花子',
          email: 'sato@tech.com',
          companyName: 'テクノロジー合同会社'
        },
        seller: {
          id: 'seller2',
          name: 'マイクロ部品販売',
          email: 'micro@demo.com'
        },
        listing: {
          id: 'listing_002',
          mpn: 'STM32F103C8T6',
          description: 'STMicroelectronics製 32bit ARMマイクロコントローラー'
        },
        quantity: 50,
        unitPrice: 350,
        totalAmount: 17500,
        stripeFee: 1400,
        netAmount: 16100,
        status: 'processing',
        paymentStatus: 'paid',
        createdAt: '2024-01-14T15:20:00Z',
        deliveryAddress: '大阪府大阪市...'
      }
    ]

    setOrders(mockOrders)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.listing.mpn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">注文確認中</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">処理中</Badge>
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-800">発送済み</Badge>
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">配送完了</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">返金済み</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">支払い待ち</Badge>
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">支払い完了</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">支払い失敗</Badge>
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">返金済み</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = {
    total: orders.length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0),
    totalFees: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.stripeFee, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">注文管理</h1>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">注文管理</h1>
          <p className="text-gray-600">取引の監視・管理</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">総注文数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">総売上</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalFees)}</div>
            <div className="text-sm text-gray-600">手数料収入</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">確認中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">処理中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">完了</div>
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
                placeholder="注文ID・型番・ユーザー名で検索"
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
              <option value="pending">注文確認中</option>
              <option value="processing">処理中</option>
              <option value="shipped">発送済み</option>
              <option value="delivered">配送完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 注文リスト */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">注文ID: {order.id}</h3>
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatCurrency(order.totalAmount)}</div>
                  <div className="text-sm text-gray-500">手数料: {formatCurrency(order.stripeFee)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">商品</p>
                  <p className="font-medium">{order.listing.mpn}</p>
                  <p className="text-sm text-gray-500">{order.quantity}個 × {formatCurrency(order.unitPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">購入者</p>
                  <p className="font-medium">{order.buyer.name}</p>
                  <p className="text-sm text-gray-500">{order.buyer.companyName || order.buyer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">出品者</p>
                  <p className="font-medium">{order.seller.name}</p>
                  <p className="text-sm text-gray-500">{order.seller.companyName || order.seller.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">注文日時</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('ja-JP')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  詳細確認
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">該当する注文がありません</h3>
            <p className="text-gray-600">検索条件を変更して再度お試しください</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}