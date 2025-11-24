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
    const result = await exhibitorService.rejectApplication(id, reason)
    if (result.success) {
      loadApplications()
    } else {
      setError(result.error)
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="exhibitor-management">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-office-building"></i>
          </span> Exhibitor Management
        </h3>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Expo:</label>
          <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
            <option value="">All Expos</option>
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        {applications.length === 0 ? (
          <Card>
            <p className="empty-state">No applications found</p>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app._id} className="application-card">
              <div className="application-header">
                <div>
                  <h3>{app.companyName}</h3>
                  <p className="expo-name">{app.expoId?.title}</p>
                </div>
                <span className={`status-badge status-${app.status}`}>
                  {app.status}
                </span>
              </div>
              <div className="application-details">
                <p>
                  <strong>Exhibitor:</strong> {app.exhibitorId?.name} ({app.exhibitorId?.email})
                </p>
                {app.companyDescription && (
                  <p>
                    <strong>Description:</strong> {app.companyDescription}
                  </p>
                )}
                {app.boothNumber && (
                  <p>
                    <strong>Booth Number:</strong> {app.boothNumber}
                  </p>
                )}
                {app.rejectionReason && (
                  <p className="rejection-reason">
                    <strong>Rejection Reason:</strong> {app.rejectionReason}
                  </p>
                )}
                <p className="application-date">
                  Applied: {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              {app.status === 'pending' && (
                <div className="application-actions">
                  <Button variant="success" size="small" onClick={() => handleApprove(app._id)}>
                    Approve
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleReject(app._id)}>
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

