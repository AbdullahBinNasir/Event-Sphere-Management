import { STORAGE_KEYS, USER_ROLES } from '../constants'

/**
 * Store authentication token
 */
export const setAuthToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Store user data
 */
export const setUserData = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, userData.role)
}

/**
 * Get user data
 */
export const getUserData = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
  return userData ? JSON.parse(userData) : null
}

/**
 * Get user role
 */
export const getUserRole = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE)
}

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE)
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken()
}

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  return getUserRole() === role
}

/**
 * Check if user is admin or organizer
 */
export const isAdminOrOrganizer = () => {
  const role = getUserRole()
  return role === USER_ROLES.ADMIN || role === USER_ROLES.ORGANIZER
}

/**
 * Check if user is exhibitor
 */
export const isExhibitor = () => {
  return getUserRole() === USER_ROLES.EXHIBITOR
}

/**
 * Check if user is attendee
 */
export const isAttendee = () => {
  return getUserRole() === USER_ROLES.ATTENDEE
}

