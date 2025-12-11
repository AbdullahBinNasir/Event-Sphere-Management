import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES, USER_ROLES } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      // Redirect based on user role
      const userRole = result.data.user.role
      if (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.ORGANIZER) {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else if (userRole === USER_ROLES.EXHIBITOR) {
        navigate(ROUTES.EXHIBITOR_PORTAL)
      } else {
        navigate(ROUTES.ATTENDEE_PORTAL)
      }
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-decoration circle-1"></div>
        <div className="bg-decoration circle-2"></div>
        <div className="bg-decoration circle-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <i className="mdi mdi-calendar-star"></i>
            </div>
          </div>
          <h1 className="login-title">
            <span className="gradient-text">Event Sphere</span>
          </h1>
          <p className="login-subtitle">Management Platform</p>
        </div>

        <div className="login-content">
          <h2 className="welcome-title">Welcome Back</h2>
          <p className="login-description">Sign in to continue to your account</p>
          
          {error && (
            <Alert type="error" message={error} />
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <label htmlFor="email" className="input-label">
                <i className="mdi mdi-email-outline"></i>
                Email Address
              </label>
              <div className="input-container">
                <i className="mdi mdi-email input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="modern-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-wrapper">
              <label htmlFor="password" className="input-label">
                <i className="mdi mdi-lock-outline"></i>
                Password
              </label>
              <div className="input-container">
                <i className="mdi mdi-lock input-icon"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="modern-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to={ROUTES.FORGOT_PASSWORD} className="forgot-password-link">
                <i className="mdi mdi-help-circle-outline"></i>
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <i className="mdi mdi-loading mdi-spin"></i>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="mdi mdi-login"></i>
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="register-link">
            <span>Don't have an account?</span>
            <Link to={ROUTES.REGISTER} className="register-link-text">
              <i className="mdi mdi-account-plus"></i>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

