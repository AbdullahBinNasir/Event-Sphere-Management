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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authService.js:35',message:'Login service called',data:{hasEmail:!!email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const response = await api.post('/auth/login', { email, password })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authService.js:38',message:'Login API response received',data:{status:response.status,hasToken:!!response.data.token,hasUser:!!response.data.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const { token, user } = response.data
    
    if (token) {
      setAuthToken(token)
      setUserData(user)
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authService.js:49',message:'Login API error',data:{status:error.response?.status,message:error.response?.data?.message,errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
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

