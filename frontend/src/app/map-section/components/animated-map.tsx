"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { interpolatePath } from "@/utils/geometry"
import { useRouter } from "next/navigation" // Import useRouter

// Fix for default Leaflet icon issues with Webpack
import L from "leaflet"
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Define the coordinates for the green shaded area (Polygon)
const greenPolygonCoordinates: L.LatLngExpression[] = [
  [34.055, -118.25],
  [34.06, -118.24],
  [34.058, -118.23],
  [34.05, -118.235],
  [34.045, -118.245],
]

// Define the coordinates for the red dashed path (Polyline)
// This path roughly follows the perimeter of the green polygon
const redPathCoordinates: L.LatLngExpression[] = [
  [34.05, -118.255], // Start point (red dot)
  [34.055, -118.25],
  [34.06, -118.24],
  [34.062, -118.235], // Slightly outside the polygon
  [34.058, -118.23],
  [34.05, -118.235],
  [34.043, -118.24], // Slightly outside
  [34.045, -118.245],
  [34.048, -118.252], // Back towards start
  [34.05, -118.255], // End point (same as start)
]

const initialCenter: L.LatLngExpression = [34.052235, -118.243683] // Centered around Los Angeles for example
const ANIMATION_DURATION = 10000 // 10 seconds in milliseconds

function MapFixer() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map])
  return null
}

export default function AnimatedMap() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression>(redPathCoordinates[0])
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const router = useRouter() // Initialize useRouter

  const animate = useCallback(
    (currentTime: DOMHighResTimeStamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsedTime = currentTime - startTimeRef.current
      const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1)

      setMarkerPosition(interpolatePath(redPathCoordinates, progress))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        startTimeRef.current = null // Reset start time
        router.push("/main-page") // Redirect to home page
      }
    },
    [router],
  ) // Add router to useCallback dependencies

  const startAnimation = () => {
    if (isAnimating) return // Prevent starting if already animating
    setIsAnimating(true)
    startTimeRef.current = null // Ensure fresh start time
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    // Cleanup animation frame on component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full h-full flex-grow relative">
        <MapContainer center={initialCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0">
          <MapFixer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon
            positions={greenPolygonCoordinates}
            pathOptions={{ color: "green", fillColor: "lightgreen", fillOpacity: 0.7 }}
          />
          <Polyline positions={redPathCoordinates} pathOptions={{ color: "red", dashArray: "10, 10", weight: 2 }} />
          <CircleMarker
            center={markerPosition}
            radius={8}
            pathOptions={{ color: "red", fillColor: "pink", fillOpacity: 1 }}
          />
        </MapContainer>
      </div>

      <div className="absolute bottom-8 flex items-center space-x-4 z-10">
        <Button
          onClick={startAnimation}
          disabled={isAnimating} // Disable button while animating
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? "Animating..." : "Start"}
        </Button>
        <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center text-red-600 text-3xl font-bold bg-white shadow-lg">
          10
        </div>
      </div>
    </div>
  )
}
