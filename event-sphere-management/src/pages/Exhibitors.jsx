import { useState, useEffect } from 'react'
import * as exhibitorService from '../services/exhibitorService'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Loading from '../components/Loading'
import Button from '../components/Button'
import Alert from '../components/Alert'
import ChatWindow from '../components/ChatWindow'
import FloorPlanViewer from '../components/FloorPlanViewer'
import './Exhibitors.css'

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedExpo, setSelectedExpo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [chatRecipient, setChatRecipient] = useState(null)
  const [showFloorPlan, setShowFloorPlan] = useState(false)
  const [currentExpoData, setCurrentExpoData] = useState(null)

  useEffect(() => {
    loadExpos()
  }, [])

  useEffect(() => {
    if (selectedExpo) {
      loadExhibitors()
      // Try to get expo from expos list first
      const expo = expos.find(e => e._id === selectedExpo)
      if (expo) {
        setCurrentExpoData(expo)
      }
    }
  }, [selectedExpo, expos])

  // Update expo data from exhibitor response if available
  useEffect(() => {
    if (exhibitors.length > 0 && selectedExpo) {
      const firstExhibitor = exhibitors[0]
      if (firstExhibitor.expoId && firstExhibitor.expoId._id === selectedExpo) {
        // Use expo data from exhibitor response if it has floor plan info
        const expoFromExhibitor = firstExhibitor.expoId
        setCurrentExpoData(prev => ({
          ...prev,
          ...expoFromExhibitor,
          // Merge floor plan data
          floorPlanUrl: expoFromExhibitor.floorPlanUrl || prev?.floorPlanUrl,
          floorPlan: expoFromExhibitor.floorPlan || prev?.floorPlan,
        }))
      }
    }
  }, [exhibitors, selectedExpo])

  const loadExpos = async () => {
    const result = await expoService.getExpos({ status: 'published' })
    if (result.success) {
      setExpos(result.data)
      if (result.data.length > 0) {
        setSelectedExpo(result.data[0]._id)
      }
    }
  }

  const loadExhibitors = async () => {
    if (!selectedExpo) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    const result = await exhibitorService.getApprovedExhibitors({
      expoId: selectedExpo,
    })
    if (result.success) {
      setExhibitors(result.data || [])
    } else {
      setError(result.error || 'Failed to load exhibitors')
      setExhibitors([])
    }
    setLoading(false)
  }

  const filteredExhibitors = exhibitors.filter(
    (exhibitor) =>
      exhibitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exhibitor.companyDescription &&
        exhibitor.companyDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return <Loading fullScreen />
  }

  const hasFloorPlan = currentExpoData?.floorPlanUrl || currentExpoData?.floorPlan?.image

  return (
    <div className="exhibitors-page">
      <div className="page-header">
        <h1>Exhibitors</h1>
        {hasFloorPlan && (
          <Button variant="secondary" onClick={() => setShowFloorPlan(true)}>
            <i className="mdi mdi-map"></i> View Floor Plan
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="filters">
        <div className="filter-group">
          <label>Select Expo:</label>
          <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
            {expos.length === 0 ? (
              <option value="">No expos available</option>
            ) : (
              expos.map((expo) => (
                <option key={expo._id} value={expo._id}>
                  {expo.title}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search exhibitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="exhibitors-grid">
        {filteredExhibitors.length === 0 ? (
          <Card>
            <p className="empty-state">
              {selectedExpo 
                ? searchTerm 
                  ? 'No exhibitors match your search criteria' 
                  : 'No approved exhibitors found for this expo'
                : 'Please select an expo to view exhibitors'}
            </p>
          </Card>
        ) : (
          filteredExhibitors.map((exhibitor) => (
            <Card key={exhibitor._id} className="exhibitor-card" hover>
              <h3>{exhibitor.companyName}</h3>
              {exhibitor.boothNumber && (
                <p className="booth-number">Booth: {exhibitor.boothNumber}</p>
              )}
              {exhibitor.companyDescription && (
                <p className="exhibitor-description">{exhibitor.companyDescription}</p>
              )}
              {exhibitor.products && exhibitor.products.length > 0 && (
                <div className="exhibitor-products">
                  <strong>Products:</strong> {exhibitor.products.join(', ')}
                </div>
              )}
              <div className="exhibitor-actions" style={{ marginTop: '1rem' }}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setChatRecipient({ 
                    id: exhibitor.exhibitorId?._id || exhibitor.exhibitorId, 
                    name: exhibitor.companyName 
                  })}
                >
                  <i className="mdi mdi-chat"></i> Chat
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {chatRecipient && (
        <ChatWindow
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          onClose={() => setChatRecipient(null)}
        />
      )}

      {showFloorPlan && (
        <FloorPlanViewer
          imageUrl={currentExpoData?.floorPlanUrl || currentExpoData?.floorPlan?.image}
          onClose={() => setShowFloorPlan(false)}
        />
      )}
    </div>
  )
}

export default Exhibitors

