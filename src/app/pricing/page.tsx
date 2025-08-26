// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Users, 
  Package, 
  Shield, 
  CheckCircle,
  Calculator,
  TrendingUp
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">料金体系</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          透明性のある料金設定で安心してご利用いただけます
        </p>
      </div>

      {/* 基本料金 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">基本料金</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 購入者 */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">購入者</CardTitle>
              <CardDescription>半導体部品を購入したい方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">8%</div>
                <div className="text-gray-600">商品代金に対して</div>
                <div className="text-sm text-gray-500">（最低手数料: 100円）</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">アカウント登録無料</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">決済手数料無料</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">送料は出品者負担</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">問い合わせサポート</span>
                </li>
              </ul>

              <Link href="/auth/signup?role=buyer" className="block">
                <Button className="w-full">
                  購入者として始める
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 出品者 */}
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">出品者</CardTitle>
              <CardDescription>半導体部品を販売したい方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">8%</div>
                <div className="text-gray-600">売上に対して</div>
                <div className="text-sm text-gray-500">（最低手数料: 100円）</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">出品・掲載無料</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">振込手数料無料</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">運営による審査</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm">売上管理ツール</span>
                </li>
              </ul>

              <Link href="/auth/signup?role=seller" className="block">
                <Button className="w-full">
                  出品者として始める
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 料金計算例 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">料金計算例</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              実際の取引での料金例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">商品代金</th>
                    <th className="text-left py-2">手数料（8%）</th>
                    <th className="text-left py-2">購入者支払い総額</th>
                    <th className="text-left py-2">出品者受取額</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3">{formatCurrency(1000)}</td>
                    <td className="py-3">{formatCurrency(100)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(1100)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(900)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">{formatCurrency(5000)}</td>
                    <td className="py-3">{formatCurrency(400)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(5400)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(4600)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">{formatCurrency(50000)}</td>
                    <td className="py-3">{formatCurrency(4000)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(54000)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(46000)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">{formatCurrency(500000)}</td>
                    <td className="py-3">{formatCurrency(40000)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(540000)}</td>
                    <td className="py-3 font-semibold">{formatCurrency(460000)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>注意：</strong>送料は出品者負担のため、購入者の支払い総額に含まれません。
                最低手数料100円が適用されるため、商品代金が1,250円未満の場合は手数料100円となります。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 支払い・入金について */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">支払い・入金について</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                購入者の支払い
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><strong>決済方法：</strong>クレジットカード（Visa、MasterCard、JCB、AMEX）</li>
                <li><strong>決済タイミング：</strong>注文確定時に即座に決済</li>
                <li><strong>決済手数料：</strong>無料</li>
                <li><strong>領収書：</strong>マイページからダウンロード可能</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                出品者への入金
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><strong>入金サイクル：</strong>週1回（毎週金曜日）</li>
                <li><strong>入金条件：</strong>商品発送完了後</li>
                <li><strong>振込手数料：</strong>無料</li>
                <li><strong>入金口座：</strong>Stripe Connectで設定した銀行口座</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* その他の費用 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">その他の費用</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">月額費用</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">無料</div>
                <p className="text-sm text-gray-600">月額・年会費は一切かかりません</p>
              </div>
              <div>
                <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">出品費用</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">無料</div>
                <p className="text-sm text-gray-600">商品の出品・掲載は完全無料</p>
              </div>
              <div>
                <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">決済・振込手数料</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">無料</div>
                <p className="text-sm text-gray-600">決済・振込の手数料は当社負担</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">今すぐ始めましょう</h2>
        <p className="text-gray-600 mb-6">
          登録は無料、取引が成立したときのみ手数料をいただきます
        </p>
        <div className="space-x-4">
          <Link href="/auth/signup?role=buyer">
            <Button size="lg">
              購入者として始める
            </Button>
          </Link>
          <Link href="/auth/signup?role=seller">
            <Button variant="outline" size="lg">
              出品者として始める
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}