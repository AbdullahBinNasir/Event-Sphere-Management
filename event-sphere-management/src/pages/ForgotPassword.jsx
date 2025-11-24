import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'
import * as authService from '../services/authService'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const result = await authService.forgotPassword(email)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h1>Event Sphere Management</h1>
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Password reset link has been sent to your email. Please check your inbox.
          </div>
        )}
        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <Link to={ROUTES.LOGIN} className="back-to-login">
            Back to Login
          </Link>
        )}
        <div className="login-link">
          Remember your password? <Link to={ROUTES.LOGIN}>Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

