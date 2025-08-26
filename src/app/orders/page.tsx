// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Calendar, 
  Search, 
  Filter,
  ChevronRight,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  itemCount: number
  orderDate: string
  estimatedDelivery?: string
  seller: {
    name: string
    email: string
  }
  items: {
    id: string
    partNumber: string
    manufacturer: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Mock orders data
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setLoading(false)
      return
    }

    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'order-001',
          orderNumber: 'ORD-2024-001',
          status: 'delivered',
          totalAmount: 15400,
          itemCount: 2,
          orderDate: '2024-01-15T10:30:00Z',
          estimatedDelivery: '2024-01-20T18:00:00Z',
          seller: {
            name: 'テック販売株式会社',
            email: 'seller@techsales.co.jp'
          },
          items: [
            {
              id: 'item-001',
              partNumber: 'STM32F401RET6',
              manufacturer: 'STMicroelectronics',
              description: '32-bit ARM Cortex-M4 MCU',
              quantity: 10,
              unitPrice: 1200,
              totalPrice: 12000
            },
            {
              id: 'item-002',
              partNumber: 'LM358P',
              manufacturer: 'Texas Instruments',
              description: 'Dual Operational Amplifier',
              quantity: 20,
              unitPrice: 170,
              totalPrice: 3400
            }
          ]
        },
        {
          id: 'order-002',
          orderNumber: 'ORD-2024-002',
          status: 'shipped',
          totalAmount: 8900,
          itemCount: 1,
          orderDate: '2024-01-22T14:15:00Z',
          estimatedDelivery: '2024-01-25T18:00:00Z',
          seller: {
            name: 'エレクトロ部品商会',
            email: 'info@electro-parts.com'
          },
          items: [
            {
              id: 'item-003',
              partNumber: 'ESP32-WROOM-32',
              manufacturer: 'Espressif Systems',
              description: 'Wi-Fi & Bluetooth Module',
              quantity: 50,
              unitPrice: 178,
              totalPrice: 8900
            }
          ]
        },
        {
          id: 'order-003',
          orderNumber: 'ORD-2024-003',
          status: 'pending',
          totalAmount: 24500,
          itemCount: 3,
          orderDate: '2024-01-25T09:45:00Z',
          seller: {
            name: 'マイクロチップ・ジャパン',
            email: 'sales@microchip.jp'
          },
          items: [
            {
              id: 'item-004',
              partNumber: 'ATMEGA328P-PU',
              manufacturer: 'Microchip',
              description: '8-bit AVR Microcontroller',
              quantity: 100,
              unitPrice: 245,
              totalPrice: 24500
            }
          ]
        }
      ]
      
      setOrders(mockOrders)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [session, status])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '注文確認中'
      case 'confirmed':
        return '注文確定'
      case 'shipped':
        return '発送済み'
      case 'delivered':
        return '配送完了'
      case 'cancelled':
        return 'キャンセル'
      default:
        return status
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ログインが必要です</h2>
            <p className="text-gray-600 mb-6">注文履歴を表示するにはログインしてください</p>
            <Link href="/auth/signin">
              <Button>ログイン</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">注文履歴</h1>
        <p className="text-gray-600">過去の注文履歴と配送状況を確認できます</p>
      </div>

      {/* フィルター・検索 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            フィルター・検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="注文番号、部品番号、メーカーで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ステータス</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">注文確認中</SelectItem>
                  <SelectItem value="confirmed">注文確定</SelectItem>
                  <SelectItem value="shipped">発送済み</SelectItem>
                  <SelectItem value="delivered">配送完了</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注文履歴リスト */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">注文履歴がありません</h3>
            <p className="text-gray-600 mb-6">まだ注文を行っていないか、検索条件に一致する注文がありません</p>
            <Link href="/listings">
              <Button>商品を探す</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      {order.orderNumber}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(order.orderDate).toLocaleDateString('ja-JP')}
                        </span>
                        <span>出品者: {order.seller.name}</span>
                        <span>{order.itemCount}商品</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} mb-2`}>
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </span>
                    </Badge>
                    <div className="text-lg font-semibold">
                      ¥{order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 商品リスト */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.partNumber}</div>
                        <div className="text-sm text-gray-600">{item.manufacturer}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">数量: {item.quantity}個</div>
                        <div className="text-sm text-gray-600">
                          単価: ¥{item.unitPrice.toLocaleString()}
                        </div>
                        <div className="font-semibold">
                          小計: ¥{item.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 配送情報 */}
                {order.estimatedDelivery && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center text-sm">
                      <Truck className="mr-2 h-4 w-4 text-blue-600" />
                      <span className="font-medium">配送予定:</span>
                      <span className="ml-2">
                        {new Date(order.estimatedDelivery).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* アクション */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    合計: ¥{order.totalAmount.toLocaleString()} (手数料込み)
                  </div>
                  <div className="space-x-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        詳細を見る
                      </Button>
                    </Link>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        再注文
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 統計情報 */}
      {filteredOrders.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>注文統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredOrders.length}
                </div>
                <div className="text-sm text-gray-600">総注文数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ¥{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">総購入金額</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredOrders.reduce((sum, order) => sum + order.itemCount, 0)}
                </div>
                <div className="text-sm text-gray-600">総購入商品数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredOrders.filter(order => order.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-600">配送完了</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}