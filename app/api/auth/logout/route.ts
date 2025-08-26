// ログアウトAPI
import { NextResponse } from 'next/server'
import { clearAuthCookie, getCurrentUser } from '@/lib/auth'

export async function POST() {
  try {
    const user = getCurrentUser()
    
    // 認証Cookieをクリア
    clearAuthCookie()
    
    if (user) {
      console.log('User logged out:', { 
        userId: user.uid,
        email: user.email 
      })
    }
    
    return NextResponse.json({
      ok: true,
      message: 'ログアウトしました'
    })
    
  } catch (error: unknown) {
    console.error('Logout error:', error)
    
    // エラーが発生してもCookieはクリアする
    clearAuthCookie()
    
    return NextResponse.json({
      ok: true,
      message: 'ログアウトしました'
    })
  }
}