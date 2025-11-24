import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { AuthContext } from '../../contexts/AuthContext'

const renderWithRouter = (component, authValue) => {
  const MockAuthProvider = ({ children }) => (
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return render(
    <MockAuthProvider>
      {component}
    </MockAuthProvider>
  )
}

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    const authValue = {
      isAuthenticated: true,
      user: { id: 1, name: 'Test User', role: 'admin' },
      loading: false,
    }

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should show loading when loading', () => {
    const authValue = {
      isAuthenticated: false,
      user: null,
      loading: true,
    }

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect when not authenticated', () => {
    const authValue = {
      isAuthenticated: false,
      user: null,
      loading: false,
    }

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authValue
    )

    // Should redirect to login, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})

