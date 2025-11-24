import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import { getMenuItems } from '../../utils/menuConfig'
import './DashboardLayout.scss'

const DashboardLayout = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const [isFullPageLayout, setIsFullPageLayout] = useState(false)

  useEffect(() => {
    // Check if current route should have full page layout (like login, register)
    const fullPageLayoutRoutes = ['/login', '/register', '/forgot-password']
    const shouldBeFullPage = fullPageLayoutRoutes.some(route => 
      location.pathname.startsWith(route)
    )
    setIsFullPageLayout(shouldBeFullPage)

    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location])

  if (isFullPageLayout) {
    return <>{children}</>
  }

  const menuItems = getMenuItems(user?.role)

  return (
    <div className="container-scroller">
      <Navbar user={user} />
      <div className="container-fluid page-body-wrapper">
        <Sidebar menuItems={menuItems} currentPath={location.pathname} user={user} />
        <div className="main-panel">
          <div className="content-wrapper">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

