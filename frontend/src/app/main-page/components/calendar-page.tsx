"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  Droplets, 
  Sun, 
  CalendarIcon,
  Brain,
  Clock,
  MapPin,
  AlertTriangle,
  Plus,
  Search,
  Users,
  Target
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { apiService } from "@/lib/api"

interface Task {
  id: number
  task: string
  time: string
  completed: boolean
  priority: "high" | "medium" | "low"
  field: string
  category: "irrigation" | "fertilization" | "pest-control" | "monitoring" | "harvesting" | "maintenance"
  aiRecommended: boolean
  description?: string
  estimatedDuration?: string
  aiReasoning?: string // AI's reasoning for the recommendation
}

interface WeatherDay {
  date: string
  weather_code: number
  weather_description: string
  weather_icon: string
  weather_condition: string
  temperature_max: number | null
  temperature_min: number | null
  rain_sum: number | null
  is_rainy: boolean
  is_cloudy: boolean
  is_sunny: boolean
}

interface CalendarDay {
  date: number
  day: string
  weather: WeatherDay | null
  tasks: Task[]
  isToday: boolean
  isSelected: boolean
}

export default function CalendarPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([])
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [locationData, setLocationData] = useState<{lat: number, lon: number} | null>(null)
  const [taskCache, setTaskCache] = useState<{[key: string]: Task[]}>({})
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Parse user location from crops_grown or use default
  useEffect(() => {
    if (user?.crops_grown && user.crops_grown.length > 0) {
      const locationStr = user.crops_grown.find(crop => crop.includes('lat:') && crop.includes('lon:'))
      if (locationStr) {
        const latMatch = locationStr.match(/lat:([\d.-]+)/)
        const lonMatch = locationStr.match(/lon:([\d.-]+)/)
        if (latMatch && lonMatch) {
          setLocationData({
            lat: parseFloat(latMatch[1]),
            lon: parseFloat(lonMatch[1])
          })
        }
      }
    }
    
    // Fallback to default location if no location found
    if (!locationData) {
      setLocationData({ lat: 9.145, lon: 40.489 }) // Default to Ethiopia
    }
  }, [user, locationData])

  // Fetch weather data when location changes
  useEffect(() => {
    if (locationData) {
      fetchWeatherData()
    }
  }, [locationData])

  // Load tasks when a date is selected
  useEffect(() => {
    if (selectedDate > 0 && locationData && weatherData.length > 0) {
      loadTasksForDate(selectedDate)
    }
  }, [selectedDate, locationData, weatherData])

     const fetchWeatherData = async () => {
     if (!locationData) return
     
     setIsLoadingWeather(true)
     try {
       // OpenMeteo supports up to 16 days, but using 14 to be safe
       const response = await apiService.getCalendarWeather(locationData.lat, locationData.lon, 14)
       if (response.status === "success") {
         setWeatherData(response.daily_weather)
       }
     } catch (error) {
       console.error("Error fetching weather data:", error)
     } finally {
       setIsLoadingWeather(false)
     }
   }

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = []
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear()
    
    // Add empty days for padding
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        date: 0,
        day: "",
        weather: null,
        tasks: [],
        isToday: false,
        isSelected: false
      })
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i)
      const dayIndex = dayDate.getDay()
      const dayName = dayNames[dayIndex]
      
      // Find weather data for this date
      const weatherForDay = weatherData.find(w => {
        const weatherDate = new Date(w.date)
        return weatherDate.getDate() === i && 
               weatherDate.getMonth() === currentMonth && 
               weatherDate.getFullYear() === currentYear
      })
      
      days.push({
        date: i,
        day: dayName,
        weather: weatherForDay || null,
        tasks: [], // Will be populated asynchronously
        isToday: isCurrentMonth && i === today.getDate(),
        isSelected: i === selectedDate
      })
    }
    
    return days
  }

     // Get AI-powered tasks for a specific date
   const getTasksForDate = async (date: number): Promise<{tasks: Task[], cached?: boolean}> => {
     const tasks: Task[] = []
     
     // Find weather data for this date
     const dayWeather = weatherData.find(w => {
       const weatherDate = new Date(w.date)
       return weatherDate.getDate() === date && 
              weatherDate.getMonth() === currentMonth && 
              weatherDate.getFullYear() === currentYear
     })
     
     if (dayWeather && locationData) {
       try {
         // Format date for API
         const dateStr = dayWeather.date
         
         // Get AI-powered task recommendations
         const response = await apiService.getAITaskRecommendations(
           locationData.lat, 
           locationData.lon, 
           dateStr
         )
         
         if (response.status === "success" && response.tasks) {
           // Convert AI response to Task format
           const convertedTasks = response.tasks.map((aiTask: any, index: number) => ({
             id: date * 100 + index + 1,
             task: aiTask.task,
             time: aiTask.time,
             completed: false,
             priority: aiTask.priority as "high" | "medium" | "low",
             field: aiTask.field,
             category: aiTask.category as "irrigation" | "fertilization" | "pest-control" | "monitoring" | "harvesting" | "maintenance",
             aiRecommended: true,
             description: aiTask.description,
             estimatedDuration: aiTask.estimated_duration,
             aiReasoning: aiTask.ai_reasoning // Additional AI reasoning field
           }))
           
           return {
             tasks: convertedTasks,
             cached: response.cached || false
           }
         }
       } catch (error) {
         console.error("Error fetching AI task recommendations:", error)
         // Fallback to basic weather-based tasks
         return {
           tasks: getFallbackTasks(dayWeather),
           cached: false
         }
       }
     }
     
     return { tasks: [], cached: false }
   }

  // Fallback tasks when AI fails
  const getFallbackTasks = (dayWeather: WeatherDay): Task[] => {
    const tasks: Task[] = []
    
    if (dayWeather.is_rainy) {
      tasks.push({
        id: Date.now() + 1,
        task: "Check drainage systems",
        time: "8:00 AM",
        completed: false,
        priority: "high",
        field: "Field A",
        category: "maintenance",
        aiRecommended: true,
        description: "Heavy rain expected - ensure proper drainage",
        estimatedDuration: "1 hour"
      })
    }
    
    if (dayWeather.temperature_max && dayWeather.temperature_max > 30) {
      tasks.push({
        id: Date.now() + 2,
        task: "Increase irrigation",
        time: "6:00 AM",
        completed: false,
        priority: "high",
        field: "All Fields",
        category: "irrigation",
        aiRecommended: true,
        description: "High temperature - crops need more water",
        estimatedDuration: "2 hours"
      })
    }
    
    return tasks
  }

  const calendarDays = generateCalendarDays()
  const selectedDayData = calendarDays.find(day => day.date === selectedDate)

     // Load tasks for a specific date
   const loadTasksForDate = async (date: number) => {
     if (!locationData) return
     
     const cacheKey = `${currentYear}-${currentMonth + 1}-${date}`
     
     // Check if tasks are already cached
     if (taskCache[cacheKey]) return
     
     setIsLoadingTasks(true)
     try {
       const result = await getTasksForDate(date)
       setTaskCache(prev => ({
         ...prev,
         [cacheKey]: result.tasks
       }))
     } catch (error) {
       console.error("Error loading tasks for date:", date, error)
     } finally {
       setIsLoadingTasks(false)
     }
   }

  // Get tasks for display (from cache or empty array)
  const getTasksForDisplay = (date: number): Task[] => {
    const cacheKey = `${currentYear}-${currentMonth + 1}-${date}`
    return taskCache[cacheKey] || []
  }

  const toggleTask = (taskId: number) => {
    console.log(`Toggle task ${taskId}`)
  }

  const getWeatherIcon = (weather: WeatherDay | null) => {
    if (!weather) return <Sun className="h-4 w-4 text-yellow-500" />
    
    if (weather.is_rainy) {
      return <Droplets className="h-4 w-4 text-blue-500" />
    } else if (weather.is_cloudy) {
        return <Cloud className="h-4 w-4 text-gray-500" />
    } else {
        return <Sun className="h-4 w-4 text-yellow-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "irrigation":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "fertilization":
        return <Circle className="h-4 w-4 text-green-500" />
      case "pest-control":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "monitoring":
        return <Search className="h-4 w-4 text-purple-500" />
      case "harvesting":
        return <CheckCircle className="h-4 w-4 text-orange-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 text-red-700 bg-red-50"
      case "medium":
        return "border-yellow-300 text-yellow-700 bg-yellow-50"
      case "low":
        return "border-green-200 text-green-600"
      default:
        return "border-gray-200 text-gray-600"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Smart Farming Calendar</h1>
          <p className="text-green-600">AI-powered task management and scheduling</p>
        </div>
      </div>

             {/* Location Info */}
       {locationData && (
         <Alert className="border-green-200 bg-green-50">
           <MapPin className="h-4 w-4" />
           <AlertDescription>
             Weather data for location: {locationData.lat.toFixed(4)}, {locationData.lon.toFixed(4)}
             {isLoadingWeather && " - Loading weather data..."}
             <br />
             <span className="text-sm text-green-600">
               Note: Weather forecast is limited to 14 days due to API constraints
             </span>
             <br />
             <span className="text-xs text-green-500">
               💾 Data is cached for faster loading
             </span>
           </AlertDescription>
         </Alert>
       )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Calendar Header */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {months[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-semibold text-green-700">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => day.date > 0 && setSelectedDate(day.date)}
                    className={`p-3 min-h-[80px] rounded-lg cursor-pointer transition-all border-2 ${
                      day.date === 0
                        ? "bg-gray-50 border-gray-100"
                        : day.isToday
                        ? "bg-green-500 text-white border-green-500"
                        : day.isSelected
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-gray-100 hover:bg-green-50 hover:border-green-200"
                    }`}
                  >
                    {day.date > 0 && (
                      <>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        day.isToday ? "text-white" : "text-gray-700"
                      }`}>
                        {day.date}
                      </span>
                      {getWeatherIcon(day.weather)}
                    </div>
                    
                    {/* Task Indicators */}
                    <div className="space-y-1">
                          {getTasksForDisplay(day.date).slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded ${
                            day.isToday
                              ? "bg-white/20 text-white"
                              : task.aiRecommended
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.aiRecommended && <Brain className="h-2 w-2 inline mr-1" />}
                          {task.task.substring(0, 15)}...
                        </div>
                      ))}
                          {getTasksForDisplay(day.date).length > 2 && (
                        <div className={`text-xs text-center ${
                          day.isToday ? "text-white/80" : "text-gray-500"
                        }`}>
                              +{getTasksForDisplay(day.date).length - 2} more
                        </div>
                      )}
                    </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Tasks */}
          {selectedDayData && selectedDayData.date > 0 && (
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-700">
                  📋 {selectedDayData.day}, {months[currentMonth]} {selectedDayData.date} - Tasks
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {getTasksForDisplay(selectedDayData.date).length} tasks
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => loadTasksForDate(selectedDayData.date)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {isLoadingTasks ? "Loading..." : "Load AI Tasks"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {getTasksForDisplay(selectedDayData.date).length > 0 ? (
                  getTasksForDisplay(selectedDayData.date).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="p-0 h-auto">
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-green-400" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium ${task.completed ? "line-through text-green-500" : "text-green-800"}`}>
                            {task.task}
                          </p>
                          {task.aiRecommended && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Recommended
                            </Badge>
                          )}
                         {/* Note: Cached status is handled at the API level, not per task */}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                          <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {task.field}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          {task.estimatedDuration && (
                            <span className="text-xs text-green-600">
                              ⏱️ {task.estimatedDuration}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-green-600 italic">{task.description}</p>
                        )}
                        {task.aiReasoning && (
                          <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-700 font-medium">🤖 AI Reasoning:</p>
                            <p className="text-xs text-purple-600">{task.aiReasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-green-600">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No AI tasks loaded for this day</p>
                    <Button 
                      variant="outline" 
                      className="mt-2 border-green-200 text-green-600"
                      onClick={() => loadTasksForDate(selectedDayData.date)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {isLoadingTasks ? "Loading AI Tasks..." : "Load AI Tasks"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Weather */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 {getWeatherIcon(selectedDayData?.weather)}
              </div>
              <p className="text-sm text-green-600 font-medium">Weather Forecast</p>
              <p className="font-bold text-green-800 text-xl">
                 {selectedDayData?.weather?.weather_description?.toUpperCase() || "CLEAR SKY"}
               </p>
               <p className="text-sm text-green-600 mt-1">
                 {selectedDayData?.weather?.temperature_max 
                   ? `${selectedDayData.weather.temperature_max}°C` 
                   : "N/A"}
               </p>
              <p className="text-xs text-green-500 mt-2">Ideal for outdoor farming</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}