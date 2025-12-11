import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import Card from '../components/Card'
import Button from '../components/Button'
import './Dashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const dashboardCards = [
    {
      id: 'expo',
      icon: 'mdi-calendar-multiple-check',
      title: 'Expo Management',
      description: 'Create, edit, and manage expo events with ease. Full control over your event lifecycle.',
      route: ROUTES.EXPO_MANAGEMENT,
      buttonText: 'Manage Expos',
      gradient: 'gradient-expo',
      iconBg: 'icon-bg-expo'
    },
    {
      id: 'exhibitor',
      icon: 'mdi-office-building',
      title: 'Exhibitor Management',
      description: 'View and manage exhibitor applications efficiently. Approve, reject, and assign booths.',
      route: ROUTES.EXHIBITOR_MANAGEMENT,
      buttonText: 'Manage Exhibitors',
      gradient: 'gradient-exhibitor',
      iconBg: 'icon-bg-exhibitor'
    },
    {
      id: 'schedule',
      icon: 'mdi-calendar-clock',
      title: 'Schedule Management',
      description: 'Create and manage event schedules seamlessly. Organize sessions and activities.',
      route: ROUTES.SCHEDULE_MANAGEMENT,
      buttonText: 'Manage Schedules',
      gradient: 'gradient-schedule',
      iconBg: 'icon-bg-schedule'
    },
    {
      id: 'analytics',
      icon: 'mdi-chart-line',
      title: 'Analytics',
      description: 'View comprehensive reports and analytics insights. Track performance and engagement.',
      route: ROUTES.ANALYTICS,
      buttonText: 'View Analytics',
      gradient: 'gradient-analytics',
      iconBg: 'icon-bg-analytics'
    }
  ]

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <div className="page-title-icon">
              <i className="mdi mdi-view-dashboard"></i>
            </div>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Manage your events, exhibitors, and analytics</p>
            </div>
          </div>
        </div>
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="mdi mdi-home"></i>
              <span>Dashboard</span>
            </li>
            <li className="breadcrumb-separator">
              <i className="mdi mdi-chevron-right"></i>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Overview
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {dashboardCards.map((card) => (
            <Card key={card.id} hover className="dashboard-card">
              <div className="card-content">
                <div className={`card-icon-wrapper ${card.iconBg}`}>
                  <div className="card-icon">
                    <i className={`mdi ${card.icon}`}></i>
                  </div>
                </div>
                <h2 className="card-title">{card.title}</h2>
                <p className="card-description">{card.description}</p>
                <Button
                  variant="primary"
                  onClick={() => navigate(card.route)}
                  fullWidth
                  className="card-button"
                >
                  <i className="mdi mdi-arrow-right"></i>
                  {card.buttonText}
                </Button>
              </div>
              <div className={`card-gradient-overlay ${card.gradient}`}></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

