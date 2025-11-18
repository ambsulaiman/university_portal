'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AvailableCourse {
  id: string
  name: string
  code: string
  instructor: string
  capacity: number
  enrolled: number
}

export default function EnrollmentView() {
  const [availableCourses] = useState<AvailableCourse[]>([
    {
      id: '6',
      name: 'Data Structures',
      code: 'CS 301',
      instructor: 'Dr. Anderson',
      capacity: 30,
      enrolled: 28,
    },
    {
      id: '7',
      name: 'Organic Chemistry',
      code: 'CHEM 202',
      instructor: 'Prof. Taylor',
      capacity: 25,
      enrolled: 22,
    },
    {
      id: '8',
      name: 'Modern Art History',
      code: 'ART 250',
      instructor: 'Dr. Martinez',
      capacity: 20,
      enrolled: 15,
    },
  ])

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  const handleEnroll = (courseId: string) => {
    setEnrolledCourses([...enrolledCourses, courseId])
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Available Courses</h2>
        <p className="text-sm text-muted-foreground">Register for next semester courses</p>
      </div>

      <div className="grid gap-4">
        {availableCourses.map((course) => {
          const isFull = course.enrolled >= course.capacity
          const isEnrolled = enrolledCourses.includes(course.id)

          return (
            <Card key={course.id} className={isFull ? 'opacity-50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{course.code}</CardTitle>
                      {isFull && <Badge variant="destructive">Full</Badge>}
                      {isEnrolled && <Badge>Enrolled</Badge>}
                    </div>
                    <CardDescription>{course.name}</CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">{course.instructor}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {course.enrolled}/{course.capacity} seats
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleEnroll(course.id)}
                    disabled={isFull || isEnrolled}
                  >
                    {isEnrolled ? 'Enrolled' : 'Enroll'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
