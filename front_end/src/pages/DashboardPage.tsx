import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface DashboardStats {
  gpa?: number
  enrolledCourses?: number
  attendanceRate?: number
  creditsEarned?: number
  totalStudents?: number
  totalCourses?: number
  activeEnrollments?: number
}

export default function DashboardPage() {
  const { user, apiClient } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const endpoint = user?.role === 'student' ? '/api/student/dashboard' : '/api/admin/dashboard'
        const response = await apiClient.get(endpoint)
        setStats(response.data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [apiClient, user?.role])

  const StatCard = ({ label, value, unit, icon, color }: any) => (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--accent)'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: color }}>{value}{unit}</p>
        </div>
        <span style={{ fontSize: '32px' }}>{icon}</span>
      </div>
    </div>
  )

  const renderStudentDashboard = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '8px' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Here's your academic overview for this semester</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <StatCard
          label="Current GPA"
          value={(stats.gpa || 0).toFixed(2)}
          unit="/4.0"
          icon="📈"
          color="var(--accent)"
        />
        <StatCard
          label="Enrolled Courses"
          value={stats.enrolledCourses || 0}
          unit=""
          icon="📚"
          color="var(--primary)"
        />
        <StatCard
          label="Attendance Rate"
          value={stats.attendanceRate || 0}
          unit="%"
          icon="✓"
          color="var(--secondary)"
        />
        <StatCard
          label="Credits Earned"
          value={stats.creditsEarned || 0}
          unit=""
          icon="⭐"
          color="var(--accent)"
        />
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '8px' }}>
          Admin Dashboard 👨‍💼
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>System overview and management tools</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <StatCard
          label="Total Students"
          value={stats.totalStudents || 0}
          unit=""
          icon="👥"
          color="var(--primary)"
        />
        <StatCard
          label="Total Courses"
          value={stats.totalCourses || 0}
          unit=""
          icon="📚"
          color="var(--secondary)"
        />
        <StatCard
          label="Active Enrollments"
          value={stats.activeEnrollments || 0}
          unit=""
          icon="✏️"
          color="var(--accent)"
        />
        <StatCard
          label="System Status"
          value="Online"
          unit=""
          icon="🟢"
          color="var(--primary)"
        />
      </div>
    </div>
  )

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {error && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--error)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 12px',
              borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        user?.role === 'student' ? renderStudentDashboard() : renderAdminDashboard()
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
