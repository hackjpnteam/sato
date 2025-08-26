// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.roles?.includes('admin') && !session?.user?.roles?.includes('operator')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await prismaMock.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        companyName: true,
        contactPerson: true,
        phoneNumber: true,
        taxId: true,
        businessLicense: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, roles } = body

    if (!userId || !Array.isArray(roles)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // ロールの妥当性チェック
    const validRoles = ['admin', 'operator', 'seller', 'buyer']
    const invalidRoles = roles.filter(role => !validRoles.includes(role))
    
    if (invalidRoles.length > 0) {
      return NextResponse.json({ 
        error: `Invalid roles: ${invalidRoles.join(', ')}` 
      }, { status: 400 })
    }

    const updatedUser = await prismaMock.user.update({
      where: { id: userId },
      data: { roles },
      select: {
        id: true,
        email: true,
        roles: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}