// MongoDB Atlas接続クライアント（開発時の多重接続を防止）
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  // ビルド時やテスト時には警告のみ出力
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.warn('MONGODB_URIが環境変数に設定されていません - 実行時に設定してください')
  }
}

const uri = process.env.MONGODB_URI || ''
const options = {
  maxPoolSize: 10, // 接続プールの最大サイズ
  serverSelectionTimeoutMS: 5000, // サーバー選択のタイムアウト
  socketTimeoutMS: 45000, // ソケットのタイムアウト
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// 開発環境では globalThis を使用してホットリロード時の多重接続を防止
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error('MONGODB_URIが環境変数に設定されていません'))
  }
  
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    // 本番環境では新しいクライアントを作成
    client = new MongoClient(uri, options)
    return client.connect()
  }
}

// 遅延初期化
if (uri) {
  clientPromise = createClientPromise()
}

export default clientPromise

// Database connection helper for API routes
export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URIが環境変数に設定されていません')
  }
  
  if (!clientPromise) {
    clientPromise = createClientPromise()
  }
  
  const client = await clientPromise
  const db = client.db('sato_marketplace')
  return { client, db }
}