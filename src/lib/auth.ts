// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります')
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 Login attempt:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          throw new Error('メールアドレスとパスワードを入力してください')
        }

        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) {
          console.log('❌ Validation failed:', validated.error.errors[0].message)
          throw new Error(validated.error.errors[0].message)
        }

        console.log('🔍 Looking for user:', credentials.email)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        console.log('👤 User found:', user ? { id: user.id, email: user.email, hasPassword: !!user.passwordHash } : 'No user found')

        if (!user || !user.passwordHash) {
          console.log('❌ User not found or no password hash')
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        }

        console.log('🔐 Comparing passwords...')
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        console.log('🔐 Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('❌ Invalid password')
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        }

        console.log('✅ Login successful')
        return {
          id: user.id,
          email: user.email,
          roles: user.roles || ['buyer'], // roles統合版
          company: user.companyName,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = user.roles || ['buyer']
        token.company = user.company
      } else if (token.id) {
        // Refresh user data from database to get updated roles
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, roles: true, companyName: true }
          })
          if (dbUser) {
            token.roles = dbUser.roles || ['buyer']
            token.company = dbUser.companyName
          }
        } catch (error) {
          console.error('Failed to refresh user data in JWT callback:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.roles = token.roles as string[]
        session.user.company = token.company as string | null
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
}