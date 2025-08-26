// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  AlertTriangle, 
  Shield, 
  CreditCard,
  Package,
  Scale,
  CheckCircle
} from 'lucide-react'

export default function SellerTermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <FileText className="mr-3 h-8 w-8" />
          出品者規約
        </h1>
        <p className="text-gray-600">
          半導体マーケットでの出品に関する規約・ガイドライン
        </p>
        <div className="mt-4">
          <Badge variant="outline">最終更新：2024年1月1日</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* 基本的な出品条件 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              第1条：基本的な出品条件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. 出品可能な商品</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    正規メーカーまたは正規代理店から入手した半導体部品
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    品質・動作に問題のない部品
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    適切な保管状態で管理された部品
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. 必須登録情報</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 型番（MPN）- 正確なメーカー部品番号</li>
                  <li>• 数量 - 正確な在庫数</li>
                  <li>• デートコード - 製造年週（YYYYWW形式等）</li>
                  <li>• 入手経路 - 正規代理店/市場在庫/その他</li>
                  <li>• メーカー保証の有無</li>
                  <li>• 商品写真 - 最低1枚、推奨3枚以上</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 厳格な禁止事項 */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              第2条：厳格な禁止事項
            </CardTitle>
            <CardDescription>
              以下の行為は即座にアカウント停止の対象となります
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-700 mb-3">絶対禁止事項</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <strong>偽造品・模倣品の販売</strong>
                      <p className="text-gray-600">正規品以外の販売は法的処罰の対象となります</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <strong>虚偽情報の記載</strong>
                      <p className="text-gray-600">仕様・状態・入手経路等の偽装</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <strong>直接取引の誘導</strong>
                      <p className="text-gray-600">プラットフォーム外での取引誘導</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <strong>価格操作・談合</strong>
                      <p className="text-gray-600">意図的な価格吊り上げや市場操作</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 品質基準 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              第3条：品質基準・審査について
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">運営審査項目</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">商品情報審査</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 型番の正確性確認</li>
                      <li>• 写真の鮮明度・真正性</li>
                      <li>• 仕様情報の妥当性</li>
                      <li>• デートコード形式の確認</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">価格・市場審査</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 相場価格との比較</li>
                      <li>• 極端な価格設定の確認</li>
                      <li>• 数量と価格の整合性</li>
                      <li>• 競合他社との比較</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-700 mb-2">審査基準</h3>
                <ul className="text-sm space-y-1">
                  <li>• 相場価格から±30%を超える乖離は要確認</li>
                  <li>• 入手経路が「その他」の場合は詳細確認が必要</li>
                  <li>• 希少部品・高額部品は厳格な審査を実施</li>
                  <li>• 初回出品者は追加書類提出を求める場合あり</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 料金・決済 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              第4条：料金・決済について
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">手数料体系</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>出品手数料：</strong>無料</li>
                    <li>• <strong>販売手数料：</strong>売上の8%（最低100円）</li>
                    <li>• <strong>振込手数料：</strong>無料</li>
                    <li>• <strong>返金手数料：</strong>無料</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">入金について</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>入金サイクル：</strong>週1回（毎週金曜日）</li>
                    <li>• <strong>入金条件：</strong>商品発送完了後</li>
                    <li>• <strong>最低入金額：</strong>1,000円</li>
                    <li>• <strong>入金口座：</strong>Stripe Connect登録口座</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC・本人確認 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="mr-2 h-5 w-5" />
              第5条：KYC・本人確認について
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">必要書類</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">個人事業主の場合</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 身分証明書（免許証・パスポート等）</li>
                      <li>• 開業届（税務署受付印あり）</li>
                      <li>• 銀行口座情報</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">法人の場合</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 登記事項証明書（3ヶ月以内）</li>
                      <li>• 代表者身分証明書</li>
                      <li>• 法人銀行口座情報</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 責任・免責 */}
        <Card>
          <CardHeader>
            <CardTitle>第6条：出品者の責任について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">出品者の責任</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 商品情報の正確性に対する責任</li>
                  <li>• 商品の品質・動作に対する責任</li>
                  <li>• 適切な梱包・発送に対する責任</li>
                  <li>• 購入者からの問い合わせへの迅速な回答</li>
                  <li>• アフターサポート（保証期間内）</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">プラットフォーム運営者の免責</h3>
                <p className="text-sm text-gray-600">
                  当社は取引の仲介のみを行い、商品の品質・適合性・動作等については一切の責任を負いません。
                  取引に関するトラブルは原則として当事者間で解決していただきます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 違反時の措置 */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              第7条：規約違反時の措置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-3 rounded">
                  <h4 className="font-medium text-yellow-700 mb-2">軽微な違反</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 警告通知</li>
                    <li>• 出品内容の修正要求</li>
                    <li>• 一時的な出品停止</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <h4 className="font-medium text-orange-700 mb-2">重度の違反</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 出品権限の停止</li>
                    <li>• 売上金の一時凍結</li>
                    <li>• アカウント利用制限</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-medium text-red-700 mb-2">悪質な違反</h4>
                  <ul className="text-xs space-y-1">
                    <li>• アカウント永久停止</li>
                    <li>• 法的措置の検討</li>
                    <li>• 関係機関への通報</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 同意・CTA */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">出品者規約への同意</h2>
          <p className="text-gray-600 mb-6">
            出品を開始する前に、上記の規約をすべてお読みいただき、同意していただく必要があります
          </p>
          <div className="space-x-4">
            <Link href="/seller/onboarding">
              <Button size="lg">
                規約に同意して出品を始める
              </Button>
            </Link>
            <Link href="/seller/guide">
              <Button variant="outline" size="lg">
                出品ガイドを確認
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-600">
              ご不明点がございましたら、お気軽にお問い合わせください<br />
              <a href="mailto:team@hackjpn.com" className="text-blue-600 hover:underline">
                team@hackjpn.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}