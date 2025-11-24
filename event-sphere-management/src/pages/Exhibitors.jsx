import { useState, useEffect } from 'react'
import * as exhibitorService from '../services/exhibitorService'
import * as expoService from '../services/expoService'
import Card from '../components/Card'
import Loading from '../components/Loading'
import './Exhibitors.css'

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState([])
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExpo, setSelectedExpo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadExpos()
  }, [])

  useEffect(() => {
    loadExhibitors()
  }, [selectedExpo])

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
    if (!selectedExpo) return

    setLoading(true)
    const result = await exhibitorService.getApplications({
      expoId: selectedExpo,
      status: 'approved',
    })
    if (result.success) {
      setExhibitors(result.data)
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

  return (
    <div className="exhibitors-page">
      <div className="page-header">
        <h1>Exhibitors</h1>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Select Expo:</label>
          <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
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
            <p className="empty-state">No exhibitors found</p>
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
              {exhibitor.services && exhibitor.services.length > 0 && (
                <div className="exhibitor-services">
                  <strong>Services:</strong> {exhibitor.services.join(', ')}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Exhibitors

