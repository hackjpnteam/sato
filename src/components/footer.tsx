// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">サービス</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary">
                  サービスについて
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="text-sm hover:text-primary">
                  使い方ガイド
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:text-primary">
                  手数料について
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">出品者向け</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/seller/guide" className="text-sm hover:text-primary">
                  出品ガイド
                </Link>
              </li>
              <li>
                <Link href="/seller/terms" className="text-sm hover:text-primary">
                  出品者規約
                </Link>
              </li>
              <li>
                <Link href="/seller/faq" className="text-sm hover:text-primary">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">購入者向け</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/buyer/guide" className="text-sm hover:text-primary">
                  購入ガイド
                </Link>
              </li>
              <li>
                <Link href="/buyer/safety" className="text-sm hover:text-primary">
                  安全な取引のために
                </Link>
              </li>
              <li>
                <Link href="/buyer/faq" className="text-sm hover:text-primary">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">法的情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-primary">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-primary">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/law" className="text-sm hover:text-primary">
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-gray-600">
            お問い合わせ：
            <a href="mailto:team@hackjpn.com" className="text-primary hover:underline ml-1">
              team@hackjpn.com
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2024 半導体マーケット. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}