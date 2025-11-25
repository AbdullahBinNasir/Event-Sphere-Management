import api from './api'

export const getExpos = async (params = {}) => {
  try {
    const response = await api.get('/expos', { params })
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch expos',
    }
  }
}

export const getExpo = async (id) => {
  try {
    const response = await api.get(`/expos/${id}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch expo',
    }
  }
}

export const createExpo = async (expoData) => {
  try {
    const response = await api.post('/expos', expoData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create expo',
    }
  }
}

export const updateExpo = async (id, expoData) => {
  try {
    const response = await api.put(`/expos/${id}`, expoData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update expo',
    }
  }
}

export const deleteExpo = async (id) => {
  try {
    await api.delete(`/expos/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete expo',
    }
  }
}

export const registerForExpo = async (expoId) => {
  try {
    const response = await api.post(`/expos/${expoId}/register`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register for expo',
    }
  }
}

export const unregisterFromExpo = async (expoId) => {
  try {
    const response = await api.delete(`/expos/${expoId}/register`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel registration',
    }
  }
}

export const getMyExpoRegistrations = async () => {
  try {
    const response = await api.get('/expos/my-registrations')
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch registrations',
    }
  }
}

