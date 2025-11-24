// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  EXHIBITOR: 'exhibitor',
  ATTENDEE: 'attendee',
}

// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN_DASHBOARD: '/admin',
  EXHIBITOR_PORTAL: '/exhibitor',
  ATTENDEE_PORTAL: '/attendee',
  EXPO_MANAGEMENT: '/admin/expos',
  EXHIBITOR_MANAGEMENT: '/admin/exhibitors',
  SCHEDULE_MANAGEMENT: '/admin/schedules',
  ANALYTICS: '/admin/analytics',
  PROFILE: '/profile',
  EVENTS: '/events',
  EXHIBITORS: '/exhibitors',
  SCHEDULE: '/schedule',
  FEEDBACK: '/feedback',
  ADMIN_FEEDBACK: '/admin/feedback',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
}

// Expo Status
export const EXPO_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Exhibitor Application Status
export const EXHIBITOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// Session Types
export const SESSION_TYPES = {
  KEYNOTE: 'keynote',
  WORKSHOP: 'workshop',
  PANEL: 'panel',
  NETWORKING: 'networking',
}

