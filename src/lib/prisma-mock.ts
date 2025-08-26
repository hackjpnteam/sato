// GENERATED: 半導体在庫売買サイト（Claude Rule適用）

// In-memory storage for mock database
const mockStorage: {
  users: any[]
  sellerProfiles: any[]
  listings: any[]
  auditLogs: any[]
  feePolicy: any[]
  marketPriceSnapshots: any[]
  systemSettings: any[]
} = {
  users: [
    // Demo users for testing (roles統合版)
    {
      id: 'demo-admin',
      email: 'admin@demo.com',
      passwordHash: '$2b$10$4p20ckN8HgbFMKa9hYf1ce470GDM0jlfjm8VARhX/6b/6o9sLSiaG', // admin123
      roles: ['admin'],
      name: '管理者',
      companyName: 'デモ管理会社',
      companyAddress: '東京都渋谷区神宮前1-1-1',
      contactPerson: '管理者',
      phoneNumber: '03-1234-5678',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-seller',
      email: 'seller@demo.com',
      passwordHash: '$2b$10$Prj01/sFpCK3s4ntBH9mwOIURmSeabOkpppnEFr.MnzaobryTYctG', // seller123
      roles: ['buyer', 'seller'], // 兼務可能
      name: '販売担当者',
      companyName: 'デモ電子部品商社',
      companyAddress: '東京都品川区',
      contactPerson: '販売担当者',
      phoneNumber: '03-9876-5432',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'demo-buyer',
      email: 'buyer@demo.com',
      passwordHash: '$2b$10$SoDQ4qREznDcH/ZTKiFdnuPLlwVLj.wS0XV6uNHTB9OxnFF05m2Sq', // buyer123
      roles: ['buyer'],
      name: '購買担当者',
      companyName: 'デモ製造会社',
      companyAddress: '大阪府大阪市',
      contactPerson: '購買担当者',
      phoneNumber: '06-1234-5678',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Registered user
    {
      id: 'user-tomura',
      email: 'tomura@hackjpn.com',
      passwordHash: '$2b$10$4p20ckN8HgbFMKa9hYf1ce470GDM0jlfjm8VARhX/6b/6o9sLSiaG',
      name: '戸村 光',
      roles: ['buyer', 'admin'], // 管理者権限を追加
      companyName: 'hackjpn株式会社',
      companyAddress: '663 Moorpark Way, Mountain View, CA 94041, United States',
      contactPerson: '戸村 光',
      phoneNumber: '',
      taxId: '',
      businessLicense: '',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  sellerProfiles: [
    // Demo seller profile for demo-seller
    {
      id: 'seller-profile-demo',
      userId: 'demo-seller',
      stripeConnectId: null,
      payoutsEnabled: false,
      kycStatus: 'verified',
      tier: 'T1', // 昇格済み
      listingCap: 50,
      holdDays: 3,
      totalOrders: 15,
      fulfilledOrders: 12,
      canceledOrders: 1,
      averageRating: 4.5,
      ratingCount: 8,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  ],
  listings: [],
  auditLogs: [],
  feePolicy: [
    {
      id: 'default-fee-policy',
      applicationFeePercent: 8.0,
      minFeeJPY: 50,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  marketPriceSnapshots: [],
  systemSettings: []
}

// Mock Prisma client for development without database
export const prismaMock = {
  user: {
    findUnique: async (options: any) => {
      console.log('🔍 findUnique called with:', options)
      console.log('📋 Available users:', mockStorage.users.map(u => ({ id: u.id, email: u.email })))
      
      const { where } = options
      if (where.email) {
        const user = mockStorage.users.find(user => user.email === where.email) || null
        console.log('🎯 findUnique result for email:', where.email, user ? 'Found' : 'Not found')
        return user
      }
      if (where.id) {
        const user = mockStorage.users.find(user => user.id === where.id) || null
        console.log('🎯 findUnique result for id:', where.id, user ? 'Found' : 'Not found')
        return user
      }
      return null
    },
    findMany: async () => mockStorage.users,
    create: async (options: any) => {
      const newUser = {
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options.data
      }
      mockStorage.users.push(newUser)
      return newUser
    },
    count: async () => mockStorage.users.length,
    update: async (options: any) => {
      console.log('🔄 user.update called with:', JSON.stringify(options, null, 2))
      const user = mockStorage.users.find(user => 
        options.where.id ? user.id === options.where.id : user.email === options.where.email
      )
      if (!user) {
        console.log('❌ user.update: User not found')
        throw new Error('User not found')
      }
      console.log('🔍 user.update: Before update:', JSON.stringify({
        id: user.id, 
        email: user.email, 
        roles: user.roles, 
        taxId: user.taxId 
      }))
      Object.assign(user, options.data, { updatedAt: new Date() })
      console.log('✅ user.update: After update:', JSON.stringify({
        id: user.id, 
        email: user.email, 
        roles: user.roles, 
        taxId: user.taxId 
      }))
      return user
    },
    upsert: async (options: any) => {
      const existingUser = mockStorage.users.find(user => user.email === options.where.email)
      if (existingUser) {
        Object.assign(existingUser, options.update)
        return existingUser
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...options.create
        }
        mockStorage.users.push(newUser)
        return newUser
      }
    }
  },
  listing: {
    findMany: async () => mockStorage.listings,
    count: async () => mockStorage.listings.length,
    findUnique: async (options: any) => {
      console.log('🔍 listing.findUnique called with:', options)
      console.log('📋 listing.findUnique: Total listings in storage:', mockStorage.listings.length)
      console.log('📋 listing.findUnique: Available listings:', mockStorage.listings.map(l => ({ id: l.id, mpn: l.mpn, sellerId: l.sellerId })))
      const { where, include } = options
      let listing = null
      
      if (where.id) {
        listing = mockStorage.listings.find(l => l.id === where.id) || null
        console.log('🎯 listing.findUnique result for id:', where.id, listing ? 'Found' : 'Not found')
        if (listing) {
          console.log('👁️ listing.findUnique: Found listing details:', { id: listing.id, mpn: listing.mpn, sellerId: listing.sellerId })
        }
      }
      
      // If listing found and include is specified, add seller info
      if (listing && include?.seller) {
        const seller = mockStorage.users.find(u => u.id === listing.sellerId)
        if (seller) {
          listing = {
            ...listing,
            seller: {
              id: seller.id,
              name: seller.name || seller.email,
              email: seller.email,
              companyName: seller.companyName,
              contactPerson: seller.contactPerson,
              companyAddress: seller.companyAddress
            }
          }
        }
      }
      
      return listing
    },
    create: async (options: any) => {
      const newListing = {
        id: `listing-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options.data
      }
      mockStorage.listings.push(newListing)
      console.log('📝 listing.create: Created listing', { id: newListing.id, mpn: newListing.mpn })
      console.log('📋 listing.create: Total listings in storage:', mockStorage.listings.length)
      return newListing
    }
  },
  auditLog: {
    create: async (options: any) => {
      const newAuditLog = {
        id: `audit-${Date.now()}`,
        createdAt: new Date(),
        ...options.data
      }
      mockStorage.auditLogs.push(newAuditLog)
      return newAuditLog
    }
  },
  feePolicy: {
    upsert: async (options: any) => {
      const existing = mockStorage.feePolicy.find(p => p.id === options.where.id)
      if (existing) {
        Object.assign(existing, options.update)
        return existing
      } else {
        const newPolicy = {
          id: options.where.id || `policy-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...options.create
        }
        mockStorage.feePolicy.push(newPolicy)
        return newPolicy
      }
    }
  },
  marketPriceSnapshot: {
    create: async (options: any) => {
      const newSnapshot = {
        id: `snapshot-${Date.now()}`,
        fetchedAt: new Date(),
        ...options.data
      }
      mockStorage.marketPriceSnapshots.push(newSnapshot)
      return newSnapshot
    }
  },
  systemSetting: {
    upsert: async (options: any) => {
      const existing = mockStorage.systemSettings.find(s => s.key === options.where.key)
      if (existing) {
        Object.assign(existing, options.update)
        return existing
      } else {
        const newSetting = {
          id: `setting-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          key: options.where.key,
          ...options.create
        }
        mockStorage.systemSettings.push(newSetting)
        return newSetting
      }
    }
  },
  sellerProfile: {
    findUnique: async (options: any) => {
      console.log('🔍 sellerProfile.findUnique called with:', options)
      const { where } = options
      if (where.userId) {
        const profile = mockStorage.sellerProfiles.find(profile => profile.userId === where.userId) || null
        console.log('🎯 sellerProfile.findUnique result for userId:', where.userId, profile ? 'Found' : 'Not found')
        return profile
      }
      if (where.id) {
        const profile = mockStorage.sellerProfiles.find(profile => profile.id === where.id) || null
        console.log('🎯 sellerProfile.findUnique result for id:', where.id, profile ? 'Found' : 'Not found')
        return profile
      }
      return null
    },
    create: async (options: any) => {
      const newProfile = {
        id: `seller-profile-${Date.now()}`,
        tier: 'T0',
        listingCap: 10,
        holdDays: 7,
        payoutsEnabled: false,
        kycStatus: 'pending',
        totalOrders: 0,
        fulfilledOrders: 0,
        canceledOrders: 0,
        averageRating: 0,
        ratingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options.data
      }
      mockStorage.sellerProfiles.push(newProfile)
      return newProfile
    },
    update: async (options: any) => {
      const profile = mockStorage.sellerProfiles.find(profile => 
        options.where.id ? profile.id === options.where.id : profile.userId === options.where.userId
      )
      if (!profile) {
        throw new Error('SellerProfile not found')
      }
      Object.assign(profile, options.data, { updatedAt: new Date() })
      return profile
    },
    upsert: async (options: any) => {
      const existingProfile = mockStorage.sellerProfiles.find(profile => profile.userId === options.where.userId)
      if (existingProfile) {
        Object.assign(existingProfile, options.update, { updatedAt: new Date() })
        return existingProfile
      } else {
        const newProfile = {
          id: `seller-profile-${Date.now()}`,
          tier: 'T0',
          listingCap: 10,
          holdDays: 7,
          payoutsEnabled: false,
          kycStatus: 'pending',
          totalOrders: 0,
          fulfilledOrders: 0,
          canceledOrders: 0,
          averageRating: 0,
          ratingCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...options.create
        }
        mockStorage.sellerProfiles.push(newProfile)
        return newProfile
      }
    }
  },
  $disconnect: async () => {}
}