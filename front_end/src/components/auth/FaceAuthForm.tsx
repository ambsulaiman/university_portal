import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function FaceAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { faceLogin, error, clearError } = useAuth()
  const navigate = useNavigate()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        clearError()
      }
    } catch {
      alert('Unable to access camera. Please check permissions and try again.')
    }
  }

  const captureAndLogin = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg', 0.95)

    setIsLoading(true)
    try {
      await faceLogin(imageData)
      navigate('/dashboard')
    } catch {
      // Error handled by context
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--error)',
          fontSize: '0.875rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!cameraActive ? (
        <button onClick={startCamera} className="btn-primary" style={{ width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            📷 Start Camera
          </span>
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(6, 182, 212, 0.3)'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', display: 'block' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Position your face in the frame and ensure good lighting
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={captureAndLogin}
              disabled={isLoading}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="spinner"></span>
                  Authenticating...
                </span>
              ) : (
                '✓ Authenticate'
              )}
            </button>
            <button
              onClick={stopCamera}
              disabled={isLoading}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
