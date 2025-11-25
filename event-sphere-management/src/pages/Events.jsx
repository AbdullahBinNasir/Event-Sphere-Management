import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { ROUTES } from '../constants'
import { format } from 'date-fns'
import './Events.css'

const Events = () => {
  const [expos, setExpos] = useState([])
  const [registrations, setRegistrations] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionExpoId, setActionExpoId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    const [exposResult, registrationsResult] = await Promise.all([
      expoService.getExpos({ status: 'published' }),
      expoService.getMyExpoRegistrations(),
    ])

    if (exposResult.success) {
      setExpos(exposResult.data)
    }

    if (registrationsResult.success) {
      const map = {}
      registrationsResult.data.forEach((registration) => {
        const expoId = registration.expoId?._id?.toString() || registration.expoId
        map[expoId] = registration
      })
      setRegistrations(map)
    } else if (!exposResult.success) {
      setError(registrationsResult.error || 'Failed to load registrations')
    }

    setLoading(false)
  }

  const isRegistered = (expoId) => Boolean(registrations[expoId])

  const handleToggleRegistration = async (expoId) => {
    setError('')
    setActionExpoId(expoId)
    const action = isRegistered(expoId)
      ? expoService.unregisterFromExpo
      : expoService.registerForExpo

    const result = await action(expoId)
    setActionExpoId(null)

    if (result.success) {
      await loadData()
    } else {
      setError(result.error)
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1>Browse Events</h1>
          <p className="page-subtitle">Register for upcoming expos and manage your schedule.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="events-grid">
        {expos.length === 0 ? (
          <Card>
            <p className="empty-state">No events available at the moment</p>
          </Card>
        ) : (
          expos.map((expo) => {
            const registered = isRegistered(expo._id)
            return (
              <Card key={expo._id} className="event-card" hover>
                <div className="event-card-header">
                  <div>
                    <h3>{expo.title}</h3>
                    {expo.theme && <p className="event-theme">{expo.theme}</p>}
                  </div>
                  <span className={`status-chip status-${expo.status}`}>{expo.status}</span>
                </div>
                <p className="event-description">{expo.description}</p>
                <div className="event-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {format(new Date(expo.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(expo.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p>
                    <strong>Location:</strong> {expo.location?.venue}, {expo.location?.city}
                  </p>
                </div>
                <div className="event-actions">
                  <Button
                    variant={registered ? 'secondary' : 'primary'}
                    fullWidth
                    onClick={() => handleToggleRegistration(expo._id)}
                    disabled={actionExpoId === expo._id}
                  >
                    {registered ? 'Registered' : 'Register'}
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(ROUTES.SCHEDULE)}
                  >
                    View Schedule
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Events

