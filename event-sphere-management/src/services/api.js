import axios from 'axios'
import { API_BASE_URL } from '../constants'
import { getAuthToken, clearAuthData } from '../utils/auth'

// Create axios instance
// #region agent log
fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:6',message:'API instance created',data:{baseURL:API_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:15',message:'API request interceptor',data:{url:config.url,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:23',message:'API request error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:29',message:'API response success',data:{status:response.status,url:response.config?.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return response
  },
  (error) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:33',message:'API response error',data:{status:error.response?.status,url:error.config?.url,pathname:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
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

