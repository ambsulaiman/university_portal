import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface AvailableCourse {
  id: string
  name: string
  code: string
  instructor: string
  capacity: number
  enrolled: number
  description?: string
}

export default function EnrollmentPage() {
  const { apiClient } = useAuth()
  const [courses, setCourses] = useState<AvailableCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailableCourses()
  }, [apiClient])

  const fetchAvailableCourses = async () => {
    try {
      const response = await apiClient.get('/api/courses/available')
      setCourses(response.data)
    } catch (err) {
      setError('Failed to load available courses')
      console.error('Available courses error:', err)
    } finally {
      setLoading(false)
    }
  }

  const enrollCourse = async (courseId: string) => {
    setEnrolling(courseId)
    try {
      await apiClient.post(`/api/enrollment/${courseId}`)
      // Refresh the course list
      await fetchAvailableCourses()
    } catch (err) {
      setError('Failed to enroll in course')
      console.error('Enrollment error:', err)
    } finally {
      setEnrolling(null)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">✏️ Course Enrollment</h1>
        <p className="text-muted-foreground">Browse and enroll in available courses for next semester</p>
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
            <p className="text-muted-foreground text-sm">Loading available courses...</p>
          </div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-4">
          {courses.map((course) => {
            const enrollmentRate = (course.enrolled / course.capacity) * 100
            const isFull = enrollmentRate >= 100
            const isNearFull = enrollmentRate >= 90

            return (
              <div
                key={course.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{course.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.code}</p>
                    <p className="text-sm text-muted-foreground mt-2">👨‍🏫 {course.instructor}</p>
                  </div>
                  <button
                    onClick={() => enrollCourse(course.id)}
                    disabled={isFull || enrolling === course.id}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isFull
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-gradient-to-r from-accent to-primary text-primary-foreground hover:shadow-lg'
                    }`}
                  >
                    {enrolling === course.id ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                        Enrolling...
                      </span>
                    ) : isFull ? (
                      'Class Full'
                    ) : (
                      'Enroll'
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {course.enrolled} / {course.capacity} enrolled
                    </span>
                    <span className={isNearFull ? 'text-destructive' : ''}>
                      {enrollmentRate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isNearFull ? 'bg-destructive' : 'bg-gradient-to-r from-accent to-primary'
                      }`}
                      style={{ width: `${Math.min(enrollmentRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">No available courses at the moment</p>
        </div>
      )}
    </div>
  )
}
