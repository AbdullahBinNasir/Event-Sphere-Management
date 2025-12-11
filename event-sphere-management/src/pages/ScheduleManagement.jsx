import { useState, useEffect } from 'react'
import * as sessionService from '../services/sessionService'
import * as expoService from '../services/expoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import './ScheduleManagement.css'

const ScheduleManagement = () => {
  const [sessions, setSessions] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [selectedExpo, setSelectedExpo] = useState('')
  const [formData, setFormData] = useState({
    expoId: '',
    title: '',
    description: '',
    type: 'workshop',
    startTime: '',
    endTime: '',
    location: '',
    speaker: {
      name: '',
      bio: '',
      email: '',
      company: '',
      title: '',
    },
    maxAttendees: 50,
  })

  useEffect(() => {
    loadExpos()
    loadSessions()
  }, [selectedExpo])

  const loadExpos = async () => {
    const result = await expoService.getExpos({ status: 'published' })
    if (result.success) {
      setExpos(result.data)
    }
  }

  const loadSessions = async () => {
    setLoading(true)
    setError('')
    const params = {}
    if (selectedExpo) params.expoId = selectedExpo

    const result = await sessionService.getSessions(params)
    if (result.success) {
      setSessions(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('speaker.')) {
      const speakerField = name.split('.')[1]
      setFormData({
        ...formData,
        speaker: {
          ...formData.speaker,
          [speakerField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = editingSession
      ? await sessionService.updateSession(editingSession._id, formData)
      : await sessionService.createSession(formData)

    if (result.success) {
      setShowForm(false)
      setEditingSession(null)
      resetForm()
      loadSessions()
    } else {
      setError(result.error)
    }
  }

  const resetForm = () => {
    setFormData({
      expoId: selectedExpo || '',
      title: '',
      description: '',
      type: 'workshop',
      startTime: '',
      endTime: '',
      location: '',
      speaker: {
        name: '',
        bio: '',
        email: '',
        company: '',
        title: '',
      },
      maxAttendees: 50,
    })
  }

  const handleEdit = (session) => {
    setEditingSession(session)
    setFormData({
      expoId: session.expoId._id || session.expoId,
      title: session.title,
      description: session.description || '',
      type: session.type,
      startTime: session.startTime
        ? format(new Date(session.startTime), "yyyy-MM-dd'T'HH:mm")
        : '',
      endTime: session.endTime
        ? format(new Date(session.endTime), "yyyy-MM-dd'T'HH:mm")
        : '',
      location: session.location,
      speaker: session.speaker || {
        name: '',
        bio: '',
        email: '',
        company: '',
        title: '',
      },
      maxAttendees: session.maxAttendees || 50,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      const result = await sessionService.deleteSession(id)
      if (result.success) {
        loadSessions()
      } else {
        setError(result.error)
      }
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="schedule-management">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <div className="page-title-icon">
              <i className="mdi mdi-calendar-clock"></i>
            </div>
            <div>
              <h1 className="page-title">Schedule Management</h1>
              <p className="page-subtitle">Create and manage event sessions</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="select-wrapper">
              <i className="mdi mdi-calendar-multiple select-icon"></i>
              <select
                value={selectedExpo}
                onChange={(e) => {
                  setSelectedExpo(e.target.value)
                  setFormData({ ...formData, expoId: e.target.value })
                }}
                className="expo-select"
              >
                <option value="">All Expos</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "secondary" : "primary"}
              className="create-button"
            >
              <i className={`mdi ${showForm ? 'mdi-close' : 'mdi-plus'}`}></i>
              {showForm ? 'Cancel' : 'Create Session'}
            </Button>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="session-form-card">
          <div className="form-header">
            <h2>
              <i className="mdi mdi-calendar-edit"></i>
              {editingSession ? 'Edit Session' : 'Create New Session'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="session-form">
            <div className="form-row">
              <div className="form-group">
                <label>Expo *</label>
                <select
                  name="expoId"
                  value={formData.expoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Expo</option>
                  {expos.map((expo) => (
                    <option key={expo._id} value={expo._id}>
                      {expo.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="keynote">Keynote</option>
                  <option value="workshop">Workshop</option>
                  <option value="panel">Panel</option>
                  <option value="networking">Networking</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Attendees</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-section-header">
              <h3>
                <i className="mdi mdi-account"></i>
                Speaker Information
              </h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Speaker Name *</label>
                <input
                  type="text"
                  name="speaker.name"
                  value={formData.speaker.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Speaker Title</label>
                <input
                  type="text"
                  name="speaker.title"
                  value={formData.speaker.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="speaker.company"
                  value={formData.speaker.company}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="speaker.email"
                  value={formData.speaker.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="speaker.bio"
                value={formData.speaker.bio}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" className="submit-button">
                <i className={`mdi ${editingSession ? 'mdi-content-save' : 'mdi-plus-circle'}`}></i>
                {editingSession ? 'Update Session' : 'Create Session'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="sessions-list">
        {sessions.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state">
              <i className="mdi mdi-calendar-remove"></i>
              <h3>No Sessions Found</h3>
              <p>Create your first session to get started!</p>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <i className="mdi mdi-plus"></i>
                Create Your First Session
              </Button>
            </div>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} className="session-card" hover>
              <div className="session-header">
                <div className="session-title-section">
                  <h3>{session.title}</h3>
                  <p className="session-expo">
                    <i className="mdi mdi-calendar-star"></i>
                    {session.expoId?.title}
                  </p>
                </div>
                <span className={`type-badge type-${session.type}`}>
                  {session.type}
                </span>
              </div>
              {session.description && (
                <p className="session-description">{session.description}</p>
              )}
              <div className="session-details">
                <div className="detail-item">
                  <i className="mdi mdi-clock-outline"></i>
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-value">
                      {format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')} -{' '}
                      {format(new Date(session.endTime), 'HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="mdi mdi-map-marker"></i>
                  <div>
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{session.location}</span>
                  </div>
                </div>
                {session.speaker && (
                  <div className="detail-item">
                    <i className="mdi mdi-account"></i>
                    <div>
                      <span className="detail-label">Speaker</span>
                      <span className="detail-value">
                        {session.speaker.name}
                        {session.speaker.company && ` (${session.speaker.company})`}
                      </span>
                    </div>
                  </div>
                )}
                <div className="detail-item">
                  <i className="mdi mdi-account-group"></i>
                  <div>
                    <span className="detail-label">Registered</span>
                    <span className="detail-value">
                      {session.registeredAttendees?.length || 0} / {session.maxAttendees}
                    </span>
                  </div>
                </div>
              </div>
              <div className="session-actions">
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={() => handleEdit(session)}
                  className="action-button"
                >
                  <i className="mdi mdi-pencil"></i>
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="small" 
                  onClick={() => handleDelete(session._id)}
                  className="action-button"
                >
                  <i className="mdi mdi-delete"></i>
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ScheduleManagement

