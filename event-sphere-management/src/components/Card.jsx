import './Card.css'

const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`card shadow-sm ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ border: 'none' }}
    >
      {children}
    </div>
  )
}

export default Card

