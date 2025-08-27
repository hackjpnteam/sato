'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setResetUrl('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        // 開発環境でのみリセットURLを表示
        if (data.resetUrl) {
          setResetUrl(data.resetUrl)
        }
      } else {
        setMessage(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      setMessage('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              パスワードリセット
            </h1>
            <p className="text-gray-600">
              登録したメールアドレスを入力してください
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('エラー') || message.includes('失敗') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              <p className="text-sm font-medium">{message}</p>
              
              {resetUrl && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-medium text-blue-800 mb-2">
                    開発環境用 - 以下のリンクからパスワードをリセット:
                  </p>
                  <Link 
                    href={resetUrl}
                    className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
                  >
                    {resetUrl}
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: user@example.com"
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
                  送信中...
                </div>
              ) : (
                'リセット指示を送信'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← ログインページに戻る
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>パスワードを思い出した場合は、</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            こちらからログイン
          </Link>
        </div>
      </div>
    </div>
  )
}