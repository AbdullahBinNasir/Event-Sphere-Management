import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserData,
  getUserData,
  getUserRole,
  clearAuthData,
  isAuthenticated,
  hasRole,
  isAdminOrOrganizer,
  isExhibitor,
  isAttendee,
} from '../auth'
import { STORAGE_KEYS, USER_ROLES } from '../../constants'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

global.localStorage = localStorageMock

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Token Management', () => {
    it('should set and get auth token', () => {
      const token = 'test-token-123'
      setAuthToken(token)
      expect(getAuthToken()).toBe(token)
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN, token)
    })

    it('should remove auth token', () => {
      setAuthToken('test-token')
      removeAuthToken()
      expect(getAuthToken()).toBeNull()
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN)
    })
  })

  describe('User Data Management', () => {
    it('should set and get user data', () => {
      const userData = { id: 1, name: 'Test User', role: USER_ROLES.ADMIN }
      setUserData(userData)
      expect(getUserData()).toEqual(userData)
      expect(getUserRole()).toBe(USER_ROLES.ADMIN)
    })

    it('should return null for non-existent user data', () => {
      expect(getUserData()).toBeNull()
    })
  })

  describe('Clear Auth Data', () => {
    it('should clear all auth data', () => {
      setAuthToken('test-token')
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ADMIN })
      clearAuthData()
      expect(getAuthToken()).toBeNull()
      expect(getUserData()).toBeNull()
      expect(getUserRole()).toBeNull()
    })
  })

  describe('Authentication Checks', () => {
    it('should return true when authenticated', () => {
      setAuthToken('test-token')
      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when not authenticated', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should check user role correctly', () => {
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ADMIN })
      expect(hasRole(USER_ROLES.ADMIN)).toBe(true)
      expect(hasRole(USER_ROLES.EXHIBITOR)).toBe(false)
    })

    it('should check if user is admin or organizer', () => {
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ADMIN })
      expect(isAdminOrOrganizer()).toBe(true)
      
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ORGANIZER })
      expect(isAdminOrOrganizer()).toBe(true)
      
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.EXHIBITOR })
      expect(isAdminOrOrganizer()).toBe(false)
    })

    it('should check if user is exhibitor', () => {
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.EXHIBITOR })
      expect(isExhibitor()).toBe(true)
      
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ADMIN })
      expect(isExhibitor()).toBe(false)
    })

    it('should check if user is attendee', () => {
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ATTENDEE })
      expect(isAttendee()).toBe(true)
      
      setUserData({ id: 1, name: 'Test', role: USER_ROLES.ADMIN })
      expect(isAttendee()).toBe(false)
    })
  })
})

