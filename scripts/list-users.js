// Script to list all users
const { MongoClient } = require('mongodb')

async function listUsers() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor-marketplace'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    
    const users = await db.collection('users').find({}).toArray()
    
    console.log(`Found ${users.length} users:\n`)
    
    users.forEach(user => {
      console.log(`Email: ${user.email}`)
      console.log(`  ID: ${user._id}`)
      console.log(`  Name: ${user.name}`)
      console.log(`  Role: ${user.role}`)
      console.log(`  Verified: ${user.emailVerified}`)
      console.log(`  Created: ${user.createdAt}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

listUsers()