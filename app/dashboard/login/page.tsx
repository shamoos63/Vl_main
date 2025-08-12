"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Image from "next/image"

export default function DashboardLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    const authState = localStorage.getItem("vl-auth-state")
    if (authState) {
      try {
        const auth = JSON.parse(authState)
        if (auth.isAuthenticated && auth.user) {
          router.push("/dashboard")
        }
      } catch (error) {
        localStorage.removeItem("vl-auth-state")
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Login failed")
      }

      // Store authentication state
      localStorage.setItem(
        "vl-auth-state",
        JSON.stringify({
          isAuthenticated: true,
          user: result.user,
          token: result.token,
        })
      )

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vl-blue via-vl-blue-light to-vl-blue-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/VL_logo.svg"
            alt="VL Real Estate"
            width={120}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-vl-yellow font-sansumi">Dashboard Access</h1>
          <p className="text-white/80 mt-2 font-sansumi ">Sign in to manage your real estate business</p>
        </div>

        {/* Login Card */}
        <Card className="bg-vl-blue border border-vl-yellow shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold font-sansumi text-vl-yellow flex items-center justify-center gap-2">
              <Lock size={20} />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className=" font-sansumi bg-transparent border border-red-400 text-red px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <Label htmlFor="username" className="font-sansumi text-vl-yellow! font-medium">
                  Username
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className=" font-sansumi pl-10 bg-white border-vl-yellow focus:border-vl-yellow text-gray-900"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="font-sansumi text-vl-yellow font-medium">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="font-sansumi pl-10 pr-10 bg-white border-vl-yellow focus:border-vl-yellow text-gray-900"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!formData.username || !formData.password || isLoading}
                className="font-sansumi w-full bg-vl-yellow hover:bg-vl-yellow-dark text-vl-blue font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="font-sansumi text-vl-yellow hover:text-white transition-colors text-sm">
                ← Back to Website
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm font-sansumi">
            © 2025 VL Real Estate. Secure admin access only.
          </p>
        </div>
      </div>
    </div>
  )
}
