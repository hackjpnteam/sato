// Script to update user role to admin
const { MongoClient } = require('mongodb')

async function updateUserRole(email, role) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor-marketplace'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db() // Use default database from connection string
    
    // First check if user exists
    const user = await db.collection('users').findOne({ email })
    console.log('Found user:', user ? `${user.email} (current role: ${user.role}, id: ${user._id})` : 'Not found')
    
    if (!user) {
      console.log(`Creating new admin user: ${email}`)
      // Import bcrypt to hash password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123456', 12)
      
      await db.collection('users').insertOne({
        email,
        passwordHash: hashedPassword,
        name: 'Admin User',
        role,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log(`Successfully created admin user: ${email}`)
      return
    }
    
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { role } }
    )

    if (result.matchedCount === 0) {
      console.log('User not found')
    } else if (result.modifiedCount === 0) {
      console.log('User already has this role')
    } else {
      console.log(`Successfully updated ${email} to role: ${role}`)
    }
  } catch (error) {
    console.error('Error updating user role:', error)
  } finally {
    await client.close()
  }
}

// Usage: node scripts/update-user-role.js email@example.com admin
const [,, email, role] = process.argv

if (!email || !role) {
  console.log('Usage: node scripts/update-user-role.js <email> <role>')
  console.log('Roles: buyer, seller, admin')
  process.exit(1)
}

updateUserRole(email, role)