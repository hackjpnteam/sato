// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Shield, 
  CreditCard, 
  Package, 
  MessageSquare, 
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Eye,
  Users,
  User
} from 'lucide-react'

export default function SellerGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">出品者ガイド</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          半導体マーケットで効果的に部品を販売するためのガイドです
        </p>
      </div>

      {/* 出品の流れ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">出品の流れ</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <User className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">1. アカウント作成</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                メールアドレスで簡単登録・出品者ロール追加
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">2. 商品情報入力</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                型番・数量・価格・入手経路を入力（3分で完了）
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <Eye className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">3. 審査・掲載</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                運営審査後、自動的にサイトに掲載開始
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">4. 売上受取</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                商品発送後、8%手数料で売上金を受取
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 出品のコツ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">売れる出品のコツ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                適正価格の設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  相場価格を参考に競争力のある価格設定
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  数量に応じたボリュームディスカウント
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  定期的な価格見直し
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-blue-500" />
                詳細な商品情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  鮮明な商品写真（複数枚）
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  正確なデートコード・ロット情報
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  入手経路・保証情報の明記
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                迅速な対応
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  問い合わせに24時間以内の回答
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  注文確定後の迅速な発送
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  トラッキング情報の共有
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                信頼性の構築
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  プロフィール情報の充実
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  正規代理店品の積極的な扱い
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                  アフターサポートの提供
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
                <h3 className="font-semibold mb-2">出品手数料</h3>
                <p className="text-2xl font-bold text-green-600">無料</p>
                <p className="text-sm text-gray-600">
                  出品・掲載は<br />
                  完全無料
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">販売手数料</h3>
                <p className="text-2xl font-bold text-primary">8%</p>
                <p className="text-sm text-gray-600">
                  売上に対して<br />
                  （最低100円）
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">入金手数料</h3>
                <p className="text-2xl font-bold text-green-600">無料</p>
                <p className="text-sm text-gray-600">
                  銀行振込手数料<br />
                  当社負担
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 禁止事項 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">禁止事項</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-600">偽造品・模倣品の販売</h3>
                  <p className="text-sm text-gray-600">
                    正規品以外の販売は固く禁じられています。発覚した場合はアカウント停止となります。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-600">不正な価格操作</h3>
                  <p className="text-sm text-gray-600">
                    相場から極端に乖離した価格設定や、意図的な価格吊り上げは禁止です。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-600">直接取引の誘導</h3>
                  <p className="text-sm text-gray-600">
                    プラットフォーム外での直接取引を誘導する行為は禁止です。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* アカウント設定 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">アカウント設定</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Stripe Connect設定</h3>
                <p className="text-sm text-gray-600 mb-2">
                  売上金の受け取りにはStripe Connectアカウントの設定が必要です：
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 本人確認書類の提出</li>
                  <li>• 銀行口座情報の登録</li>
                  <li>• 事業者情報の入力</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">税務について</h3>
                <p className="text-sm text-gray-600">
                  売上に応じて確定申告が必要な場合があります。詳細は税理士または税務署にご相談ください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seller Tiers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">出品者ランクシステム</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">ビギナー</Badge>
              <CardTitle className="text-xl">T0ランク</CardTitle>
              <CardDescription>出品者登録直後のランクです</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>出品上限</span>
                  <span className="font-semibold">10件</span>
                </div>
                <div className="flex justify-between">
                  <span>保留期間</span>
                  <span className="font-semibold">7日</span>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  初回出品から実績を積むことで自動的にランクアップします
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <Badge className="w-fit bg-green-100 text-green-800">スタンダード</Badge>
              <CardTitle className="text-xl">T1ランク</CardTitle>
              <CardDescription>安定した取引実績をお持ちの方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>出品上限</span>
                  <span className="font-semibold">50件</span>
                </div>
                <div className="flex justify-between">
                  <span>保留期間</span>
                  <span className="font-semibold">3日</span>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  5件以上の成功取引で自動昇格
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <Badge className="w-fit bg-purple-100 text-purple-800">プレミアム</Badge>
              <CardTitle className="text-xl">T2ランク</CardTitle>
              <CardDescription>トップセラーのための特別ランク</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>出品上限</span>
                  <span className="font-semibold">100件</span>
                </div>
                <div className="flex justify-between">
                  <span>保留期間</span>
                  <span className="font-semibold">即時</span>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  20件以上の成功取引＋高評価で昇格
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">今すぐ出品を始めましょう</h2>
        <p className="text-gray-600 mb-6">
          3分で出品完了。手数料はたったの8%で、余剰在庫を現金化できます。
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/sell">
            <Button size="lg">
              <Package className="mr-2 h-5 w-5" />
              出品を開始する
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              アカウントを作成する
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}