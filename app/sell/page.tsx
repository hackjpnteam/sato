'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  partNumber: string
  manufacturer: string
  category: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode: string
  warranty: string
  description: string
  images: string[]
  minimumOrderQuantity: number
  leadTime: string
  certificationsCompliance: string
  rohs: boolean
  reach: boolean
}

const categories = [
  { value: 'microcontroller', label: 'マイコン' },
  { value: 'sensor', label: 'センサー' },
  { value: 'memory', label: 'メモリ' },
  { value: 'power', label: '電源IC' },
  { value: 'analog', label: 'アナログIC' },
  { value: 'rf', label: 'RF・無線' },
  { value: 'interface', label: 'インターフェース' },
  { value: 'passive', label: '受動部品' },
  { value: 'other', label: 'その他' }
]

const conditions = [
  { value: 'new', label: '新品' },
  { value: 'used', label: '中古' },
  { value: 'refurbished', label: 'リファービッシュ品' }
]

const stockSources = [
  { value: 'manufacturer', label: 'メーカー在庫' },
  { value: 'distributor', label: '代理店在庫' },
  { value: 'excess', label: '余剰在庫' },
  { value: 'other', label: 'その他' }
]

export default function SellPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyInfoMissing, setCompanyInfoMissing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    partNumber: '',
    manufacturer: '',
    category: 'microcontroller',
    quantity: 1,
    unitPriceJPY: 0,
    condition: 'new',
    stockSource: 'manufacturer',
    dateCode: '',
    warranty: '30日間',
    description: '',
    images: [],
    minimumOrderQuantity: 1,
    leadTime: '即納',
    certificationsCompliance: '',
    rohs: false,
    reach: false
  })

  useEffect(() => {
    const checkAuthAndCompany = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (!data.ok || !data.user) {
          router.push('/login')
          return
        }

        setUser(data.user)

        // Check if user has company information
        if (!data.user.companyName || !data.user.companyAddress) {
          setCompanyInfoMissing(true)
        }
        
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuthAndCompany()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        alert('出品が完了しました！')
        router.push(`/listings/${data.listingId}`)
      } else {
        const errorData = await response.json()
        if (errorData.code === 'COMPANY_INFO_REQUIRED') {
          setCompanyInfoMissing(true)
        }
        setError(errorData.error || '出品に失敗しました')
      }
    } catch (err) {
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // Show company information required message
  if (companyInfoMissing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              会社情報の登録が必要です
            </h1>
            <p className="text-gray-600 mb-6">
              半導体部品を出品するには、会社情報の登録が必須となります。<br />
              購入者として利用する場合は、会社情報の登録は不要です。
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center text-gray-700">
                <span className="text-green-600 mr-2">✓</span>
                購入者として利用する場合 → 会社情報登録不要
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <span className="text-red-600 mr-2">✗</span>
                出品者として利用する場合 → 会社情報登録必須
              </div>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={() => router.push('/account')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                会社情報を登録する
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <span className="mr-2">←</span>
            戻る
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">半導体部品を出品</h1>
          <p className="text-gray-600">
            在庫の半導体部品を出品して、購入者とつながりましょう
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📝</span>
              基本情報
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  型番 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: STM32F407VGT6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メーカー <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: STMicroelectronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  デートコード
                </label>
                <input
                  type="text"
                  name="dateCode"
                  value={formData.dateCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 2024+"
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📦</span>
              在庫情報
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  在庫数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最小発注数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minimumOrderQuantity"
                  value={formData.minimumOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コンディション <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  在庫源 <span className="text-red-500">*</span>
                </label>
                <select
                  name="stockSource"
                  value={formData.stockSource}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stockSources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Delivery */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">💰</span>
              価格・納期
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  単価（円） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="unitPriceJPY"
                  value={formData.unitPriceJPY}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  納期
                </label>
                <input
                  type="text"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 即納、3営業日"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  保証期間
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 30日間"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📄</span>
              詳細説明
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品説明
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="商品の状態、特徴、使用用途などを詳しく記載してください"
              />
            </div>
          </div>

          {/* Compliance */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span>
              認証・コンプライアンス
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rohs"
                  name="rohs"
                  checked={formData.rohs}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="rohs" className="text-sm font-medium text-gray-700">
                  RoHS対応
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reach"
                  name="reach"
                  checked={formData.reach}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="reach" className="text-sm font-medium text-gray-700">
                  REACH対応
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '出品中...' : '出品する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}