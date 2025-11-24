import './Alert.css'

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null

  return (
    <div className={`alert alert-${type} ${className}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}

export default Alert

