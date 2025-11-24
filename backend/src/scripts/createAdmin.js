import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// Load environment variables
dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-sphere'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@eventsphere.com',
      password: 'admin123', // Change this password!
      role: 'admin',
      phone: '',
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email })
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with this email')
      console.log('   You can update the role manually in MongoDB or use a different email')
      process.exit(0)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    adminData.password = await bcrypt.hash(adminData.password, salt)

    // Create admin user
    const admin = await User.create(adminData)

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminData.email)
    console.log('🔑 Password: admin123 (Please change this!)')
    console.log('👤 Role:', admin.role)
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

createAdmin()

