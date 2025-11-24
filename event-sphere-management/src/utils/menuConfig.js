import { ROUTES, USER_ROLES } from '../constants'

export const getMenuItems = (userRole) => {
  const baseMenu = [
    {
      title: 'Dashboard',
      path: getDashboardRoute(userRole),
      icon: 'mdi-home',
      exact: true,
    },
  ]

  switch (userRole) {
    case USER_ROLES.ADMIN:
    case USER_ROLES.ORGANIZER:
      return [
        ...baseMenu,
        {
          title: 'Expo Management',
          path: ROUTES.EXPO_MANAGEMENT,
          icon: 'mdi-calendar-multiple',
        },
        {
          title: 'Exhibitor Management',
          path: ROUTES.EXHIBITOR_MANAGEMENT,
          icon: 'mdi-office-building',
        },
        {
          title: 'Schedule Management',
          path: ROUTES.SCHEDULE_MANAGEMENT,
          icon: 'mdi-calendar-clock',
        },
        {
          title: 'Analytics',
          path: ROUTES.ANALYTICS,
          icon: 'mdi-chart-line',
        },
      ]

    case USER_ROLES.EXHIBITOR:
      return [
        ...baseMenu,
        {
          title: 'My Applications',
          path: ROUTES.EXHIBITOR_PORTAL,
          icon: 'mdi-file-document',
        },
        {
          title: 'My Booth',
          path: '/exhibitor/booth',
          icon: 'mdi-store',
        },
      ]

    case USER_ROLES.ATTENDEE:
      return [
        ...baseMenu,
        {
          title: 'Events',
          path: ROUTES.EVENTS,
          icon: 'mdi-calendar-star',
        },
        {
          title: 'Exhibitors',
          path: ROUTES.EXHIBITORS,
          icon: 'mdi-account-group',
        },
        {
          title: 'My Schedule',
          path: ROUTES.SCHEDULE,
          icon: 'mdi-calendar-check',
        },
        {
          title: 'Feedback',
          path: ROUTES.FEEDBACK,
          icon: 'mdi-comment-text',
        },
      ]

    default:
      return baseMenu
  }
}

const getDashboardRoute = (userRole) => {
  switch (userRole) {
    case USER_ROLES.ADMIN:
    case USER_ROLES.ORGANIZER:
      return ROUTES.ADMIN_DASHBOARD
    case USER_ROLES.EXHIBITOR:
      return ROUTES.EXHIBITOR_PORTAL
    case USER_ROLES.ATTENDEE:
      return ROUTES.ATTENDEE_PORTAL
    default:
      return ROUTES.HOME
  }
}

