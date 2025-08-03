"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2, CheckCircle, AlertTriangle, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

export default function LocationDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
  }, [])

  const getLocation = () => {
    setIsDetecting(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setIsDetecting(false)
      return
    }

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        setLocationData(locationData)
        setIsDetecting(false)
        
        // Store location data in session storage
        sessionStorage.setItem('farmer_location', JSON.stringify(locationData))
        
        // Auto-proceed after 2 seconds
        setTimeout(() => {
          router.push("/language-selection")
        }, 2000)
      },
      (error) => {
        console.log("High accuracy location failed:", error)
        
        // If high accuracy fails, try with lower accuracy
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          console.log("Trying with lower accuracy...")
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
              
              setLocationData(locationData)
              setIsDetecting(false)
              
              // Store location data in session storage
              sessionStorage.setItem('farmer_location', JSON.stringify(locationData))
              
              // Auto-proceed after 2 seconds
              setTimeout(() => {
                router.push("/language-selection")
              }, 2000)
            },
            (fallbackError) => {
              console.log("Lower accuracy also failed:", fallbackError)
              let errorMessage = "Unable to retrieve your location."
              switch (fallbackError.code) {
                case fallbackError.PERMISSION_DENIED:
                  errorMessage = "Location access denied. Please enable location services in your browser settings."
                  break
                case fallbackError.POSITION_UNAVAILABLE:
                  errorMessage = "Location information unavailable. Please check your GPS settings."
                  break
                case fallbackError.TIMEOUT:
                  errorMessage = "Location request timed out. Please try again or skip for now."
                  break
              }
              setError(errorMessage)
              setIsDetecting(false)
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 300000 // 5 minutes
            }
          )
      } else {
          let errorMessage = "Unable to retrieve your location."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services in your browser settings."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please check your GPS settings."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again or skip for now."
              break
          }
          setError(errorMessage)
          setIsDetecting(false)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000, // Reduced timeout
        maximumAge: 60000
      }
    )
  }

  const handleSkipLocation = () => {
    // Store default location or skip
    sessionStorage.setItem('farmer_location', JSON.stringify({
      latitude: 0,
      longitude: 0,
      accuracy: 0
    }))
    router.push("/language-selection")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Detect Your Location</h1>
          <p className="text-green-600 text-lg">We'll use this to provide better farming recommendations</p>
        </div>

        {/* Location Detection Card */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-center">
              {isMobile ? "Enable Location Access" : "Location Detection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {!isMobile && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Mobile Device Required</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Location detection works best on mobile devices. Please use your phone for the best experience.
                </p>
              </div>
            )}

            {isDetecting && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-green-700 font-medium">Detecting your location...</p>
                <p className="text-sm text-green-600 mt-2">Please allow location access when prompted</p>
              </div>
            )}

            {locationData && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium mb-2">Location Detected!</p>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700">
                  <p><strong>Latitude:</strong> {locationData.latitude.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {locationData.longitude.toFixed(6)}</p>
                  <p><strong>Accuracy:</strong> ±{Math.round(locationData.accuracy)} meters</p>
                </div>
                <p className="text-sm text-green-600 mt-3">Proceeding to language selection...</p>
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Location Error</span>
                  </div>
                  <p className="text-sm text-red-700">{error}</p>
      </div>

                {/* Manual Location Input */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Manual Location</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    You can enter your location manually or try again
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={getLocation}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={handleSkipLocation}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Skip Location
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isDetecting && !locationData && !error && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-green-700 mb-4">
                    We'll use your location to provide:
                  </p>
                  <div className="space-y-2 text-sm text-green-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Local weather forecasts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Soil recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Crop-specific advice</span>
                    </div>
                  </div>
                </div>

                {isMobile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Mobile Device Detected</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Make sure location services are enabled on your device for the best experience.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={getLocation}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    {isMobile ? "Enable Location Access" : "Detect My Location"}
                  </Button>
                  
        <Button
                    onClick={handleSkipLocation}
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 py-4 rounded-xl"
                  >
                    Skip for Now
        </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-green-600">
          <p>Your location helps us provide personalized farming advice</p>
          <p className="mt-1">You can change this later in settings</p>
        </div>
      </div>
    </div>
  )
}
