// Sensor utilities for enhanced land mapping

// TypeScript declarations for sensor APIs
declare global {
    interface Window {
        Accelerometer: typeof Accelerometer
        Gyroscope: typeof Gyroscope
        Magnetometer: typeof Magnetometer
    }
}

interface Accelerometer {
    x: number | null
    y: number | null
    z: number | null
    addEventListener(type: string, listener: EventListener): void
    start(): void
    stop(): void
}

interface Gyroscope {
    x: number | null
    y: number | null
    z: number | null
    start(): void
    stop(): void
}

interface Magnetometer {
    x: number | null
    y: number | null
    z: number | null
    start(): void
    stop(): void
}

declare var Accelerometer: {
    new(options?: { frequency?: number }): Accelerometer
}

declare var Gyroscope: {
    new(options?: { frequency?: number }): Gyroscope
}

declare var Magnetometer: {
    new(options?: { frequency?: number }): Magnetometer
}

export interface SensorData {
    accelerometer: {
        x: number
        y: number
        z: number
    } | null
    gyroscope: {
        x: number
        y: number
        z: number
    } | null
    magnetometer: {
        x: number
        y: number
        z: number
    } | null
    compass: number | null
    stepCount: number
}

export class SensorManager {
    private accelerometer: Accelerometer | null = null
    private gyroscope: Gyroscope | null = null
    private magnetometer: Magnetometer | null = null
    private stepCount: number = 0
    private lastAccelerometerReading: { x: number; y: number; z: number } | null = null
    private stepThreshold = 2.5 // Increased threshold for step detection
    private walkingThreshold = 1.8 // Increased threshold for walking detection
    private lastStepTime = 0
    private stepCooldown = 500 // 500ms cooldown between steps

    constructor() {
        this.initializeSensors()
    }

    private async initializeSensors() {
        try {
            // Check if sensors are available
            if ('Accelerometer' in window) {
                this.accelerometer = new Accelerometer({ frequency: 60 })
                this.accelerometer.addEventListener('reading', () => {
                    this.handleAccelerometerReading()
                })
                this.accelerometer.start()
            }

            if ('Gyroscope' in window) {
                this.gyroscope = new Gyroscope({ frequency: 60 })
                this.gyroscope.start()
            }

            if ('Magnetometer' in window) {
                this.magnetometer = new Magnetometer({ frequency: 60 })
                this.magnetometer.start()
            }
        } catch (error) {
            console.warn('Some sensors not available:', error)
        }
    }

    private handleAccelerometerReading() {
        if (!this.accelerometer) return

        const currentReading = {
            x: this.accelerometer.x || 0,
            y: this.accelerometer.y || 0,
            z: this.accelerometer.z || 0
        }

        // Simple step detection based on acceleration magnitude
        if (this.lastAccelerometerReading) {
            const magnitude = Math.sqrt(
                Math.pow(currentReading.x - this.lastAccelerometerReading.x, 2) +
                Math.pow(currentReading.y - this.lastAccelerometerReading.y, 2) +
                Math.pow(currentReading.z - this.lastAccelerometerReading.z, 2)
            )

            const now = Date.now()
            if (magnitude > this.stepThreshold && (now - this.lastStepTime) > this.stepCooldown) {
                this.stepCount++
                this.lastStepTime = now
            }
        }

        this.lastAccelerometerReading = currentReading
    }

    public getSensorData(): SensorData {
        return {
            accelerometer: this.accelerometer ? {
                x: this.accelerometer.x || 0,
                y: this.accelerometer.y || 0,
                z: this.accelerometer.z || 0
            } : null,
            gyroscope: this.gyroscope ? {
                x: this.gyroscope.x || 0,
                y: this.gyroscope.y || 0,
                z: this.gyroscope.z || 0
            } : null,
            magnetometer: this.magnetometer ? {
                x: this.magnetometer.x || 0,
                y: this.magnetometer.y || 0,
                z: this.magnetometer.z || 0
            } : null,
            compass: this.calculateCompassHeading(),
            stepCount: this.stepCount
        }
    }

    private calculateCompassHeading(): number | null {
        if (!this.magnetometer) return null

        const x = this.magnetometer.x || 0
        const y = this.magnetometer.y || 0

        let heading = Math.atan2(y, x) * 180 / Math.PI
        heading = (heading + 360) % 360

        return heading
    }

