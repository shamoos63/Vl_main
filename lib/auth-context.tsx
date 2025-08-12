"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  expiresAt: number | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  refreshToken: () => Promise<boolean>
}

const TOKEN_EXPIRY_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds
const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    expiresAt: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Generate a simple token (in a real app, this would come from the server)
  const generateToken = (username: string): string => {
    return `${username}_${Math.random().toString(36).substring(2)}_${Date.now()}`
  }

  // Check if token is expired
  const isTokenExpired = (expiresAt: number | null): boolean => {
    if (!expiresAt) return true
    return Date.now() >= expiresAt
  }

  // Check if token needs refresh
  const shouldRefreshToken = (expiresAt: number | null): boolean => {
    if (!expiresAt) return false
    return Date.now() >= expiresAt - REFRESH_THRESHOLD
  }

  // Load auth state from localStorage
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedAuthState = localStorage.getItem("vl-auth-state")
        if (storedAuthState) {
          const parsedState: AuthState = JSON.parse(storedAuthState)

          // Check if token is expired
          if (isTokenExpired(parsedState.expiresAt)) {
            console.log("Token expired, logging out")
            localStorage.removeItem("vl-auth-state")
            setAuthState({ user: null, token: null, expiresAt: null })
          } else {
            console.log("Auth state loaded from localStorage")
            setAuthState(parsedState)

            // Check if token needs refresh
            if (shouldRefreshToken(parsedState.expiresAt)) {
              console.log("Token needs refresh")
              refreshToken()
            }
          }
        }
      } catch (error) {
        console.error("Failed to parse stored auth state:", error)
        localStorage.removeItem("vl-auth-state")
      }
      setIsLoading(false)
    }

    loadAuthState()
  }, [])

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!authState.user) return false

      console.log("Refreshing token")

      // In a real app, this would be an API call to refresh the token
      const newToken = generateToken(authState.user.username)
      const expiresAt = Date.now() + TOKEN_EXPIRY_TIME

      const newAuthState = {
        ...authState,
        token: newToken,
        expiresAt,
      }

      setAuthState(newAuthState)
      localStorage.setItem("vl-auth-state", JSON.stringify(newAuthState))

      console.log("Token refreshed, new expiry:", new Date(expiresAt).toLocaleTimeString())
      return true
    } catch (error) {
      console.error("Failed to refresh token:", error)
      return false
    }
  }

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication for demo purposes
    if (username === "admin" && password === "Secret") {
      const user = { username, isAdmin: true }
      const token = generateToken(username)
      const expiresAt = Date.now() + TOKEN_EXPIRY_TIME

      const newAuthState = { user, token, expiresAt }
      setAuthState(newAuthState)
      localStorage.setItem("vl-auth-state", JSON.stringify(newAuthState))

      console.log("Login successful, token expires at:", new Date(expiresAt).toLocaleTimeString())
      return true
    }
    return false
  }

  // Logout function
  const logout = () => {
    setAuthState({ user: null, token: null, expiresAt: null })
    localStorage.removeItem("vl-auth-state")
    router.push("/dashboard/login")
  }

  // Set up token refresh interval
  useEffect(() => {
    if (!authState.token || !authState.expiresAt) return

    const checkTokenInterval = setInterval(() => {
      if (shouldRefreshToken(authState.expiresAt)) {
        console.log("Token refresh check - refreshing token")
        refreshToken()
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkTokenInterval)
  }, [authState.token, authState.expiresAt])

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!authState.token && !isTokenExpired(authState.expiresAt),
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
