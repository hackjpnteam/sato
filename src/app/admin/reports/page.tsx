// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Package,
  BarChart3,
  PieChart
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ReportData {
  period: string
  revenue: number
  fees: number
  orders: number
  users: number
  listings: number
  averageOrderValue: number
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // モックデータ
    const mockData: ReportData[] = [
      {
        period: '2024年1月',
        revenue: 2480000,
        fees: 198400,
        orders: 127,
        users: 45,
        listings: 234,
        averageOrderValue: 19528
      },
      {
        period: '2023年12月',
        revenue: 2150000,
        fees: 172000,
        orders: 98,
        users: 38,
        listings: 201,
        averageOrderValue: 21939
      },
      {
        period: '2023年11月',
        revenue: 1890000,
        fees: 151200,
        orders: 89,
        users: 32,
        listings: 178,
        averageOrderValue: 21236
      }
    ]

    setReportData(mockData)
    setLoading(false)
  }, [selectedPeriod])

  const currentPeriod = reportData[0] || {
    period: '',
    revenue: 0,
    fees: 0,
    orders: 0,
    users: 0,
    listings: 0,
    averageOrderValue: 0
  }

  const previousPeriod = reportData[1] || currentPeriod

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const growthMetrics = {
    revenue: calculateGrowth(currentPeriod.revenue, previousPeriod.revenue),
    fees: calculateGrowth(currentPeriod.fees, previousPeriod.fees),
    orders: calculateGrowth(currentPeriod.orders, previousPeriod.orders),
    users: calculateGrowth(currentPeriod.users, previousPeriod.users),
    listings: calculateGrowth(currentPeriod.listings, previousPeriod.listings)
  }

  const topCategories = [
    { name: 'マイクロコントローラー', value: 850000, percentage: 34.3 },
    { name: 'ロジックIC', value: 620000, percentage: 25.0 },
    { name: 'センサー', value: 480000, percentage: 19.4 },
    { name: 'アナログIC', value: 350000, percentage: 14.1 },
    { name: 'その他', value: 180000, percentage: 7.2 }
  ]

  const topSellers = [
    { name: 'デモ電子部品商社', revenue: 650000, orders: 32 },
    { name: 'マイクロ部品販売', revenue: 480000, orders: 24 },
    { name: 'IC商店', revenue: 320000, orders: 18 },
    { name: 'エレクトロ販売', revenue: 280000, percentage: 15 }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">レポート・分析</h1>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">レポート・分析</h1>
          <p className="text-gray-600">売上・利用状況の分析</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="期間選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">週間</SelectItem>
              <SelectItem value="month">月間</SelectItem>
              <SelectItem value="quarter">四半期</SelectItem>
              <SelectItem value="year">年間</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDFエクスポート
          </Button>
        </div>
      </div>

      {/* KPI サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">売上高</p>
                <p className="text-2xl font-bold">{formatCurrency(currentPeriod.revenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${growthMetrics.revenue >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${growthMetrics.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthMetrics.revenue >= 0 ? '+' : ''}{growthMetrics.revenue.toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">手数料収入</p>
                <p className="text-2xl font-bold">{formatCurrency(currentPeriod.fees)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${growthMetrics.fees >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${growthMetrics.fees >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthMetrics.fees >= 0 ? '+' : ''}{growthMetrics.fees.toFixed(1)}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">注文数</p>
                <p className="text-2xl font-bold">{currentPeriod.orders}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${growthMetrics.orders >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${growthMetrics.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthMetrics.orders >= 0 ? '+' : ''}{growthMetrics.orders.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">新規ユーザー</p>
                <p className="text-2xl font-bold">{currentPeriod.users}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${growthMetrics.users >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs ${growthMetrics.users >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthMetrics.users >= 0 ? '+' : ''}{growthMetrics.users.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均注文単価</p>
                <p className="text-2xl font-bold">{formatCurrency(currentPeriod.averageOrderValue)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600">前月比</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* カテゴリ別売上 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              カテゴリ別売上
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 72}, 70%, 50%)` }}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.value)}</div>
                    <div className="text-sm text-gray-500">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 上位出品者 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              上位出品者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{seller.name}</div>
                    <div className="text-sm text-gray-600">{seller.orders}件の注文</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(seller.revenue)}</div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 期間別推移 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            期間別推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.map((data, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">期間</p>
                  <p className="font-medium">{data.period}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">売上高</p>
                  <p className="font-medium">{formatCurrency(data.revenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">手数料</p>
                  <p className="font-medium">{formatCurrency(data.fees)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">注文数</p>
                  <p className="font-medium">{data.orders}件</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">新規ユーザー</p>
                  <p className="font-medium">{data.users}名</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">平均単価</p>
                  <p className="font-medium">{formatCurrency(data.averageOrderValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}