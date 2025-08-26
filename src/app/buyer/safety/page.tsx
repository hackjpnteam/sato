// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Lock,
  CreditCard,
  Phone,
  FileText,
  Users
} from 'lucide-react'

export default function BuyerSafetyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">安全な取引のために</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          半導体マーケットで安心して取引するためのガイドライン
        </p>
      </div>

      {/* セキュリティ対策 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">プラットフォームのセキュリティ対策</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-500" />
                運営による審査
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                すべての出品は運営チームが審査し、以下の項目をチェックします：
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  商品写真の真正性
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  価格の適正性
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  出品者情報の確認
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  仕様情報の正確性
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-blue-500" />
                安全な決済システム
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Stripe決済システムによる安全な取引：
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  SSL暗号化通信
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  PCI DSS準拠
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  不正利用検知システム
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  チャージバック対応
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 安全確認チェックリスト */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">購入前の安全確認チェックリスト</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-green-600">✅ 確認すべき項目</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    出品者の会社名・住所が明記されている
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    商品写真が鮮明で詳細
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    デートコード・ロット情報が記載
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    入手経路が明確（正規代理店等）
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    価格が相場と大きく乖離していない
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    質問への回答が迅速・丁寧
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-red-600">⚠️ 注意すべき項目</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    価格が相場より極端に安い
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    出品者情報が不完全・不明確
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    商品写真が不鮮明・少ない
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    入手経路が「その他」で詳細不明
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    質問への回答がない・遅い
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                    直接取引を提案してくる
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 偽造品の見分け方 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">偽造品・模倣品の見分け方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-blue-500" />
                外観チェック
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 印字のかすれ・にじみ</li>
                <li>• パッケージの質感の違い</li>
                <li>• ロゴ・文字の微細な違い</li>
                <li>• サイズ・形状の不正確性</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-500" />
                書類確認
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 正規販売店の証明書</li>
                <li>• メーカーの品質保証書</li>
                <li>• トレーサビリティ文書</li>
                <li>• 輸入証明書（海外品）</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                出品者確認
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 長期間の取引実績</li>
                <li>• 正規代理店認定の有無</li>
                <li>• 過去の評価・レビュー</li>
                <li>• 問い合わせ対応の質</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* トラブル対応 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">トラブル発生時の対応</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">1. まずは出品者に連絡</h3>
                <p className="text-sm text-gray-600 mb-2">
                  商品の不具合や配送の問題は、まず出品者に直接連絡してください。
                </p>
                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                  <li>• 問題の詳細を写真付きで報告</li>
                  <li>• 希望する解決方法を明確に伝える</li>
                  <li>• 回答期限を設定（通常48時間）</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">2. 運営チームに報告</h3>
                <p className="text-sm text-gray-600 mb-2">
                  出品者からの回答がない、または解決に至らない場合：
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 mb-2">
                    お問い合わせ：team@hackjpn.com
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 注文番号</li>
                    <li>• 問題の詳細</li>
                    <li>• 出品者とのやり取り履歴</li>
                    <li>• 証拠資料（写真・文書等）</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">3. 返金・補償</h3>
                <p className="text-sm text-gray-600">
                  問題が確認された場合、以下の対応を行います：
                </p>
                <ul className="text-sm text-gray-600 ml-4 space-y-1 mt-2">
                  <li>• 商品の返品・交換</li>
                  <li>• 代金の全額または一部返金</li>
                  <li>• 送料の補償</li>
                  <li>• 出品者への指導・処分</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">安全な取引を始めましょう</h2>
        <p className="text-gray-600 mb-6">
          ガイドラインを確認して、安心して半導体部品をお探しください
        </p>
        <div className="space-x-4">
          <Link href="/listings">
            <Button size="lg">
              部品を探す
            </Button>
          </Link>
          <Link href="/buyer/guide">
            <Button variant="outline" size="lg">
              購入ガイドを見る
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}