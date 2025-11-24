import express from 'express'
import {
  getFeedback,
  getMyFeedback,
  createFeedback,
  updateFeedback,
} from '../controllers/feedbackController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// User routes
router.get('/my-feedback', protect, getMyFeedback)
router.post('/', protect, createFeedback)

// Admin/Organizer routes
router.get('/', protect, authorize('admin', 'organizer'), getFeedback)
router.put('/:id', protect, authorize('admin', 'organizer'), updateFeedback)

export default router

