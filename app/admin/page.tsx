'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  overview: {
    totalUsers: number
    totalListings: number
    totalOrders: number
    totalRevenue: number
    monthlyUsers: number
    monthlyListings: number
  }
  recentUsers: Array<{
    id: string
    email: string
    name: string
    role: string
    createdAt: string
  }>
  recentListings: Array<{
    id: string
    partNumber: string
    manufacturer: string
    price: number
    quantity: number
    createdAt: string
  }>
  topSellingItems: Array<{
    id: string
    partNumber: string
    manufacturer: string
    price: number
    questionCount: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    totalValue: number
  }>
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Users management state
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPage, setUsersPage] = useState(1)
  const [usersPagination, setUsersPagination] = useState<any>(null)
  const [usersSearch, setUsersSearch] = useState('')
  
  // Listings management state
  const [listings, setListings] = useState<any[]>([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [listingsPage, setListingsPage] = useState(1)
  const [listingsPagination, setListingsPagination] = useState<any>(null)
  const [listingsSearch, setListingsSearch] = useState('')
  
  // Orders management state
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPagination, setOrdersPagination] = useState<any>(null)

  // Fetch users data
  const fetchUsers = async (page = 1, search = '') => {
    if (user?.role !== 'admin') return
    
    setUsersLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })
      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setUsersPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  // Fetch listings data
  const fetchListings = async (page = 1, search = '') => {
    setListingsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      })
      const response = await fetch(`/api/admin/listings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
        setListingsPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  // Fetch orders data
  const fetchOrders = async (page = 1) => {
    setOrdersLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setOrdersPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })
      
      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        ))
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  // Handle listing deletion
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('この出品を削除しますか？')) return
    
    try {
      const response = await fetch(`/api/admin/listings?id=${listingId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setListings(prev => prev.filter(l => l._id !== listingId))
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (!data.ok || !data.user) {
          router.push('/account')
          return
        }

        // Check if user is admin or seller
        if (data.user.role !== 'admin' && data.user.role !== 'seller') {
          router.push('/account')
          return
        }

        setUser(data.user)
        
        // Fetch admin stats from API
        const statsResponse = await fetch('/api/admin/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
        
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/account')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Load tab data when switching tabs
  useEffect(() => {
    if (!user) return
    
    if (activeTab === 'users' && user.role === 'admin') {
      fetchUsers(usersPage, usersSearch)
    } else if (activeTab === 'listings') {
      fetchListings(listingsPage, listingsSearch)
    } else if (activeTab === 'orders') {
      fetchOrders(ordersPage)
    }
  }, [activeTab, user, usersPage, usersSearch, listingsPage, listingsSearch, ordersPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            管理画面
          </h1>
          <p className="text-gray-600">
            {user.role === 'admin' ? '管理者' : '出品者'}ダッシュボード
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['overview', 'users', 'listings', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'overview' && '📊 概要'}
                  {tab === 'users' && '👥 ユーザー管理'}  
                  {tab === 'listings' && '📦 出品管理'}
                  {tab === 'orders' && '🛒 注文管理'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-600 text-3xl">📦</div>
                  <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">出品数</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.overview.totalListings}</div>
                <p className="text-sm text-gray-600 mt-1">今月: +{stats.overview.monthlyListings}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-green-600 text-3xl">👥</div>
                  <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">ユーザー数</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</div>
                <p className="text-sm text-gray-600 mt-1">今月: +{stats.overview.monthlyUsers}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-purple-600 text-3xl">🛒</div>
                  <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">注文数</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.overview.totalOrders}</div>
                <p className="text-sm text-gray-600 mt-1">カート内アイテム</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-600 text-3xl">💰</div>
                  <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">売上</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">¥{stats.overview.totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-gray-600 mt-1">合計取引額</p>
              </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">最新登録ユーザー</h3>
                <div className="space-y-3">
                  {stats.recentUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? '管理者' : user.role === 'seller' ? '出品者' : '購入者'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Listings */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">最新出品</h3>
                <div className="space-y-3">
                  {stats.recentListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{listing.partNumber}</div>
                        <div className="text-sm text-gray-600">{listing.manufacturer}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">¥{listing.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">在庫: {listing.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別統計</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.categoryStats.map((cat) => (
                  <div key={cat.category} className="p-4 border rounded-lg">
                    <div className="font-medium text-gray-900">{cat.category}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      出品数: {cat.count} | 総額: ¥{cat.totalValue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && user?.role === 'admin' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">ユーザー管理</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="ユーザーを検索..."
                  value={usersSearch}
                  onChange={(e) => {
                    setUsersSearch(e.target.value)
                    setUsersPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">ユーザー</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">会社</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">ロール</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">登録日</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">アクション</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {user.companyName || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? '管理者' : 
                               user.role === 'seller' ? '出品者' : '購入者'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="buyer">購入者</option>
                              <option value="seller">出品者</option>
                              <option value="admin">管理者</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {usersPagination && usersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-700">
                      {usersPagination.totalUsers}件中 {((usersPage - 1) * 10) + 1}〜{Math.min(usersPage * 10, usersPagination.totalUsers)}件を表示
                    </p>
                    <div className="flex space-x-2">
                      <button
                        disabled={usersPage <= 1}
                        onClick={() => setUsersPage(prev => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        前へ
                      </button>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        {usersPage} / {usersPagination.totalPages}
                      </span>
                      <button
                        disabled={usersPage >= usersPagination.totalPages}
                        onClick={() => setUsersPage(prev => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Listings Management Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">出品管理</h3>
              <input
                type="text"
                placeholder="出品を検索..."
                value={listingsSearch}
                onChange={(e) => {
                  setListingsSearch(e.target.value)
                  setListingsPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {listingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">商品</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">出品者</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">価格</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">在庫</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">出品日</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">アクション</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing._id} className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{listing.partNumber}</div>
                              <div className="text-sm text-gray-600">{listing.manufacturer}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900">{listing.sellerName}</div>
                            <div className="text-sm text-gray-600">{listing.sellerCompany || '-'}</div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            ¥{listing.unitPriceJPY?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {listing.quantity}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(listing.createdAt).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleDeleteListing(listing._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              削除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {listingsPagination && listingsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-700">
                      {listingsPagination.totalListings}件中 {((listingsPage - 1) * 10) + 1}〜{Math.min(listingsPage * 10, listingsPagination.totalListings)}件を表示
                    </p>
                    <div className="flex space-x-2">
                      <button
                        disabled={listingsPage <= 1}
                        onClick={() => setListingsPage(prev => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        前へ
                      </button>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        {listingsPage} / {listingsPagination.totalPages}
                      </span>
                      <button
                        disabled={listingsPage >= listingsPagination.totalPages}
                        onClick={() => setListingsPage(prev => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">注文管理</h3>
            </div>

            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">注文ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">購入者</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">アイテム数</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">合計金額</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">作成日</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-100">
                          <td className="py-4 px-4 font-mono text-sm text-gray-900">
                            {order._id.slice(-8)}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{order.userName}</div>
                              <div className="text-sm text-gray-600">{order.userEmail}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {order.items?.length || 0}個
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            ¥{order.totalAmount?.toLocaleString() || '0'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              カート中
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {ordersPagination && ordersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-700">
                      {ordersPagination.totalOrders}件中 {((ordersPage - 1) * 10) + 1}〜{Math.min(ordersPage * 10, ordersPagination.totalOrders)}件を表示
                    </p>
                    <div className="flex space-x-2">
                      <button
                        disabled={ordersPage <= 1}
                        onClick={() => setOrdersPage(prev => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        前へ
                      </button>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        {ordersPage} / {ordersPagination.totalPages}
                      </span>
                      <button
                        disabled={ordersPage >= ordersPagination.totalPages}
                        onClick={() => setOrdersPage(prev => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/admin/listings')}
              className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mr-3">📋</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">出品管理</div>
                <div className="text-sm text-gray-600">出品の確認と編集</div>
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/orders')}
              className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">注文管理</div>
                <div className="text-sm text-gray-600">注文の処理と追跡</div>
              </div>
            </button>

            {user.role === 'admin' && (
              <button 
                onClick={() => router.push('/admin/users')}
                className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl mr-3">👤</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">ユーザー管理</div>
                  <div className="text-sm text-gray-600">ユーザーの管理と権限設定</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">最近のアクティビティ</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-3">🆕</span>
                <div>
                  <div className="font-medium text-gray-900">新規出品</div>
                  <div className="text-sm text-gray-600">マイコン STM32F407VGT6 が追加されました</div>
                </div>
              </div>
              <span className="text-sm text-gray-500">5分前</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✅</span>
                <div>
                  <div className="font-medium text-gray-900">注文確定</div>
                  <div className="text-sm text-gray-600">注文 #12345 が確定しました</div>
                </div>
              </div>
              <span className="text-sm text-gray-500">1時間前</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <span className="text-purple-600 text-xl mr-3">💬</span>
                <div>
                  <div className="font-medium text-gray-900">新規質問</div>
                  <div className="text-sm text-gray-600">商品への質問が投稿されました</div>
                </div>
              </div>
              <span className="text-sm text-gray-500">3時間前</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}