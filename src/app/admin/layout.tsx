// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Settings, 
  BarChart3, 
  FileText,
  Shield
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // roles統合版対応: 配列からadminまたはoperatorロールをチェック
    const userRoles = session.user?.roles || []
    if (!userRoles.includes('admin') && !userRoles.includes('operator')) {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  // roles統合版対応: 配列からadminまたはoperatorロールをチェック
  const userRoles = session?.user?.roles || []
  if (!session || (!userRoles.includes('admin') && !userRoles.includes('operator'))) {
    return null
  }

  const menuItems = [
    {
      href: '/admin',
      icon: BarChart3,
      label: 'ダッシュボード',
      description: 'KPIと概要'
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'ユーザー管理',
      description: '登録ユーザー一覧'
    },
    {
      href: '/admin/listings',
      icon: Package,
      label: '出品管理',
      description: '出品審査・管理'
    },
    {
      href: '/admin/orders',
      icon: ShoppingCart,
      label: '注文管理',
      description: '注文状況・管理'
    },
    {
      href: '/admin/payments',
      icon: CreditCard,
      label: '決済管理',
      description: '支払い・返金'
    },
    {
      href: '/admin/reports',
      icon: FileText,
      label: 'レポート',
      description: 'データエクスポート'
    }
  ]

  if (userRoles.includes('admin')) {
    menuItems.push({
      href: '/admin/settings',
      icon: Settings,
      label: 'システム設定',
      description: '手数料・設定'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* サイドバー */}
        <div className="w-64 bg-white shadow-sm flex flex-col h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">管理画面</h1>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {userRoles.includes('admin') ? '管理者' : 'オペレーター'}
            </div>
          </div>
          
          <nav className="mt-6 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-gray-100">
            <Link
              href="/"
              className="block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              サイトに戻る
            </Link>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">管理画面</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {session.user?.email}
                </span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}