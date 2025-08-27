'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  emailVerified: boolean
  companyName?: string
  companyAddress?: string
  companyPhone?: string
  companyDescription?: string
}

interface Listing {
  _id: string
  sellerId?: string
  partNumber: string
  manufacturer: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode?: string
  warranty?: string
  createdAt: string
  questionCount: number
  sellerName?: string
  sellerCompany?: string
}

// Fallback UI components
const Button = ({ children, onClick, className = '', disabled = false, variant = 'default', type = 'button' }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </button>
)

const Input = ({ id, type = 'text', value, onChange, required = false, placeholder = '', className = '' }: any) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
  />
)

const Textarea = ({ id, value, onChange, required = false, placeholder = '', rows = 4, className = '' }: any) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    rows={rows}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
  />
)

const Label = ({ htmlFor, children }: any) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  })

  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyDescription: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (data.user) {
          setUser(data.user)
          setProfileData({
            name: data.user.name || '',
            email: data.user.email
          })
          setCompanyData({
            companyName: data.user.companyName || '',
            companyAddress: data.user.companyAddress || '',
            companyPhone: data.user.companyPhone || '',
            companyDescription: data.user.companyDescription || ''
          })
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const fetchUserListings = async () => {
    setLoadingListings(true)
    try {
      // If user has management role, fetch all listings via admin API
      if (user && (user.role === 'admin' || user.role === 'seller')) {
        const response = await fetch('/api/admin/listings?page=1&limit=50')
        if (response.ok) {
          const data = await response.json()
          setUserListings(data.listings || [])
        }
      } else {
        // For regular users, fetch only their own listings
        const response = await fetch('/api/user/listings')
        if (response.ok) {
          const data = await response.json()
          setUserListings(data.listings || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoadingListings(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'listings' && user) {
      fetchUserListings()
    }
  }, [activeTab, user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        alert('プロフィールを更新しました')
      } else {
        const error = await response.json()
        alert(error.error || 'プロフィール更新に失敗しました')
      }
    } catch {
      alert('プロフィール更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/auth/update-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      })

      if (response.ok) {
        alert('会社情報を更新しました')
        // ユーザー情報を再取得
        const userResponse = await fetch('/api/auth/me')
        const userData = await userResponse.json()
        if (userData.user) {
          setUser(userData.user)
        }
      } else {
        const error = await response.json()
        alert(error.error || '会社情報更新に失敗しました')
      }
    } catch {
      alert('会社情報更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    const listing = userListings.find(l => l._id === listingId)
    const isOwnListing = listing && listing.sellerId === user?.id
    const isManagementUser = user && (user.role === 'admin' || user.role === 'seller')
    
    let confirmMessage = 'この出品を削除してもよろしいですか？この操作は取り消せません。'
    if (isManagementUser && !isOwnListing) {
      confirmMessage = `管理権限により他のユーザーの出品「${listing?.partNumber || ''}」を削除しようとしています。この操作は取り消せません。削除してもよろしいですか？`
    }
    
    if (!confirm(confirmMessage)) {
      return
    }

    setDeletingIds(prev => new Set(Array.from(prev).concat(listingId)))
    try {
      // Use admin API for management users, user API for regular users
      const isManagementUser = user && (user.role === 'admin' || user.role === 'seller')
      const apiEndpoint = isManagementUser 
        ? `/api/admin/listings?id=${listingId}`
        : `/api/user/listings?id=${listingId}`
        
      const response = await fetch(apiEndpoint, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('出品を削除しました')
        fetchUserListings() // リストを再取得
      } else {
        const error = await response.json()
        alert(error.error || '削除に失敗しました')
      }
    } catch {
      alert('削除中にエラーが発生しました')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(listingId)
        return newSet
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch {
      alert('ログアウト中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">ログインが必要です</div>
          <Button onClick={() => router.push('/')} className="mt-4">
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: '👤 プロフィール', icon: '👤' },
    { id: 'company', name: '🏢 会社情報', icon: '🏢' },
    { id: 'listings', name: '📦 出品管理', icon: '📦' }
  ]
  
  // Show admin button for admin or seller roles
  const showAdminButton = user.role === 'admin' || user.role === 'seller'
  
  // Debug: Log user role
  console.log('User role:', user.role, 'Show admin button:', showAdminButton)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">アカウント管理</h1>
          <p className="text-gray-600">
            プロフィール、会社情報、出品の管理ができます。
          </p>
          <div className="mt-2 text-sm">
            <span className="text-green-600 mr-4">✓ 購入者: 会社情報登録不要</span>
            <span className="text-blue-600">✓ 出品者: 会社情報登録必須</span>
          </div>
        </div>
        <div className="flex gap-3">
          {showAdminButton && (
            <Button onClick={() => router.push('/admin')} className="bg-purple-600 hover:bg-purple-700">
              🔧 管理画面へ
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline">
            ログアウト
          </Button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* プロフィールタブ */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">プロフィール情報</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e: any) => setProfileData({...profileData, name: e.target.value})}
                placeholder="お名前を入力してください"
              />
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">メールアドレスは変更できません</p>
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? '更新中...' : 'プロフィールを更新'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 会社情報タブ */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">会社情報</h2>
          
          {/* Company registration status */}
          {!user.companyName ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                <div>
                  <h3 className="text-yellow-800 font-semibold mb-1">会社情報が未登録です</h3>
                  <p className="text-yellow-800 text-sm mb-2">
                    出品機能をご利用いただくには会社情報の登録が必要です。
                  </p>
                  <div className="text-xs text-yellow-700">
                    <div>✓ 購入者としてのご利用: 会社情報登録は不要</div>
                    <div>✓ 出品者としてのご利用: 会社情報登録が必須</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-green-600 text-xl mr-3">✅</div>
                <div>
                  <h3 className="text-green-800 font-semibold mb-1">会社情報が登録されています</h3>
                  <p className="text-green-800 text-sm">
                    出品機能をご利用いただけます。会社情報を更新することも可能です。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 会社情報を登録すると、部品の出品ができるようになります
            </p>
          </div>
          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div>
              <Label htmlFor="companyName">会社名 *</Label>
              <Input
                id="companyName"
                value={companyData.companyName}
                onChange={(e: any) => setCompanyData({...companyData, companyName: e.target.value})}
                placeholder="株式会社○○○"
                required
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">住所</Label>
              <Input
                id="companyAddress"
                value={companyData.companyAddress}
                onChange={(e: any) => setCompanyData({...companyData, companyAddress: e.target.value})}
                placeholder="〒000-0000 東京都○○区○○ 1-2-3"
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">電話番号</Label>
              <Input
                id="companyPhone"
                value={companyData.companyPhone}
                onChange={(e: any) => setCompanyData({...companyData, companyPhone: e.target.value})}
                placeholder="03-0000-0000"
              />
            </div>
            <div>
              <Label htmlFor="companyDescription">会社説明</Label>
              <Textarea
                id="companyDescription"
                value={companyData.companyDescription}
                onChange={(e: any) => setCompanyData({...companyData, companyDescription: e.target.value})}
                placeholder="会社の事業内容や特徴をご記入ください"
                rows={4}
              />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? '更新中...' : '会社情報を更新'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 出品管理タブ */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">出品管理</h2>
                {user && (user.role === 'admin' || user.role === 'seller') && (
                  <p className="text-sm text-blue-600 mt-1">
                    管理権限により全ての出品を管理できます
                  </p>
                )}
              </div>
            </div>

            {loadingListings ? (
              <div className="text-center py-8">
                <div className="text-gray-600">読み込み中...</div>
              </div>
            ) : userListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  出品がありません
                </h3>
                <p className="text-gray-600 mb-6">
                  半導体部品を出品して販売を開始しましょう
                </p>
                <a
                  href="/sell"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  最初の出品を作成
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {userListings.map((listing) => (
                  <div key={listing._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-2xl">🔌</div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {listing.partNumber}
                            </h3>
                            <p className="text-gray-600 mb-2">{listing.manufacturer}</p>
                            {user && (user.role === 'admin' || user.role === 'seller') && listing.sellerName && (
                              <p className="text-sm text-purple-600 mb-2">
                                出品者: {listing.sellerName} {listing.sellerCompany && `(${listing.sellerCompany})`}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                listing.condition === 'new' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {listing.condition === 'new' ? '新品' : '中古'}
                              </span>
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {listing.stockSource === 'authorized' ? '正規代理店' : '二次市場'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">在庫数:</span>
                                <div className="font-medium">{listing.quantity.toLocaleString()}個</div>
                              </div>
                              <div>
                                <span className="text-gray-600">単価:</span>
                                <div className="font-bold text-blue-600">¥{listing.unitPriceJPY.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">質問数:</span>
                                <div className="font-medium">{listing.questionCount}件</div>
                              </div>
                              <div>
                                <span className="text-gray-600">出品日:</span>
                                <div className="font-medium">{new Date(listing.createdAt).toLocaleDateString('ja-JP')}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <a
                          href={`/listings/${listing._id}`}
                          className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        >
                          詳細表示
                        </a>
                        <Button
                          onClick={() => handleDeleteListing(listing._id)}
                          disabled={deletingIds.has(listing._id)}
                          variant="danger"
                          className="text-sm"
                          title={
                            user && (user.role === 'admin' || user.role === 'seller') && listing.sellerId !== user.id
                              ? '管理権限により削除'
                              : '自分の出品を削除'
                          }
                        >
                          {deletingIds.has(listing._id) ? '削除中...' : '削除'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}