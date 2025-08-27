'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setMessage('無効なリセットリンクです')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setMessage('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setMessage(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      setMessage('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              無効なリンク
            </h1>
            <p className="text-gray-600 mb-6">
              パスワードリセットのリンクが無効または期限切れです。
            </p>
            <Link 
              href="/forgot-password"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              新しいリセットリンクを取得
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              新しいパスワード設定
            </h1>
            <p className="text-gray-600">
              新しいパスワードを入力してください
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <p className="text-sm font-medium">{message}</p>
              {success && (
                <p className="text-xs mt-2">3秒後にログインページに移動します...</p>
              )}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6文字以上で入力"
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード確認
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="もう一度入力"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    更新中...
                  </div>
                ) : (
                  'パスワードを更新'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}