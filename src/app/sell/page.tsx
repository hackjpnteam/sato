// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Package, AlertCircle, Store, Plus, User, Shield, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

interface SellerProfile {
  id: string
  tier: 'T0' | 'T1' | 'T2'
  listingCap: number
  kycStatus: 'pending' | 'verified' | 'restricted'
  payoutsEnabled: boolean
}

export default function SellPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
  const [currentListingCount, setCurrentListingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [autoRegisteringSeller, setAutoRegisteringSeller] = useState(false)
  const [taxId, setTaxId] = useState('')
  const [registeringWithTaxId, setRegisteringWithTaxId] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    mpn: '',
    quantity: '',
    dateCode: '',
    sourceRoute: 'authorized_distributor',
    warranty: true,
    pricePerUnitJPY: '',
    photos: [] as string[],
    description: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      // Don't redirect immediately, show welcome message instead
      setLoading(false)
      return
    }

    const fetchSellerData = async () => {
      try {
        // Check if user has seller role and get profile
        const profileResponse = await fetch('/api/profile')
        if (!profileResponse.ok) {
          toast.error('プロフィールの取得に失敗しました')
          return
        }
        
        const profileData = await profileResponse.json()
        
        // If user has taxId (法人番号) but not seller role, auto-register as seller
        if (profileData.taxId && (!profileData.roles || !profileData.roles.includes('seller'))) {
          setAutoRegisteringSeller(true)
          try {
            const becomeSellerResponse = await fetch('/api/become-seller', {
              method: 'POST'
            })
            
            if (becomeSellerResponse.ok) {
              const sellerData = await becomeSellerResponse.json()
              // Refresh profile data
              const updatedProfileResponse = await fetch('/api/profile')
              if (updatedProfileResponse.ok) {
                const updatedProfileData = await updatedProfileResponse.json()
                toast.success('法人番号が確認できたため、自動的に出品者として登録しました')
                // Continue with seller data fetching
              }
            }
          } catch (error) {
            console.error('Auto seller registration failed:', error)
          } finally {
            setAutoRegisteringSeller(false)
          }
        }
        
        // Re-fetch profile data after potential auto-registration
        const currentProfileResponse = await fetch('/api/profile')
        const currentProfileData = await currentProfileResponse.json()
        
        // Allow listing even without seller role - auto-create seller profile if needed
        if (!currentProfileData.roles || !currentProfileData.roles.includes('seller')) {
          // Auto-register as seller for anyone who wants to sell
          try {
            const becomeSellerResponse = await fetch('/api/become-seller', {
              method: 'POST'
            })
            
            if (becomeSellerResponse.ok) {
              // Continue to get seller profile
            } else {
              // If become-seller fails, still allow listing but show warning
              console.warn('Auto-seller registration failed, but allowing listing')
            }
          } catch (error) {
            console.warn('Auto-seller registration error, but allowing listing:', error)
          }
        }

        // Get seller profile
        const sellerResponse = await fetch('/api/seller-profile')
        if (!sellerResponse.ok) {
          toast.error('出品者情報の取得に失敗しました')
          return
        }
        
        const sellerData = await sellerResponse.json()
        setSellerProfile(sellerData)

        // Get current listing count
        const listingsResponse = await fetch('/api/my-listings')
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setCurrentListingCount(listingsData.length)
        }

      } catch (error) {
        toast.error('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Remove seller profile check - allow anyone to list

    // Check listing cap
    if (currentListingCount >= effectiveSellerProfile.listingCap) {
      toast.error(`出品上限に達しています。現在の上限: ${effectiveSellerProfile.listingCap}件`)
      return
    }

    // Validate required fields
    if (!formData.mpn || !formData.quantity || !formData.pricePerUnitJPY) {
      toast.error('必須項目を入力してください')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          pricePerUnitJPY: parseInt(formData.pricePerUnitJPY)
        })
      })

      if (response.ok) {
        const newListing = await response.json()
        console.log('✅ Listing created successfully, response:', newListing)
        toast.success('商品を出品しました！')
        // Temporary redirect to listings page instead of individual listing
        router.push('/listings')
      } else {
        const error = await response.json()
        toast.error(error.error || '出品に失敗しました')
      }
    } catch (error) {
      toast.error('出品に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const getSellerTierLabel = (tier: string) => {
    switch (tier) {
      case 'T0': return 'ビギナー'
      case 'T1': return 'スタンダード'
      case 'T2': return 'プレミアム'
      default: return tier
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  // Show welcome page for non-logged-in users
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">半導体部品を出品しませんか？</h1>
          <p className="text-xl text-gray-600 mb-8">
            余った在庫を現金化して、必要としている人へお届けしましょう
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>簡単出品</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                型番、数量、価格を入力するだけで、
                3分で出品が完了します
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>安心取引</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                運営が審査した信頼できるバイヤーとのみ取引。
                Stripe決済で安全な代金回収
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>適正価格</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Octopartの相場データを参照して、
                適正価格で出品できます
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">手数料はたったの8%</CardTitle>
            <CardDescription>
              成約時のみ手数料が発生。出品料や月額費用は一切かかりません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">他サイト</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>出品料: ¥1,000/月</div>
                  <div>成約手数料: 10-15%</div>
                  <div>振込手数料: ¥500</div>
                </div>
                <div className="mt-4 text-xl font-bold text-red-600">約13-20%</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="text-lg font-semibold mb-2 text-green-800">当サイト</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>出品料: 無料</div>
                  <div>成約手数料: 8%</div>
                  <div>振込手数料: 無料</div>
                </div>
                <div className="mt-4 text-xl font-bold text-green-600">たったの8%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">今すぐ出品を始めましょう</h2>
          <div className="flex justify-center space-x-4 mb-8">
            <Link href="/auth/signup">
              <Button size="lg">
                <User className="mr-2 h-5 w-5" />
                無料でアカウント作成
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                アカウントをお持ちの方はログイン
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            登録後、プロフィールページで「出品者になる」ボタンをクリックして出品を開始できます
          </p>
        </div>
      </div>
    )
  }

  const handleTaxIdRegistration = async () => {
    if (!taxId || taxId.length !== 13) {
      toast.error('正しい法人番号（13桁）を入力してください')
      return
    }

    setRegisteringWithTaxId(true)
    try {
      // Get current profile first
      const profileResponse = await fetch('/api/profile')
      if (!profileResponse.ok) {
        throw new Error('プロフィールの取得に失敗しました')
      }
      const currentProfile = await profileResponse.json()

      // Update profile with tax ID
      const updateResponse = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentProfile.name,
          companyName: currentProfile.companyName,
          companyAddress: currentProfile.companyAddress,
          contactPerson: currentProfile.contactPerson,
          phoneNumber: currentProfile.phoneNumber,
          businessLicense: currentProfile.businessLicense,
          taxId: taxId
        })
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.error || 'プロフィールの更新に失敗しました')
      }

      // Register as seller
      const sellerResponse = await fetch('/api/become-seller', {
        method: 'POST'
      })

      if (sellerResponse.ok) {
        const data = await sellerResponse.json()
        setSellerProfile(data.sellerProfile)
        toast.success('法人番号が確認できました。出品者として登録しました！')
        
        // Fetch current listing count
        const listingsResponse = await fetch('/api/my-listings')
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setCurrentListingCount(listingsData.length)
        }
      } else {
        const error = await sellerResponse.json()
        toast.error(error.error || '出品者登録に失敗しました')
      }
    } catch (error) {
      toast.error('登録に失敗しました')
    } finally {
      setRegisteringWithTaxId(false)
    }
  }

  // If no seller profile, create a default one to allow listing
  const effectiveSellerProfile = sellerProfile || {
    id: 'temp',
    tier: 'T0' as const,
    listingCap: 10,
    kycStatus: 'pending' as const,
    payoutsEnabled: false
  }

  const remainingListings = effectiveSellerProfile.listingCap - currentListingCount

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">商品出品</h1>
        <p className="text-gray-600">半導体部品を出品します</p>
      </div>

      {/* Seller Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            出品者ステータス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>ティア</Label>
              <div className="mt-1">
                <Badge variant="secondary">
                  {getSellerTierLabel(effectiveSellerProfile.tier)}
                </Badge>
              </div>
            </div>
            <div>
              <Label>出品枠</Label>
              <p className="text-sm font-medium mt-1">
                {currentListingCount} / {effectiveSellerProfile.listingCap}
              </p>
            </div>
            <div>
              <Label>残り出品可能数</Label>
              <p className="text-sm font-medium mt-1 text-green-600">
                {remainingListings}件
              </p>
            </div>
            <div>
              <Label>KYC</Label>
              <div className="mt-1">
                <Badge 
                  variant={effectiveSellerProfile.kycStatus === 'verified' ? 'default' : 'secondary'}
                  className={effectiveSellerProfile.kycStatus === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {effectiveSellerProfile.kycStatus === 'verified' ? '確認済み' : '未確認'}
                </Badge>
              </div>
            </div>
          </div>
          
          {remainingListings <= 0 && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                出品上限に達しています。既存の出品を削除するか、ティアアップをお待ちください。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mpn">型番 *</Label>
                  <Input
                    id="mpn"
                    value={formData.mpn}
                    onChange={(e) => setFormData({...formData, mpn: e.target.value})}
                    placeholder="ESP32-WROOM-32"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">数量 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateCode">デートコード</Label>
                  <Input
                    id="dateCode"
                    value={formData.dateCode}
                    onChange={(e) => setFormData({...formData, dateCode: e.target.value})}
                    placeholder="2024W05"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceRoute">入手経路</Label>
                  <Select
                    value={formData.sourceRoute}
                    onValueChange={(value) => setFormData({...formData, sourceRoute: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authorized_distributor">正規代理店</SelectItem>
                      <SelectItem value="manufacturer_direct">メーカー直送</SelectItem>
                      <SelectItem value="secondary_market">二次市場</SelectItem>
                      <SelectItem value="excess_inventory">余剰在庫</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price and Warranty */}
          <Card>
            <CardHeader>
              <CardTitle>価格・保証</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">1個単価（円）*</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={formData.pricePerUnitJPY}
                  onChange={(e) => setFormData({...formData, pricePerUnitJPY: e.target.value})}
                  placeholder="800"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="warranty"
                  checked={formData.warranty}
                  onCheckedChange={(checked) => setFormData({...formData, warranty: checked})}
                />
                <Label htmlFor="warranty">メーカー保証あり</Label>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>商品説明</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="商品の詳細説明を入力してください..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={submitting || remainingListings <= 0}
            >
              <Package className="mr-2 h-4 w-4" />
              {submitting ? '出品中...' : '商品を出品'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}