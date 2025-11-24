import axios from 'axios'
import { API_BASE_URL } from '../constants'
import { getAuthToken, clearAuthData } from '../utils/auth'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 during registration/login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      // Unauthorized - clear auth data and redirect to login
      clearAuthData()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

