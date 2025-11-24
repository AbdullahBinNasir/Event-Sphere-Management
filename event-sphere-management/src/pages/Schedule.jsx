import { useState, useEffect } from 'react'
import * as sessionService from '../services/sessionService'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { format } from 'date-fns'
import './Schedule.css'

const Schedule = () => {
  const [sessions, setSessions] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedExpo, setSelectedExpo] = useState('')

  useEffect(() => {
    loadExpos()
  }, [])

  useEffect(() => {
    if (selectedExpo) {
      loadSessions()
    }
  }, [selectedExpo])

  const loadExpos = async () => {
    const result = await expoService.getExpos({ status: 'published' })
    if (result.success) {
      setExpos(result.data)
      if (result.data.length > 0) {
        setSelectedExpo(result.data[0]._id)
      }
    }
  }

  const loadSessions = async () => {
    setLoading(true)
    setError('')
    const result = await sessionService.getSessions({ expoId: selectedExpo })
    if (result.success) {
      setSessions(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleRegister = async (sessionId) => {
    setError('')
    const result = await sessionService.registerForSession(sessionId)
    if (result.success) {
      loadSessions()
    } else {
      setError(result.error)
    }
  }

  const handleUnregister = async (sessionId) => {
    setError('')
    const result = await sessionService.unregisterFromSession(sessionId)
    if (result.success) {
      loadSessions()
    } else {
      setError(result.error)
    }
  }

  const isRegistered = (session) => {
    // This would need to check against current user ID
    // For now, we'll show the button
    return false
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1>Event Schedule</h1>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="expo-selector">
        <label>Select Expo:</label>
        <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
          {expos.map((expo) => (
            <option key={expo._id} value={expo._id}>
              {expo.title}
            </option>
          ))}
        </select>
      </div>

      <div className="sessions-list">
        {sessions.length === 0 ? (
          <Card>
            <p className="empty-state">No sessions scheduled for this expo</p>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} className="session-card">
              <div className="session-header">
                <div>
                  <h3>{session.title}</h3>
                  <span className={`type-badge type-${session.type}`}>{session.type}</span>
                </div>
              </div>
              <div className="session-details">
                <p>
                  <strong>Time:</strong>{' '}
                  {format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')} -{' '}
                  {format(new Date(session.endTime), 'HH:mm')}
                </p>
                <p>
                  <strong>Location:</strong> {session.location}
                </p>
                {session.speaker && (
                  <div className="speaker-info">
                    <strong>Speaker:</strong> {session.speaker.name}
                    {session.speaker.company && ` (${session.speaker.company})`}
                    {session.speaker.bio && <p className="speaker-bio">{session.speaker.bio}</p>}
                  </div>
                )}
                <p>
                  <strong>Registered:</strong> {session.registeredAttendees?.length || 0} /{' '}
                  {session.maxAttendees}
                </p>
                {session.description && (
                  <p className="session-description">{session.description}</p>
                )}
              </div>
              <div className="session-actions">
                {isRegistered(session) ? (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleUnregister(session._id)}
                  >
                    Unregister
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleRegister(session._id)}
                    disabled={
                      (session.registeredAttendees?.length || 0) >= session.maxAttendees
                    }
                  >
                    Register
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Schedule

