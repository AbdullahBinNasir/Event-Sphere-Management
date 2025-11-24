import express from 'express'
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  registerForSession,
  unregisterFromSession,
} from '../controllers/sessionController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getSessions)
router.get('/:id', getSession)

// Protected routes (Admin/Organizer)
router.post('/', protect, authorize('admin', 'organizer'), createSession)
router.put('/:id', protect, authorize('admin', 'organizer'), updateSession)
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteSession)

// Attendee routes
router.post('/:id/register', protect, authorize('attendee'), registerForSession)
router.delete('/:id/register', protect, authorize('attendee'), unregisterFromSession)

export default router

