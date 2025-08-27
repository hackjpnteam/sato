const bcrypt = require('bcryptjs')

async function testPassword() {
  const password = 'admin123456'
  
  // Create hash like the script does
  const hash = await bcrypt.hash(password, 12)
  console.log('Generated hash:', hash)
  
  // Test comparison
  const result = await bcrypt.compare(password, hash)
  console.log('Password comparison result:', result)
  
  // Test with different rounds
  const hash10 = await bcrypt.hash(password, 10)
  console.log('Hash with 10 rounds:', hash10)
  
  const result10 = await bcrypt.compare(password, hash10)
  console.log('Comparison with 10 rounds:', result10)
}

testPassword()