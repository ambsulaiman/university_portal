import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const getNavItems = () => {
    if (user?.role === 'student') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'My Courses', icon: '📚' },
        { path: '/enrollment', label: 'Enrollment', icon: '✏️' },
        { path: '/attendance', label: 'Attendance', icon: '✓' },
      ]
    } else {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'Manage Courses', icon: '📚' },
        { path: '/enrollment', label: 'Enrollments', icon: '✏️' },
        { path: '/attendance', label: 'Attendance', icon: '✓' },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <aside style={{
      width: '256px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            📚
          </div>
          <div>
            <h1 style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text)' }}>UniPortal</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>v1.0</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border)'
      }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px', textTransform: 'capitalize' }}>
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              textDecoration: 'none',
              backgroundColor: location.pathname === item.path ? 'var(--primary)' : 'transparent',
              color: location.pathname === item.path ? 'white' : 'var(--text)',
              boxShadow: location.pathname === item.path ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ fontWeight: '500', fontSize: '14px' }}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: 'var(--error)',
            border: 'none',
            transition: 'background-color 0.2s',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
