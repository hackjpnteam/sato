// MongoDB版 簡易UIホームページ
'use client'

import { useState, useEffect } from 'react'

interface Listing {
  _id: string
  partNumber: string
  manufacturer: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode?: string
  warranty?: string
  category?: string
}

// Fallback components for missing UI components
const Button = ({ children, onClick, className = '', disabled = false, variant = 'default', size = 'default', type = 'button' }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${
      size === 'lg' ? 'px-6 py-3 text-lg' : ''
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </button>
)

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: any) => <div className="px-6 py-4">{children}</div>
const CardTitle = ({ children, className = '' }: any) => <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
const CardDescription = ({ children }: any) => <p className="text-sm text-gray-600 mt-1">{children}</p>
const CardContent = ({ children, className = '' }: any) => <div className={`px-6 py-4 ${className}`}>{children}</div>

const Input = ({ id, type = 'text', value, onChange, required = false, placeholder = '', className = '', minLength, min }: any) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    minLength={minLength}
    min={min}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
  />
)

const Label = ({ htmlFor, children }: any) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

const Select = ({ value, onValueChange, children }: any) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  >
    {children}
  </select>
)

const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>

const Alert = ({ children, className = '' }: any) => (
  <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-md ${className}`}>
    {children}
  </div>
)

const AlertDescription = ({ children }: any) => (
  <div className="text-sm text-yellow-800">{children}</div>
)

// Simple icons
const Shield = ({ className = '' }: any) => <div className={`w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center ${className}`}>🛡</div>
const Zap = ({ className = '' }: any) => <div className={`w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center ${className}`}>⚡</div>
const Package = ({ className = '' }: any) => <div className={`w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center ${className}`}>📦</div>
const Plus = ({ className = '' }: any) => <span className={className}>+</span>
const AlertCircle = ({ className = '' }: any) => <span className={className}>⚠️</span>
const CheckCircle = ({ className = '' }: any) => <span className={`text-green-500 ${className}`}>✓</span>

interface User {
  id: string
  email: string
  name: string
  role: string
  emailVerified: boolean
}

interface ListingFormData {
  partNumber: string
  manufacturer: string
  quantity: string
  unitPriceJPY: string
  dateCode: string
  stockSource: 'authorized' | 'open_market'
  condition: 'new' | 'used'
  warranty: string
  images: string[]
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showListingForm, setShowListingForm] = useState(false)
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])

  // フォームデータ
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [listingData, setListingData] = useState<ListingFormData>({
    partNumber: '',
    manufacturer: '',
    quantity: '',
    unitPriceJPY: '',
    dateCode: '',
    stockSource: 'authorized',
    condition: 'new',
    warranty: '',
    images: []
  })

  // 現在のユーザー情報と注目商品を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザー情報取得
        const userResponse = await fetch('/api/auth/me')
        const userData = await userResponse.json()
        setUser(userData.user)

        // 注目商品取得（最新6件）
        const listingsResponse = await fetch('/api/listings?limit=6')
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setFeaturedListings(listingsData.listings || [])
        }
      } catch {
        console.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 登録処理
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || 'アカウントを作成しました')
        setShowRegisterForm(false)
        setRegisterData({ email: '', password: '', name: '' })
      } else {
        alert(result.error || '登録に失敗しました')
      }
    } catch {
      alert('登録中にエラーが発生しました')
    }
  }

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || 'ログインしました')
        setUser(result.user)
        setShowLoginForm(false)
        setLoginData({ email: '', password: '' })
      } else {
        alert(result.error || 'ログインに失敗しました')
      }
    } catch {
      alert('ログイン中にエラーが発生しました')
    }
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      alert('ログアウトしました')
    } catch {
      alert('ログアウト中にエラーが発生しました')
    }
  }

  // 出品処理
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()

    // セラーロールチェック
    if (!user?.role || !['seller', 'admin'].includes(user.role)) {
      alert('出品するにはセラー権限が必要です')
      return
    }
    
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...listingData,
          quantity: Number(listingData.quantity),
          unitPriceJPY: Number(listingData.unitPriceJPY)
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || '出品を作成しました')
        setShowListingForm(false)
        setListingData({
          partNumber: '',
          manufacturer: '',
          quantity: '',
          unitPriceJPY: '',
          dateCode: '',
          stockSource: 'authorized',
          condition: 'new',
          warranty: '',
          images: []
        })
      } else {
        alert(result.error || '出品作成に失敗しました')
      }
    } catch {
      alert('出品作成中にエラーが発生しました')
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

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 px-4">
          半導体部品マーケットプレイス
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
          信頼できる半導体部品の売買プラットフォーム
        </p>

        {user ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Button 
                onClick={() => setShowListingForm(true)}
                size="lg"
                className="w-full sm:w-auto"
                disabled={!['seller', 'admin'].includes(user.role)}
              >
                <Plus className="mr-2" />
                出品を作成
              </Button>
              <Button 
                onClick={handleLogout}
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto"
              >
                ログアウト
              </Button>
            </div>
            {!['seller', 'admin'].includes(user.role) && (
              <div className="mt-4 max-w-md mx-auto">
                <Alert className="text-center">
                  <AlertCircle className="h-4 w-4 mx-auto mb-1" />
                  <AlertDescription className="text-sm">
                    出品するにはセラー権限が必要です。管理者にお問い合わせください。
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button 
              onClick={() => setShowRegisterForm(true)}
              size="lg"
              className="w-full sm:w-auto"
            >
              新規登録
            </Button>
            <Button 
              onClick={() => setShowLoginForm(true)}
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto"
            >
              ログイン
            </Button>
          </div>
        )}
      </section>

      {/* 登録フォーム */}
      {showRegisterForm && (
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>新規アカウント作成</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-email">メールアドレス</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e: any) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password">パスワード（8文字以上）</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e: any) => setRegisterData({...registerData, password: e.target.value})}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="register-name">名前（任意）</Label>
                <Input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e: any) => setRegisterData({...registerData, name: e.target.value})}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  アカウント作成
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegisterForm(false)}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ログインフォーム */}
      {showLoginForm && (
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">メールアドレス</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e: any) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">パスワード</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e: any) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  ログイン
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowLoginForm(false)}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 出品作成フォーム */}
      {showListingForm && user && (
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>新規出品作成</CardTitle>
            <CardDescription>
              半導体部品の出品情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partNumber">部品番号 *</Label>
                  <Input
                    id="partNumber"
                    value={listingData.partNumber}
                    onChange={(e: any) => setListingData({...listingData, partNumber: e.target.value})}
                    placeholder="ESP32-WROOM-32"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">メーカー名 *</Label>
                  <Input
                    id="manufacturer"
                    value={listingData.manufacturer}
                    onChange={(e: any) => setListingData({...listingData, manufacturer: e.target.value})}
                    placeholder="Espressif Systems"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">数量 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={listingData.quantity}
                    onChange={(e: any) => setListingData({...listingData, quantity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unitPriceJPY">単価（円）*</Label>
                  <Input
                    id="unitPriceJPY"
                    type="number"
                    min="0"
                    value={listingData.unitPriceJPY}
                    onChange={(e: any) => setListingData({...listingData, unitPriceJPY: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateCode">デートコード</Label>
                  <Input
                    id="dateCode"
                    value={listingData.dateCode}
                    onChange={(e: any) => setListingData({...listingData, dateCode: e.target.value})}
                    placeholder="2024W12"
                  />
                </div>
                <div>
                  <Label htmlFor="warranty">保証情報</Label>
                  <Input
                    id="warranty"
                    value={listingData.warranty}
                    onChange={(e: any) => setListingData({...listingData, warranty: e.target.value})}
                    placeholder="メーカー保証1年"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockSource">入手経路</Label>
                  <Select 
                    value={listingData.stockSource} 
                    onValueChange={(value: 'authorized' | 'open_market') => 
                      setListingData({...listingData, stockSource: value})
                    }
                  >
                    <SelectItem value="authorized">正規代理店</SelectItem>
                    <SelectItem value="open_market">二次市場</SelectItem>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">状態</Label>
                  <Select 
                    value={listingData.condition} 
                    onValueChange={(value: 'new' | 'used') => 
                      setListingData({...listingData, condition: value})
                    }
                  >
                    <SelectItem value="new">新品</SelectItem>
                    <SelectItem value="used">中古</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Package className="mr-2" />
                  出品を作成
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowListingForm(false)}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">主な機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Shield className="mb-2" />
              <CardTitle>安全な取引</CardTitle>
              <CardDescription>
                セキュアな認証システムで安心してご利用いただけます
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-2" />
              <CardTitle>高速検索</CardTitle>
              <CardDescription>
                豊富な在庫から目的の部品を素早く見つけることができます
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="mb-2" />
              <CardTitle>リアルタイム在庫</CardTitle>
              <CardDescription>
                注文と同時に在庫が更新され、正確な在庫状況を把握できます
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      {featuredListings.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">注目の商品</h2>
            <a 
              href="/listings"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              すべて見る →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <div key={listing._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square w-full mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="text-xs font-medium text-gray-700">{listing.manufacturer}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 break-all mb-2">{listing.partNumber}</h3>
                  <p className="text-sm text-gray-600 mb-2">{listing.manufacturer}</p>
                  <div className="flex items-center space-x-2">
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
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">数量:</span>
                    <span className="font-medium">{listing.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">単価:</span>
                    <span className="font-bold text-blue-600 text-lg">¥{listing.unitPriceJPY.toLocaleString()}</span>
                  </div>
                  {listing.dateCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">デートコード:</span>
                      <span className="font-medium">{listing.dateCode}</span>
                    </div>
                  )}
                </div>

                <a 
                  href={`/listings/${listing._id}`}
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center text-sm"
                >
                  詳細を見る
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          半導体部品マーケットプレイス
        </h2>
        <p className="text-gray-600 mb-4">
          確実で安全な部品調達をサポートします
        </p>
        <p className="text-sm text-gray-500">
          お問い合わせ：team@hackjpn.com
        </p>
      </section>
    </div>
  )
}