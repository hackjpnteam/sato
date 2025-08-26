// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, 
  Search, 
  Download, 
  Eye,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PaymentTransaction {
  id: string
  type: 'payment' | 'payout' | 'refund' | 'fee'
  orderId?: string
  sellerId?: string
  amount: number
  fee: number
  netAmount: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  stripeChargeId?: string
  stripeTransferId?: string
  paymentMethod: 'card' | 'bank_transfer' | 'wallet'
  createdAt: string
  completedAt?: string
  description: string
  metadata: {
    buyerName?: string
    sellerName?: string
    mpn?: string
    quantity?: number
  }
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // モックデータ
    const mockTransactions: PaymentTransaction[] = [
      {
        id: 'txn_001',
        type: 'payment',
        orderId: 'order_001',
        sellerId: 'seller1',
        amount: 12000,
        fee: 960,
        netAmount: 11040,
        status: 'completed',
        stripeChargeId: 'ch_1234567890',
        paymentMethod: 'card',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:31:15Z',
        description: 'SN74LVC14APWR × 100個の購入',
        metadata: {
          buyerName: '田中太郎',
          sellerName: 'デモ電子部品商社',
          mpn: 'SN74LVC14APWR',
          quantity: 100
        }
      },
      {
        id: 'txn_002',
        type: 'payout',
        sellerId: 'seller1',
        amount: 11040,
        fee: 320,
        netAmount: 10720,
        status: 'processing',
        stripeTransferId: 'tr_0987654321',
        paymentMethod: 'bank_transfer',
        createdAt: '2024-01-15T11:00:00Z',
        description: 'デモ電子部品商社への支払い',
        metadata: {
          sellerName: 'デモ電子部品商社'
        }
      },
      {
        id: 'txn_003',
        type: 'payment',
        orderId: 'order_002',
        sellerId: 'seller2',
        amount: 17500,
        fee: 1400,
        netAmount: 16100,
        status: 'completed',
        stripeChargeId: 'ch_2345678901',
        paymentMethod: 'card',
        createdAt: '2024-01-14T15:20:00Z',
        completedAt: '2024-01-14T15:21:03Z',
        description: 'STM32F103C8T6 × 50個の購入',
        metadata: {
          buyerName: '佐藤花子',
          sellerName: 'マイクロ部品販売',
          mpn: 'STM32F103C8T6',
          quantity: 50
        }
      },
      {
        id: 'txn_004',
        type: 'refund',
        orderId: 'order_003',
        amount: -5400,
        fee: -432,
        netAmount: -4968,
        status: 'completed',
        stripeChargeId: 'ch_3456789012',
        paymentMethod: 'card',
        createdAt: '2024-01-13T09:15:00Z',
        completedAt: '2024-01-13T09:16:22Z',
        description: 'ESP32-WROOM-32注文の返金',
        metadata: {
          buyerName: '山田一郎',
          mpn: 'ESP32-WROOM-32'
        }
      }
    ]

    setTransactions(mockTransactions)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchQuery) {
      filtered = filtered.filter(txn =>
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.metadata.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.metadata.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.metadata.mpn?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, typeFilter, statusFilter])

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-green-100 text-green-800">支払い</Badge>
      case 'payout':
        return <Badge className="bg-blue-100 text-blue-800">払い出し</Badge>
      case 'refund':
        return <Badge className="bg-red-100 text-red-800">返金</Badge>
      case 'fee':
        return <Badge className="bg-purple-100 text-purple-800">手数料</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />待機中</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800"><RefreshCw className="w-3 h-3 mr-1" />処理中</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />完了</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />失敗</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">キャンセル</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'クレジットカード'
      case 'bank_transfer':
        return '銀行振込'
      case 'wallet':
        return 'ウォレット'
      default:
        return method
    }
  }

  const stats = {
    totalPayments: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalPayouts: transactions.filter(t => t.type === 'payout' && t.status === 'completed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalFees: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.fee, 0),
    pendingPayouts: transactions.filter(t => t.type === 'payout' && t.status === 'processing').length,
    totalRefunds: Math.abs(transactions.filter(t => t.type === 'refund' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">決済管理</h1>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">決済管理</h1>
          <p className="text-gray-600">決済・払い出し・返金の管理</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          取引履歴をエクスポート
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総決済額</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPayments)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総払い出し額</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPayouts)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">手数料収入</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalFees)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">処理中払い出し</p>
                <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総返金額</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRefunds)}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="取引ID・注文ID・ユーザー名・型番で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">すべての取引種別</option>
              <option value="payment">支払い</option>
              <option value="payout">払い出し</option>
              <option value="refund">返金</option>
              <option value="fee">手数料</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">待機中</option>
              <option value="processing">処理中</option>
              <option value="completed">完了</option>
              <option value="failed">失敗</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 取引リスト */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold">{transaction.id}</h3>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                  {getTypeBadge(transaction.type)}
                  {getStatusBadge(transaction.status)}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    手数料: {formatCurrency(Math.abs(transaction.fee))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">支払い方法</p>
                  <p className="font-medium">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">作成日時</p>
                  <p className="font-medium">
                    {new Date(transaction.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleTimeString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">完了日時</p>
                  <p className="font-medium">
                    {transaction.completedAt ? 
                      new Date(transaction.completedAt).toLocaleDateString('ja-JP') : 
                      '未完了'
                    }
                  </p>
                  {transaction.completedAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.completedAt).toLocaleTimeString('ja-JP')}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">実際の受取額</p>
                  <p className="font-medium">{formatCurrency(Math.abs(transaction.netAmount))}</p>
                  {transaction.stripeChargeId && (
                    <p className="text-xs text-gray-500">Stripe ID: {transaction.stripeChargeId}</p>
                  )}
                </div>
              </div>

              {(transaction.metadata.buyerName || transaction.metadata.sellerName || transaction.metadata.mpn) && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    {transaction.metadata.buyerName && (
                      <div>
                        <span className="text-gray-600">購入者:</span>
                        <span className="ml-2 font-medium">{transaction.metadata.buyerName}</span>
                      </div>
                    )}
                    {transaction.metadata.sellerName && (
                      <div>
                        <span className="text-gray-600">出品者:</span>
                        <span className="ml-2 font-medium">{transaction.metadata.sellerName}</span>
                      </div>
                    )}
                    {transaction.metadata.mpn && (
                      <div>
                        <span className="text-gray-600">商品:</span>
                        <span className="ml-2 font-medium">{transaction.metadata.mpn}</span>
                        {transaction.metadata.quantity && (
                          <span className="ml-1 text-gray-500">× {transaction.metadata.quantity}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  詳細確認
                </Button>
                {transaction.orderId && (
                  <Button size="sm" variant="outline">
                    注文詳細
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">該当する取引がありません</h3>
            <p className="text-gray-600">検索条件を変更して再度お試しください</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}