// 認可ガードヘルパー関数
import { NextResponse } from 'next/server'

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