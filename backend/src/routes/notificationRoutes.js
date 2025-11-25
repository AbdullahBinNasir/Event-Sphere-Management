import express from 'express'
import * as notificationController from '../controllers/notificationController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', notificationController.getNotifications)
router.put('/:id/read', notificationController.markAsRead)

export default router
