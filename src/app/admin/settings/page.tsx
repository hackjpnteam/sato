// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // システム設定
    siteName: '半導体マーケットプレイス',
    siteDescription: '半導体部品の在庫売買プラットフォーム',
    contactEmail: 'team@hackjpn.com',
    supportEmail: 'support@hackjpn.com',
    maintenanceMode: false,
    
    // 手数料設定
    platformFeeRate: 8.0,
    minimumOrderAmount: 1000,
    maximumOrderAmount: 10000000,
    
    // 通知設定
    emailNotifications: true,
    orderNotifications: true,
    listingApprovalNotifications: true,
    systemAlerts: true,
    
    // セキュリティ設定
    requireEmailVerification: true,
    requireTaxIdForSellers: true,
    autoApproveListings: false,
    maxListingsPerSeller: {
      T0: 10,
      T1: 50,
      T2: 100
    },
    
    // Stripe設定
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    stripeConnectClientId: process.env.STRIPE_CONNECT_CLIENT_ID || ''
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // 実際の実装では API に設定を送信
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('設定を保存しました')
    } catch {
      toast.error('設定の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNestedInputChange = (parentKey: string, childKey: string, value: unknown) => {
    setSettings(prev => {
      const parentValue = prev[parentKey as keyof typeof prev] as Record<string, unknown>
      return {
        ...prev,
        [parentKey]: {
          ...parentValue,
          [childKey]: value
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">システム設定</h1>
          <p className="text-gray-600">プラットフォームの設定・管理</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>設定を保存中...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              設定を保存
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              基本設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">サイト名</label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="サイト名を入力"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">サイト説明</label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                placeholder="サイトの説明を入力"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">お問い合わせメール</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">サポートメール</label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                placeholder="support@example.com"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">メンテナンスモード</p>
                <p className="text-sm text-gray-600">サイトを一時的に停止します</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 手数料設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              手数料設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">プラットフォーム手数料 (%)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={settings.platformFeeRate}
                onChange={(e) => handleInputChange('platformFeeRate', parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">現在: {settings.platformFeeRate}%</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">最小注文金額 (円)</label>
              <Input
                type="number"
                min="0"
                value={settings.minimumOrderAmount}
                onChange={(e) => handleInputChange('minimumOrderAmount', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">最大注文金額 (円)</label>
              <Input
                type="number"
                min="0"
                value={settings.maximumOrderAmount}
                onChange={(e) => handleInputChange('maximumOrderAmount', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              通知設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">メール通知</p>
                <p className="text-sm text-gray-600">一般的なメール通知を有効化</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">注文通知</p>
                <p className="text-sm text-gray-600">新しい注文の通知</p>
              </div>
              <Switch
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">出品承認通知</p>
                <p className="text-sm text-gray-600">出品承認・拒否の通知</p>
              </div>
              <Switch
                checked={settings.listingApprovalNotifications}
                onCheckedChange={(checked) => handleInputChange('listingApprovalNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">システムアラート</p>
                <p className="text-sm text-gray-600">システム関連の緊急通知</p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* セキュリティ設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              セキュリティ設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">メール認証必須</p>
                <p className="text-sm text-gray-600">ユーザー登録時のメール認証を必須にする</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => handleInputChange('requireEmailVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">出品者の法人番号必須</p>
                <p className="text-sm text-gray-600">出品者登録時に法人番号を必須にする</p>
              </div>
              <Switch
                checked={settings.requireTaxIdForSellers}
                onCheckedChange={(checked) => handleInputChange('requireTaxIdForSellers', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">出品自動承認</p>
                <p className="text-sm text-gray-600">出品を自動的に承認する</p>
              </div>
              <Switch
                checked={settings.autoApproveListings}
                onCheckedChange={(checked) => handleInputChange('autoApproveListings', checked)}
              />
            </div>
            
            <div>
              <p className="font-medium mb-3">ティア別出品上限設定</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">T0 (新規)</span>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.maxListingsPerSeller.T0}
                    onChange={(e) => handleNestedInputChange('maxListingsPerSeller', 'T0', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">T1 (標準)</span>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.maxListingsPerSeller.T1}
                    onChange={(e) => handleNestedInputChange('maxListingsPerSeller', 'T1', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">T2 (プレミアム)</span>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.maxListingsPerSeller.T2}
                    onChange={(e) => handleNestedInputChange('maxListingsPerSeller', 'T2', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stripe設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Stripe設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Publishable Key</label>
              <Input
                type="password"
                value={settings.stripePublishableKey}
                onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                placeholder="pk_test_..."
              />
              <div className="flex items-center mt-1">
                {settings.stripePublishableKey ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">設定済み</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">未設定</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Webhook Secret</label>
              <Input
                type="password"
                value={settings.stripeWebhookSecret}
                onChange={(e) => handleInputChange('stripeWebhookSecret', e.target.value)}
                placeholder="whsec_..."
              />
              <div className="flex items-center mt-1">
                {settings.stripeWebhookSecret ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">設定済み</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">未設定</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Connect Client ID</label>
              <Input
                type="password"
                value={settings.stripeConnectClientId}
                onChange={(e) => handleInputChange('stripeConnectClientId', e.target.value)}
                placeholder="ca_..."
              />
              <div className="flex items-center mt-1">
                {settings.stripeConnectClientId ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">設定済み</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">未設定</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 設定確認 */}
      <Card>
        <CardHeader>
          <CardTitle>設定状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Badge className={settings.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                {settings.maintenanceMode ? 'メンテナンス中' : '稼働中'}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">サイト状態</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge className={settings.emailNotifications ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                {settings.emailNotifications ? '有効' : '無効'}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">メール通知</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge className="bg-green-100 text-green-800">
                {settings.platformFeeRate}%
              </Badge>
              <p className="text-sm text-gray-600 mt-1">プラットフォーム手数料</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge className={settings.autoApproveListings ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                {settings.autoApproveListings ? '自動承認' : '手動承認'}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">出品承認</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}