import { useState } from 'react'
import './FloorPlanViewer.css'

const FloorPlanViewer = ({ imageUrl, onClose }) => {
    return (
        <div className="floor-plan-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Event Floor Plan</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Floor Plan" className="floor-plan-image" />
                    ) : (
                        <div className="no-plan">No floor plan available for this event.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FloorPlanViewer
