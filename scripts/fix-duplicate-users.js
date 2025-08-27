// Script to fix duplicate users and ensure admin role
const { MongoClient } = require('mongodb')

async function fixDuplicateUsers() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' })
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/semiconductor-marketplace'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    
    // Find all users with admin@semiconductor.com email
    const users = await db.collection('users').find({ 
      email: 'admin@semiconductor.com' 
    }).toArray()
    
    console.log(`Found ${users.length} users with email admin@semiconductor.com`)
    
    if (users.length > 0) {
      // Show all users
      users.forEach((user, index) => {
        console.log(`User ${index + 1}: id=${user._id}, role=${user.role}, name="${user.name}", verified=${user.emailVerified}`)
      })
      
      // Keep the one with ID 68ae889433fb5af780654287 (the one being used in login)
      const targetUserId = '68ae889433fb5af780654287'
      
      // Update the target user to admin
      const result = await db.collection('users').updateOne(
        { _id: { $oid: targetUserId } },
        { $set: { role: 'admin', name: 'Admin User' } }
      )
      
      if (result.matchedCount === 0) {
        // Try with ObjectId
        const { ObjectId } = require('mongodb')
        const result2 = await db.collection('users').updateOne(
          { _id: new ObjectId(targetUserId) },
          { $set: { role: 'admin', name: 'Admin User' } }
        )
        console.log(`Updated user ${targetUserId}: matched=${result2.matchedCount}, modified=${result2.modifiedCount}`)
      } else {
        console.log(`Updated user ${targetUserId}: matched=${result.matchedCount}, modified=${result.modifiedCount}`)
      }
      
      // Delete any other duplicate users
      const deleteResult = await db.collection('users').deleteMany({
        email: 'admin@semiconductor.com',
        _id: { $ne: new ObjectId(targetUserId) }
      })
      console.log(`Deleted ${deleteResult.deletedCount} duplicate users`)
    }
    
    // Verify final state
    const finalUser = await db.collection('users').findOne({ 
      email: 'admin@semiconductor.com' 
    })
    console.log('\nFinal user state:')
    console.log(`Email: ${finalUser.email}`)
    console.log(`Role: ${finalUser.role}`)
    console.log(`Name: ${finalUser.name}`)
    console.log(`ID: ${finalUser._id}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

fixDuplicateUsers()