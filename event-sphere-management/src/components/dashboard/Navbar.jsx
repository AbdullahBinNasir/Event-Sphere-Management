import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../constants'
import './Navbar.scss'

const Navbar = ({ user }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas')?.classList.toggle('active')
  }

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-icon-only')
  }

  const toggleRightSidebar = () => {
    document.querySelector('.right-sidebar')?.classList.toggle('open')
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to={ROUTES.HOME}>
          EventSphere
        </Link>
        <Link className="navbar-brand brand-logo-mini" to={ROUTES.HOME}>
          ES
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={toggleSidebar}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search..."
              />
            </div>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile">
            <Dropdown align="end">
              <Dropdown.Toggle 
                className="nav-link" 
                as="button"
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div className="nav-profile-img">
                  <div className="profile-avatar-small">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">{user?.name || 'User'}</p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown">
                <Dropdown.Item as="button" onClick={(e) => e.preventDefault()}>
                  <i className="mdi mdi-account mr-2 text-success"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={handleLogout}>
                  <i className="mdi mdi-logout mr-2 text-primary"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item nav-settings d-none d-lg-block">
            <button
              type="button"
              className="nav-link border-0"
              onClick={toggleRightSidebar}
            >
              <i className="mdi mdi-format-line-spacing"></i>
            </button>
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

