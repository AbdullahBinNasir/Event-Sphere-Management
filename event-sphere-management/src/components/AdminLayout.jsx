import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import Button from './Button'
import './AdminLayout.css'

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    // Navigation will be handled by the logout function in AuthContext
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>{title}</h1>
        </div>
        <div className="admin-header-right">
          <span className="welcome-text">Welcome, {user?.name}</span>
          <Button variant="outline" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <div className="admin-content">{children}</div>
    </div>
  )
}

export default AdminLayout

