// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      roles: string[] // roles統合版
      company: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    roles: string[]
    company: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    roles: string[]
    company: string | null
  }
}