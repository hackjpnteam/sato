// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextResponse } from 'next/server'
import { prismaMock } from '@/lib/prisma-mock'

export async function GET() {
  try {
    // Get all users with their roles
    const users = await prismaMock.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        companyName: true,
        taxId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log('🔍 Debug: All users in database:', users)
    
    return NextResponse.json({
      count: users.length,
      users: users
    })
  } catch (error) {
    console.error('Debug users fetch error:', error)
    return NextResponse.json(
      { error: 'Debug fetch failed', details: error },
      { status: 500 }
    )
  }
}