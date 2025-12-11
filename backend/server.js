import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './src/routes/authRoutes.js'
import expoRoutes from './src/routes/expoRoutes.js'
import sessionRoutes from './src/routes/sessionRoutes.js'
import exhibitorRoutes from './src/routes/exhibitorRoutes.js'
import feedbackRoutes from './src/routes/feedbackRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import userRoutes from './src/routes/userRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
// Remove quotes if present in the URI
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-sphere'
MONGODB_URI = MONGODB_URI.replace(/^['"]|['"]$/g, '') // Remove surrounding quotes
const PORT = process.env.PORT || 5000

// #region agent log
const logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
const logEntry = JSON.stringify({
  location: 'server.js:45',
  message: 'MongoDB connection attempt',
  data: {
    hasUri: !!MONGODB_URI,
    uriType: MONGODB_URI.includes('mongodb+srv') ? 'Atlas' : 'Local',
    port: PORT
  },
  timestamp: Date.now(),
  sessionId: 'debug-session',
  runId: 'run1',
  hypothesisId: 'A'
}) + '\n';
try { fs.appendFileSync(logPath, logEntry); } catch(e) {}
// #endregion

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    // #region agent log
    const logEntry2 = JSON.stringify({
      location: 'server.js:57',
      message: 'MongoDB connected successfully',
      data: {},
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    }) + '\n';
    try { fs.appendFileSync(logPath, logEntry2); } catch(e) {}
    // #endregion
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((error) => {
    // #region agent log
    const logEntry3 = JSON.stringify({
      location: 'server.js:67',
      message: 'MongoDB connection error',
      data: {
        errorCode: error.code,
        errorName: error.name,
        errorMessage: error.message,
        codeName: error.codeName
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    }) + '\n';
    try { fs.appendFileSync(logPath, logEntry3); } catch(e) {}
    // #endregion
    console.error('❌ MongoDB connection error:', error.message)
    console.error('Error details:', {
      code: error.code,
      codeName: error.codeName,
      name: error.name
    })
    
    if (error.code === 8000 || error.codeName === 'AtlasError') {
      console.error('\n💡 MongoDB Atlas Authentication Error:')
      console.error('   - Check your MongoDB Atlas username and password')
      console.error('   - Verify the database user has proper permissions')
      console.error('   - Ensure your IP is whitelisted in MongoDB Atlas Network Access')
      console.error('   - Check if the connection string in .env is correct')
    }
    
    console.error('\n💡 To use local MongoDB instead, update .env:')
    console.error('   MONGODB_URI=mongodb://localhost:27017/event-sphere')
    
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
