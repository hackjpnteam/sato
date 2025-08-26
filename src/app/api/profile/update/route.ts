// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  company: z.string().min(1, '会社名を入力してください'),
  contactName: z.string().min(1, '担当者名を入力してください'),
  contactPhone: z.string().min(1, '電話番号を入力してください'),
  address: z.string().min(1, '住所を入力してください')
})

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const validated = updateProfileSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { company, contactName, contactPhone, address } = validated.data

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        company,
        contactName,
        contactPhone,
        address,
        updatedAt: new Date()
      }
    })

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'profile_updated',
        targetType: 'user',
        targetId: session.user.id,
        payload: {
          updatedFields: ['company', 'contactName', 'contactPhone', 'address']
        }
      }
    })

    return NextResponse.json({
      message: 'プロフィールが更新されました',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        company: updatedUser.company,
        contactName: updatedUser.contactName,
        contactPhone: updatedUser.contactPhone,
        address: updatedUser.address
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}