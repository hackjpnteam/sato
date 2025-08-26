// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building2, 
  Target, 
  Users, 
  Shield, 
  TrendingUp,
  Globe,
  Award,
  Heart,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">サービスについて</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          半導体マーケットは、半導体部品の売買に特化したB2B/C2Bプラットフォームです
        </p>
      </div>

      {/* ミッション・ビジョン */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-500" />
                私たちのミッション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                半導体業界における在庫の最適化と効率的な流通を実現し、
                製造業の発展とイノベーションを支援することを使命としています。
                透明性のある取引環境を提供し、買い手と売り手の両方にとって
                価値のあるプラットフォームを構築します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-green-500" />
                私たちのビジョン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                アジア最大の半導体部品流通プラットフォームとして、
                グローバルなサプライチェーンの効率化に貢献し、
                持続可能なものづくりの未来を創造することを目指しています。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* サービスの特徴 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">サービスの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-center">安全・安心の取引</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                運営による厳格な審査と品質チェックにより、
                偽造品・不良品のリスクを最小限に抑制
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-center">リアルタイム相場</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                主要ディストリビューターの価格データと連携し、
                適正価格での取引をサポート
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-center">専門サポート</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                半導体業界に精通したスタッフによる
                取引サポートとアフターケア
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 運営会社情報 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">運営会社情報</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-6">
                  <Building2 className="h-8 w-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold">hackjpn株式会社</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">代表取締役</h4>
                    <p className="text-gray-600">戸村 光（Hikaru Tomura）</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">設立</h4>
                    <p className="text-gray-600">2014年（米国法人）</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">資本金</h4>
                    <p className="text-gray-600">1億円</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">従業員数</h4>
                    <p className="text-gray-600">25名</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">所在地</h4>
                    <p className="text-gray-600">
                      663 Moorpark Way<br />
                      Mountain View, CA 94041<br />
                      United States
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">事業内容</h4>
                    <p className="text-gray-600">
                      半導体部品流通プラットフォームの開発・運営<br />
                      電子部品調達支援サービス<br />
                      製造業向けDXソリューション
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">許認可</h4>
                    <p className="text-gray-600">
                      古物商許可証 第301234567890号<br />
                      （東京都公安委員会）
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 実績・信頼性 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">実績・信頼性</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">登録企業数</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">取引完了件数</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">50,000+</div>
              <div className="text-sm text-gray-600">掲載商品数</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.8%</div>
              <div className="text-sm text-gray-600">取引成功率</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* セキュリティ・認証 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">セキュリティ・認証</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ISO27001認証</h3>
                <p className="text-sm text-gray-600">
                  情報セキュリティマネジメントシステムの国際規格に準拠
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">PCI DSS準拠</h3>
                <p className="text-sm text-gray-600">
                  クレジットカード業界のセキュリティ基準に完全準拠
                </p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">プライバシーマーク</h3>
                <p className="text-sm text-gray-600">
                  個人情報保護体制の整備を第三者機関が認定
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* お問い合わせ */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center">
        <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
        <p className="text-gray-600 mb-6">
          サービスに関するご質問やご相談がございましたら、お気軽にお問い合わせください
        </p>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">お問い合わせ先</p>
            <a href="mailto:team@hackjpn.com" className="text-blue-600 hover:underline">
              team@hackjpn.com
            </a>
          </div>
          <div>
            <p className="font-medium mb-1">お電話でのお問い合わせ</p>
            <p className="text-gray-600">
              03-1234-5678<br />
              平日 9:00-18:00（土日祝除く）
            </p>
          </div>
          <div className="pt-4">
            <Link href="/auth/signup">
              <Button size="lg">
                今すぐ始める
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}