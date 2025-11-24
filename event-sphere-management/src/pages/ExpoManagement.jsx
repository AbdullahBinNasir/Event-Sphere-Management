import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as expoService from '../services/expoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import './ExpoManagement.css'

const ExpoManagement = () => {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingExpo, setEditingExpo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    maxExhibitors: 100,
    registrationDeadline: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadExpos()
  }, [])

  const loadExpos = async () => {
    setLoading(true)
    setError('')
    const result = await expoService.getExpos()
    if (result.success) {
      setExpos(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const expoData = {
      ...formData,
      location: {
        venue: formData.venue,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      },
    }

    delete expoData.venue
    delete expoData.address
    delete expoData.city
    delete expoData.state
    delete expoData.country
    delete expoData.zipCode

    const result = editingExpo
      ? await expoService.updateExpo(editingExpo._id, expoData)
      : await expoService.createExpo(expoData)

    if (result.success) {
      setShowForm(false)
      setEditingExpo(null)
      setFormData({
        title: '',
        description: '',
        theme: '',
        startDate: '',
        endDate: '',
        venue: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        maxExhibitors: 100,
        registrationDeadline: '',
      })
      loadExpos()
    } else {
      setError(result.error)
    }
  }

  const handleEdit = (expo) => {
    setEditingExpo(expo)
    setFormData({
      title: expo.title,
      description: expo.description,
      theme: expo.theme || '',
      startDate: expo.startDate ? format(new Date(expo.startDate), "yyyy-MM-dd'T'HH:mm") : '',
      endDate: expo.endDate ? format(new Date(expo.endDate), "yyyy-MM-dd'T'HH:mm") : '',
      venue: expo.location?.venue || '',
      address: expo.location?.address || '',
      city: expo.location?.city || '',
      state: expo.location?.state || '',
      country: expo.location?.country || '',
      zipCode: expo.location?.zipCode || '',
      maxExhibitors: expo.maxExhibitors || 100,
      registrationDeadline: expo.registrationDeadline
        ? format(new Date(expo.registrationDeadline), "yyyy-MM-dd'T'HH:mm")
        : '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expo?')) {
      const result = await expoService.deleteExpo(id)
      if (result.success) {
        loadExpos()
      } else {
        setError(result.error)
      }
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="expo-management">
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="page-title mb-0">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-calendar-multiple"></i>
            </span> Expo Management
          </h3>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create New Expo'}
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="expo-form-card">
          <h2>{editingExpo ? 'Edit Expo' : 'Create New Expo'}</h2>
          <form onSubmit={handleSubmit} className="expo-form">
            <div className="form-row">
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
                <label>Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max Exhibitors</label>
                <input
                  type="number"
                  name="maxExhibitors"
                  value={formData.maxExhibitors}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Registration Deadline</label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">
                {editingExpo ? 'Update Expo' : 'Create Expo'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="expos-grid">
        {expos.length === 0 ? (
          <Card>
            <p className="empty-state">No expos found. Create your first expo!</p>
          </Card>
        ) : (
          expos.map((expo) => (
            <Card key={expo._id} className="expo-card" hover>
              <div className="expo-card-header">
                <h3>{expo.title}</h3>
                <span className={`status-badge status-${expo.status}`}>
                  {expo.status}
                </span>
              </div>
              {expo.theme && <p className="expo-theme">{expo.theme}</p>}
              <p className="expo-description">{expo.description}</p>
              <div className="expo-details">
                <p>
                  <strong>Date:</strong>{' '}
                  {format(new Date(expo.startDate), 'MMM dd, yyyy')} -{' '}
                  {format(new Date(expo.endDate), 'MMM dd, yyyy')}
                </p>
                <p>
                  <strong>Location:</strong> {expo.location?.venue}, {expo.location?.city}
                </p>
              </div>
              <div className="expo-actions">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate(`/admin/expos/${expo._id}`)}
                >
                  View Details
                </Button>
                <Button variant="outline" size="small" onClick={() => handleEdit(expo)}>
                  Edit
                </Button>
                {expo.status === 'draft' && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={async () => {
                      const result = await expoService.updateExpo(expo._id, { status: 'published' })
                      if (result.success) {
                        loadExpos()
                      } else {
                        setError(result.error)
                      }
                    }}
                  >
                    Publish
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(expo._id)}
                >
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

export default ExpoManagement

