'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email, password }
        : { email, password, name }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        if (isLogin) {
          // Login successful
          router.push('/account')
        } else {
          // Registration successful, switch to login
          alert('登録が完了しました。ログインしてください。')
          setIsLogin(true)
          setPassword('')
        }
      } else {
        setError(data.error || 'エラーが発生しました')
      }
    } catch (err) {
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            半導体マーケット
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {isLogin ? 'ログイン' : '新規登録'}
          </h2>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  お名前
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="山田 太郎"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                {isLogin && (
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    パスワードを忘れた場合
                  </a>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={isLogin ? 'パスワードを入力' : '8文字以上で入力'}
                minLength={isLogin ? undefined : 8}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録する')}
          </button>

          {/* Switch between login and register */}
          <div className="text-center border-t pt-4">
            <p className="text-sm text-gray-600">
              {isLogin ? 'アカウントをお持ちでない方' : 'すでにアカウントをお持ちの方'}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setPassword('')
              }}
              className="mt-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              {isLogin ? '新規登録はこちら →' : 'ログインはこちら →'}
            </button>
          </div>

        </form>

        {/* Back to Home */}
        <div className="text-center">
          <a href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  )
}