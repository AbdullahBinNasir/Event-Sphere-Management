import { createContext, useContext, useState, useEffect } from 'react'
import { getUserData, isAuthenticated } from '../utils/auth'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:19',message:'AuthContext useEffect - checking auth',data:{isAuth:isAuthenticated()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    // Check if user is already logged in
    if (isAuthenticated()) {
      const userData = getUserData()
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:23',message:'User data retrieved',data:{hasUserData:!!userData,userRole:userData?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:28',message:'Login attempt started',data:{hasEmail:!!email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setLoading(true)
    const result = await authService.login(email, password)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:31',message:'Login result received',data:{success:result.success,hasError:!!result.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (result.success) {
      setUser(result.data.user)
    }
    setLoading(false)
    return result
  }

  const register = async (userData) => {
    setLoading(true)
    const result = await authService.register(userData)
    if (result.success) {
      setUser(result.data.user)
    }
    setLoading(false)
    return result
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    // Force a page reload to clear all state
    window.location.href = '/'
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

