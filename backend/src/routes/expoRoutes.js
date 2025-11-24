import express from 'express'
import {
  getExpos,
  getExpo,
  createExpo,
  updateExpo,
  deleteExpo,
} from '../controllers/expoController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getExpos)
router.get('/:id', getExpo)

// Protected routes (Admin/Organizer only)
router.post('/', protect, authorize('admin', 'organizer'), createExpo)
router.put('/:id', protect, authorize('admin', 'organizer'), updateExpo)
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteExpo)

export default router

