'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/components/auth/login-form'
import FaceAuthForm from '@/components/auth/face-auth-form'

export default function HomePage() {
  const [authMode, setAuthMode] = useState<'login' | 'face'>('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">U</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">University Portal</h1>
          <p className="text-muted-foreground">Your gateway to academic excellence</p>
        </div>

        {/* Auth Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
            
            {/* Auth Mode Switcher */}
            <div className="flex gap-2 pt-2">
              <Button
                variant={authMode === 'login' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAuthMode('login')}
                className="flex-1"
              >
                Email & Password
              </Button>
              <Button
                variant={authMode === 'face' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAuthMode('face')}
                className="flex-1"
              >
                Face ID
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {authMode === 'login' ? <LoginForm /> : <FaceAuthForm />}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  )
}
