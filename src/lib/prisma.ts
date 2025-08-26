// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { PrismaClient } from '@prisma/client'
import { prismaMock } from './prisma-mock'

declare global {
  var prisma: PrismaClient | any
}

const USE_MOCK = process.env.USE_MOCK_DB === 'true' || !process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:password@localhost:5432/semiconductor_marketplace?schema=public'

export const prisma = global.prisma || (USE_MOCK ? prismaMock : new PrismaClient())

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}