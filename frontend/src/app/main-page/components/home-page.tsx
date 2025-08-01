"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer, MapPin, Sprout, Users, TrendingUp, AlertCircle, ChevronLeft, ChevronRight, Sun, Cloud, CheckCircle, Circle, Badge, Brain, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function HomePage() {

  const weekDays = [
    { day: "Mon", date: 20, tasks: ["Soil check"], weather: "sunny" },
    { day: "Tue", date: 21, tasks: ["Irrigate field A", "Check equipment"], weather: "cloudy" },
    { day: "Wed", date: 22, tasks: ["Apply fertilizer"], weather: "rainy" },
    { day: "Thu", date: 23, tasks: ["Pest inspection"], weather: "sunny" },
    { day: "Fri", date: 24, tasks: ["Fertilize field B", "Water plants"], weather: "cloudy" },
    { day: "Sat", date: 25, tasks: ["Market visit"], weather: "sunny" },
    { day: "Sun", date: 26, tasks: ["Rest day", "Planning"], weather: "sunny" },
  ]

  const [userTasks, setUserTasks] = useState([
    {
      id: 1,
      task: "Check water pump functionality",
      time: "8:00 AM",
      completed: true,
      priority: "medium",
      field: "Equipment",
      isAI: false,
    },
    {
      id: 2,
      task: "Record daily observations",
      time: "6:00 PM",
      completed: false,
      priority: "low",
      field: "General",
      isAI: false,
    },
  ])

  // Generate AI recommendations based on mock crop data
  const generateAITasks = () => {
    const aiTasks = []
    const currentDate = new Date()
    const dayOfWeek = currentDate.getDay()
    
    // Mock crop data for UI demonstration
    const mockCrops = [
      { name: "Rice", stage: "Vegetative", icon: "🌾" },
      { name: "Wheat", stage: "Flowering", icon: "🌾" },
      { name: "Pulses", stage: "Germination", icon: "🫘" }
    ]

    // Generate tasks based on crop stages and current date
    mockCrops.forEach((crop: any, index: number) => {
      const baseTime = 6 + (index * 2) // Spread tasks throughout the day
      const time = `${baseTime}:00 ${baseTime < 12 ? 'AM' : 'PM'}`
      
      switch (crop.stage) {
        case "Germination":
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Check soil moisture for ${crop.name} germination`,
            time: time,
            completed: false,
            priority: "high",
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Critical for successful germination"
          })
          break
        case "Vegetative":
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Apply nitrogen fertilizer to ${crop.name}`,
            time: time,
            completed: false,
            priority: "high",
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Vegetative stage requires high nitrogen"
          })
          break
        case "Flowering":
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Monitor ${crop.name} for pest activity`,
            time: time,
            completed: false,
            priority: "high",
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Flowering stage is vulnerable to pests"
          })
          break
        case "Ripening":
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Reduce irrigation for ${crop.name} ripening`,
            time: time,
      completed: false, 
      priority: "medium", 
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Ripening stage needs controlled water"
          })
          break
        case "Harvest":
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Prepare harvesting equipment for ${crop.name}`,
            time: time,
      completed: false,
      priority: "high",
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Harvest preparation is critical"
          })
          break
        default:
          aiTasks.push({
            id: `ai-${index}-1`,
            task: `Monitor ${crop.name} growth progress`,
            time: time,
            completed: false,
            priority: "medium",
            field: `${crop.name} Field`,
            isAI: true,
            reason: "Regular monitoring ensures optimal growth"
          })
      }
    })

    // Add weather-based tasks
    if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
      aiTasks.push({
        id: "ai-weather-1",
        task: "Check weather forecast for irrigation planning",
        time: "7:00 AM",
        completed: false,
        priority: "medium",
        field: "All Fields",
        isAI: true,
        reason: "Weather affects irrigation decisions"
      })
    }

    // Add soil health tasks
    if (dayOfWeek === 2) { // Tuesday
      aiTasks.push({
        id: "ai-soil-1",
        task: "Test soil pH levels",
        time: "9:00 AM",
        completed: false,
        priority: "medium",
        field: "All Fields",
        isAI: true,
        reason: "Weekly soil monitoring maintains health"
      })
    }

    return aiTasks
  }

  const [aiTasks, setAiTasks] = useState(generateAITasks())
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    task: "",
    time: "",
    priority: "medium",
    field: "General"
  })

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-4 w-4 text-green-500" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-green-500" />
      case "rainy":
        return <Droplets className="h-4 w-4 text-green-500" />
      default:
        return <Sun className="h-4 w-4 text-green-500" />
    }
  }
  
  const toggleTask = (taskId: number) => {
    console.log(`Toggle task ${taskId}`)
  }

  const [selectedDay, setSelectedDay] = useState(2) // Tuesday selected
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])

  // Mock AI recommendations for UI demonstration
  useEffect(() => {
    const mockRecommendations = [
      { name: "Rice", stage: "Vegetative", icon: "🌾" },
      { name: "Wheat", stage: "Flowering", icon: "🌾" },
      { name: "Pulses", stage: "Germination", icon: "🫘" }
    ]
    setAiRecommendations(mockRecommendations)
  }, [])
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div
        className="relative rounded-3xl p-4 md:p-6 text-white overflow-hidden"
        style={{
          backgroundImage: "url('/img-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-black/50 z-0" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold">Welcome back, Farmer! 👋</h2>
              <p className="text-green-100 text-sm md:text-base">Your virtual farmland awaits</p>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-green-100 text-sm">Last updated</p>
            <p className="text-white font-semibold">Today, 10:30 AM</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6">
        {/* AI Recommendation Overview */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center gap-2 text-base md:text-lg">
              <Brain className="h-5 w-5" />
              AI Recommendation Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.length > 0 ? (
              <div className="space-y-3">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl">{rec.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">{rec.name}</p>
                      <p className="text-sm text-green-600">Stage: {rec.stage}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      AI Recommended
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                  <p className="text-xs md:text-sm text-green-600 font-medium">Soil Type</p>
                  <p className="text-green-800 font-bold text-sm md:text-lg">Clay Loam</p>
                  <p className="text-xs text-green-600 mt-1">pH: 6.8 (Good)</p>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                  <p className="text-xs md:text-sm text-green-600 font-medium">Land Area</p>
                  <p className="text-green-800 font-bold text-sm md:text-lg">2.5 hectares</p>
                  <p className="text-xs text-green-600 mt-1">6.2 acres</p>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                  <p className="text-xs md:text-sm text-green-600 font-medium">Crop Type</p>
                  <p className="text-green-800 font-bold text-sm md:text-lg">Rice & Wheat</p>
                  <p className="text-xs text-green-600 mt-1">Rotation cycle</p>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl">
                  <p className="text-xs md:text-sm text-green-600 font-medium">Water Access</p>
                  <p className="text-green-800 font-bold text-sm md:text-lg">Tube Well</p>
                  <p className="text-xs text-green-600 mt-1">150ft depth</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Tasks - {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowAddTask(!showAddTask)}
                className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
              >
                + Add Task
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* AI Tasks */}
              {aiTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border-l-4 border-blue-400"
                >
                  <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="p-0 h-auto">
                    {task.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-green-400" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${task.completed ? "line-through text-green-500" : "text-green-800"}`}>
                        {task.task}
                      </p>
                      <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                        <Brain className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-green-600">{task.time}</span>
                      <Badge className="text-xs border-green-200 text-green-600">
                        {task.field}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          task.priority === "high"
                            ? "border-green-300 text-green-700 bg-green-50"
                            : task.priority === "medium"
                              ? "border-green-200 text-green-600"
                              : "border-green-200 text-green-600"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    {task.reason && (
                      <p className="text-xs text-blue-600 mt-1 italic">💡 {task.reason}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* User Tasks */}
              {userTasks.map((task: any) => (
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
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${task.completed ? "line-through text-green-500" : "text-green-800"}`}>
                        {task.task}
                      </p>
                      <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                        Manual
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-green-600">{task.time}</span>
                      <Badge className="text-xs border-green-200 text-green-600">
                        {task.field}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          task.priority === "high"
                            ? "border-green-300 text-green-700 bg-green-50"
                            : task.priority === "medium"
                              ? "border-green-200 text-green-600"
                              : "border-green-200 text-green-600"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Form */}
              {showAddTask && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter task description"
                      value={newTask.task}
                      onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                      className="w-full p-2 border border-yellow-300 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={newTask.time}
                        onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                        className="p-2 border border-yellow-300 rounded-lg"
                      />
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        className="p-2 border border-yellow-300 rounded-lg"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (newTask.task && newTask.time) {
                            setUserTasks([...userTasks, {
                              id: Date.now(),
                              ...newTask,
                              completed: false,
                              isAI: false
                            }])
                            setNewTask({task: "", time: "", priority: "medium", field: "General"})
                            setShowAddTask(false)
                          }
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Add Task
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddTask(false)}
                        className="border-yellow-300 text-yellow-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>


     

      {/* Stats Overview - Mobile: 2 cols, Desktop: 4 cols */}
      {/* Calendar and Tasks */}
     
      {/* Quick Actions - Mobile: 2 cols, Desktop: 4 cols */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <p className="font-semibold text-green-700 text-sm md:text-lg">Crop Diagnosis</p>
            <p className="text-xs md:text-sm text-green-600 mt-1">AI-powered health check</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <span className="text-2xl md:text-3xl">💬</span>
            </div>
            <p className="font-semibold text-green-700 text-sm md:text-lg">Ask AI Expert</p>
            <p className="text-xs md:text-sm text-green-600 mt-1">Get instant farming advice</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <span className="text-2xl md:text-3xl">📅</span>
            </div>
            <p className="font-semibold text-green-700 text-sm md:text-lg">Farm Calendar</p>
            <p className="text-xs md:text-sm text-green-600 mt-1">Weekly task planning</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <span className="text-2xl md:text-3xl">📊</span>
            </div>
            <p className="font-semibold text-green-700 text-sm md:text-lg">Analytics</p>
            <p className="text-xs md:text-sm text-green-600 mt-1">Farm performance insights</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Recent Activity */}
      <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2 text-base md:text-lg">
            📈 Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Irrigation completed for Field A</p>
                <p className="text-xs text-green-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Fertilizer application scheduled</p>
                <p className="text-xs text-green-600">Tomorrow, 6:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Crop health scan completed</p>
                <p className="text-xs text-green-600">Yesterday, 4:30 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
