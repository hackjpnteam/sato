// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
  company: z.string().min(1, '会社名を入力してください'),
  contactName: z.string().min(1, '担当者名を入力してください'),
  contactPhone: z.string().min(1, '電話番号を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  role: z.enum(['buyer', 'seller'])
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const validated = signupSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, company, contactName, contactPhone, address, role } = validated.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        company,
        contactName,
        contactPhone,
        address,
        role: role as any,
        emailVerified: new Date()
      }
    })

    // Log registration
    await prisma.auditLog.create({
      data: {
        action: 'user_registered',
        targetType: 'user',
        targetId: user.id,
        payload: {
          email: user.email,
          role: user.role,
          company: user.company
        }
      }
    })

    return NextResponse.json({
      message: '登録が完了しました',
      userId: user.id
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}