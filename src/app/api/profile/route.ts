// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaMock as prisma } from '@/lib/prisma-mock'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('🔍 Profile GET - Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      console.log('❌ No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('👤 Looking for user with email:', session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    console.log('🎯 Found user:', user ? 'Yes' : 'No', user?.id || 'N/A')

    if (!user) {
      console.log('❌ User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles || ['buyer'], // roles統合版対応
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      contactPerson: user.contactPerson,
      phoneNumber: user.phoneNumber,
      taxId: user.taxId,
      businessLicense: user.businessLicense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('🔄 Profile PUT - Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      console.log('❌ PUT: No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    console.log('📝 PUT request data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      console.log('❌ PUT: Name validation failed:', data.name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Update user profile
    console.log('🔍 PUT: About to update user with email:', session.user.email)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name?.trim(),
        companyName: data.companyName?.trim() || null,
        companyAddress: data.companyAddress?.trim() || null,
        contactPerson: data.contactPerson?.trim() || null,
        phoneNumber: data.phoneNumber?.trim() || null,
        taxId: data.taxId?.trim() || null,
        businessLicense: data.businessLicense?.trim() || null,
        updatedAt: new Date()
      }
    })
    console.log('✅ PUT: User updated successfully:', updatedUser.id)

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      roles: updatedUser.roles || ['buyer'], // roles統合版対応
      companyName: updatedUser.companyName,
      companyAddress: updatedUser.companyAddress,
      contactPerson: updatedUser.contactPerson,
      phoneNumber: updatedUser.phoneNumber,
      taxId: updatedUser.taxId,
      businessLicense: updatedUser.businessLicense,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    })
  } catch (error) {
    console.error('❌ Profile update error:', error)
    
    // Check if error is due to malformed JSON
    if (error instanceof SyntaxError) {
      console.log('❌ JSON parsing error')
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}