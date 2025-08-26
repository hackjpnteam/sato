// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

import { PrismaClient, Role, KycStatus, ListingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 手数料ポリシーの初期設定
  const feePolicy = await prisma.feePolicy.upsert({
    where: { id: 'default-fee-policy' },
    update: {},
    create: {
      id: 'default-fee-policy',
      applicationFeePercent: 8.0,
      minFeeJPY: 100,
      active: true
    }
  })
  console.log('Fee policy created:', feePolicy)

  // 管理者ユーザーの作成
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hackjpn.com' },
    update: {},
    create: {
      email: 'admin@hackjpn.com',
      passwordHash: adminPassword,
      role: Role.admin,
      company: 'HackJPN',
      contactName: '管理者',
      contactPhone: '03-1234-5678',
      address: '東京都渋谷区',
      kycStatus: KycStatus.verified,
      payoutsEnabled: true,
      emailVerified: new Date()
    }
  })
  console.log('Admin user created:', adminUser.email)

  // デモ用セラーユーザーの作成
  const sellerPassword = await bcrypt.hash('seller123', 10)
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@demo.com' },
    update: {},
    create: {
      email: 'seller@demo.com',
      passwordHash: sellerPassword,
      role: Role.seller,
      company: 'デモ電子部品商社',
      contactName: '販売担当者',
      contactPhone: '03-9876-5432',
      address: '東京都品川区',
      kycStatus: KycStatus.verified,
      payoutsEnabled: true,
      emailVerified: new Date()
    }
  })
  console.log('Seller user created:', sellerUser.email)

  // デモ用バイヤーユーザーの作成
  const buyerPassword = await bcrypt.hash('buyer123', 10)
  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@demo.com' },
    update: {},
    create: {
      email: 'buyer@demo.com',
      passwordHash: buyerPassword,
      role: Role.buyer,
      company: 'デモ製造会社',
      contactName: '購買担当者',
      contactPhone: '06-1234-5678',
      address: '大阪府大阪市',
      emailVerified: new Date()
    }
  })
  console.log('Buyer user created:', buyerUser.email)

  // サンプル半導体部品の出品
  const sampleMPNs = [
    { mpn: 'SN74LVC14APWR', maker: 'Texas Instruments', category: 'ロジックIC' },
    { mpn: 'STM32F103C8T6', maker: 'STMicroelectronics', category: 'マイコン' },
    { mpn: 'LM317T', maker: 'Texas Instruments', category: '電源IC' },
    { mpn: '2N2222A', maker: 'ON Semiconductor', category: 'トランジスタ' },
    { mpn: 'NE555P', maker: 'Texas Instruments', category: 'タイマーIC' }
  ]

  for (const item of sampleMPNs) {
    const listing = await prisma.listing.create({
      data: {
        mpn: item.mpn,
        quantity: Math.floor(Math.random() * 1000) + 100,
        dateCode: '2024W12',
        sourceRoute: '正規代理店',
        warranty: true,
        pricePerUnitJPY: Math.floor(Math.random() * 500) + 100,
        photos: ['https://placehold.co/400x300.png'],
        description: `${item.maker}製 ${item.category}`,
        status: ListingStatus.listed,
        sellerId: sellerUser.id
      }
    })
    console.log(`Listing created: ${listing.mpn}`)

    // 相場価格スナップショットも作成
    await prisma.marketPriceSnapshot.create({
      data: {
        mpn: item.mpn,
        source: 'Octopart',
        unitPriceJPY: Math.floor(Math.random() * 600) + 150,
        stock: Math.floor(Math.random() * 5000) + 500,
        currency: 'JPY',
        listingId: listing.id
      }
    })
  }

  // システム設定の初期値
  const systemSettings = [
    { key: 'max_image_size_mb', value: { value: 5 } },
    { key: 'allowed_image_types', value: { value: ['image/jpeg', 'image/png', 'image/webp'] } },
    { key: 'price_deviation_threshold', value: { value: 30 } }, // 30%の価格乖離で警告
    { key: 'min_listing_price_jpy', value: { value: 100 } }
  ]

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value
      }
    })
    console.log(`System setting created: ${setting.key}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })