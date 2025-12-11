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
      {/* Hero Section */}
      <header className="home-header">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Event Management Platform</span>
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">Event Sphere</span>
            <br />
            Management
          </h1>
          <p className="hero-subtitle">
            Your Complete Expo and Trade Show Management Solution
          </p>
          <p className="hero-description">
            Streamline your events, connect exhibitors, and create unforgettable experiences
            with our comprehensive event management platform.
          </p>
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <Link to={ROUTES.LOGIN} className="btn-link">
                <Button variant="primary" size="large" className="hero-btn-primary">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER} className="btn-link">
                <Button variant="secondary" size="large" className="hero-btn-secondary">
                  Get Started Free
                </Button>
              </Link>
            </div>
          ) : (
            <div className="welcome-message">
              <p className="welcome-text">
                Welcome back, <span className="welcome-name">{user?.name}</span>!
              </p>
              <Link
                to={
                  user?.role === 'admin' || user?.role === 'organizer'
                    ? ROUTES.ADMIN_DASHBOARD
                    : user?.role === 'exhibitor'
                    ? ROUTES.EXHIBITOR_PORTAL
                    : ROUTES.ATTENDEE_PORTAL
                }
                className="btn-link"
              >
                <Button variant="primary" size="large" className="hero-btn-primary">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Everyone</h2>
            <p className="section-subtitle">
              Everything you need to manage and attend amazing events
            </p>
          </div>
          <div className="features-grid">
            <Card hover className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon icon-organizer">
                  <i className="mdi mdi-calendar-multiple-check"></i>
                </div>
              </div>
              <h3 className="feature-title">For Organizers</h3>
              <p className="feature-description">
                Manage expos, exhibitors, schedules, and analytics all in one place. 
                Complete control over your events with real-time insights.
              </p>
              <ul className="feature-list">
                <li>Event Management</li>
                <li>Analytics Dashboard</li>
                <li>Schedule Planning</li>
              </ul>
            </Card>
            <Card hover className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon icon-exhibitor">
                  <i className="mdi mdi-office-building"></i>
                </div>
              </div>
              <h3 className="feature-title">For Exhibitors</h3>
              <p className="feature-description">
                Register for expos, select booths, and manage your presence. 
                Showcase your business effectively to reach your target audience.
              </p>
              <ul className="feature-list">
                <li>Booth Selection</li>
                <li>Application Management</li>
                <li>Brand Showcase</li>
              </ul>
            </Card>
            <Card hover className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon icon-attendee">
                  <i className="mdi mdi-account-group"></i>
                </div>
              </div>
              <h3 className="feature-title">For Attendees</h3>
              <p className="feature-description">
                Discover events, browse exhibitors, and plan your schedule. 
                Make the most of every event with personalized recommendations.
              </p>
              <ul className="feature-list">
                <li>Event Discovery</li>
                <li>Schedule Planning</li>
                <li>Networking Tools</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Events Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

