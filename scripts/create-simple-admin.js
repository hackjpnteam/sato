// Create a simple admin user that definitely works
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createSimpleAdmin() {
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db('sato_marketplace')
    
    const email = 'admin@test.com'
    const password = '123456'
    
    // Delete any existing user
    await db.collection('users').deleteMany({ email })
    
    // Simple hash with bcryptjs
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    console.log('Creating admin user:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Hash:', hash)
    
    // Test hash immediately
    const testResult = await bcrypt.compare(password, hash)
    console.log('Hash test result:', testResult)
    
    if (!testResult) {
      console.error('Hash test failed - aborting')
      return
    }
    
    // Insert user
    const result = await db.collection('users').insertOne({
      email: email,
      passwordHash: hash,
      name: 'Administrator',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    console.log('Admin user created successfully!')
    console.log('User ID:', result.insertedId.toString())
    
    // Verify the user was created correctly
    const createdUser = await db.collection('users').findOne({ email })
    console.log('Verification - User found:', createdUser ? 'YES' : 'NO')
    console.log('Verification - Role:', createdUser?.role)
    console.log('Verification - Has passwordHash:', !!createdUser?.passwordHash)
    
    if (createdUser) {
      const finalTest = await bcrypt.compare(password, createdUser.passwordHash)
      console.log('Final verification test:', finalTest)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

createSimpleAdmin()