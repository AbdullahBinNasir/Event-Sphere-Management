import express from 'express'
import * as userController from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/bookmarks/:sessionId', userController.toggleBookmark)
router.get('/bookmarks', userController.getBookmarks)

export default router
