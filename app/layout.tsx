import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '半導体在庫売買サイト - 半導体部品のマーケットプレイス',
  description: '半導体部品のC2B/B2Bマーケットプレイス。出品・検索・購入・決済をワンストップで提供します。',
}

// Simple Footer Component  
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">半導体マーケット</h3>
            <p className="text-gray-300 text-sm">
              確実で安全な半導体部品の調達をサポートするプラットフォームです。
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/search" className="hover:text-white">部品検索</a></li>
              <li><a href="/sell" className="hover:text-white">出品</a></li>
              <li><a href="/buy" className="hover:text-white">購入</a></li>
              <li><a href="/inventory" className="hover:text-white">在庫管理</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">ヘルプ</a></li>
              <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white">利用規約</a></li>
              <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">お問い合わせ</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: team@hackjpn.com</li>
              <li>営業時間: 平日 9:00-18:00</li>
              <li>土日祝日: 休業</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 半導体マーケット. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}