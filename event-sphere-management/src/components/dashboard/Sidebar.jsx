import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Sidebar.scss'

const Sidebar = ({ menuItems, currentPath, user }) => {
  const [activeMenu, setActiveMenu] = useState(null)

  const isPathActive = (path) => {
    if (path === '/admin' || path === '/exhibitor' || path === '/attendee') {
      return currentPath === path
    }
    return currentPath.startsWith(path)
  }

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index)
  }

  useEffect(() => {
    // Close sidebar on mobile when route changes
    const sidebar = document.querySelector('#sidebar')
    if (sidebar) {
      sidebar.classList.remove('active')
    }
  }, [currentPath])

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#!" className="nav-link" onClick={(e) => e.preventDefault()}>
            <div className="nav-profile-image">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">{user?.name || 'User'}</span>
              <span className="text-secondary text-small">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              </span>
            </div>
          </a>
        </li>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={isPathActive(item.path) ? 'nav-item active' : 'nav-item'}
          >
            <Link className="nav-link" to={item.path}>
              <i className={`mdi ${item.icon} menu-icon`}></i>
              <span className="menu-title">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar

