import api from './api'

export const getApplications = async (params = {}) => {
  try {
    const response = await api.get('/exhibitors/applications', { params })
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch applications',
    }
  }
}

export const getApplication = async (id) => {
  try {
    const response = await api.get(`/exhibitors/applications/${id}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch application',
    }
  }
}

export const createApplication = async (applicationData) => {
  try {
    const response = await api.post('/exhibitors/applications', applicationData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit application',
    }
  }
}

export const approveApplication = async (id, data) => {
  try {
    const response = await api.put(`/exhibitors/applications/${id}/approve`, data)
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to approve application',
    }
  }
}

export const rejectApplication = async (id, rejectionReason) => {
  try {
    const response = await api.put(`/exhibitors/applications/${id}/reject`, {
      rejectionReason,
    })
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to reject application',
    }
  }
}

export const getMyApplications = async () => {
  try {
    const response = await api.get('/exhibitors/my-applications')
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch applications',
    }
  }
}

