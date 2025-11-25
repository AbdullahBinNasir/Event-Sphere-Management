import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import expoRoutes from './src/routes/expoRoutes.js'
import sessionRoutes from './src/routes/sessionRoutes.js'
import exhibitorRoutes from './src/routes/exhibitorRoutes.js'
import feedbackRoutes from './src/routes/feedbackRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import userRoutes from './src/routes/userRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/expos', expoRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/exhibitors', exhibitorRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/users', userRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-sphere'
const PORT = process.env.PORT || 5000

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

export default app
