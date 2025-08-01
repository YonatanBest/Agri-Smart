"use client"

import { useState } from "react"
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
  Filter,
  Search
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
}

interface CalendarDay {
  date: number
  day: string
  weather: "sunny" | "cloudy" | "rainy" | "partly-cloudy"
  temperature: string
  tasks: Task[]
  isToday: boolean
  isSelected: boolean
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = January
  const [selectedDate, setSelectedDate] = useState(21)
  const [viewMode, setViewMode] = useState<"week" | "month">("month")

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // AI Recommended Tasks for the month
  const aiRecommendedTasks: { [key: number]: Task[] } = {
    15: [
      {
        id: 101,
        task: "Soil pH Testing - Field A",
        time: "8:00 AM",
        completed: false,
        priority: "high",
        field: "Field A",
        category: "monitoring",
        aiRecommended: true,
        description: "AI detected optimal conditions for soil testing. pH levels critical for rice crop.",
        estimatedDuration: "2 hours"
      },
      {
        id: 102,
        task: "Pre-irrigation Setup",
        time: "10:00 AM",
        completed: false,
        priority: "medium",
        field: "Field A",
        category: "irrigation",
        aiRecommended: true,
        description: "Prepare irrigation system for upcoming monsoon season.",
        estimatedDuration: "1.5 hours"
      }
    ],
    18: [
      {
        id: 103,
        task: "Fertilizer Application - NPK Mix",
        time: "6:00 AM",
        completed: false,
        priority: "high",
        field: "Field B",
        category: "fertilization",
        aiRecommended: true,
        description: "Optimal timing for NPK application based on crop growth stage.",
        estimatedDuration: "3 hours"
      }
    ],
    21: [
      {
        id: 104,
        task: "Irrigate field A - Section 1",
        time: "6:00 AM",
        completed: true,
        priority: "high",
        field: "Field A",
        category: "irrigation",
        aiRecommended: true,
        description: "Early morning irrigation for optimal water absorption.",
        estimatedDuration: "2 hours"
      },
      {
        id: 105,
        task: "Check water pump functionality",
        time: "8:00 AM",
        completed: true,
        priority: "medium",
        field: "Equipment",
        category: "maintenance",
        aiRecommended: true,
        description: "Preventive maintenance to avoid breakdown during peak season.",
        estimatedDuration: "1 hour"
      },
      {
        id: 106,
        task: "Pest Monitoring - Field C",
        time: "4:00 PM",
        completed: false,
        priority: "high",
        field: "Field C",
        category: "pest-control",
        aiRecommended: true,
        description: "AI detected potential pest activity patterns. Early detection critical.",
        estimatedDuration: "1.5 hours"
      },
      {
        id: 107,
        task: "Record daily observations",
        time: "6:00 PM",
        completed: false,
        priority: "low",
        field: "General",
        category: "monitoring",
        aiRecommended: false,
        description: "Daily log for crop health tracking.",
        estimatedDuration: "30 minutes"
      }
    ],
    22: [
      {
        id: 108,
        task: "Apply organic fertilizer",
        time: "7:00 AM",
        completed: false,
        priority: "high",
        field: "Field A",
        category: "fertilization",
        aiRecommended: true,
        description: "Organic matter application for soil health improvement.",
        estimatedDuration: "2.5 hours"
      },
      {
        id: 109,
        task: "Weather monitoring setup",
        time: "9:00 AM",
        completed: false,
        priority: "medium",
        field: "Equipment",
        category: "monitoring",
        aiRecommended: true,
        description: "Install weather sensors for precise forecasting.",
        estimatedDuration: "1 hour"
      }
    ],
    25: [
      {
        id: 110,
        task: "Harvest preparation - Field B",
        time: "8:00 AM",
        completed: false,
        priority: "high",
        field: "Field B",
        category: "harvesting",
        aiRecommended: true,
        description: "Prepare harvesting equipment and storage facilities.",
        estimatedDuration: "3 hours"
      }
    ],
    28: [
      {
        id: 111,
        task: "Crop rotation planning",
        time: "10:00 AM",
        completed: false,
        priority: "medium",
        field: "Planning",
        category: "monitoring",
        aiRecommended: true,
        description: "AI analysis for optimal crop rotation sequence.",
        estimatedDuration: "2 hours"
      }
    ]
  }

  // Generate calendar days for the month
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = []
    const daysInMonth = 31 // January
    const startDay = 1 // January 1st starts on Monday

    for (let i = 1; i <= daysInMonth; i++) {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const dayIndex = (startDay + i - 2) % 7
      const dayName = dayNames[dayIndex]
      
      const weatherOptions: Array<"sunny" | "cloudy" | "rainy" | "partly-cloudy"> = ["sunny", "cloudy", "rainy", "partly-cloudy"]
      const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
      
      days.push({
        date: i,
        day: dayName,
        weather: randomWeather,
        temperature: `${20 + Math.floor(Math.random() * 15)}°C`,
        tasks: aiRecommendedTasks[i] || [],
        isToday: i === 21,
        isSelected: i === selectedDate
      })
    }
    return days
  }

  const calendarDays = generateCalendarDays()
  const selectedDayData = calendarDays.find(day => day.date === selectedDate)

  const toggleTask = (taskId: number) => {
    console.log(`Toggle task ${taskId}`)
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "rainy":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "partly-cloudy":
        return <Cloud className="h-4 w-4 text-gray-400" />
      default:
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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Smart Farming Calendar</h1>
          <p className="text-green-600">AI-powered task management and scheduling</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "week" ? "month" : "week")}
            className="border-green-200 text-green-600"
          >
            {viewMode === "week" ? "Month View" : "Week View"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Calendar Header */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {months[currentMonth]} 2024
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-semibold text-green-700">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-3 min-h-[80px] rounded-lg cursor-pointer transition-all border-2 ${
                      day.isToday
                        ? "bg-green-500 text-white border-green-500"
                        : day.isSelected
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-gray-100 hover:bg-green-50 hover:border-green-200"
                    }`}
                  >
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
                      {day.tasks.slice(0, 2).map((task) => (
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
                      {day.tasks.length > 2 && (
                        <div className={`text-xs text-center ${
                          day.isToday ? "text-white/80" : "text-gray-500"
                        }`}>
                          +{day.tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Tasks */}
          {selectedDayData && (
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-700">
                  📋 {selectedDayData.day}, January {selectedDayData.date} - Tasks
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {selectedDayData.tasks.length} tasks
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDayData.tasks.length > 0 ? (
                  selectedDayData.tasks.map((task) => (
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
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-green-600">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No tasks scheduled for this day</p>
                    <Button variant="outline" className="mt-2 border-green-200 text-green-600">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
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
                {getWeatherIcon(selectedDayData?.weather || "sunny")}
              </div>
              <p className="text-sm text-green-600 font-medium">Weather Forecast</p>
              <p className="font-bold text-green-800 text-xl">
                {selectedDayData?.weather.replace("-", " ").toUpperCase()}
              </p>
              <p className="text-sm text-green-600 mt-1">{selectedDayData?.temperature}</p>
              <p className="text-xs text-green-500 mt-2">Ideal for outdoor farming</p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-700 mb-3">Monthly Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Tasks completed</span>
                  <span className="font-medium">18/25</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">AI recommendations</span>
                  <span className="font-medium text-purple-600">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Fields managed</span>
                  <span className="font-medium text-green-600">3/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Efficiency score</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}