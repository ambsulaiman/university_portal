'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StudentDashboardProps {
  user: any
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">3.85</p>
            <p className="text-xs text-muted-foreground mt-1">Excellent standing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">5</p>
            <p className="text-xs text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">94%</p>
            <p className="text-xs text-muted-foreground mt-1">All courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">45</p>
            <p className="text-xs text-muted-foreground mt-1">Of 120 required</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest academic updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Grade posted for CS 101</p>
              <p className="text-xs text-muted-foreground">A- in Midterm exam • 2 days ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-border/50">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Assignment due</p>
              <p className="text-xs text-muted-foreground">MATH 201: Calculus II • Due in 3 days</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Course registration open</p>
              <p className="text-xs text-muted-foreground">Next semester registration begins tomorrow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
