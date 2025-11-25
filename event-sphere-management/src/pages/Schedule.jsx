import { useState, useEffect, useMemo } from 'react'
import * as sessionService from '../services/sessionService'
import * as expoService from '../services/expoService'
import * as userService from '../services/userService'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { format } from 'date-fns'
import './Schedule.css'

const Schedule = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [expos, setExpos] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarkError, setBookmarkError] = useState('')
  const [selectedExpo, setSelectedExpo] = useState('')

  useEffect(() => {
    loadExpos()
    loadBookmarks()
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

  const loadBookmarks = async () => {
    try {
      const result = await userService.getBookmarks()
      if (result.success && result.data) {
        // Handle both populated session objects and plain IDs
        const bookmarkIds = result.data.map((item) => {
          // If it's a populated session object, get _id
          if (item && typeof item === 'object' && item._id) {
            return item._id.toString()
          }
          // If it's already an ID (string or ObjectId)
          return item.toString ? item.toString() : String(item)
        })
        setBookmarks(bookmarkIds)
      } else {
        setBookmarks([])
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      setBookmarks([])
    }
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

  const handleToggleBookmark = async (sessionId) => {
    setBookmarkError('')
    const result = await userService.toggleBookmark(sessionId)
    if (result.success) {
      // Update bookmarks list - result.data is array of bookmark IDs
      const bookmarkIds = result.data.map((id) => {
        // Handle both ObjectId objects and strings
        return id.toString ? id.toString() : String(id)
      })
      setBookmarks(bookmarkIds)
      // Reload bookmarks to ensure consistency
      loadBookmarks()
    } else {
      setBookmarkError(result.error || 'Failed to toggle bookmark')
    }
  }

  const isRegistered = (session) =>
    session.registeredAttendees?.some((attendee) => attendee._id === user?._id)

  const isBookmarked = (sessionId) => {
    if (!sessionId) return false
    const sessionIdStr = sessionId.toString()
    return bookmarks.some(bookmarkId => bookmarkId.toString() === sessionIdStr)
  }

  const displayedSessions = useMemo(() => {
    if (showBookmarksOnly) {
      return sessions.filter((session) => isBookmarked(session._id))
    }
    return sessions
  }, [sessions, bookmarks, showBookmarksOnly])

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1>Event Schedule</h1>
        <p className="page-subtitle">Register and bookmark sessions to build your agenda.</p>
      </div>

      {error && <Alert type="error" message={error} />}
      {bookmarkError && <Alert type="error" message={bookmarkError} />}

      <div className="expo-selector">
        <label>Select Expo:</label>
        <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
          {expos.map((expo) => (
            <option key={expo._id} value={expo._id}>
              {expo.title}
            </option>
          ))}
        </select>
        <label className="bookmark-toggle">
          <input
            type="checkbox"
            checked={showBookmarksOnly}
            onChange={() => setShowBookmarksOnly(!showBookmarksOnly)}
          />
          Show bookmarked only
        </label>
      </div>

      <div className="sessions-list">
        {displayedSessions.length === 0 ? (
          <Card>
            <p className="empty-state">No sessions match your criteria.</p>
          </Card>
        ) : (
          displayedSessions.map((session) => (
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
                <div className="session-action-buttons">
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
                  <Button
                    variant={isBookmarked(session._id) ? 'secondary' : 'outline'}
                    size="small"
                    onClick={() => handleToggleBookmark(session._id)}
                  >
                    <i
                      className={`mdi ${
                        isBookmarked(session._id) ? 'mdi-bookmark' : 'mdi-bookmark-outline'
                      }`}
                    ></i>{' '}
                    {isBookmarked(session._id) ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Schedule
