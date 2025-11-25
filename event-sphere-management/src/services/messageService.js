import api from './api'

export const getConversations = async () => {
    try {
        const response = await api.get('/messages/conversations')
        return { success: true, data: response.data.data }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch conversations',
        }
    }
}

export const getMessages = async (otherUserId) => {
    try {
        const response = await api.get(`/messages/${otherUserId}`)
        return { success: true, data: response.data.data || [] }
    } catch (error) {
        console.error('Get messages error:', error)
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch messages',
            data: [],
        }
    }
}

export const sendMessage = async (recipientId, content) => {
    try {
        const response = await api.post('/messages', { recipientId, content })
        return { success: true, data: response.data.data }
    } catch (error) {
        console.error('Send message error:', error)
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Failed to send message',
        }
    }
}
