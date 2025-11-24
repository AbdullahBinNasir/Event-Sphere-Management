import './Loading.css'

const Loading = ({ size = 'medium', fullScreen = false }) => {
  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container'
  
  return (
    <div className={containerClass}>
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
    </div>
  )
}

export default Loading

