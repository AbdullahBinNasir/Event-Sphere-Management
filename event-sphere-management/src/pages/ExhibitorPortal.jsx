import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import * as exhibitorService from '../services/exhibitorService'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { format } from 'date-fns'
import './Dashboard.css'
import './ExhibitorPortal.css'

const ExhibitorPortal = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [formData, setFormData] = useState({
    expoId: '',
    companyName: '',
    companyDescription: '',
    products: '',
    services: '',
    website: '',
  })

  // Update formData when user data is available
  useEffect(() => {
    if (user?.companyName) {
      setFormData(prev => ({ ...prev, companyName: user.companyName }))
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    const [appsResult, exposResult] = await Promise.all([
      exhibitorService.getMyApplications(),
      expoService.getExpos({ status: 'published' }),
    ])

    if (appsResult.success) {
      setApplications(appsResult.data)
    } else {
      console.error('Failed to load applications:', appsResult.error)
    }
    
    if (exposResult.success) {
      setExpos(exposResult.data)
      if (exposResult.data.length === 0) {
        // Try to get all expos (not just published) to show if any exist
        const allExposResult = await expoService.getExpos()
        if (allExposResult.success && allExposResult.data.length > 0) {
          setError('No published expos available. Please contact the organizer.')
        }
      }
    } else {
      setError(exposResult.error || 'Failed to load expos')
    }
    
    setLoading(false)
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    setError('')

    const applicationData = {
      ...formData,
      products: formData.products.split(',').map((p) => p.trim()).filter(Boolean),
      services: formData.services.split(',').map((s) => s.trim()).filter(Boolean),
    }

    const result = await exhibitorService.createApplication(applicationData)
    if (result.success) {
      setShowApplicationForm(false)
      setFormData({
        expoId: '',
        companyName: user?.companyName || '',
        companyDescription: '',
        products: '',
        services: '',
        website: '',
      })
      loadData()
    } else {
      setError(result.error)
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-office-building"></i>
          </span> Exhibitor Portal
        </h3>
      </div>
      <div className="dashboard-content">
        {error && <Alert type="error" message={error} />}

        {/* Available Expos Section */}
        <div className="exhibitor-section">
          <div className="section-header">
            <h2>Available Expos</h2>
          </div>
          <p className="info-message">
            💡 <strong>Note:</strong> Only <strong>published</strong> expos are visible here. 
            If you don't see an expo, it may still be in draft status. Contact the organizer to publish it.
          </p>
          <div className="expos-grid">
            {expos.length === 0 ? (
              <Card>
                <p className="empty-state">No expos available at the moment</p>
              </Card>
            ) : (
              expos.map((expo) => {
                const hasApplied = applications.some(
                  (app) => app.expoId?._id === expo._id || app.expoId === expo._id
                )
                return (
                  <Card key={expo._id} className="expo-card" hover>
                    <h3>{expo.title}</h3>
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
                    {hasApplied ? (
                      <div className="expo-status">
                        <span className="applied-badge">Already Applied</span>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => {
                          setFormData({ ...formData, expoId: expo._id })
                          setShowApplicationForm(true)
                        }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* My Applications Section */}
        <div className="exhibitor-section">
          <div className="section-header">
            <h2>My Applications</h2>
            <Button onClick={() => setShowApplicationForm(!showApplicationForm)}>
              {showApplicationForm ? 'Cancel' : '+ Apply for Expo'}
            </Button>
          </div>

          {showApplicationForm && (
            <Card className="application-form-card">
              <h3>Apply for Expo</h3>
              <form onSubmit={handleSubmitApplication}>
                <div className="form-group">
                  <label>Select Expo *</label>
                  <select
                    value={formData.expoId}
                    onChange={(e) => setFormData({ ...formData, expoId: e.target.value })}
                    required
                  >
                    <option value="">Select an expo</option>
                    {expos.map((expo) => (
                      <option key={expo._id} value={expo._id}>
                        {expo.title} - {format(new Date(expo.startDate), 'MMM dd, yyyy')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="form-group">
                  <label>Company Description</label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, companyDescription: e.target.value })
                    }
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Products (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                    placeholder="Product 1, Product 2, ..."
                  />
                </div>
                <div className="form-group">
                  <label>Services (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder="Service 1, Service 2, ..."
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="primary">
                  Submit Application
                </Button>
              </form>
            </Card>
          )}

          <div className="applications-list">
            {applications.length === 0 ? (
              <Card>
                <p className="empty-state">No applications yet. Apply for an expo to get started!</p>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app._id} className="application-card">
                  <div className="application-header">
                    <h3>{app.expoId?.title}</h3>
                    <span className={`status-badge status-${app.status}`}>{app.status}</span>
                  </div>
                  {app.boothNumber && <p>Booth: {app.boothNumber}</p>}
                  <p>Applied: {format(new Date(app.createdAt), 'MMM dd, yyyy')}</p>
                  {app.rejectionReason && (
                    <p className="rejection-reason">Reason: {app.rejectionReason}</p>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExhibitorPortal

