import { useState, useEffect } from 'react'
import * as expoService from '../services/expoService'
import * as exhibitorService from '../services/exhibitorService'
import * as sessionService from '../services/sessionService'
import Card from '../components/Card'
import Loading from '../components/Loading'
import './Analytics.css'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExpos: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalSessions: 0,
    totalRegistrations: 0,
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)

    const [exposResult, applicationsResult, sessionsResult] = await Promise.all([
      expoService.getExpos(),
      exhibitorService.getApplications(),
      sessionService.getSessions(),
    ])

    if (exposResult.success) {
      setStats((prev) => ({ ...prev, totalExpos: exposResult.data.length }))
    }

    if (applicationsResult.success) {
      const apps = applicationsResult.data
      setStats((prev) => ({
        ...prev,
        totalApplications: apps.length,
        pendingApplications: apps.filter((a) => a.status === 'pending').length,
        approvedApplications: apps.filter((a) => a.status === 'approved').length,
      }))
    }

    if (sessionsResult.success) {
      const sessions = sessionsResult.data
      const totalRegistrations = sessions.reduce(
        (sum, s) => sum + (s.registeredAttendees?.length || 0),
        0
      )
      setStats((prev) => ({
        ...prev,
        totalSessions: sessions.length,
        totalRegistrations,
      }))
    }

    setLoading(false)
  }

  if (loading) {
    return <Loading fullScreen />
  }

  const statCards = [
    {
      id: 'expos',
      icon: 'mdi-calendar-multiple-check',
      value: stats.totalExpos,
      label: 'Total Expos',
      gradient: 'gradient-expos',
      iconBg: 'icon-bg-expos',
      trend: null,
    },
    {
      id: 'applications',
      icon: 'mdi-file-document-multiple',
      value: stats.totalApplications,
      label: 'Total Applications',
      gradient: 'gradient-applications',
      iconBg: 'icon-bg-applications',
      trend: null,
    },
    {
      id: 'pending',
      icon: 'mdi-clock-outline',
      value: stats.pendingApplications,
      label: 'Pending Applications',
      gradient: 'gradient-pending',
      iconBg: 'icon-bg-pending',
      trend: null,
    },
    {
      id: 'approved',
      icon: 'mdi-check-circle',
      value: stats.approvedApplications,
      label: 'Approved Applications',
      gradient: 'gradient-approved',
      iconBg: 'icon-bg-approved',
      trend: null,
    },
    {
      id: 'sessions',
      icon: 'mdi-calendar-clock',
      value: stats.totalSessions,
      label: 'Total Sessions',
      gradient: 'gradient-sessions',
      iconBg: 'icon-bg-sessions',
      trend: null,
    },
    {
      id: 'registrations',
      icon: 'mdi-account-group',
      value: stats.totalRegistrations,
      label: 'Session Registrations',
      gradient: 'gradient-registrations',
      iconBg: 'icon-bg-registrations',
      trend: null,
    },
  ]

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <div className="page-title-icon">
              <i className="mdi mdi-chart-line"></i>
            </div>
            <div>
              <h1 className="page-title">Analytics & Reports</h1>
              <p className="page-subtitle">Comprehensive insights into your event management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-content">
        <div className="stats-grid">
          {statCards.map((stat) => (
            <Card key={stat.id} className="stat-card" hover>
              <div className={`stat-icon-wrapper ${stat.iconBg}`}>
                <i className={`mdi ${stat.icon}`}></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value.toLocaleString()}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div className={`stat-gradient-overlay ${stat.gradient}`}></div>
            </Card>
          ))}
        </div>

        <Card className="info-card">
          <div className="info-header">
            <div className="info-icon">
              <i className="mdi mdi-information"></i>
            </div>
            <h2>Analytics Overview</h2>
          </div>
          <p>
            This dashboard provides a comprehensive overview of your event management system. 
            Track your expos, exhibitor applications, sessions, and registrations all in one place. 
            More detailed analytics and reporting features will be available in future updates.
          </p>
          <div className="info-features">
            <div className="feature-item">
              <i className="mdi mdi-chart-bar"></i>
              <span>Real-time Statistics</span>
            </div>
            <div className="feature-item">
              <i className="mdi mdi-trending-up"></i>
              <span>Performance Tracking</span>
            </div>
            <div className="feature-item">
              <i className="mdi mdi-database"></i>
              <span>Data Insights</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics

