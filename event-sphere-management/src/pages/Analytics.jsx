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

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-chart-line"></i>
          </span> Analytics & Reports
        </h3>
      </div>
      <div className="analytics">

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.totalExpos}</div>
          <div className="stat-label">Total Expos</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingApplications}</div>
          <div className="stat-label">Pending Applications</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.approvedApplications}</div>
          <div className="stat-label">Approved Applications</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.totalSessions}</div>
          <div className="stat-label">Total Sessions</div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalRegistrations}</div>
          <div className="stat-label">Session Registrations</div>
        </Card>
      </div>

      <Card className="info-card">
        <h2>Analytics Overview</h2>
        <p>
          This dashboard provides an overview of your event management system. More detailed
          analytics and reporting features will be available in future updates.
        </p>
      </Card>
      </div>
    </div>
  )
}

export default Analytics

