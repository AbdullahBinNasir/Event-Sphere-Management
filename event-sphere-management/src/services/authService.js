import api from './api'
import { setAuthToken, setUserData, clearAuthData } from '../utils/auth'

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    const { token, user } = response.data
    
    if (token && user) {
      setAuthToken(token)
      setUserData(user)
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Registration failed. Please check your connection and try again.'
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    
    if (token) {
      setAuthToken(token)
      setUserData(user)
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    }
  }
}

/**
 * Logout user
 */
export const logout = () => {
  clearAuthData()
}

/**
 * Forgot password - request password reset
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send reset email',
    }
  }
}

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Password reset failed',
    }
  }
}

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user data',
    }
  }
}

