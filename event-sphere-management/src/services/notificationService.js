import api from './api'

export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications')
        return { success: true, data: response.data.data }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch notifications',
        }
    }
}

export const markAsRead = async (id) => {
    try {
        const response = await api.put(`/notifications/${id}/read`)
        return { success: true, data: response.data.data }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to mark notification as read',
        }
    }
}
