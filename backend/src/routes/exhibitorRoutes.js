import express from 'express'
import {
  getApplications,
  getApplication,
  createApplication,
  approveApplication,
  rejectApplication,
  getMyApplications,
  getApprovedExhibitors,
} from '../controllers/exhibitorController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public route - Get approved exhibitors (for attendees)
router.get('/approved', getApprovedExhibitors)

// Exhibitor routes
router.get('/my-applications', protect, authorize('exhibitor'), getMyApplications)
router.post('/applications', protect, authorize('exhibitor'), createApplication)
router.get('/applications/:id', protect, getApplication)

// Admin/Organizer routes
router.get('/applications', protect, authorize('admin', 'organizer'), getApplications)
router.put('/applications/:id/approve', protect, authorize('admin', 'organizer'), approveApplication)
router.put('/applications/:id/reject', protect, authorize('admin', 'organizer'), rejectApplication)

export default router

