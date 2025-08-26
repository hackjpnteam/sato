// 認可ガードヘルパー関数
import { NextResponse } from 'next/server'
import { getCurrentUser, hasRole } from './auth'

// 認証要求ガード
export function requireAuth(allowedRoles?: string[]) {
  const user = getCurrentUser()
  
  // 未認証の場合
  if (!user) {
    return NextResponse.json(
      { error: '認証が必要です', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }
  
  // ロール制限がある場合はチェック
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json(
        { 
          error: 'このリソースにアクセスする権限がありません',
          code: 'FORBIDDEN',
          requiredRoles: allowedRoles,
          userRole: user.role
        },
        { status: 403 }
      )
    }
  }
  
  // 認証・認可成功時はユーザー情報を返す
  return { user }
}

// セラー権限チェック（seller または admin）
export function requireSeller() {
  return requireAuth(['seller', 'admin'])
}

// 管理者権限チェック
export function requireAdmin() {
  return requireAuth(['admin'])
}

// 現在のユーザーがリソースの所有者または管理者かチェック
export function requireOwnerOrAdmin(resourceOwnerId: string) {
  const authResult = requireAuth()
  
  // 認証失敗の場合はそのまま返す
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  const { user } = authResult
  
  // 管理者または所有者の場合は許可
  if (user.role === 'admin' || user.uid === resourceOwnerId) {
    return { user }
  }
  
  return NextResponse.json(
    { 
      error: 'このリソースにアクセスする権限がありません',
      code: 'FORBIDDEN' 
    },
    { status: 403 }
  )
}

// エラーレスポンス生成ヘルパー
export function createErrorResponse(
  message: string,
  status: number,
  code?: string,
  requestId?: string
) {
  const error: Record<string, unknown> = { error: message }
  if (code) error.code = code
  if (requestId) error.requestId = requestId
  
  return NextResponse.json(error, { status })
}

// 内部サーバーエラーレスポンス
export function createInternalErrorResponse(requestId?: string) {
  return createErrorResponse(
    'Internal Server Error',
    500,
    'INTERNAL_ERROR',
    requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )
}