import express from 'express'
import {
  getExpos,
  getExpo,
  createExpo,
  updateExpo,
  deleteExpo,
  registerForExpo,
  cancelExpoRegistration,
  getMyRegistrations,
} from '../controllers/expoController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Attendee routes
router.get('/my-registrations', protect, authorize('attendee'), getMyRegistrations)
router.post('/:id/register', protect, authorize('attendee'), registerForExpo)
router.delete('/:id/register', protect, authorize('attendee'), cancelExpoRegistration)

// Public routes
router.get('/', getExpos)
router.get('/:id', getExpo)

// Protected routes (Admin/Organizer only)
router.post('/', protect, authorize('admin', 'organizer'), createExpo)
router.put('/:id', protect, authorize('admin', 'organizer'), updateExpo)
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteExpo)

export default router

