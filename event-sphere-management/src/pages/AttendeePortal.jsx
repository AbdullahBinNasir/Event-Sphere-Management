import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import Card from '../components/Card'
import Button from '../components/Button'
import './Dashboard.css'

const AttendeePortal = () => {
  const navigate = useNavigate()

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-account-group"></i>
          </span> Attendee Portal
        </h3>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <Card hover className="dashboard-card">
            <div className="card-icon">🎯</div>
            <h2>Browse Events</h2>
            <p>Discover upcoming expos and events</p>
            <Button variant="primary" onClick={() => navigate(ROUTES.EVENTS)} fullWidth>
              Browse Events
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">🏢</div>
            <h2>Exhibitors</h2>
            <p>Search and explore exhibitors</p>
            <Button variant="primary" onClick={() => navigate(ROUTES.EXHIBITORS)} fullWidth>
              Search Exhibitors
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">📅</div>
            <h2>My Schedule</h2>
            <p>View and manage your event schedule</p>
            <Button variant="primary" onClick={() => navigate(ROUTES.SCHEDULE)} fullWidth>
              View Schedule
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">💬</div>
            <h2>Feedback</h2>
            <p>Submit feedback and get support</p>
            <Button variant="primary" onClick={() => navigate(ROUTES.FEEDBACK)} fullWidth>
              Submit Feedback
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AttendeePortal

