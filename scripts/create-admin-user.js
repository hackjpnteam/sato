// Script to create a working admin user
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createAdminUser() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor-marketplace'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    
    const email = 'admin@example.com'
    const password = 'admin123456'
    const name = 'System Administrator'
    
    // Delete existing user if exists
    await db.collection('users').deleteMany({ email })
    console.log(`Deleted any existing user with email: ${email}`)
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create new admin user
    const result = await db.collection('users').insertOne({
      email,
      passwordHash: hashedPassword,
      name,
      role: 'admin',
      emailVerified: true,
      companyName: 'System Admin',
      companyAddress: '',
      companyPhone: '',
      companyDescription: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    console.log(`Successfully created admin user:`)
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)
    console.log(`  Role: admin`)
    console.log(`  ID: ${result.insertedId}`)
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await client.close()
  }
}

createAdminUser()