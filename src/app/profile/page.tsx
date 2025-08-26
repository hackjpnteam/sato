// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Building, Mail, Phone, MapPin, Shield, Save, AlertCircle, Store, Plus } from 'lucide-react'
import { toast } from 'sonner'

type Role = 'admin' | 'operator' | 'seller' | 'buyer'

interface UserProfile {
  id: string
  email: string
  name: string
  roles: Role[] // roles統合版
  companyName?: string
  companyAddress?: string
  contactPerson?: string
  phoneNumber?: string
  taxId?: string
  businessLicense?: string
  createdAt: string
  updatedAt: string
}

interface SellerProfile {
  id: string
  userId: string
  stripeConnectId?: string
  payoutsEnabled: boolean
  kycStatus: 'pending' | 'verified' | 'restricted'
  tier: 'T0' | 'T1' | 'T2'
  listingCap: number
  holdDays: number
  totalOrders: number
  fulfilledOrders: number
  averageRating: number
  ratingCount: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [becomingSelller, setBecomingSeller] = useState(false)

  // Fetch user profile from API
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setLoading(false)
      return
    }
    
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          
          // sellerロールを持っている場合、SellerProfileも取得
          if (data.roles && data.roles.includes('seller')) {
            const sellerResponse = await fetch('/api/seller-profile')
            if (sellerResponse.ok) {
              const sellerData = await sellerResponse.json()
              setSellerProfile(sellerData)
            }
          }
        } else {
          toast.error('プロフィールの取得に失敗しました')
        }
      } catch (error) {
        toast.error('プロフィールの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [session, status])

  const handleSave = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          companyName: profile.companyName,
          companyAddress: profile.companyAddress,
          contactPerson: profile.contactPerson,
          phoneNumber: profile.phoneNumber,
          taxId: profile.taxId,
          businessLicense: profile.businessLicense
        })
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        toast.success('プロフィールが更新されました')
        setEditMode(false)
      } else {
        const error = await response.json()
        toast.error(error.error || '更新に失敗しました')
      }
    } catch (error) {
      toast.error('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    setEditMode(false)
    // Reset form data by refetching from API
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error resetting profile data:', error)
    }
  }

  const handleBecomeSeller = async () => {
    setBecomingSeller(true)
    try {
      const response = await fetch('/api/become-seller', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setSellerProfile(data.sellerProfile)
        toast.success('出品者登録が完了しました！')
      } else {
        const error = await response.json()
        toast.error(error.error || '出品者登録に失敗しました')
      }
    } catch (error) {
      toast.error('出品者登録に失敗しました')
    } finally {
      setBecomingSeller(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'operator':
        return 'bg-orange-100 text-orange-800'
      case 'seller':
        return 'bg-green-100 text-green-800'
      case 'buyer':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者'
      case 'operator':
        return 'オペレーター'
      case 'seller':
        return '出品者'
      case 'buyer':
        return '購入者'
      default:
        return role
    }
  }
  
  const getSellerTierLabel = (tier: string) => {
    switch (tier) {
      case 'T0':
        return 'ビギナー'
      case 'T1':
        return 'スタンダード'
      case 'T2':
        return 'プレミアム'
      default:
        return tier
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

  if (!session || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">アクセスが制限されています</h2>
            <p className="text-gray-600">プロフィールを表示するにはログインが必要です。</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロフィール</h1>
        <p className="text-gray-600">アカウント情報の確認・編集</p>
      </div>

      <div className="space-y-8">
        {/* アカウント基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              アカウント基本情報
            </CardTitle>
            <CardDescription>
              ログイン情報とアカウントの種類
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">メールアドレスは変更できません</p>
              </div>
              <div>
                <Label htmlFor="roles">アカウント種別</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.roles.map((role, index) => (
                    <Badge key={index} className={getRoleColor(role)}>
                      {getRoleLabel(role)}
                    </Badge>
                  ))}
                </div>
                {!profile.roles.includes('seller') && (
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleBecomeSeller}
                      disabled={becomingSelller}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Store className="mr-2 h-4 w-4" />
                      {becomingSelller ? '登録中...' : '出品者になる'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="name">表示名</Label>
              {editMode ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              ) : (
                <Input
                  id="name"
                  value={profile.name}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 会社情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              会社・団体情報
            </CardTitle>
            <CardDescription>
              取引に使用される会社情報
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">会社名・団体名</Label>
                {editMode ? (
                  <Input
                    id="companyName"
                    value={profile.companyName || ''}
                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  />
                ) : (
                  <Input
                    id="companyName"
                    value={profile.companyName || ''}
                    disabled
                    className="bg-gray-50"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="contactPerson">担当者名</Label>
                {editMode ? (
                  <Input
                    id="contactPerson"
                    value={profile.contactPerson || ''}
                    onChange={(e) => setProfile({...profile, contactPerson: e.target.value})}
                  />
                ) : (
                  <Input
                    id="contactPerson"
                    value={profile.contactPerson || ''}
                    disabled
                    className="bg-gray-50"
                  />
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="companyAddress">所在地</Label>
              {editMode ? (
                <Textarea
                  id="companyAddress"
                  value={profile.companyAddress || ''}
                  onChange={(e) => setProfile({...profile, companyAddress: e.target.value})}
                  rows={2}
                />
              ) : (
                <Textarea
                  id="companyAddress"
                  value={profile.companyAddress || ''}
                  disabled
                  className="bg-gray-50"
                  rows={2}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 連絡先情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              連絡先情報
            </CardTitle>
            <CardDescription>
              緊急時や重要な連絡に使用されます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">電話番号</Label>
              {editMode ? (
                <Input
                  id="phoneNumber"
                  value={profile.phoneNumber || ''}
                  onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                  placeholder="03-1234-5678"
                />
              ) : (
                <Input
                  id="phoneNumber"
                  value={profile.phoneNumber || ''}
                  disabled
                  className="bg-gray-50"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 出品者情報 */}
        {profile.roles.includes('seller') && sellerProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                出品者情報
              </CardTitle>
              <CardDescription>
                出品ステータスと実績
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>ティア</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {getSellerTierLabel(sellerProfile.tier)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>出品上限</Label>
                  <p className="text-sm font-medium mt-1">
                    {sellerProfile.listingCap}件
                  </p>
                </div>
                <div>
                  <Label>KYCステータス</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={sellerProfile.kycStatus === 'verified' ? 'default' : 'secondary'}
                      className={sellerProfile.kycStatus === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {sellerProfile.kycStatus === 'verified' ? '確認済み' : 
                       sellerProfile.kycStatus === 'pending' ? '未確認' : '制限中'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>平均評価</Label>
                  <p className="text-sm font-medium mt-1">
                    {sellerProfile.averageRating.toFixed(1)} ★ ({sellerProfile.ratingCount})
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{sellerProfile.totalOrders}</p>
                  <p className="text-sm text-gray-600">総受注数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{sellerProfile.fulfilledOrders}</p>
                  <p className="text-sm text-gray-600">完了数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {sellerProfile.totalOrders > 0 
                      ? Math.round((sellerProfile.fulfilledOrders / sellerProfile.totalOrders) * 100) 
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">完了率</p>
                </div>
              </div>
              
              {!sellerProfile.payoutsEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">振込設定が未完了です</p>
                      <p className="text-xs text-yellow-600">出品の売上を受け取るためにStripe Connectの設定が必要です。</p>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3" disabled>
                    Stripe Connect設定 (未実装)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 法人番号・許可証 */}
        {profile.roles.includes('seller') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                事業者情報
              </CardTitle>
              <CardDescription>
                出品者として必要な法人情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">法人番号</Label>
                  {editMode ? (
                    <Input
                      id="taxId"
                      value={profile.taxId || ''}
                      onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                      placeholder="1234567890123"
                    />
                  ) : (
                    <Input
                      id="taxId"
                      value={profile.taxId || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="businessLicense">事業許可証番号</Label>
                  {editMode ? (
                    <Input
                      id="businessLicense"
                      value={profile.businessLicense || ''}
                      onChange={(e) => setProfile({...profile, businessLicense: e.target.value})}
                      placeholder="T1234567890"
                    />
                  ) : (
                    <Input
                      id="businessLicense"
                      value={profile.businessLicense || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* アカウント作成情報 */}
        <Card>
          <CardHeader>
            <CardTitle>アカウント履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-1">
              <div>作成日時: {new Date(profile.createdAt).toLocaleString('ja-JP')}</div>
              <div>最終更新: {new Date(profile.updatedAt).toLocaleString('ja-JP')}</div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex justify-end space-x-4">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '変更を保存'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              プロフィールを編集
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}