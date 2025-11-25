import User from '../models/User.js'
import mongoose from 'mongoose'

export const toggleBookmark = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { sessionId } = req.params;

        // Validate sessionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid session ID',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Convert bookmarks to strings for comparison
        const bookmarkIds = user.bookmarks.map(id => id.toString());
        const sessionIdStr = sessionId.toString();

        let isBookmarked = false;
        if (!bookmarkIds.includes(sessionIdStr)) {
            // Add bookmark
            user.bookmarks.push(new mongoose.Types.ObjectId(sessionId));
            isBookmarked = true;
        } else {
            // Remove bookmark
            user.bookmarks = user.bookmarks.filter(
                id => id.toString() !== sessionIdStr
            );
            isBookmarked = false;
        }

        await user.save();
        res.status(200).json({
            success: true,
            data: user.bookmarks,
            isBookmarked,
        });
    } catch (error) {
        console.error('Toggle bookmark error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle bookmark',
            error: error.message,
        });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).populate('bookmarks');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user.bookmarks || [],
        });
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookmarks',
            error: error.message,
        });
    }
};
