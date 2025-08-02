"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Play,
    Pause,
    Square,
    MapPin,
    Navigation,
    Smartphone,
    CheckCircle,
    AlertCircle,
    Loader2,
    Compass,
    Footprints
} from "lucide-react"
import { useRouter } from "next/navigation"
import { EnhancedGPSTracker } from "@/utils/sensors"

interface GPSPosition {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
}

interface LandBoundary {
    coordinates: GPSPosition[]
    area: number
    perimeter: number
}

export default function LandMappingPage() {
    const [isMapping, setIsMapping] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null)
    const [boundaryPoints, setBoundaryPoints] = useState<GPSPosition[]>([])
    const [startPoint, setStartPoint] = useState<GPSPosition | null>(null)
    const [distanceTraveled, setDistanceTraveled] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isComplete, setIsComplete] = useState(false)
    const [landData, setLandData] = useState<LandBoundary | null>(null)
    const [stepCount, setStepCount] = useState(0)
    const [isWalking, setIsWalking] = useState(false)
    const [movementDirection, setMovementDirection] = useState<string | null>(null)

    const router = useRouter()
    const watchIdRef = useRef<number | null>(null)
    const startTimeRef = useRef<number>(0)
    const lastPositionRef = useRef<GPSPosition | null>(null)
    const enhancedTrackerRef = useRef<EnhancedGPSTracker | null>(null)

    // Calculate distance between two GPS points using Haversine formula
    const calculateDistance = (pos1: GPSPosition, pos2: GPSPosition): number => {
        const R = 6371e3 // Earth's radius in meters
        const φ1 = pos1.latitude * Math.PI / 180
        const φ2 = pos2.latitude * Math.PI / 180
        const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180
        const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c
    }

    // Calculate area using shoelace formula
    const calculateArea = (coordinates: GPSPosition[]): number => {
        if (coordinates.length < 3) return 0

        let area = 0
        for (let i = 0; i < coordinates.length; i++) {
            const j = (i + 1) % coordinates.length
            area += coordinates[i].longitude * coordinates[j].latitude
            area -= coordinates[j].longitude * coordinates[i].latitude
        }

        // Convert to square meters (approximate)
        return Math.abs(area) * 111320 * 111320 / 2
    }

    // Calculate perimeter
    const calculatePerimeter = (coordinates: GPSPosition[]): number => {
        if (coordinates.length < 2) return 0

        let perimeter = 0
        for (let i = 0; i < coordinates.length; i++) {
            const j = (i + 1) % coordinates.length
            perimeter += calculateDistance(coordinates[i], coordinates[j])
        }

        return perimeter
    }

    // Check if we're back near the start point
    const isNearStartPoint = (currentPos: GPSPosition, startPos: GPSPosition): boolean => {
        const distance = calculateDistance(currentPos, startPos)
        return distance < 10 // Within 10 meters of start point
    }

    const startMapping = async () => {
        try {
            setError(null)

            // Initialize enhanced tracker
            enhancedTrackerRef.current = new EnhancedGPSTracker()

            // Request GPS permissions
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                })
            })

            const initialPosition: GPSPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            }

            setCurrentPosition(initialPosition)
            setStartPoint(initialPosition)
            setBoundaryPoints([initialPosition])
            setGpsAccuracy(initialPosition.accuracy)
            setIsMapping(true)
            setIsPaused(false)
            startTimeRef.current = Date.now()

            // Start watching position
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newPos: GPSPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    }

                    // Add to enhanced tracker
                    if (enhancedTrackerRef.current) {
                        enhancedTrackerRef.current.addGPSPosition(
                            newPos.latitude,
                            newPos.longitude,
                            newPos.accuracy,
                            newPos.timestamp
                        )
                    }

                    setCurrentPosition(newPos)
                    setGpsAccuracy(newPos.accuracy)

                    // Only update distance if we've actually moved significantly
                    if (lastPositionRef.current) {
                        const distance = calculateDistance(lastPositionRef.current, newPos)
                        // Only count distance if we've moved more than 1 meter
                        if (distance > 1) {
                            setDistanceTraveled(prev => prev + distance)
                            lastPositionRef.current = newPos
                        }
                    } else {
                        lastPositionRef.current = newPos
                    }

                    // Add point to boundary if we've moved enough
                    if (lastPositionRef.current &&
                        calculateDistance(lastPositionRef.current, newPos) > 2) { // 2 meters minimum
                        setBoundaryPoints(prev => [...prev, newPos])
                    }

                    // Check if we're back near start point
                    if (startPoint && isNearStartPoint(newPos, startPoint) && boundaryPoints.length > 10) {
                        completeMapping()
                    }

                    // Update progress based on time (assuming average walking speed)
                    const timeElapsed = (Date.now() - startTimeRef.current) / 1000
                    setTimeElapsed(timeElapsed)

                    // Estimate progress based on time (assuming 5 minutes for average farm)
                    const estimatedProgress = Math.min((timeElapsed / 300) * 100, 95)
                    setProgress(estimatedProgress)

                    // Update sensor data
                    if (enhancedTrackerRef.current) {
                        setStepCount(enhancedTrackerRef.current.getStepCount())
                        setIsWalking(enhancedTrackerRef.current.isWalking())
                        setMovementDirection(enhancedTrackerRef.current.getMovementDirection())
                    }
                },
                (error) => {
                    setError(`GPS Error: ${error.message}`)
                    setIsMapping(false)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )

        } catch (error) {
            setError(`Failed to start mapping: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    const pauseMapping = () => {
        setIsPaused(true)
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
    }

    const resumeMapping = () => {
        setIsPaused(false)
        startMapping()
    }

    const stopMapping = () => {
        setIsMapping(false)
        setIsPaused(false)
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        if (enhancedTrackerRef.current) {
            enhancedTrackerRef.current.cleanup()
        }
        setProgress(0)
        setBoundaryPoints([])
        setStartPoint(null)
        setCurrentPosition(null)
        setDistanceTraveled(0)
        setTimeElapsed(0)
        setStepCount(0)
        setIsWalking(false)
        setMovementDirection(null)
    }

    const completeMapping = () => {
        if (boundaryPoints.length < 3) {
            setError("Not enough boundary points. Please walk around your farm completely.")
            return
        }

        const area = calculateArea(boundaryPoints)
        const perimeter = calculatePerimeter(boundaryPoints)

        const landBoundary: LandBoundary = {
            coordinates: boundaryPoints,
            area,
            perimeter
        }

        setLandData(landBoundary)
        setIsComplete(true)
        setIsMapping(false)
        setProgress(100)

        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        if (enhancedTrackerRef.current) {
            enhancedTrackerRef.current.cleanup()
        }
    }

    const goToDashboard = () => {
        // Save land data to localStorage or send to backend
        if (landData) {
            localStorage.setItem('agrilo_land_data', JSON.stringify(landData))
        }
        router.push('/main-page')
    }

    useEffect(() => {
        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
            if (enhancedTrackerRef.current) {
                enhancedTrackerRef.current.cleanup()
            }
        }
    }, [])

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
                <div className="max-w-md mx-auto">
                    <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
                        <CardHeader className="text-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <CardTitle className="text-green-700 text-xl">Land Mapping Complete!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center space-y-2">
                                <p className="text-green-600">Your farmland has been successfully mapped!</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="font-semibold text-green-700">Area</p>
                                        <p className="text-green-600">{(landData?.area || 0 / 10000).toFixed(2)} hectares</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="font-semibold text-green-700">Perimeter</p>
                                        <p className="text-green-600">{(landData?.perimeter || 0).toFixed(0)} meters</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={goToDashboard}
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                            >
                                Continue to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="max-w-md mx-auto">
                <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-green-700 text-xl">
                            {!isMapping ? "Map Your Farmland" : "Mapping in Progress"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!isMapping ? (
                            <div className="space-y-4">
                                <div className="text-center space-y-3">
                                    <p className="text-green-600">
                                        Walk around the perimeter of your farmland. The app will automatically trace your path using GPS and phone sensors.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                                        <Smartphone className="h-4 w-4" />
                                        <span>Uses GPS, accelerometer, gyroscope & compass</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-700 mb-2">Instructions:</h3>
                                    <ol className="text-sm text-blue-600 space-y-1">
                                        <li>1. Stand at one corner of your farmland</li>
                                        <li>2. Click "Start Mapping"</li>
                                        <li>3. Walk around the entire perimeter</li>
                                        <li>4. Return to your starting point</li>
                                        <li>5. The app will automatically complete the mapping</li>
                                    </ol>
                                </div>

                                <Button
                                    onClick={startMapping}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Mapping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                                        <div
                                            className="absolute inset-0 border-4 border-green-500 rounded-full"
                                            style={{
                                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((progress / 100) * 2 * Math.PI)}% 0%, ${50 + 50 * Math.cos((progress / 100) * 2 * Math.PI)}% ${50 + 50 * Math.sin((progress / 100) * 2 * Math.PI)}%, 50% 50%)`
                                            }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-green-700">{Math.round(progress)}%</span>
                                        </div>
                                    </div>
                                    <p className="text-green-600 font-medium">Mapping Progress</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Distance Traveled</span>
                                        <span className="font-semibold">{distanceTraveled.toFixed(0)}m</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Time Elapsed</span>
                                        <span className="font-semibold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toFixed(0).padStart(2, '0')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">GPS Accuracy</span>
                                        <span className="font-semibold">{gpsAccuracy ? `${gpsAccuracy.toFixed(1)}m` : '--'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Boundary Points</span>
                                        <span className="font-semibold">{boundaryPoints.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Footprints className="h-3 w-3" />
                                            Steps
                                        </span>
                                        <span className="font-semibold">{stepCount}</span>
                                    </div>
                                    {movementDirection && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600 flex items-center gap-1">
                                                <Compass className="h-3 w-3" />
                                                Direction
                                            </span>
                                            <span className="font-semibold capitalize">{movementDirection}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Status</span>
                                        <span className={`font-semibold ${isWalking ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {isWalking ? 'Walking' : 'Standing'}
                                        </span>
                                    </div>
                                </div>

                                {currentPosition && (
                                    <div className="bg-green-50 p-3 rounded-lg text-sm">
                                        <p className="text-green-700 font-medium">Current Position:</p>
                                        <p className="text-green-600">
                                            {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {isPaused ? (
                                        <Button
                                            onClick={resumeMapping}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            Resume
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={pauseMapping}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                                        >
                                            <Pause className="h-4 w-4 mr-2" />
                                            Pause
                                        </Button>
                                    )}
                                    <Button
                                        onClick={stopMapping}
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <Square className="h-4 w-4 mr-2" />
                                        Stop
                                    </Button>
                                </div>

                                <Button
                                    onClick={completeMapping}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                    disabled={boundaryPoints.length < 3}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete Mapping
                                </Button>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Error</span>
                                </div>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 