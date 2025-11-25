import express from 'express'
import * as messageController from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', messageController.sendMessage)
router.get('/conversations', messageController.getConversations)
router.get('/:otherUserId', messageController.getMessages)

export default router
