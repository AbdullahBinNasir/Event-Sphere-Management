import Notification from '../models/Notification.js'

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await Notification.find({ recipient: userId }).sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createNotification = async (recipientId, message, type = 'info') => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            message,
            type
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
