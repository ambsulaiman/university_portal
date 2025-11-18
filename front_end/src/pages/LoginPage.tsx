import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import FaceAuthForm from '../components/auth/FaceAuthForm'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'login' | 'face'>('login')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, var(--background), rgba(30, 41, 59, 0.2))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              fontSize: '28px'
            }}>
              📚
            </div>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text)' }}>
            University Portal
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Sign in to access your academic profile
          </p>
        </div>

        {/* Auth Card */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '8px',
          boxShadow: '0 20px 25px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '8px' }}>
                Welcome
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Choose your authentication method
              </p>
            </div>

            {/* Auth Mode Switcher */}
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'rgba(51, 65, 85, 0.3)',
              padding: '4px',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: authMode === 'login' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'login' ? 'white' : 'var(--text-muted)',
                  boxShadow: authMode === 'login' ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                Email & Password
              </button>
              <button
                onClick={() => setAuthMode('face')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: authMode === 'face' ? 'var(--primary)' : 'transparent',
                  color: authMode === 'face' ? 'white' : 'var(--text-muted)',
                  boxShadow: authMode === 'face' ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                Face ID
              </button>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {authMode === 'login' ? <LoginForm /> : <FaceAuthForm />}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            🔒 Secured with enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  )
}
