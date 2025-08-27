import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '半導体在庫売買サイト - 半導体部品のマーケットプレイス',
  description: '半導体部品のC2B/B2Bマーケットプレイス。出品・検索・購入・決済をワンストップで提供します。',
}

// Simple Header Component
function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap">
                半導体マーケット
              </h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              🏠 ホーム
            </a>
            <a href="/search" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              🔍 部品検索
            </a>
            <a href="/listings" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm">
              📋 出品一覧
            </a>
            <div className="ml-4 pl-4 border-l border-gray-200">
              <a href="/" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                👤 アカウント
              </a>
            </div>
          </nav>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <a href="/search" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              🔍
            </a>
            <a href="/listings" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              📋
            </a>
            <a href="/" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              👤
            </a>
          </div>
        </div>
      </div>
    </header>
  )
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}