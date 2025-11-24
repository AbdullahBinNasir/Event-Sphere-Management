import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import Card from '../components/Card'
import Button from '../components/Button'
import './Dashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span> Admin Dashboard
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview
            </li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <Card hover className="dashboard-card">
            <div className="card-icon">🎯</div>
            <h2>Expo Management</h2>
            <p>Create, edit, and manage expo events</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.EXPO_MANAGEMENT)}
              fullWidth
            >
              Manage Expos
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">🏢</div>
            <h2>Exhibitor Management</h2>
            <p>View and manage exhibitor applications</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.EXHIBITOR_MANAGEMENT)}
              fullWidth
            >
              Manage Exhibitors
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">📅</div>
            <h2>Schedule Management</h2>
            <p>Create and manage event schedules</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.SCHEDULE_MANAGEMENT)}
              fullWidth
            >
              Manage Schedules
            </Button>
          </Card>
          <Card hover className="dashboard-card">
            <div className="card-icon">📊</div>
            <h2>Analytics</h2>
            <p>View reports and analytics</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.ANALYTICS)}
              fullWidth
            >
              View Analytics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

