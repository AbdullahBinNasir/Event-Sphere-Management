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
      <div className="login-card">
        <div className="login-header">
          <h1>Event Sphere</h1>
          <p className="login-subtitle">Management Platform</p>
        </div>
        <h2>Welcome Back</h2>
        <p className="login-description">Sign in to continue to your account</p>
        
        {error && (
          <Alert type="error" message={error} />
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
          <div className="form-actions">
            <Link to={ROUTES.FORGOT_PASSWORD} className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
        <div className="register-link">
          Don't have an account? <Link to={ROUTES.REGISTER}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login

