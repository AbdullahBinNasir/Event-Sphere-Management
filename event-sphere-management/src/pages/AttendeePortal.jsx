import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import * as expoService from '../services/expoService'
import * as sessionService from '../services/sessionService'
import * as userService from '../services/userService'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { format, differenceInMinutes } from 'date-fns'
import './Dashboard.css'
import './AttendeePortal.css'

const AttendeePortal = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [bookmarkedSessions, setBookmarkedSessions] = useState([])
  const [registeredSessions, setRegisteredSessions] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadAttendeeData()
  }, [])

  const loadAttendeeData = async () => {
    setLoading(true)
    setError('')
    const [registrationsResult, bookmarksResult, sessionsResult] = await Promise.all([
      expoService.getMyExpoRegistrations(),
      userService.getBookmarks(),
      sessionService.getSessions({ status: 'scheduled' }),
    ])

    if (registrationsResult.success) {
      setRegistrations(registrationsResult.data)
    } else {
      setError(registrationsResult.error || 'Failed to load registrations')
    }

    if (bookmarksResult.success) {
      setBookmarkedSessions(bookmarksResult.data)
      const upcomingReminders = bookmarksResult.data
        .filter((session) => {
          const start = new Date(session.startTime)
          const minutesUntilStart = differenceInMinutes(start, new Date())
          return minutesUntilStart > 0 && minutesUntilStart <= 120
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 3)
      setReminders(upcomingReminders)
    } else {
      setError((prev) => prev || bookmarksResult.error || 'Failed to load bookmarks')
    }

    if (sessionsResult.success && user?._id) {
      const mySessions = sessionsResult.data
        .filter((session) =>
          session.registeredAttendees?.some((attendee) => attendee._id === user._id)
        )
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 4)
      setRegisteredSessions(mySessions)
    } else if (!sessionsResult.success) {
      setError((prev) => prev || sessionsResult.error || 'Failed to load sessions')
    }

    setLoading(false)
  }

  if (loading) {
    return <Loading fullScreen />
  }

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
        {error && <Alert type="error" message={error} />}

        {reminders.length > 0 && (
          <div className="attendee-section reminders">
            <div className="section-header">
              <h2>Upcoming Reminders</h2>
              <span className="badge">{reminders.length}</span>
            </div>
            <div className="reminders-grid">
              {reminders.map((session) => (
                <Card key={session._id} className="reminder-card">
                  <div>
                    <h3>{session.title}</h3>
                    <p className="reminder-time">
                      Starts {format(new Date(session.startTime), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                  <div className="reminder-actions">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => navigate(ROUTES.SCHEDULE)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {registrations.length > 0 && (
          <div className="attendee-section">
            <div className="section-header">
              <h2>My Registered Events</h2>
              <Button variant="outline" size="small" onClick={() => navigate(ROUTES.EVENTS)}>
                Find More Events
              </Button>
            </div>
            <div className="registrations-grid">
              {registrations.map((registration) => (
                <Card key={registration._id} className="registration-card">
                  <div className="registration-header">
                    <h3>{registration.expoId?.title}</h3>
                    <span className="status-chip status-registered">Registered</span>
                  </div>
                  <p className="registration-date">
                    {registration.expoId?.startDate &&
                      `${format(new Date(registration.expoId.startDate), 'MMM dd')} - ${format(
                        new Date(registration.expoId.endDate),
                        'MMM dd, yyyy'
                      )}`}
                  </p>
                  <p className="registration-location">
                    {registration.expoId?.location?.venue}, {registration.expoId?.location?.city}
                  </p>
                  <div className="registration-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(ROUTES.SCHEDULE)}
                    >
                      View Schedule
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => navigate(ROUTES.EXHIBITORS)}
                    >
                      Meet Exhibitors
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {registeredSessions.length > 0 && (
          <div className="attendee-section">
            <div className="section-header">
              <h2>My Upcoming Sessions</h2>
              <Button variant="outline" size="small" onClick={() => navigate(ROUTES.SCHEDULE)}>
                Manage Schedule
              </Button>
            </div>
            <div className="sessions-grid">
              {registeredSessions.map((session) => (
                <Card key={session._id} className="session-summary-card">
                  <div className="session-summary-header">
                    <h3>{session.title}</h3>
                    <span className={`type-badge type-${session.type}`}>{session.type}</span>
                  </div>
                  <p className="session-time">
                    {format(new Date(session.startTime), 'MMM dd, HH:mm')} -{' '}
                    {format(new Date(session.endTime), 'HH:mm')}
                  </p>
                  <p className="session-location">{session.location}</p>
                  {session.speaker?.name && <p className="session-speaker">{session.speaker.name}</p>}
                </Card>
              ))}
            </div>
          </div>
        )}

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

