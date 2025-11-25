import api from './api'

export const toggleBookmark = async (sessionId) => {
    try {
        const response = await api.post(`/users/bookmarks/${sessionId}`)
        return {
            success: true,
            data: response.data.data || [],
            isBookmarked: response.data.isBookmarked,
        }
    } catch (error) {
        console.error('Toggle bookmark error:', error)
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Failed to toggle bookmark',
        }
    }
}

export const getBookmarks = async () => {
    try {
        const response = await api.get('/users/bookmarks')
        return {
            success: true,
            data: response.data.data || [],
        }
    } catch (error) {
        console.error('Get bookmarks error:', error)
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch bookmarks',
            data: [],
        }
    }
}