    public resetStepCount() {
        this.stepCount = 0
        this.lastStepTime = 0
    }

    public getStepCount(): number {
        return this.stepCount
    }

    public isWalking(): boolean {
        if (!this.accelerometer) return false

        const magnitude = Math.sqrt(
            Math.pow(this.accelerometer.x || 0, 2) +
            Math.pow(this.accelerometer.y || 0, 2) +
            Math.pow(this.accelerometer.z || 0, 2)
        )

        // More conservative walking detection
        return magnitude > this.walkingThreshold
    }

    public getMovementDirection(): 'north' | 'south' | 'east' | 'west' | null {
        const heading = this.calculateCompassHeading()
        if (heading === null) return null

        if (heading >= 315 || heading < 45) return 'north'
        if (heading >= 45 && heading < 135) return 'east'
        if (heading >= 135 && heading < 225) return 'south'
        if (heading >= 225 && heading < 315) return 'west'

        return null
    }

    public cleanup() {
        if (this.accelerometer) {
            this.accelerometer.stop()
        }
        if (this.gyroscope) {
            this.gyroscope.stop()
        }
        if (this.magnetometer) {
            this.magnetometer.stop()
        }
    }
}

// Enhanced GPS tracking with sensor fusion
export class EnhancedGPSTracker {
    private sensorManager: SensorManager
    private gpsPositions: Array<{
        latitude: number
        longitude: number
        accuracy: number
        timestamp: number
        sensorData: SensorData
    }> = []
    private lastPosition: { latitude: number; longitude: number; timestamp: number } | null = null
    private minDistanceThreshold = 3 // Minimum 3 meters between GPS points
    private maxTimeThreshold = 5000 // Maximum 5 seconds between GPS updates

    constructor() {
        this.sensorManager = new SensorManager()
    }

    public addGPSPosition(
        latitude: number,
        longitude: number,
        accuracy: number,
        timestamp: number
    ) {
        // Only add position if we've moved enough or enough time has passed
        if (this.shouldAddPosition(latitude, longitude, timestamp)) {
            const sensorData = this.sensorManager.getSensorData()

            this.gpsPositions.push({
                latitude,
                longitude,
                accuracy,
                timestamp,
                sensorData
            })

            this.lastPosition = { latitude, longitude, timestamp }
        }
    }

    private shouldAddPosition(latitude: number, longitude: number, timestamp: number): boolean {
        if (!this.lastPosition) return true

        const distance = this.calculateDistance(
            this.lastPosition.latitude,
            this.lastPosition.longitude,
            latitude,
            longitude
        )
        const timeDiff = timestamp - this.lastPosition.timestamp

        // Add position if we've moved more than threshold OR if significant time has passed
        return distance > this.minDistanceThreshold || timeDiff > this.maxTimeThreshold
    }

    public getFilteredPositions(): Array<{
        latitude: number
        longitude: number
        accuracy: number
        timestamp: number
    }> {
        // Filter out positions with poor accuracy or unrealistic movement
        return this.gpsPositions
            .filter(pos => pos.accuracy < 10) // Only positions with accuracy better than 10m
            .filter((pos, index, array) => {
                if (index === 0) return true

                const prevPos = array[index - 1]
                const distance = this.calculateDistance(
                    prevPos.latitude,
                    prevPos.longitude,
                    pos.latitude,
                    pos.longitude
                )
                const timeDiff = (pos.timestamp - prevPos.timestamp) / 1000 // seconds

                // Filter out unrealistic speeds (> 10 m/s = 36 km/h)
                const speed = distance / timeDiff
                return speed < 10
            })
            .map(pos => ({
                latitude: pos.latitude,
                longitude: pos.longitude,
                accuracy: pos.accuracy,
                timestamp: pos.timestamp
            }))
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3 // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180
        const φ2 = lat2 * Math.PI / 180
        const Δφ = (lat2 - lat1) * Math.PI / 180
        const Δλ = (lon2 - lon1) * Math.PI / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c
    }

    public getStepCount(): number {
        return this.sensorManager.getStepCount()
    }

    public isWalking(): boolean {
        return this.sensorManager.isWalking()
    }

    public getMovementDirection(): 'north' | 'south' | 'east' | 'west' | null {
        return this.sensorManager.getMovementDirection()
    }

    public cleanup() {
        this.sensorManager.cleanup()
    }
} 