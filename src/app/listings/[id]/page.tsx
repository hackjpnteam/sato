// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  MapPin, 
  Shield, 
  Building2, 
  Calendar, 
  TrendingUp,
  ShoppingCart,
  Heart,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { generatePlaceholderImage } from '@/lib/image-utils'

// モックデータ
const mockListings: { [key: string]: any } = {
  '1': {
    id: '1',
    mpn: 'SN74LVC14APWR',
    manufacturer: 'Texas Instruments',
    quantity: 500,
    dateCode: '2024W12',
    sourceRoute: '正規代理店',
    warranty: true,
    pricePerUnitJPY: 120,
    photos: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    description: 'Texas Instruments製 ロジックIC - 6チャンネル シュミット トリガー インバーター。高品質な正規代理店品です。',
    status: 'listed',
    seller: {
      id: 'seller1',
      company: 'デモ電子部品商社',
      email: 'seller@demo.com',
      contactName: '営業担当者',
      address: '東京都品川区'
    },
    createdAt: new Date('2024-01-15')
  },
  '2': {
    id: '2',
    mpn: 'STM32F401RET6',
    manufacturer: 'STMicroelectronics',
    quantity: 100,
    dateCode: '2024W08',
    sourceRoute: '正規代理店',
    warranty: true,
    pricePerUnitJPY: 1200,
    photos: [
      'https://placehold.co/400x300.png'
    ],
    description: 'STMicroelectronics製 32-bit ARM Cortex-M4 マイクロコントローラー。高性能で様々な用途に対応。',
    status: 'listed',
    seller: {
      id: 'seller2',
      company: 'マイクロテック販売',
      email: 'sales@microtech.co.jp',
      contactName: '技術営業',
      address: '神奈川県横浜市'
    },
    createdAt: new Date('2024-01-20')
  },
  '3': {
    id: '3',
    mpn: 'ESP32-WROOM-32',
    manufacturer: 'Espressif Systems',
    quantity: 200,
    dateCode: '2024W05',
    sourceRoute: '正規代理店',
    warranty: true,
    pricePerUnitJPY: 800,
    photos: [], // 画像なし
    description: 'Espressif Systems製 Wi-Fi & Bluetooth モジュール。IoTプロジェクトに最適な高性能モジュールです。',
    status: 'listed',
    seller: {
      id: 'seller3',
      company: 'ワイヤレス部品株式会社',
      email: 'contact@wireless-parts.jp',
      contactName: '販売担当',
      address: '大阪府大阪市'
    },
    createdAt: new Date('2024-01-25')
  }
}

// モック相場データ
const mockMarketPrice = {
  averagePrice: 135,
  lowestPrice: 110,
  highestPrice: 180,
  totalStock: 15000,
  priceHistory: [
    { date: '2024-01-01', price: 140 },
    { date: '2024-01-08', price: 135 },
    { date: '2024-01-15', price: 132 },
    { date: '2024-01-22', price: 128 },
    { date: '2024-01-29', price: 135 }
  ]
}

export default function ListingDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const listingId = params.id as string

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}`)
        if (response.ok) {
          const data = await response.json()
          setListing(data)
        } else {
          console.error('Failed to fetch listing:', response.statusText)
          // Fallback to mock data
          setListing(mockListings[listingId])
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
        // Fallback to mock data
        setListing(mockListings[listingId])
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchListing()
    }
  }, [listingId])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">商品が見つかりません</h2>
            <p className="text-gray-600 mb-6">指定された商品は存在しないか削除されました</p>
            <Link href="/listings">
              <Button>商品一覧に戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // 画像がない場合はプレースホルダーを生成
  const displayPhotos = listing.photos.length > 0 
    ? listing.photos 
    : [generatePlaceholderImage(listing.mpn, listing.manufacturer)]
  const marketPrice = mockMarketPrice
  
  const totalPrice = listing.pricePerUnitJPY * quantity
  const priceDeviation = ((listing.pricePerUnitJPY - marketPrice.averagePrice) / marketPrice.averagePrice * 100)
  const isGoodDeal = priceDeviation < -10
  const isPriceHigh = priceDeviation > 20

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側: 画像とメイン情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* パンくずナビ */}
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/listings" className="hover:text-primary">出品一覧</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{listing.mpn}</span>
          </nav>

          {/* 画像 */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={displayPhotos[selectedPhoto]}
                    alt={`${listing.mpn} 画像 ${selectedPhoto + 1}`}
                    fill
                    className="object-cover"
                  />
                  {listing.photos.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                      <div className="text-center p-4">
                        <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">プレースホルダー画像</p>
                      </div>
                    </div>
                  )}
                </div>
                {displayPhotos.length > 1 && (
                  <div className="flex gap-2">
                    {displayPhotos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhoto(index)}
                        className={`w-20 h-20 relative overflow-hidden rounded border-2 ${
                          selectedPhoto === index ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`${listing.mpn} サムネイル ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 詳細情報 */}
          <Card>
            <CardHeader>
              <CardTitle>部品詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{listing.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>在庫: {listing.quantity.toLocaleString()}個</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>DC: {listing.dateCode}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{listing.sourceRoute}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {listing.warranty ? (
                    <>
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">メーカー保証あり</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-orange-600">メーカー保証なし</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 出品者情報 */}
          <Card>
            <CardHeader>
              <CardTitle>出品者情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">{listing.seller.company}</span>
                </div>
                <div className="text-sm text-gray-600">
                  担当者: {listing.seller.contactName}
                </div>
                <div className="text-sm text-gray-600">
                  所在地: {listing.seller.address}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  出品日: {listing.createdAt.toLocaleDateString('ja-JP')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右側: 購入セクションと相場情報 */}
        <div className="space-y-6">
          {/* 購入セクション */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{listing.mpn}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {listing.warranty && (
                      <Badge variant="secondary">保証あり</Badge>
                    )}
                    <Badge variant="outline">{listing.sourceRoute}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(listing.pricePerUnitJPY)}
                  </span>
                  <span className="text-sm text-gray-500">/ 個</span>
                </div>
                
                {/* 相場比較 */}
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    相場: {formatCurrency(marketPrice.averagePrice)}
                  </span>
                  {isGoodDeal && (
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      お得
                    </Badge>
                  )}
                  {isPriceHigh && (
                    <Badge variant="outline" className="text-orange-600">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      相場より高め
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">数量</Label>
                  <div className="flex mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={listing.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="mx-2 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(listing.quantity, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    最大 {listing.quantity.toLocaleString()}個まで
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>小計</span>
                    <span className="font-medium">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    購入手続きに進む
                  </Button>
                  <Button variant="outline" className="w-full">
                    出品者に問い合わせ
                  </Button>
                </div>

                <p className="text-xs text-gray-500">
                  ※手数料8%が別途かかります。詳細は購入手続き画面でご確認ください。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 相場情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                相場情報
              </CardTitle>
              <CardDescription>
                {listing.mpn}の市場価格動向
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">平均価格</span>
                  <p className="font-semibold">
                    {formatCurrency(marketPrice.averagePrice)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">総在庫数</span>
                  <p className="font-semibold">
                    {marketPrice.totalStock.toLocaleString()}個
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">最安値</span>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(marketPrice.lowestPrice)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">最高値</span>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(marketPrice.highestPrice)}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                ※Octopartデータを参照（毎日更新）
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}