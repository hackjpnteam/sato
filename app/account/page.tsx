'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  emailVerified: boolean
  companyName?: string
  companyAddress?: string
  companyPhone?: string
  companyDescription?: string
}

// Fallback UI components
const Button = ({ children, onClick, className = '', disabled = false, variant = 'default', type = 'button' }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </button>
)

const Input = ({ id, type = 'text', value, onChange, required = false, placeholder = '', className = '' }: any) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
  />
)

const Textarea = ({ id, value, onChange, required = false, placeholder = '', rows = 4, className = '' }: any) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    placeholder={placeholder}
    rows={rows}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none ${className}`}
  />
)

const Label = ({ htmlFor, children }: any) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showCompanyInfo, setShowCompanyInfo] = useState(false)
  const router = useRouter()

  // Form data
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  })

  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyDescription: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (data.user) {
          setUser(data.user)
          setProfileData({
            name: data.user.name || '',
            email: data.user.email
          })
          setCompanyData({
            companyName: data.user.companyName || '',
            companyAddress: data.user.companyAddress || '',
            companyPhone: data.user.companyPhone || '',
            companyDescription: data.user.companyDescription || ''
          })
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      const result = await response.json()

      if (response.ok) {
        setUser(prev => prev ? { ...prev, ...profileData } : null)
        setShowEditProfile(false)
        alert('プロフィールを更新しました')
      } else {
        alert(result.error || 'プロフィール更新に失敗しました')
      }
    } catch {
      alert('プロフィール更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/auth/update-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      })

      const result = await response.json()

      if (response.ok) {
        setUser(prev => prev ? { ...prev, ...companyData } : null)
        setShowCompanyInfo(false)
        alert('会社情報を更新しました')
      } else {
        alert(result.error || '会社情報更新に失敗しました')
      }
    } catch {
      alert('会社情報更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch {
      alert('ログアウト中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">ユーザー情報を読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <div className="text-gray-800 text-xl mb-4">ログインが必要です</div>
          <Button onClick={() => router.push('/')}>
            ← ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">アカウント管理</h1>
        
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">プロフィール情報</h2>
            <Button onClick={() => setShowEditProfile(!showEditProfile)} variant="outline">
              {showEditProfile ? 'キャンセル' : '編集'}
            </Button>
          </div>
          
          {showEditProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e: any) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="山田太郎"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e: any) => setProfileData({...profileData, email: e.target.value})}
                  required
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">メールアドレスは変更できません</p>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={saving}>
                  {saving ? '更新中...' : '更新'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEditProfile(false)}>
                  キャンセル
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">名前:</span>
                <span className="font-medium">{user.name || '未設定'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">メールアドレス:</span>
                <span className="font-medium break-all">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email認証:</span>
                <span className={`font-medium ${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {user.emailVerified ? '認証済み' : '未認証'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">アカウント種別:</span>
                <span className="font-medium">{user.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Company Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">会社情報</h2>
            <Button onClick={() => setShowCompanyInfo(!showCompanyInfo)} variant="outline">
              {showCompanyInfo ? 'キャンセル' : user.companyName ? '編集' : '登録'}
            </Button>
          </div>
          
          {showCompanyInfo ? (
            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <Label htmlFor="companyName">会社名 *</Label>
                <Input
                  id="companyName"
                  value={companyData.companyName}
                  onChange={(e: any) => setCompanyData({...companyData, companyName: e.target.value})}
                  placeholder="株式会社サンプル"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="companyAddress">住所</Label>
                <Input
                  id="companyAddress"
                  value={companyData.companyAddress}
                  onChange={(e: any) => setCompanyData({...companyData, companyAddress: e.target.value})}
                  placeholder="東京都渋谷区..."
                />
              </div>
              
              <div>
                <Label htmlFor="companyPhone">電話番号</Label>
                <Input
                  id="companyPhone"
                  value={companyData.companyPhone}
                  onChange={(e: any) => setCompanyData({...companyData, companyPhone: e.target.value})}
                  placeholder="03-1234-5678"
                />
              </div>
              
              <div>
                <Label htmlFor="companyDescription">会社概要</Label>
                <Textarea
                  id="companyDescription"
                  value={companyData.companyDescription}
                  onChange={(e: any) => setCompanyData({...companyData, companyDescription: e.target.value})}
                  placeholder="会社の事業内容や特徴を記載してください"
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={saving}>
                  {saving ? '更新中...' : user.companyName ? '更新' : '登録'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCompanyInfo(false)}>
                  キャンセル
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {user.companyName ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">会社名:</span>
                    <span className="font-medium">{user.companyName}</span>
                  </div>
                  {user.companyAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">住所:</span>
                      <span className="font-medium">{user.companyAddress}</span>
                    </div>
                  )}
                  {user.companyPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">電話番号:</span>
                      <span className="font-medium">{user.companyPhone}</span>
                    </div>
                  )}
                  {user.companyDescription && (
                    <div className="space-y-1">
                      <span className="text-gray-600">会社概要:</span>
                      <p className="text-sm text-gray-700">{user.companyDescription}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏢</div>
                  <p>会社情報が登録されていません</p>
                  <p className="text-sm">出品するには会社情報の登録が必要です</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">アカウント操作</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              ログアウト
            </Button>
            <Button onClick={() => router.push('/')} className="flex-1">
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}