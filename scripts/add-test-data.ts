// テストデータ追加スクリプト
import { config } from 'dotenv'
config({ path: '.env.local' })

import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URIが環境変数に設定されていません')
}

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

const testListings = [
  {
    partNumber: 'ESP32-WROOM-32',
    manufacturer: 'Espressif Systems',
    quantity: 1000,
    unitPriceJPY: 450,
    dateCode: '2024W15',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証2年',
    category: 'microcontroller',
    images: [],
    sellerId: 'test-seller-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'STM32F407VGT6',
    manufacturer: 'STMicroelectronics',
    quantity: 500,
    unitPriceJPY: 1200,
    dateCode: '2024W12',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証1年',
    category: 'microcontroller',
    images: [],
    sellerId: 'test-seller-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'BME280',
    manufacturer: 'Bosch',
    quantity: 200,
    unitPriceJPY: 890,
    dateCode: '2024W10',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証1年',
    category: 'sensor',
    images: [],
    sellerId: 'test-seller-2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'ADS1115',
    manufacturer: 'Texas Instruments',
    quantity: 150,
    unitPriceJPY: 320,
    dateCode: '2024W08',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証3年',
    category: 'analog',
    images: [],
    sellerId: 'test-seller-2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'ATMEGA328P-PU',
    manufacturer: 'Microchip',
    quantity: 300,
    unitPriceJPY: 280,
    dateCode: '2024W05',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証2年',
    category: 'microcontroller',
    images: [],
    sellerId: 'test-seller-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'NRF24L01+',
    manufacturer: 'Nordic Semiconductor',
    quantity: 400,
    unitPriceJPY: 180,
    dateCode: '2024W02',
    stockSource: 'open_market',
    condition: 'new',
    warranty: '販売店保証6ヶ月',
    category: 'rf',
    images: [],
    sellerId: 'test-seller-3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'LM358N',
    manufacturer: 'Texas Instruments',
    quantity: 800,
    unitPriceJPY: 45,
    dateCode: '2023W48',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証2年',
    category: 'analog',
    images: [],
    sellerId: 'test-seller-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'MAX7219CNG',
    manufacturer: 'Maxim Integrated',
    quantity: 120,
    unitPriceJPY: 650,
    dateCode: '2024W01',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証1年',
    category: 'interface',
    images: [],
    sellerId: 'test-seller-2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'DS18B20',
    manufacturer: 'Maxim Integrated',
    quantity: 350,
    unitPriceJPY: 150,
    dateCode: '2024W03',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証2年',
    category: 'sensor',
    images: [],
    sellerId: 'test-seller-3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    partNumber: 'MCP3008-I/P',
    manufacturer: 'Microchip',
    quantity: 250,
    unitPriceJPY: 420,
    dateCode: '2024W07',
    stockSource: 'authorized',
    condition: 'new',
    warranty: 'メーカー保証3年',
    category: 'analog',
    images: [],
    sellerId: 'test-seller-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const testUsers = [
  {
    email: 'seller1@example.com',
    passwordHash: '', // Will be filled below
    name: 'テストセラー1',
    role: 'seller',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'seller2@example.com',  
    passwordHash: '', // Will be filled below
    name: 'テストセラー2',
    role: 'seller',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'seller3@example.com',
    passwordHash: '', // Will be filled below
    name: 'テストセラー3', 
    role: 'seller',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'admin@example.com',
    passwordHash: '', // Will be filled below
    name: '管理者',
    role: 'admin',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function addTestData() {
  try {
    await client.connect()
    console.log('MongoDB接続成功')
    
    const db = client.db('sato_marketplace')
    
    // Hash passwords
    const saltRounds = 12
    for (const user of testUsers) {
      user.passwordHash = await bcrypt.hash('password123', saltRounds)
    }
    
    // Clear existing test data
    await db.collection('users').deleteMany({ email: { $regex: /example\.com$/ } })
    await db.collection('listings').deleteMany({ sellerId: { $in: ['test-seller-1', 'test-seller-2', 'test-seller-3'] } })
    
    // Insert test users
    const userResult = await db.collection('users').insertMany(testUsers)
    console.log(`${userResult.insertedCount}件のテストユーザーを追加しました`)
    
    // Update sellerId with actual ObjectIds
    const userIds = Object.values(userResult.insertedIds)
    testListings.forEach((listing, index) => {
      if (listing.sellerId === 'test-seller-1') {
        listing.sellerId = userIds[0].toString()
      } else if (listing.sellerId === 'test-seller-2') {
        listing.sellerId = userIds[1].toString()
      } else if (listing.sellerId === 'test-seller-3') {
        listing.sellerId = userIds[2].toString()
      }
    })
    
    // Insert test listings
    const listingResult = await db.collection('listings').insertMany(testListings)
    console.log(`${listingResult.insertedCount}件のテスト商品を追加しました`)
    
    console.log('テストデータの追加が完了しました')
    console.log('テストログイン情報:')
    console.log('- seller1@example.com / password123 (セラー)')
    console.log('- seller2@example.com / password123 (セラー)')
    console.log('- seller3@example.com / password123 (セラー)')
    console.log('- admin@example.com / password123 (管理者)')
    
  } catch (error) {
    console.error('エラー:', error)
  } finally {
    await client.close()
  }
}

addTestData()