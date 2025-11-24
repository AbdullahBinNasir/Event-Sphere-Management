import api from './api'

export const getFeedback = async (params = {}) => {
  try {
    const response = await api.get('/feedback', { params })
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch feedback',
    }
  }
}

export const getMyFeedback = async () => {
  try {
    const response = await api.get('/feedback/my-feedback')
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch feedback',
    }
  }
}

export const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/feedback', feedbackData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit feedback',
    }
  }
}

export const updateFeedback = async (id, feedbackData) => {
  try {
    const response = await api.put(`/feedback/${id}`, feedbackData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update feedback',
    }
  }
}

