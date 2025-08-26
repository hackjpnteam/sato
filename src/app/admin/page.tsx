// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalUsers: number
  newUsersToday: number
  totalListings: number
  pendingListings: number
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalListings: 0,
    pendingListings: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0
  })

  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    // モックデータ
    setStats({
      totalUsers: 1247,
      newUsersToday: 23,
      totalListings: 3891,
      pendingListings: 12,
      totalOrders: 2156,
      todayOrders: 8,
      totalRevenue: 15420000,
      todayRevenue: 89000
    })

    setRecentActivities([
      {
        id: 1,
        type: 'user_registered',
        description: 'ユーザー登録: 新しい購入者が登録しました',
        time: '10分前',
        status: 'info'
      },
      {
        id: 2,
        type: 'listing_pending',
        description: '出品審査: SN74LVC14APWRの審査が必要です',
        time: '25分前',
        status: 'warning'
      },
      {
        id: 3,
        type: 'order_completed',
        description: '注文完了: ¥45,000の注文が完了しました',
        time: '1時間前',
        status: 'success'
      },
      {
        id: 4,
        type: 'user_registered',
        description: 'ユーザー登録: 新しい出品者が登録しました',
        time: '2時間前',
        status: 'info'
      },
      {
        id: 5,
        type: 'listing_approved',
        description: '出品承認: STM32F103C8T6が承認されました',
        time: '3時間前',
        status: 'success'
      }
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-gray-600">システム全体の概要とKPI</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.newUsersToday}</span> 本日新規
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">出品数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingListings}件</span> 審査待ち
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総注文数</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+{stats.todayOrders}</span> 本日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総売上</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{formatCurrency(stats.todayRevenue)}</span> 本日
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近のアクティビティ */}
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>システムの最新動向</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                    {activity.status === 'info' && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 審査待ち一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>審査待ち出品</CardTitle>
            <CardDescription>承認が必要な出品一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: '1', mpn: 'SN74LVC14APWR', seller: 'デモ電子部品商社', price: 120, time: '2時間前' },
                { id: '2', mpn: 'STM32F407VGT6', seller: 'マイクロ部品販売', price: 890, time: '4時間前' },
                { id: '3', mpn: 'LM358P', seller: 'IC商店', price: 45, time: '6時間前' }
              ].map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{listing.mpn}</p>
                    <p className="text-sm text-gray-600">{listing.seller}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(listing.price)}</p>
                    <p className="text-xs text-gray-500">{listing.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日の概要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            本日の概要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.newUsersToday}</div>
              <div className="text-sm text-gray-600">新規登録</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingListings}</div>
              <div className="text-sm text-gray-600">審査待ち</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.todayOrders}</div>
              <div className="text-sm text-gray-600">新規注文</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.todayRevenue)}</div>
              <div className="text-sm text-gray-600">売上</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}