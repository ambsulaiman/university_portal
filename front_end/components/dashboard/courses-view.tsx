'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Course {
  id: string
  name: string
  code: string
  instructor: string
  progress: number
  grade: string
}

export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Introduction to Computer Science',
      code: 'CS 101',
      instructor: 'Dr. Smith',
      progress: 85,
      grade: 'A-',
    },
    {
      id: '2',
      name: 'Calculus II',
      code: 'MATH 201',
      instructor: 'Prof. Johnson',
      progress: 72,
      grade: 'B+',
    },
    {
      id: '3',
      name: 'Physics Fundamentals',
      code: 'PHY 101',
      instructor: 'Dr. Williams',
      progress: 88,
      grade: 'A',
    },
    {
      id: '4',
      name: 'English Literature',
      code: 'ENG 150',
      instructor: 'Prof. Davis',
      progress: 91,
      grade: 'A',
    },
    {
      id: '5',
      name: 'World History',
      code: 'HIS 200',
      instructor: 'Dr. Brown',
      progress: 78,
      grade: 'B+',
    },
  ])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">My Courses</h2>
        <p className="text-sm text-muted-foreground">You are enrolled in {courses.length} courses this semester</p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{course.code}</CardTitle>
                    <Badge variant="secondary">{course.grade}</Badge>
                  </div>
                  <CardDescription>{course.name}</CardDescription>
                </div>
                <span className="text-xs text-muted-foreground">{course.instructor}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
