// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }