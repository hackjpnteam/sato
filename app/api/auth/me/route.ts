import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development'

interface JwtPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    
    if (!token || !token.value) {
      return NextResponse.json({ ok: false, user: null });
    }

    const decoded = verifyToken(token.value)
    if (!decoded) {
      return NextResponse.json({ ok: false, user: null });
    }

    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId)
    })

    if (!user) {
      return NextResponse.json({ ok: false, user: null });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ ok: false, user: null });
  }
}