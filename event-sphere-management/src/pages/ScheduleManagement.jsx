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
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="page-title mb-0">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-calendar-clock"></i>
            </span> Schedule Management
          </h3>
          <div className="d-flex align-items-center gap-3">
            <select
              value={selectedExpo}
              onChange={(e) => {
                setSelectedExpo(e.target.value)
                setFormData({ ...formData, expoId: e.target.value })
              }}
              className="form-control"
              style={{ width: 'auto', minWidth: '200px' }}
            >
              <option value="">All Expos</option>
              {expos.map((expo) => (
                <option key={expo._id} value={expo._id}>
                  {expo.title}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Create Session'}
            </Button>
          </div>
        </div>
      </div>

        {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="session-form-card">
          <h2>{editingSession ? 'Edit Session' : 'Create New Session'}</h2>
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

            <h3>Speaker Information</h3>
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
              <Button type="submit" variant="primary">
                {editingSession ? 'Update Session' : 'Create Session'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="sessions-list">
        {sessions.length === 0 ? (
          <Card>
            <p className="empty-state">No sessions found. Create your first session!</p>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} className="session-card" hover>
              <div className="session-header">
                <div>
                  <h3>{session.title}</h3>
                  <p className="session-expo">{session.expoId?.title}</p>
                </div>
                <span className={`type-badge type-${session.type}`}>{session.type}</span>
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
                  <p>
                    <strong>Speaker:</strong> {session.speaker.name}
                    {session.speaker.company && ` (${session.speaker.company})`}
                  </p>
                )}
                <p>
                  <strong>Registered:</strong> {session.registeredAttendees?.length || 0} /{' '}
                  {session.maxAttendees}
                </p>
              </div>
              <div className="session-actions">
                <Button variant="outline" size="small" onClick={() => handleEdit(session)}>
                  Edit
                </Button>
                <Button variant="danger" size="small" onClick={() => handleDelete(session._id)}>
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

