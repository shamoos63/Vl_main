"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authState = localStorage.getItem("vl-auth-state")
        if (!authState) {
          router.push("/dashboard/login")
          return
        }

        const auth = JSON.parse(authState)
        if (!auth.isAuthenticated || !auth.user || !auth.token) {
          localStorage.removeItem("vl-auth-state")
          router.push("/dashboard/login")
          return
        }

        // Verify token format (basic check)
        if (!auth.token.startsWith("vl_")) {
          localStorage.removeItem("vl-auth-state")
          router.push("/dashboard/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("vl-auth-state")
        router.push("/dashboard/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vl-blue via-vl-blue-light to-vl-blue-dark flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-white">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will handle redirect
  }

  return <>{children}</>
}
