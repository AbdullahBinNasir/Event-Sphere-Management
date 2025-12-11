import { useState, useEffect } from 'react'
import * as exhibitorService from '../services/exhibitorService'
import * as expoService from '../services/expoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { format } from 'date-fns'
import './ExhibitorManagement.css'

const ExhibitorManagement = () => {
  const [applications, setApplications] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedExpo, setSelectedExpo] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    loadExpos()
    loadApplications()
  }, [selectedExpo, selectedStatus])

  const loadExpos = async () => {
    const result = await expoService.getExpos({ status: 'published' })
    if (result.success) {
      setExpos(result.data)
    }
  }

  const loadApplications = async () => {
    setLoading(true)
    setError('')
    const params = {}
    if (selectedExpo) params.expoId = selectedExpo
    if (selectedStatus) params.status = selectedStatus

    const result = await exhibitorService.getApplications(params)
    if (result.success) {
      setApplications(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleApprove = async (id) => {
    const boothNumber = prompt('Enter booth number (optional):')
    const result = await exhibitorService.approveApplication(id, { boothNumber })
    if (result.success) {
      loadApplications()
    } else {
      setError(result.error)
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Application rejected'
    if (reason) {
      const result = await exhibitorService.rejectApplication(id, reason)
      if (result.success) {
        loadApplications()
      } else {
        setError(result.error)
      }
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="exhibitor-management">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <div className="page-title-icon">
              <i className="mdi mdi-office-building"></i>
            </div>
            <div>
              <h1 className="page-title">Exhibitor Management</h1>
              <p className="page-subtitle">Review and manage exhibitor applications</p>
            </div>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="filters-section">
        <div className="filters">
          <div className="filter-group">
            <label>
              <i className="mdi mdi-filter"></i>
              Filter by Expo
            </label>
            <div className="select-wrapper">
              <i className="mdi mdi-calendar-multiple select-icon"></i>
              <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
                <option value="">All Expos</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-group">
            <label>
              <i className="mdi mdi-filter"></i>
              Filter by Status
            </label>
            <div className="select-wrapper">
              <i className="mdi mdi-flag select-icon"></i>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="applications-list">
        {applications.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state">
              <i className="mdi mdi-file-document-remove"></i>
              <h3>No Applications Found</h3>
              <p>No exhibitor applications match your current filters.</p>
            </div>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app._id} className="application-card" hover>
              <div className="application-header">
                <div className="application-title-section">
                  <h3>{app.companyName}</h3>
                  <p className="expo-name">
                    <i className="mdi mdi-calendar-star"></i>
                    {app.expoId?.title}
                  </p>
                </div>
                <span className={`status-badge status-${app.status}`}>
                  {app.status}
                </span>
              </div>
              <div className="application-details">
                <div className="detail-item">
                  <i className="mdi mdi-account"></i>
                  <div>
                    <span className="detail-label">Exhibitor</span>
                    <span className="detail-value">
                      {app.exhibitorId?.name} ({app.exhibitorId?.email})
                    </span>
                  </div>
                </div>
                {app.companyDescription && (
                  <div className="detail-item">
                    <i className="mdi mdi-text"></i>
                    <div>
                      <span className="detail-label">Description</span>
                      <span className="detail-value">{app.companyDescription}</span>
                    </div>
                  </div>
                )}
                {app.boothNumber && (
                  <div className="detail-item">
                    <i className="mdi mdi-store"></i>
                    <div>
                      <span className="detail-label">Booth Number</span>
                      <span className="detail-value">{app.boothNumber}</span>
                    </div>
                  </div>
                )}
                {app.rejectionReason && (
                  <div className="rejection-reason">
                    <i className="mdi mdi-alert-circle"></i>
                    <div>
                      <span className="rejection-label">Rejection Reason</span>
                      <span className="rejection-text">{app.rejectionReason}</span>
                    </div>
                  </div>
                )}
                <div className="application-date">
                  <i className="mdi mdi-clock-outline"></i>
                  Applied: {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="application-actions">
                  <Button 
                    variant="success" 
                    size="small" 
                    onClick={() => handleApprove(app._id)}
                    className="action-button"
                  >
                    <i className="mdi mdi-check-circle"></i>
                    Approve
                  </Button>
                  <Button 
                    variant="danger" 
                    size="small" 
                    onClick={() => handleReject(app._id)}
                    className="action-button"
                  >
                    <i className="mdi mdi-close-circle"></i>
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ExhibitorManagement

