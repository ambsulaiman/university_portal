'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface AttendanceRecord {
  courseCode: string
  courseName: string
  attended: number
  total: number
  percentage: number
}

export default function AttendanceView() {
  const attendanceRecords: AttendanceRecord[] = [
    {
      courseCode: 'CS 101',
      courseName: 'Introduction to Computer Science',
      attended: 23,
      total: 24,
      percentage: 96,
    },
    {
      courseCode: 'MATH 201',
      courseName: 'Calculus II',
      attended: 21,
      total: 24,
      percentage: 88,
    },
    {
      courseCode: 'PHY 101',
      courseName: 'Physics Fundamentals',
      attended: 24,
      total: 24,
      percentage: 100,
    },
    {
      courseCode: 'ENG 150',
      courseName: 'English Literature',
      attended: 22,
      total: 24,
      percentage: 92,
    },
    {
      courseCode: 'HIS 200',
      courseName: 'World History',
      attended: 20,
      total: 24,
      percentage: 83,
    },
  ]

  const overallAttendance =
    (attendanceRecords.reduce((acc, r) => acc + r.attended, 0) /
      attendanceRecords.reduce((acc, r) => acc + r.total, 0)) *
    100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Attendance</CardTitle>
          <CardDescription>Across all your courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">{overallAttendance.toFixed(1)}%</span>
            <span className="text-sm text-muted-foreground">
              {attendanceRecords.reduce((acc, r) => acc + r.attended, 0)} of{' '}
              {attendanceRecords.reduce((acc, r) => acc + r.total, 0)} classes attended
            </span>
          </div>
          <Progress value={overallAttendance} className="h-2" />
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Attendance by Course</h3>
        <div className="grid gap-4">
          {attendanceRecords.map((record) => (
            <Card key={record.courseCode}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{record.courseCode}</CardTitle>
                    <CardDescription>{record.courseName}</CardDescription>
                  </div>
                  <span className="text-sm font-medium text-primary">{record.percentage}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {record.attended} of {record.total} classes attended
                    </span>
                  </div>
                  <Progress value={record.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
