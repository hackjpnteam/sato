// ログアウトAPI
import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie, getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
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
    
  } catch (error) {
    console.error('Logout error:', error)
    
    // エラーが発生してもCookieはクリアする
    clearAuthCookie()
    
    return NextResponse.json({
      ok: true,
      message: 'ログアウトしました'
    })
  }
}