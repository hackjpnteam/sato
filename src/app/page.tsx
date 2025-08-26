// MongoDB版 簡易UIホームページ
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  TrendingUp, 
  Package, 
  Zap, 
  Users,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

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

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        setUser(data.user)
      } catch {
        console.error('Failed to fetch user:')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
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
        toast.success(result.message || 'アカウントを作成しました')
        setShowRegisterForm(false)
        setRegisterData({ email: '', password: '', name: '' })
      } else {
        toast.error(result.error || '登録に失敗しました')
      }
    } catch {
      toast.error('登録中にエラーが発生しました')
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
        toast.success(result.message || 'ログインしました')
        setUser(result.user)
        setShowLoginForm(false)
        setLoginData({ email: '', password: '' })
      } else {
        toast.error(result.error || 'ログインに失敗しました')
      }
    } catch {
      toast.error('ログイン中にエラーが発生しました')
    }
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast.success('ログアウトしました')
    } catch {
      toast.error('ログアウト中にエラーが発生しました')
    }
  }

  // 出品処理
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()

    // セラーロールチェック
    if (!user?.role || !['seller', 'admin'].includes(user.role)) {
      toast.error('出品するにはセラー権限が必要です')
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
        toast.success(result.message || '出品を作成しました')
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
        toast.error(result.error || '出品作成に失敗しました')
      }
    } catch {
      toast.error('出品作成中にエラーが発生しました')
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4">
          半導体部品マーケットプレイス
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          信頼できる半導体部品の売買プラットフォーム
        </p>

        {user ? (
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-lg font-semibold">ログイン中</span>
            </div>
            <div className="text-left space-y-2 mb-4">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.name || '未設定'}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Email認証:</strong> {user.emailVerified ? '済み' : '未認証'}</p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => setShowListingForm(true)}
                className="w-full"
                disabled={!['seller', 'admin'].includes(user.role)}
              >
                <Plus className="mr-2 h-4 w-4" />
                出品を作成
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                ログアウト
              </Button>
            </div>
            {!['seller', 'admin'].includes(user.role) && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  出品するにはセラー権限が必要です。管理者にお問い合わせください。
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => setShowRegisterForm(true)}
              size="lg"
            >
              新規登録
            </Button>
            <Button 
              onClick={() => setShowLoginForm(true)}
              size="lg" 
              variant="outline"
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
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password">パスワード（8文字以上）</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
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
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
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
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">パスワード</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                    onChange={(e) => setListingData({...listingData, partNumber: e.target.value})}
                    placeholder="ESP32-WROOM-32"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">メーカー名 *</Label>
                  <Input
                    id="manufacturer"
                    value={listingData.manufacturer}
                    onChange={(e) => setListingData({...listingData, manufacturer: e.target.value})}
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
                    onChange={(e) => setListingData({...listingData, quantity: e.target.value})}
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
                    onChange={(e) => setListingData({...listingData, unitPriceJPY: e.target.value})}
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
                    onChange={(e) => setListingData({...listingData, dateCode: e.target.value})}
                    placeholder="2024W12"
                  />
                </div>
                <div>
                  <Label htmlFor="warranty">保証情報</Label>
                  <Input
                    id="warranty"
                    value={listingData.warranty}
                    onChange={(e) => setListingData({...listingData, warranty: e.target.value})}
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authorized">正規代理店</SelectItem>
                      <SelectItem value="open_market">二次市場</SelectItem>
                    </SelectContent>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">新品</SelectItem>
                      <SelectItem value="used">中古</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Package className="mr-2 h-4 w-4" />
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
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>安全な取引</CardTitle>
              <CardDescription>
                セキュアな認証システムで安心・安全な取引を実現
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>高速検索</CardTitle>
              <CardDescription>
                部品番号やメーカー名で瞬時に在庫を検索
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>在庫管理</CardTitle>
              <CardDescription>
                リアルタイムの在庫管理と自動更新システム
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Services */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>提供サービス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  購入者向け
                </h4>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>✓ 幅広い半導体部品の検索</li>
                  <li>✓ 複数サプライヤーからの価格比較</li>
                  <li>✓ 安全な決済システム</li>
                  <li>✓ リアルタイム在庫確認</li>
                  <li>✓ 品質保証付き部品の購入</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  販売者向け
                </h4>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>✓ 簡単な出品プロセス</li>
                  <li>✓ 在庫管理ツール</li>
                  <li>✓ 売上分析レポート</li>
                  <li>✓ 自動価格調整機能</li>
                  <li>✓ グローバルな顧客へのアクセス</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact */}
      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          半導体部品の売買をもっと簡単に
        </h2>
        <p className="text-gray-600 mb-4">
          安心・安全・スピーディーな取引をサポートします
        </p>
        <p className="text-sm text-gray-500">
          お問い合わせ：team@hackjpn.com
        </p>
      </section>
    </div>
  )
}