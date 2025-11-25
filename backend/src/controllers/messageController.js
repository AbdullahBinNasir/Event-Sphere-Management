import Message from '../models/Message.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

export const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user._id || req.user.id;

        // Validation
        if (!recipientId || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Recipient ID and message content are required',
            });
        }

        // Validate recipientId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipient ID',
            });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found',
            });
        }

        // Don't allow sending message to self
        if (senderId.toString() === recipientId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send message to yourself',
            });
        }

        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            content: content.trim(),
        });

        await message.save();
        
        // Populate sender and recipient for response
        await message.populate('sender', 'name email');
        await message.populate('recipient', 'name email');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message,
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { otherUserId } = req.params;

        // Validate otherUserId
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message,
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        // Find all messages where user is sender or recipient
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }]
        })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ timestamp: -1 });

        // Group by other user
        const conversations = {};
        const userIdStr = userId.toString();
        
        messages.forEach(msg => {
            const senderIdStr = msg.sender._id.toString();
            const recipientIdStr = msg.recipient._id.toString();
            
            const otherUser = senderIdStr === userIdStr ? msg.recipient : msg.sender;
            const otherUserId = otherUser._id.toString();

            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    user: otherUser,
                    lastMessage: msg
                };
            }
        });

        res.status(200).json({
            success: true,
            data: Object.values(conversations),
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversations',
            error: error.message,
        });
    }
};
