import { useState, useEffect } from 'react'
import * as feedbackService from '../services/feedbackService'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import './Feedback.css'

const Feedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
  })

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    setLoading(true)
    setError('')
    const result = await feedbackService.getMyFeedback()
    if (result.success) {
      setFeedback(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await feedbackService.createFeedback(formData)
    if (result.success) {
      setShowForm(false)
      setFormData({
        type: 'suggestion',
        subject: '',
        message: '',
      })
      loadFeedback()
    } else {
      setError(result.error)
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="feedback-page">
      <div className="page-header">
        <h1>Feedback & Support</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Submit Feedback'}
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="feedback-form-card">
          <h2>Submit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="complaint">Complaint</option>
                <option value="compliment">Compliment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Brief subject line"
              />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows="6"
                placeholder="Describe your feedback in detail..."
              />
            </div>
            <Button type="submit" variant="primary">
              Submit Feedback
            </Button>
          </form>
        </Card>
      )}

      <div className="feedback-list">
        {feedback.length === 0 ? (
          <Card>
            <p className="empty-state">No feedback submitted yet</p>
          </Card>
        ) : (
          feedback.map((item) => (
            <Card key={item._id} className="feedback-card">
              <div className="feedback-header">
                <div>
                  <h3>{item.subject}</h3>
                  <span className={`type-badge type-${item.type}`}>{item.type}</span>
                </div>
                <span className={`status-badge status-${item.status}`}>{item.status}</span>
              </div>
              <p className="feedback-message">{item.message}</p>
              {item.response && (
                <div className="feedback-response">
                  <strong>Response:</strong>
                  <p>{item.response}</p>
                </div>
              )}
              <p className="feedback-date">
                Submitted: {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Feedback

