"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer, MapPin, Sprout, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function HomePage() {
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-4 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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

      {/* Stats Overview - Mobile: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-green-600 font-medium">Total Yield</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">2.8 tons</p>
                <p className="text-xs text-green-600">+12% from last season</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-green-600 font-medium">Crop Health</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">92%</p>
                <Progress value={92} className="w-12 md:w-16 h-2 mt-1" />
              </div>
              <Sprout className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-green-600 font-medium">Water Usage</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">1,250L</p>
                <p className="text-xs text-green-600">Today</p>
              </div>
              <Droplets className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-green-600 font-medium">Active Alerts</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">3</p>
                <p className="text-xs text-green-600">Requires attention</p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6">
        {/* Farm Overview */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center gap-2 text-base md:text-lg">
              🏡 Ai recommndation Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Weather & Location */}
        {/* <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center gap-2 text-base md:text-lg">
              🌤️ Weather & Location Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-gray-700 font-medium text-sm md:text-base">Punjab, India</span>
              <span className="text-xs text-gray-500 ml-auto">Updated 5 min ago</span>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
              <div className="bg-green-50 p-3 md:p-4 rounded-xl text-center">
                <Thermometer className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-green-600 font-medium">Temperature</p>
                <p className="font-bold text-green-800 text-sm md:text-lg">28°C</p>
                <p className="text-xs text-green-600">Feels like 31°C</p>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl text-center">
                <Droplets className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-green-600 font-medium">Humidity</p>
                <p className="font-bold text-green-800 text-sm md:text-lg">65%</p>
                <p className="text-xs text-green-600">Moderate</p>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-xl text-center">
                <Sprout className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-green-600 font-medium">Crop Stage</p>
                <p className="font-bold text-green-800 text-sm md:text-lg">Growing</p>
                <p className="text-xs text-green-600">Day 45</p>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Today's AI Recommendation:</p>
              <p className="text-green-600 font-semibold text-sm md:text-base">
                Perfect day for irrigation! Consider watering in the evening between 4-6 PM for optimal absorption.
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>

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
