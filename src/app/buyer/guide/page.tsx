// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Shield, 
  CreditCard, 
  Package, 
  MessageSquare, 
  CheckCircle,
  AlertTriangle,
  Star,
  Clock
} from 'lucide-react'

export default function BuyerGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">購入者ガイド</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          半導体マーケットで安心・安全に部品を購入するためのガイドです
        </p>
      </div>

      {/* 購入の流れ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">購入の流れ</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Search className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">1. 部品を探す</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                型番や仕様で必要な半導体部品を検索
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Package className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">2. 詳細確認</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                仕様・在庫・相場価格・出品者情報を確認
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">3. 購入手続き</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                数量選択・決済・配送先入力
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">4. 取引完了</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                商品受取・取引評価・完了
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 安全な取引のポイント */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">安全な取引のポイント</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-500" />
                出品者を確認
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  会社名・住所が明記されているか
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  過去の取引実績・評価
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  レスポンスの速さ
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-blue-500" />
                商品詳細を確認
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  デートコード・ロット番号
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  入手経路（正規代理店・市場在庫）
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  メーカー保証の有無
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                相場価格と比較
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  Octopart等の相場データを参照
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500 mt-0.5" />
                  相場より極端に安い場合は注意
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  総コスト（送料・手数料込み）で判断
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                コミュニケーション
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  購入前に不明点を質問
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  配送方法・日数を確認
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  トラブル時は運営に相談
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 料金体系 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">料金体系</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">購入手数料</h3>
                <p className="text-2xl font-bold text-primary">8%</p>
                <p className="text-sm text-gray-600">
                  商品代金に対して<br />
                  （最低100円）
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">決済手数料</h3>
                <p className="text-2xl font-bold text-green-600">無料</p>
                <p className="text-sm text-gray-600">
                  クレジットカード・<br />
                  銀行振込
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">送料</h3>
                <p className="text-2xl font-bold text-blue-600">出品者負担</p>
                <p className="text-sm text-gray-600">
                  購入者の追加負担<br />
                  なし
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 注意事項 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">注意事項</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">偽造品・模倣品について</h3>
                  <p className="text-sm text-gray-600">
                    極端に安い価格や、入手経路が不明な商品は偽造品の可能性があります。不審な商品を発見した場合は運営までご報告ください。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">納期について</h3>
                  <p className="text-sm text-gray-600">
                    在庫状況や配送地域により納期が変動する場合があります。急ぎの場合は事前に出品者へ確認してください。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">返品・交換について</h3>
                  <p className="text-sm text-gray-600">
                    商品に不具合がある場合、到着から7日以内にご連絡ください。出品者との協議により返品・交換を行います。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">半導体部品を探してみましょう</h2>
        <p className="text-gray-600 mb-6">
          豊富な在庫から必要な部品を見つけてください
        </p>
        <div className="space-x-4">
          <Link href="/listings">
            <Button size="lg">
              <Search className="mr-2 h-4 w-4" />
              部品を探す
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">
              無料で始める
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}