// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Circle,
  CreditCard, 
  Shield, 
  Upload, 
  FileText,
  Building2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

export default function SellerOnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'seller') {
      router.push('/auth/signup?role=seller')
      return
    }

    // オンボーディングステップの初期化
    const steps: OnboardingStep[] = [
      {
        id: 'profile',
        title: 'プロフィール完成',
        description: '会社情報・連絡先の登録',
        completed: !!(session.user?.company && session.user?.contactName),
        required: true
      },
      {
        id: 'stripe-connect',
        title: 'Stripe Connect設定',
        description: '売上金受け取りのための決済設定',
        completed: session.user?.payoutsEnabled || false,
        required: true
      },
      {
        id: 'kyc',
        title: 'KYC認証',
        description: '本人確認書類の提出',
        completed: session.user?.kycStatus === 'verified',
        required: true
      },
      {
        id: 'first-listing',
        title: '初回出品',
        description: '最初の商品を出品',
        completed: false, // 実際はデータベースから取得
        required: false
      },
      {
        id: 'guidelines',
        title: '出品ガイドライン確認',
        description: '出品ルール・禁止事項の確認',
        completed: false, // 実際はデータベースから取得
        required: true
      }
    ]

    setOnboardingSteps(steps)

    const completedSteps = steps.filter(step => step.completed).length
    setCompletionPercentage((completedSteps / steps.length) * 100)
  }, [session, status, router])

  const handleStripeConnect = async () => {
    try {
      const response = await fetch('/api/stripe/connect/onboarding-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Stripe Connect設定の準備中です。しばらくお待ちください。')
      }
    } catch (error) {
      console.error('Stripe Connect error:', error)
      alert('エラーが発生しました。しばらく時間をおいて再度お試しください。')
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

  if (!session || session.user?.role !== 'seller') {
    return null
  }

  const completedRequiredSteps = onboardingSteps.filter(step => step.required && step.completed).length
  const totalRequiredSteps = onboardingSteps.filter(step => step.required).length
  const canStartSelling = completedRequiredSteps === totalRequiredSteps

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">出品者オンボーディング</h1>
        <p className="text-gray-600 mb-6">
          半導体マーケットで販売を始めるための準備を完了しましょう
        </p>
        
        {/* 進捗状況 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">完了状況</span>
              <span className="text-sm text-gray-600">
                {Math.round(completionPercentage)}% 完了
              </span>
            </div>
            <Progress value={completionPercentage} className="mb-4" />
            {canStartSelling ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">販売開始準備完了！</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  販売開始まで残り{totalRequiredSteps - completedRequiredSteps}ステップ
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* オンボーディングステップ */}
      <div className="space-y-6">
        {onboardingSteps.map((step, index) => (
          <Card key={step.id} className={`${step.completed ? 'border-green-200 bg-green-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">必須</Badge>
                    )}
                    {step.completed && (
                      <Badge variant="secondary" className="text-xs">完了</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {/* ステップ固有のコンテンツ */}
                  {step.id === 'profile' && !step.completed && (
                    <div className="space-y-2">
                      <p className="text-sm text-orange-600 flex items-center">
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        会社情報と担当者名の設定が必要です
                      </p>
                      <Link href="/profile/edit">
                        <Button size="sm">
                          <Building2 className="mr-2 h-4 w-4" />
                          プロフィール編集
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {step.id === 'stripe-connect' && !step.completed && (
                    <div className="space-y-2">
                      <p className="text-sm text-blue-600">
                        売上金を受け取るためにStripe Connectの設定が必要です
                      </p>
                      <Button onClick={handleStripeConnect} size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Stripe設定を開始
                      </Button>
                    </div>
                  )}
                  
                  {step.id === 'kyc' && !step.completed && (
                    <div className="space-y-2">
                      <p className="text-sm text-purple-600">
                        本人確認書類の提出が必要です（Stripe Connect設定後に可能）
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={!session.user?.payoutsEnabled}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        KYC認証開始
                      </Button>
                    </div>
                  )}
                  
                  {step.id === 'guidelines' && !step.completed && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        出品ガイドラインを確認してください
                      </p>
                      <Link href="/seller/guide">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          ガイドラインを確認
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {step.id === 'first-listing' && !step.completed && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        最初の商品を出品してみましょう
                      </p>
                      <Link href="/seller/listings/new">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={!canStartSelling}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          商品を出品
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 完了後のアクション */}
      {canStartSelling && (
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">準備完了！</h2>
            <p className="text-gray-600 mb-6">
              すべての必須設定が完了しました。商品の出品を開始できます。
            </p>
            <div className="space-x-4">
              <Link href="/seller/listings/new">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  初回出品する
                </Button>
              </Link>
              <Link href="/seller/dashboard">
                <Button variant="outline" size="lg">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  出品者ダッシュボード
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}