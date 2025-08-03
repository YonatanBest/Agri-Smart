"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, UserPlus, ArrowRight, ArrowLeft, Leaf, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AuthOptionsPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { t } = useLanguage()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmailFormat')
    }
    
    if (!formData.password) {
      newErrors.password = t('passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordMinLength')
    }
    
    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = t('nameRequired')
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('confirmPasswordRequired')
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('passwordsDoNotMatch')
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      if (isSignUp) {
        // Store basic user data for the onboarding process
        sessionStorage.setItem('auth_data', JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        }))
        // For new users, go through the full onboarding process
        router.push("/map-section")
      } else {
        // For existing users, go directly to main app
        router.push("/main-page")
      }
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {isSignUp ? t('createAccount') : t('welcomeBack')}
          </h1>
          <p className="text-green-600 text-lg">
            {isSignUp 
              ? t('joinAgrilo')
              : t('signInToContinue')
            }
          </p>
        </div>

        {/* Auth Options Card */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-6">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setIsSignUp(false)}
                variant={!isSignUp ? "default" : "outline"}
                className={`flex-1 ${!isSignUp ? "bg-green-500 text-white" : "border-green-200 text-green-600"}`}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {t('signIn')}
              </Button>
              <Button
                onClick={() => setIsSignUp(true)}
                variant={isSignUp ? "default" : "outline"}
                className={`flex-1 ${isSignUp ? "bg-green-500 text-white" : "border-green-200 text-green-600"}`}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('signUp')}
              </Button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-green-700 font-medium">
                    {t('fullName')}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('enterFullName')}
                    className="rounded-xl border-green-200 focus:border-green-500"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700 font-medium">
                  {t('emailAddress')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder={t('enterEmailAddress')}
                  className="rounded-xl border-green-200 focus:border-green-500"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700 font-medium">
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={t('enterPassword')}
                  className="rounded-xl border-green-200 focus:border-green-500"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-green-700 font-medium">
                    {t('confirmPassword')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder={t('confirmYourPassword')}
                    className="rounded-xl border-green-200 focus:border-green-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl mt-6"
              >
                {isSignUp ? t('createAccountButton') : t('signInButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Info Box */}
            {isSignUp && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">{t('newUserSetup')}</span>
                </div>
                <p className="text-sm text-blue-700">
                  {t('newUserSetupDesc')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToHome')}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-green-600">
          <p>
            {isSignUp 
              ? t('alreadyHaveAccount')
              : t('dontHaveAccount')
            }
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium underline hover:text-green-700"
            >
              {isSignUp ? t('signIn') : t('signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
} 