'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function FaceAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Unable to access camera',
        variant: 'destructive',
      })
    }
  }

  const captureAndLogin = async () => {
    if (!videoRef.current) return

    setIsLoading(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')

        const response = await fetch('/api/faces/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_data: imageData }),
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('token', data.access_token)
          toast({
            title: 'Success',
            description: 'Face authentication successful',
          })
          window.location.href = '/dashboard'
        } else {
          toast({
            title: 'Error',
            description: 'Face not recognized. Please try again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during face authentication',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!cameraActive ? (
        <Button onClick={startCamera} className="w-full" size="lg">
          Start Camera
        </Button>
      ) : (
        <>
          <div className="relative w-full bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setCameraActive(false)
                if (videoRef.current?.srcObject) {
                  const stream = videoRef.current.srcObject as MediaStream
                  stream.getTracks().forEach(track => track.stop())
                }
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={captureAndLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </Button>
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Position your face clearly in the frame
      </p>
    </div>
  )
}
