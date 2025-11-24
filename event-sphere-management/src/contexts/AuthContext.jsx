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
    // Check if user is already logged in
    if (isAuthenticated()) {
      const userData = getUserData()
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    const result = await authService.login(email, password)
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

