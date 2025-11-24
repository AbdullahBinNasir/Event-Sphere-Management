import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES, USER_ROLES } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.ATTENDEE,
    companyName: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    // Prepare registration data
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    }

    // Add company name for exhibitors
    if (formData.role === USER_ROLES.EXHIBITOR) {
      if (!formData.companyName) {
        setError('Company name is required for exhibitors')
        setLoading(false)
        return
      }
      registrationData.companyName = formData.companyName
    }

    const result = await register(registrationData)

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
      setError(result.error || 'Registration failed. Please try again.')
      console.error('Registration error:', result.error)
    }
    setLoading(false)
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Event Sphere</h1>
          <p className="register-subtitle">Create Your Account</p>
        </div>
        <h2>Get Started</h2>
        <p className="register-description">Join us to manage and attend amazing events</p>
        
        {error && (
          <Alert type="error" message={error} />
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
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
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          <div className="input-group">
            <label htmlFor="role" className="input-label">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value={USER_ROLES.ATTENDEE}>Attendee</option>
              <option value={USER_ROLES.EXHIBITOR}>Exhibitor</option>
            </select>
          </div>
          {formData.role === USER_ROLES.EXHIBITOR && (
            <Input
              label="Company Name"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter your company name"
            />
          )}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password (min 6 characters)"
            minLength={6}
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <div className="login-link">
          Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register

