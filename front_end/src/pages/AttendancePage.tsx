import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface AttendanceRecord {
  id: string
  courseName: string
  courseCode: string
  attended: number
  total: number
}

export default function AttendancePage() {
  const { apiClient } = useAuth()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await apiClient.get('/api/attendance')
        setRecords(response.data)
      } catch (err) {
        setError('Failed to load attendance records')
        console.error('Attendance error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [apiClient])

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 85) return { label: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (rate >= 75) return { label: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
    if (rate >= 70) return { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
    return { label: 'Low', color: 'text-destructive', bgColor: 'bg-destructive/20' }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">✓ Attendance Records</h1>
        <p className="text-muted-foreground">Track your attendance by course</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/15 border border-destructive/30 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent border-t-transparent"></div>
            <p className="text-muted-foreground text-sm">Loading attendance records...</p>
          </div>
        </div>
      ) : records.length > 0 ? (
        <div className="grid gap-4">
          {records.map((record) => {
            const attendanceRate = (record.attended / record.total) * 100
            const status = getAttendanceStatus(attendanceRate)

            return (
              <div
                key={record.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{record.courseName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{record.courseCode}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full ${status.bgColor} text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </div>
                    <p className={`text-3xl font-bold mt-2 ${status.color}`}>
                      {attendanceRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {record.attended} out of {record.total} classes attended
                  </p>
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${status.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">No attendance records available</p>
        </div>
      )}
    </div>
  )
}
