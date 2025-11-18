import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Course {
  id: string
  name: string
  code: string
  grade?: string
  credits: number
  instructor?: string
}

export default function CoursesPage() {
  const { apiClient } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/api/courses')
        setCourses(response.data)
      } catch (err) {
        setError('Failed to load courses')
        console.error('Courses error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [apiClient])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">📚 My Courses</h1>
        <p className="text-muted-foreground">View all your enrolled courses and grades</p>
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
            <p className="text-muted-foreground text-sm">Loading courses...</p>
          </div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.code}</p>
                  {course.instructor && (
                    <p className="text-sm text-muted-foreground mt-2">👨‍🏫 {course.instructor}</p>
                  )}
                </div>
                <div className="text-right">
                  {course.grade && (
                    <p className="text-3xl font-bold text-accent">{course.grade}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{course.credits} credits</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">No courses enrolled yet</p>
          <p className="text-sm text-muted-foreground mt-2">Browse available courses to get started</p>
        </div>
      )}
    </div>
  )
}
