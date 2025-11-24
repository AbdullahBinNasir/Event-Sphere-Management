import api from './api'

export const getSessions = async (params = {}) => {
  try {
    const response = await api.get('/sessions', { params })
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch sessions',
    }
  }
}

export const getSession = async (id) => {
  try {
    const response = await api.get(`/sessions/${id}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch session',
    }
  }
}

export const createSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create session',
    }
  }
}

export const updateSession = async (id, sessionData) => {
  try {
    const response = await api.put(`/sessions/${id}`, sessionData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update session',
    }
  }
}

export const deleteSession = async (id) => {
  try {
    await api.delete(`/sessions/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete session',
    }
  }
}

export const registerForSession = async (id) => {
  try {
    const response = await api.post(`/sessions/${id}/register`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register for session',
    }
  }
}

export const unregisterFromSession = async (id) => {
  try {
    const response = await api.delete(`/sessions/${id}/register`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to unregister from session',
    }
  }
}

