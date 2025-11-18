import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios, { AxiosInstance } from 'axios'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin' | 'staff'
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  apiClient: AxiosInstance
  login: (email: string, password: string) => Promise<void>
  faceLogin: (imageData: string) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_BASE_URL = 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      // Verify token by attempting to get current user
      const response = await apiClient.get('/users/me')
      setUser(response.data)
    } catch (err) {
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await apiClient.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const newToken = response.data.access_token
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      // Fetch user data after login
      const userResponse = await apiClient.get('/users/me')
      setUser(userResponse.data)
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || 'Login failed'
        : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const faceLogin = async (imageData: string) => {
    setError(null)
    setLoading(true)
    try {
      const response = await apiClient.post(
        '/faces/auth/login',
        {},
        {
          params: { image_data: imageData },
        }
      )

      const newToken = response.data.access_token
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      // Fetch user data after login
      const userResponse = await apiClient.get('/users/me')
      setUser(userResponse.data)
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || 'Face login failed'
        : 'Face login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    delete apiClient.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    setError(null)
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        apiClient,
        login,
        faceLogin,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
