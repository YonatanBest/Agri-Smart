"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Cloud, Droplets, Sun, CalendarIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(2) // Tuesday selected
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false)

  const weekDays = [
    { day: "Mon", date: 20, tasks: ["Soil check"], weather: "sunny" },
    { day: "Tue", date: 21, tasks: ["Irrigate field A", "Check equipment"], weather: "cloudy" },
    { day: "Wed", date: 22, tasks: ["Apply fertilizer"], weather: "rainy" },
    { day: "Thu", date: 23, tasks: ["Pest inspection"], weather: "sunny" },
    { day: "Fri", date: 24, tasks: ["Fertilize field B", "Water plants"], weather: "cloudy" },
    { day: "Sat", date: 25, tasks: ["Market visit"], weather: "sunny" },
    { day: "Sun", date: 26, tasks: ["Rest day", "Planning"], weather: "sunny" },
  ]

  const todayTasks = [
    {
      id: 1,
      task: "Irrigate field A - Section 1",
      time: "6:00 AM",
      completed: true,
      priority: "high",
      field: "Field A",
    },
    {
      id: 2,
      task: "Check water pump functionality",
      time: "8:00 AM",
      completed: true,
      priority: "medium",
      field: "Equipment",
    },
    {
      id: 3,
      task: "Irrigate field A - Section 2",
      time: "4:00 PM",
      completed: false,
      priority: "high",
      field: "Field A",
    },
    { id: 4, task: "Record daily observations", time: "6:00 PM", completed: false, priority: "low", field: "General" },
    {
      id: 5,
      task: "Check soil moisture levels",
      time: "7:00 PM",
      completed: false,
      priority: "medium",
      field: "Field B",
    },
  ]

  const toggleTask = (taskId: number) => {
    console.log(`Toggle task ${taskId}`)
  }

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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">📅 Smart Farm Calendar</h2>
            <p className="text-green-100">AI-powered weekly planning for your farm</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">Tasks completed</p>
              <p className="text-white font-bold text-2xl">8/12</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CalendarIcon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 font-medium">Current Weather</p>
              <p className="font-bold text-green-800 text-xl">Partly Cloudy</p>
              <p className="text-sm text-green-600 mt-1">28°C, 65% humidity</p>
              <p className="text-xs text-green-500 mt-2">Perfect for outdoor work</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 font-medium">Next Priority Action</p>
              <p className="font-bold text-green-800 text-xl">Irrigate Field A</p>
              <p className="text-sm text-green-600 mt-1">Today, 4:00 PM</p>
              <Badge className="mt-2 bg-green-500">High Priority</Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-700 mb-3">Weekly Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Tasks completed</span>
                  <span className="font-medium">8/12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Fields irrigated</span>
                  <span className="font-medium text-green-600">2/3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Treatments applied</span>
                  <span className="font-medium text-green-600">3/4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Week Calendar */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-700">This Week</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">January 2024</span>
                <Button variant="ghost" size="sm" className="p-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                      selectedDay === index ? "bg-green-500 text-white shadow-lg" : "bg-green-50 hover:bg-green-100"
                    }`}
                  >
                    <p className="text-xs font-medium">{day.day}</p>
                    <p className="text-lg font-bold">{day.date}</p>
                    <div className="mt-2 flex items-center justify-center">{getWeatherIcon(day.weather)}</div>
                    <div className="mt-1">
                      {day.tasks.length > 0 && (
                        <div
                          className={`w-2 h-2 rounded-full mx-auto ${selectedDay === index ? "bg-white" : "bg-green-400"}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
                className="w-full bg-green-500 hover:bg-green-600 rounded-xl"
              >
                {showWeeklyPlan ? "Hide" : "Show"} AI Weekly Plan Details
              </Button>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-700">📋 Today's Tasks - Tuesday</CardTitle>
              <Button
                variant="outline"
                className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
              >
                + Add Task
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.map((task) => (
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
                    <p className={`font-medium ${task.completed ? "line-through text-green-500" : "text-green-800"}`}>
                      {task.task}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-green-600">{task.time}</span>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                        {task.field}
                      </Badge>
                      <Badge
                        variant="outline"
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Plan Details */}
      {showWeeklyPlan && (
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg animate-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle className="text-green-700">🤖 AI Generated Weekly Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Sun className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Optimal Schedule:</strong> Based on weather forecast and crop growth stage
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {weekDays.map((day, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.weather)}
                    <div>
                      <p className="font-medium text-green-800">
                        {day.day}, Jan {day.date}
                      </p>
                      <p className="text-sm text-green-600">{day.tasks.join(", ")}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {day.tasks.length} task{day.tasks.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}