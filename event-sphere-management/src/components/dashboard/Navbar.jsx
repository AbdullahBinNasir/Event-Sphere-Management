import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES, USER_ROLES } from '../../constants'
import NotificationDropdown from '../NotificationDropdown'
import './Navbar.scss'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return ROUTES.HOME
    switch (user.role) {
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

  const handleLogout = () => {
    setIsProfileOpen(false)
    logout()
    // logout() already redirects, so navigate is not needed
  }

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas')?.classList.toggle('active')
  }

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-icon-only')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand-wrapper">
        <Link to={getDashboardRoute()} className="navbar-brand">
          EventSphere
        </Link>
        <Link to={getDashboardRoute()} className="navbar-brand-mini">
          ES
        </Link>
      </div>

      <div className="navbar-menu-wrapper">
        <button
          className="navbar-toggler align-self-center"
          type="button"
          onClick={toggleSidebar}
        >
          <i className="mdi mdi-menu"></i>
        </button>

        <ul className="navbar-nav">
          <li className="nav-item">
            <NotificationDropdown />
          </li>
          <li className={`nav-item dropdown ${isProfileOpen ? 'show' : ''}`} ref={dropdownRef}>
            <button
              className="nav-link"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div className="profile-avatar-small">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="profile-name">{user?.name || 'User'}</span>
              <i className="mdi mdi-chevron-down"></i>
            </button>

            {isProfileOpen && (
              <div className="dropdown-menu">
                <Link 
                  to={ROUTES.PROFILE} 
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="mdi mdi-account"></i> Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  <i className="mdi mdi-logout"></i> Logout
                </button>
              </div>
            )}
          </li>
        </ul>

        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
