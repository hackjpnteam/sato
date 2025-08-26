// JWT認証およびHttpOnly Cookie管理ユーティリティ
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRETが環境変数に設定されていません')
}

const JWT_SECRET = process.env.JWT_SECRET
const COOKIE_NAME = 'auth_token'

// JWT ペイロード型定義
export interface JwtPayload {
  uid: string
  role: string
  email: string
  iat?: number
  exp?: number
}

// JWT作成（デフォルト有効期限：7日）
export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

// JWT検証
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// HttpOnly Cookieに認証トークンを設定
export function setAuthCookie(token: string): void {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: '/',
  })
}

// 認証Cookieをクリア
export function clearAuthCookie(): void {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

// Cookieから認証トークンを取得
export function getAuthCookie(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

// Cookieから現在のユーザー情報を取得
export function getCurrentUser(): JwtPayload | null {
  const token = getAuthCookie()
  if (!token) {
    return null
  }
  return verifyJwt(token)
}

// ユーザーが指定したロールを持っているかチェック
export function hasRole(userRoles: string | string[], requiredRoles: string[]): boolean {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
  return requiredRoles.some(role => roles.includes(role))
}