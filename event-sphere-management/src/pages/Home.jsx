import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../constants'
import Button from '../components/Button'
import Card from '../components/Card'
import './Home.css'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Event Sphere Management</h1>
        <p>Your Complete Expo and Trade Show Management Solution</p>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="large">
                Sign In
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="secondary" size="large">
                Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="welcome-message">
            <p className="welcome-text">Welcome back, {user?.name}!</p>
            <Link
              to={
                user?.role === 'admin' || user?.role === 'organizer'
                  ? ROUTES.ADMIN_DASHBOARD
                  : user?.role === 'exhibitor'
                  ? ROUTES.EXHIBITOR_PORTAL
                  : ROUTES.ATTENDEE_PORTAL
              }
            >
              <Button variant="primary" size="large">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </header>
      <section className="features-section">
        <h2>Powerful Features for Everyone</h2>
        <p className="section-subtitle">Everything you need to manage and attend amazing events</p>
        <div className="features-grid">
          <Card hover className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>For Organizers</h3>
            <p>Manage expos, exhibitors, schedules, and analytics all in one place. Complete control over your events.</p>
          </Card>
          <Card hover className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>For Exhibitors</h3>
            <p>Register for expos, select booths, and manage your presence. Showcase your business effectively.</p>
          </Card>
          <Card hover className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>For Attendees</h3>
            <p>Discover events, browse exhibitors, and plan your schedule. Make the most of every event.</p>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home

