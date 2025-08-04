"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthOptionsPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, initiateRegistration, isAuthenticated, isLoading, error: authError, clearError } = useAuth()

  // Redirect authenticated users to main page (only for existing users, not new registrations)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if this is a new registration by looking for onboarding data
      const authData = sessionStorage.getItem('auth_data')
      const locationData = sessionStorage.getItem('farmer_location')

      // If we have onboarding data, continue with onboarding flow
      if (authData && locationData) {
        // New user with onboarding data - let them continue the flow
        return
      }

      // Existing user - redirect to main page
      router.push("/main-page")
    }
  }, [isAuthenticated, isLoading, router])

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Email and password are required")
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    clearLocalError()
    if (validateForm()) {
      try {
      if (isSignUp) {
          // Store auth data for new user onboarding flow
        sessionStorage.setItem('auth_data', JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }))
          // Initiate registration for new user (client-side only)
          await initiateRegistration({
            name: formData.name,
          email: formData.email,
          password: formData.password,
            location: "unknown",
            preferred_language: "en",
            crops_grown: [],
            user_type: "farmer",
            years_experience: 1,
            main_goal: "increase_yield"
          })
        // For new users, go through the full onboarding process
        router.push("/map-section")
      } else {
          // Login existing user
          await login(formData.email, formData.password)
        // For existing users, go directly to main app
        router.push("/main-page")
        }
      } catch (err: any) {
        // Error is handled by the auth context
        console.error("Authentication error:", err)
        if (isSignUp && err.message && err.message.includes('Email already registered')) {
          alert('This email is already registered. Please sign in instead.')
          setIsSignUp(false)
          setFormData({ name: "", email: formData.email, password: "", confirmPassword: "" })
        }
      }
    }
  }

  const clearLocalError = () => {
    setError("")
    if (authError) {
      clearError()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isSignUp ? "Join AgriLo to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isSignUp ? "signup" : "signin"} onValueChange={(value) => setIsSignUp(value === "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
          </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
        </div>
              <Button
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
            </TabsContent>

            <TabsContent value="signup">
            <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                <Input
                    id="signup-email"
                  type="email"
                    placeholder="Enter your email"
                  value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                <Input
                    id="signup-password"
                  type="password"
                    placeholder="Create a password"
                  value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              <Button
                onClick={handleSubmit}
                  className="w-full"
                  disabled={isLoading}
              >
                  {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
} 