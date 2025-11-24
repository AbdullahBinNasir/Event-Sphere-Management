import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Map variants to Bootstrap classes
  const variantMap = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
    danger: 'btn-danger',
    success: 'btn-success',
  }
  
  const sizeMap = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg',
  }
  
  const buttonClasses = [
    'btn',
    variantMap[variant] || 'btn-primary',
    sizeMap[size],
    fullWidth ? 'w-100' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

