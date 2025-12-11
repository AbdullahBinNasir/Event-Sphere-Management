import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/dashboard/DashboardLayout'
import { ROUTES, USER_ROLES } from './constants'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './pages/AdminDashboard'
import ExpoManagement from './pages/ExpoManagement'
import ExhibitorManagement from './pages/ExhibitorManagement'
import ScheduleManagement from './pages/ScheduleManagement'
import Analytics from './pages/Analytics'
import ExhibitorPortal from './pages/ExhibitorPortal'
import AttendeePortal from './pages/AttendeePortal'
import Events from './pages/Events'
import Exhibitors from './pages/Exhibitors'
import Schedule from './pages/Schedule'
import Feedback from './pages/Feedback'

import './App.css'

function App() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:26',message:'App component rendering',data:{routesCount:Object.keys(ROUTES).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          
          {/* Protected Routes with Dashboard Layout */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ORGANIZER]}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXPO_MANAGEMENT}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ORGANIZER]}>
                <DashboardLayout>
                  <ExpoManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXHIBITOR_MANAGEMENT}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ORGANIZER]}>
                <DashboardLayout>
                  <ExhibitorManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SCHEDULE_MANAGEMENT}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ORGANIZER]}>
                <DashboardLayout>
                  <ScheduleManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ANALYTICS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ORGANIZER]}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXHIBITOR_PORTAL}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.EXHIBITOR]}>
                <DashboardLayout>
                  <ExhibitorPortal />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ATTENDEE_PORTAL}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ATTENDEE]}>
                <DashboardLayout>
                  <AttendeePortal />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EVENTS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ATTENDEE]}>
                <DashboardLayout>
                  <Events />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXHIBITORS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ATTENDEE]}>
                <DashboardLayout>
                  <Exhibitors />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SCHEDULE}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ATTENDEE]}>
                <DashboardLayout>
                  <Schedule />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FEEDBACK}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Feedback />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
