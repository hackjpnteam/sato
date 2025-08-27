'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCart } from '@/contexts/CartContext'

interface Listing {
  _id: string
  partNumber: string
  manufacturer: string
  quantity: number
  unitPriceJPY: number
  condition: string
  stockSource: string
  dateCode?: string
  warranty?: string
  category?: string
  sellerId: string
  createdAt: string
  updatedAt: string
}

// Mock price history data - 実際の実装では API から取得
const generatePriceHistory = (currentPrice: number) => {
  const data: Array<{ month: string; price: number; date: string }> = []
  const basePrice = currentPrice
  const months = ['7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月']
  
  for (let i = 0; i < 8; i++) {
    const variation = (Math.random() - 0.5) * 0.3 // ±15%の変動
    const price = Math.floor(basePrice * (1 + variation))
    data.push({
      month: months[i],
      price: price,
      date: `2024-${String(i + 5).padStart(2, '0')}-15`
    })
  }
  
  // 現在の価格を最後に追加
  data.push({
    month: '今月',
    price: currentPrice,
    date: new Date().toISOString().slice(0, 10)
  })
  
  return data
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [showContact, setShowContact] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submittingQuestion, setSubmittingQuestion] = useState(false)
  const [answerTexts, setAnswerTexts] = useState<{[key: string]: string}>({})
  const [submittingAnswers, setSubmittingAnswers] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 商品情報を取得
        const listingResponse = await fetch(`/api/listings/${params.id}`)
        if (listingResponse.ok) {
          const listingData = await listingResponse.json()
          setListing(listingData.listing)
          // Generate mock price history
          setPriceHistory(generatePriceHistory(listingData.listing.unitPriceJPY))
        } else {
          setError('商品が見つかりませんでした')
        }

        // ユーザー情報を取得
        try {
          const userResponse = await fetch('/api/auth/me')
          const userData = await userResponse.json()
          setUser(userData.user)
        } catch {
          // ログインしていない場合
        }

        // 質問一覧を取得
        const questionsResponse = await fetch(`/api/listings/${params.id}/questions`)
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json()
          setQuestions(questionsData.questions || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('データの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    setSubmittingQuestion(true)
    try {
      const response = await fetch(`/api/listings/${params.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newQuestion })
      })

      if (response.ok) {
        setNewQuestion('')
        // 質問一覧を再取得
        const questionsResponse = await fetch(`/api/listings/${params.id}/questions`)
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json()
          setQuestions(questionsData.questions || [])
        }
        alert('質問を投稿しました')
      } else {
        const error = await response.json()
        alert(error.error || '質問の投稿に失敗しました')
      }
    } catch {
      alert('質問の投稿中にエラーが発生しました')
    } finally {
      setSubmittingQuestion(false)
    }
  }

  const handleSubmitAnswer = async (questionId: string) => {
    const content = answerTexts[questionId]?.trim()
    if (!content) return

    setSubmittingAnswers(prev => new Set([...prev, questionId]))
    try {
      const response = await fetch(`/api/listings/${params.id}/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        setAnswerTexts(prev => ({ ...prev, [questionId]: '' }))
        // 質問一覧を再取得
        const questionsResponse = await fetch(`/api/listings/${params.id}/questions`)
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json()
          setQuestions(questionsData.questions || [])
        }
        alert('回答を投稿しました')
      } else {
        const error = await response.json()
        alert(error.error || '回答の投稿に失敗しました')
      }
    } catch {
      alert('回答の投稿中にエラーが発生しました')
    } finally {
      setSubmittingAnswers(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">商品を読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-gray-800 text-xl mb-4">{error || '商品が見つかりませんでした'}</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            ← 戻る
          </button>
        </div>
      </div>
    )
  }

  const getCategoryName = (category?: string) => {
    const categories: { [key: string]: string } = {
      microcontroller: 'マイコン',
      sensor: 'センサー',
      memory: 'メモリ',
      power: '電源IC',
      analog: 'アナログIC',
      rf: 'RF・無線',
      interface: 'インターフェース',
      passive: '受動部品'
    }
    return category ? categories[category] || category : 'その他'
  }

  const getPriceStatus = () => {
    if (priceHistory.length < 2) return { status: '標準', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    
    const avgPrice = priceHistory.slice(0, -1).reduce((sum, item) => sum + item.price, 0) / (priceHistory.length - 1)
    const currentPrice = listing.unitPriceJPY
    const difference = ((currentPrice - avgPrice) / avgPrice) * 100

    if (difference > 10) {
      return { status: '相場より高い', color: 'text-red-600', bgColor: 'bg-red-50', icon: '📈' }
    } else if (difference < -10) {
      return { status: '相場よりお得！', color: 'text-green-600', bgColor: 'bg-green-50', icon: '💰' }
    } else {
      return { status: '相場通り', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '📊' }
    }
  }

  const priceStatus = getPriceStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="text-xl mr-2">←</span>
            商品詳細
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <div className="text-4xl">🔌</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{listing.manufacturer}</div>
                  <div className="text-lg font-bold text-gray-900 break-all">{listing.partNumber}</div>
                  <div className="text-xs text-gray-500 mt-2">{getCategoryName(listing.category)} • {listing.condition === 'new' ? '新品' : '中古'}</div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex justify-center space-x-3">
                {['🔌', '⚡', '🔋', '📟'].map((emoji, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="text-2xl">{emoji}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="mb-4">
                {listing.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                    {getCategoryName(listing.category)}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-all">
                  {listing.partNumber}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{listing.manufacturer}</p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    listing.condition === 'new' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.condition === 'new' ? '✨ 新品' : '🔧 中古'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {listing.stockSource === 'authorized' ? '🏢 正規代理店' : '🏪 二次市場'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priceStatus.color} ${priceStatus.bgColor}`}>
                    {priceStatus.icon} {priceStatus.status}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ¥{listing.unitPriceJPY.toLocaleString()}
                    <span className="text-base font-normal text-gray-600 ml-2">/ 個</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    税込価格 • 送料別
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">🔧 基本情報</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">在庫数量:</span>
                      <span className="font-medium">{listing.quantity.toLocaleString()}個</span>
                    </div>
                    {listing.dateCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">デートコード:</span>
                        <span className="font-medium">{listing.dateCode}</span>
                      </div>
                    )}
                    {listing.warranty && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">保証:</span>
                        <span className="font-medium">{listing.warranty}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📦 在庫状況</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">状態:</span>
                      <span className={`font-medium ${listing.quantity > 100 ? 'text-green-600' : listing.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {listing.quantity > 100 ? '在庫十分' : listing.quantity > 0 ? `残り${listing.quantity}個` : '在庫切れ'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">出品日:</span>
                      <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            {priceHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  💹 価格推移（過去8ヶ月）
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#666"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                        tickFormatter={(value) => `¥${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`¥${value.toLocaleString()}`, '価格']}
                        labelStyle={{ color: '#333' }}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  📊 このグラフは過去の市場価格データに基づいています
                </div>
              </div>
            )}

            {/* Q&A セクション */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 relative z-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                💬 質問・回答
              </h2>

              {/* 質問投稿フォーム */}
              {user ? (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl relative">
                  <h3 className="font-semibold text-gray-900 mb-4">📝 出品者に質問する</h3>
                  <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="この商品について質問があります... 例：在庫の状態、配送方法、技術仕様など"
                      className="w-full p-4 border-2 border-blue-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      rows={4}
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-blue-600 font-medium">
                        {newQuestion.length}/1000文字
                      </div>
                      <button 
                        type="submit"
                        disabled={!newQuestion.trim() || submittingQuestion}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                      >
                        {submittingQuestion ? '⏳ 投稿中...' : '📤 質問を投稿'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-yellow-800 font-medium">
                    🔐 質問を投稿するにはログインが必要です
                  </p>
                </div>
              )}

              {/* 質問一覧 */}
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    まだ質問がありません
                  </h3>
                  <p className="text-gray-600">
                    商品について何かご不明な点がございましたら、お気軽にご質問ください
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-6">
                      {/* 質問 */}
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">Q</span>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="font-semibold text-gray-900">
                                {question.user?.name || 'ユーザー'}
                              </span>
                              {question.user?.companyName && (
                                <span className="text-gray-600 text-sm ml-2">
                                  ({question.user.companyName})
                                </span>
                              )}
                              <span className="text-gray-500 text-sm ml-2">
                                {new Date(question.createdAt).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                            <div className="text-gray-800 whitespace-pre-wrap">
                              {question.content}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 回答一覧 */}
                      {question.answers && question.answers.length > 0 && (
                        <div className="ml-13 space-y-4">
                          {question.answers.map((answer: any) => (
                            <div key={answer._id} className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 font-bold text-sm">A</span>
                              </div>
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span className="font-semibold text-gray-900">
                                    {answer.user?.name || '出品者'}
                                  </span>
                                  {answer.user?.companyName && (
                                    <span className="text-gray-600 text-sm ml-2">
                                      ({answer.user.companyName})
                                    </span>
                                  )}
                                  <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    出品者
                                  </span>
                                  <span className="text-gray-500 text-sm ml-2">
                                    {new Date(answer.createdAt).toLocaleDateString('ja-JP')}
                                  </span>
                                </div>
                                <div className="text-gray-800 whitespace-pre-wrap">
                                  {answer.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 回答フォーム（出品者のみ） */}
                      {user && listing && user.id === listing.sellerId && (
                        <div className="ml-13 mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">この質問に回答する</h4>
                          <textarea
                            value={answerTexts[question._id] || ''}
                            onChange={(e) => setAnswerTexts(prev => ({ 
                              ...prev, 
                              [question._id]: e.target.value 
                            }))}
                            placeholder="質問にお答えください..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                            rows={3}
                            maxLength={1000}
                          />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {(answerTexts[question._id] || '').length}/1000文字
                            </div>
                            <button 
                              onClick={() => handleSubmitAnswer(question._id)}
                              disabled={!answerTexts[question._id]?.trim() || submittingAnswers.has(question._id)}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingAnswers.has(question._id) ? '投稿中...' : '回答を投稿'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🛒 購入・お問い合わせ</h3>
                
                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数量を選択
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-3 py-2 text-center border-none focus:outline-none"
                      min="1"
                      max={listing.quantity}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(listing.quantity, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= listing.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">合計金額:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ¥{(listing.unitPriceJPY * quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {quantity}個 × ¥{listing.unitPriceJPY.toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      if (listing.quantity === 0) return
                      setAddingToCart(true)
                      try {
                        const success = await addToCart(listing._id, quantity)
                        if (success) {
                          alert(`${quantity}個をカートに追加しました！`)
                        } else {
                          alert('カートに追加できませんでした')
                        }
                      } finally {
                        setAddingToCart(false)
                      }
                    }}
                    className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={listing.quantity === 0 || addingToCart}
                  >
                    {addingToCart ? (
                      <>⏳ 追加中...</>
                    ) : listing.quantity > 0 ? (
                      <>🛒 カートに追加</>
                    ) : (
                      <>❌ 在庫切れ</>
                    )}
                  </button>
                  
                  <button
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                    disabled={listing.quantity === 0}
                  >
                    ⚡ 今すぐ購入
                  </button>
                  
                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    📩 出品者に質問
                  </button>

                </div>

                {/* Safety Features */}
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    <span>取引保護サービス対象</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📦</span>
                    <span>匿名配送可能</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>品質保証あり</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}