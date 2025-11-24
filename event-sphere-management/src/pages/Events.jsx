import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import './Events.css'

const Events = () => {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadExpos()
  }, [])

  const loadExpos = async () => {
    setLoading(true)
    const result = await expoService.getExpos({ status: 'published' })
    if (result.success) {
      setExpos(result.data)
    }
    setLoading(false)
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Browse Events</h1>
      </div>

      <div className="events-grid">
        {expos.length === 0 ? (
          <Card>
            <p className="empty-state">No events available at the moment</p>
          </Card>
        ) : (
          expos.map((expo) => (
            <Card key={expo._id} className="event-card" hover>
              <h3>{expo.title}</h3>
              {expo.theme && <p className="event-theme">{expo.theme}</p>}
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
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(`/events/${expo._id}`)}
              >
                View Details
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Events

