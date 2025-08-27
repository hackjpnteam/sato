// Script to reset user password
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function resetPassword(email, newPassword) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor-marketplace'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      console.log(`User ${email} not found`)
      return
    }
    
    console.log(`Found user: ${user.email} (role: ${user.role})`)
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          passwordHash: hashedPassword,
          updatedAt: new Date()
        } 
      }
    )

    if (result.modifiedCount > 0) {
      console.log(`Successfully reset password for ${email}`)
    } else {
      console.log(`Failed to reset password for ${email}`)
    }
    
  } catch (error) {
    console.error('Error resetting password:', error)
  } finally {
    await client.close()
  }
}

// Usage: node scripts/reset-password.js email@example.com newpassword
const [,, email, password] = process.argv

if (!email || !password) {
  console.log('Usage: node scripts/reset-password.js <email> <password>')
  process.exit(1)
}

resetPassword(email, password)