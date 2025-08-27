// MongoDB Atlas接続クライアント（開発時の多重接続を防止）
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URIが環境変数に設定されていません')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10, // 接続プールの最大サイズ
  serverSelectionTimeoutMS: 5000, // サーバー選択のタイムアウト
  socketTimeoutMS: 45000, // ソケットのタイムアウト
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// 開発環境では globalThis を使用してホットリロード時の多重接続を防止
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // 本番環境では新しいクライアントを作成
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

// Database connection helper for API routes
export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db('sato_marketplace')
  return { client, db }
}