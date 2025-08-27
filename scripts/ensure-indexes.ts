// MongoDB インデックス作成スクリプト
import clientPromise from '../lib/mongodb'

async function ensureIndexes() {
  console.log('🔄 MongoDB インデックス作成を開始します...')
  
  try {
    const client = await clientPromise
    if (!client) {
      throw new Error('MongoDB client is not available')
    }
    const db = client.db('semiconductor-marketplace')
    
    // Users コレクションのインデックス
    console.log('📧 Users コレクションのインデックスを作成中...')
    await db.collection('users').createIndex(
      { email: 1 }, 
      { unique: true, name: 'email_unique' }
    )
    console.log('✅ users.email (unique) インデックスを作成しました')
    
    // Listings コレクションのインデックス
    console.log('📦 Listings コレクションのインデックスを作成中...')
    
    // 部品番号 + デートコード（複合インデックス）
    await db.collection('listings').createIndex(
      { partNumber: 1, dateCode: 1 }, 
      { name: 'partNumber_dateCode' }
    )
    console.log('✅ listings.partNumber_dateCode インデックスを作成しました')
    
    // メーカー + 部品番号（複合インデックス）
    await db.collection('listings').createIndex(
      { manufacturer: 1, partNumber: 1 }, 
      { name: 'manufacturer_partNumber' }
    )
    console.log('✅ listings.manufacturer_partNumber インデックスを作成しました')
    
    // 作成日時（降順）
    await db.collection('listings').createIndex(
      { createdAt: -1 }, 
      { name: 'createdAt_desc' }
    )
    console.log('✅ listings.createdAt (desc) インデックスを作成しました')
    
    // ステータス
    await db.collection('listings').createIndex(
      { status: 1 }, 
      { name: 'status' }
    )
    console.log('✅ listings.status インデックスを作成しました')
    
    // 販売者ID
    await db.collection('listings').createIndex(
      { sellerId: 1 }, 
      { name: 'sellerId' }
    )
    console.log('✅ listings.sellerId インデックスを作成しました')
    
    // Inventory Lots コレクションのインデックス
    console.log('🏭 Inventory Lots コレクションのインデックスを作成中...')
    
    // 部品番号 + デートコード
    await db.collection('inventoryLots').createIndex(
      { partNumber: 1, dateCode: 1 }, 
      { name: 'partNumber_dateCode' }
    )
    console.log('✅ inventoryLots.partNumber_dateCode インデックスを作成しました')
    
    // 在庫数（降順）
    await db.collection('inventoryLots').createIndex(
      { availableQty: -1 }, 
      { name: 'availableQty_desc' }
    )
    console.log('✅ inventoryLots.availableQty (desc) インデックスを作成しました')
    
    // 販売者ID
    await db.collection('inventoryLots').createIndex(
      { sellerId: 1 }, 
      { name: 'sellerId' }
    )
    console.log('✅ inventoryLots.sellerId インデックスを作成しました')
    
    // Sellers コレクションのインデックス
    console.log('🏢 Sellers コレクションのインデックスを作成中...')
    
    // 会社名（テキストインデックス）
    await db.collection('sellers').createIndex(
      { companyName: 'text' }, 
      { name: 'companyName_text' }
    )
    console.log('✅ sellers.companyName (text) インデックスを作成しました')
    
    // 所有者ユーザーID（ユニーク）
    await db.collection('sellers').createIndex(
      { ownerUserId: 1 }, 
      { unique: true, name: 'ownerUserId_unique' }
    )
    console.log('✅ sellers.ownerUserId (unique) インデックスを作成しました')
    
    // Orders コレクションのインデックス
    console.log('📋 Orders コレクションのインデックスを作成中...')
    
    // 購入者ID
    await db.collection('orders').createIndex(
      { buyerUserId: 1 }, 
      { name: 'buyerUserId' }
    )
    console.log('✅ orders.buyerUserId インデックスを作成しました')
    
    // 販売者ID
    await db.collection('orders').createIndex(
      { sellerId: 1 }, 
      { name: 'sellerId' }
    )
    console.log('✅ orders.sellerId インデックスを作成しました')
    
    // 出品ID
    await db.collection('orders').createIndex(
      { listingId: 1 }, 
      { name: 'listingId' }
    )
    console.log('✅ orders.listingId インデックスを作成しました')
    
    // ロットID
    await db.collection('orders').createIndex(
      { lotId: 1 }, 
      { name: 'lotId' }
    )
    console.log('✅ orders.lotId インデックスを作成しました')
    
    // ステータス
    await db.collection('orders').createIndex(
      { status: 1 }, 
      { name: 'status' }
    )
    console.log('✅ orders.status インデックスを作成しました')
    
    // 作成日時（降順）
    await db.collection('orders').createIndex(
      { createdAt: -1 }, 
      { name: 'createdAt_desc' }
    )
    console.log('✅ orders.createdAt (desc) インデックスを作成しました')
    
    console.log('🎉 すべてのインデックス作成が完了しました！')
    
    // インデックス一覧を表示
    console.log('\\n📊 作成されたインデックス一覧:')
    
    const collections = ['users', 'listings', 'inventoryLots', 'sellers', 'orders']
    for (const collectionName of collections) {
      console.log(`\\n${collectionName}:`)
      const indexes = await db.collection(collectionName).listIndexes().toArray()
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}${index.unique ? ' (unique)' : ''}`)
      })
    }
    
  } catch (error) {
    console.error('❌ インデックス作成中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// スクリプト実行
if (require.main === module) {
  ensureIndexes().then(() => {
    console.log('\\n✅ インデックス作成スクリプトが正常に完了しました')
    process.exit(0)
  }).catch((error) => {
    console.error('❌ スクリプト実行エラー:', error)
    process.exit(1)
  })
}

export { ensureIndexes }