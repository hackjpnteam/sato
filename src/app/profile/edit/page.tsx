// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Mail,
  Shield,
  Save,
  AlertTriangle
} from 'lucide-react'

export default function ProfileEditPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    company: '',
    contactName: '',
    contactPhone: '',
    address: '',
    role: 'buyer'
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // セッションデータでフォームを初期化
    setFormData({
      email: session.user?.email || '',
      company: session.user?.company || '',
      contactName: session.user?.contactName || '',
      contactPhone: session.user?.contactPhone || '',
      address: session.user?.address || '',
      role: session.user?.role || 'buyer'
    })
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'プロフィールの更新に失敗しました')
      } else {
        setSuccess('プロフィールが正常に更新されました')
        // セッションを更新
        await update({
          ...session,
          user: {
            ...session?.user,
            company: formData.company,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            address: formData.address
          }
        })
      }
    } catch (error) {
      setError('プロフィールの更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">プロフィール編集</h1>
        <p className="text-gray-600">
          アカウント情報を更新してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* アカウント情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              アカウント情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="flex-1"
                />
                <Badge variant="secondary">変更不可</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>アカウントタイプ</Label>
              <div className="flex items-center space-x-2">
                <Badge variant={session.user?.role === 'seller' ? 'default' : 'outline'}>
                  {session.user?.role === 'seller' ? '出品者' : '購入者'}
                </Badge>
                {session.user?.role === 'seller' && (
                  <>
                    <Badge variant={session.user?.kycStatus === 'verified' ? 'default' : 'secondary'}>
                      {session.user?.kycStatus === 'verified' ? 'KYC認証済み' : 'KYC未認証'}
                    </Badge>
                    {session.user?.payoutsEnabled && (
                      <Badge variant="secondary">
                        <Shield className="mr-1 h-3 w-3" />
                        入金可能
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 会社・連絡先情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              会社・連絡先情報
            </CardTitle>
            <CardDescription>
              取引相手に表示される情報です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">会社名 *</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                placeholder="例：株式会社○○商事"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">担当者名 *</Label>
              <Input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
                placeholder="例：田中太郎"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">電話番号 *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                placeholder="例：03-1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">住所 *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="例：東京都渋谷区○○1-2-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* セキュリティ情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              セキュリティ・認証状況
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">メール認証</h3>
                <p className="text-sm text-gray-600">メールアドレスの確認</p>
              </div>
              <Badge variant={session.user?.emailVerified ? 'default' : 'secondary'}>
                {session.user?.emailVerified ? '認証済み' : '未認証'}
              </Badge>
            </div>

            {session.user?.role === 'seller' && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Stripe Connect</h3>
                  <p className="text-sm text-gray-600">売上金受け取り設定</p>
                </div>
                <Badge variant={session.user?.payoutsEnabled ? 'default' : 'secondary'}>
                  {session.user?.payoutsEnabled ? '設定完了' : '未設定'}
                </Badge>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">パスワード変更</h3>
                  <p className="text-sm text-blue-600">
                    セキュリティ向上のため、定期的なパスワード変更を推奨します
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    パスワード変更
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* エラー・成功メッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* 保存ボタン */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>読み込み中...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}