"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, AlertTriangle, CheckCircle, MessageCircle, Bell, Calendar, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function MonitorPage() {
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false)

  const handleImageUpload = () => {
    setShowDiagnosisResult(true)
  }

  const fertilizers = [
    { name: "NPK 20-20-20", date: "2024-01-15", status: "applied", field: "Field A" },
    { name: "Urea", date: "2024-01-10", status: "applied", field: "Field B" },
    { name: "Potash", date: "2024-01-25", status: "upcoming", field: "Field A" },
    { name: "Organic Compost", date: "2024-01-20", status: "applied", field: "Field C" },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">🔍 Monitor & Diagnose</h2>
            <p className="text-green-100">Keep your crops healthy with AI insights</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">Health Score</p>
              <p className="text-white font-bold text-2xl">92%</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div> */}

      <Tabs defaultValue="diagnosis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-white rounded-2xl p-1 shadow-sm">
          <TabsTrigger
            value="diagnosis"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Crop Health Diagnosis
          </TabsTrigger>
          <TabsTrigger
            value="tracker"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Treatment Tracker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">📱 Crop Health Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Upload or capture images of your crop, leaf, or soil for AI analysis
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleImageUpload}
                    className="h-32 flex flex-col gap-3 bg-green-500 hover:bg-green-600 rounded-2xl"
                  >
                    <Camera className="h-12 w-12" />
                    <span className="text-sm font-medium">Capture Image</span>
                    <span className="text-xs opacity-80">Use camera</span>
                  </Button>
                  <Button
                    onClick={handleImageUpload}
                    variant="outline"
                    className="h-32 flex flex-col gap-3 border-2 border-green-300 rounded-2xl hover:bg-green-50 bg-transparent"
                  >
                    <Upload className="h-12 w-12 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Upload Image</span>
                    <span className="text-xs text-green-600 opacity-80">From gallery</span>
                  </Button>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700">
                    <strong>Pro Tip:</strong> For best results, capture images in natural daylight and ensure the
                    affected area is clearly visible.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">📊 Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Overall Health</span>
                      <span className="text-sm font-bold text-green-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Disease Risk</span>
                      <span className="text-sm font-bold text-green-600">Low</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Nutrient Level</span>
                      <span className="text-sm font-bold text-green-600">Good</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">15</p>
                    <p className="text-xs text-green-600">Scans this month</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">2</p>
                    <p className="text-xs text-green-600">Issues detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Diagnosis Result */}
          {showDiagnosisResult && (
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg animate-in slide-in-from-bottom duration-500">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">🤖 AI Diagnosis Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50">
                      <AlertTriangle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        <strong>Issue Detected:</strong> Bacterial Leaf Blight Disease
                      </AlertDescription>
                    </Alert>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Problem Summary:</h4>
                      <p className="text-sm text-green-700">
                        Your rice crop shows signs of bacterial leaf blight. This is common during humid conditions and
                        can spread rapidly if not treated. Confidence level: 94%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Actionable Recommendations:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Apply copper-based fungicide immediately</li>
                        <li>• Improve drainage to reduce moisture</li>
                        <li>• Remove affected leaves and burn them</li>
                        <li>• Monitor other plants for early signs</li>
                        <li>• Increase air circulation between plants</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-green-500 hover:bg-green-600 rounded-xl flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Ask AI Expert
                      </Button>
                      <Button variant="outline" className="rounded-xl border-2 bg-transparent">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Treatment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fertilizer Tracker */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-green-700 flex items-center gap-2">🧪 Treatment History</CardTitle>
                  <Button className="bg-green-500 hover:bg-green-600 rounded-xl">+ Log New Treatment</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {fertilizers.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-green-800">{item.name}</p>
                            <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                              {item.field}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-600 mt-1">{item.date}</p>
                        </div>
                        <Badge
                          variant={item.status === "applied" ? "default" : "secondary"}
                          className={item.status === "applied" ? "bg-green-500" : "bg-green-300"}
                        >
                          {item.status === "applied" ? "Applied" : "Upcoming"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert System */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">🚨 Alert System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <Bell className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    <strong>Upcoming:</strong> Apply Potash fertilizer in 3 days
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    <strong>Good News:</strong> No overuse detected
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-200 bg-green-50">
                  <Bell className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    <strong>Reminder:</strong> Soil test due next week
                  </AlertDescription>
                </Alert>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-green-700 mb-2">Quick Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">This month</span>
                      <span className="font-medium">4 treatments</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Next due</span>
                      <span className="font-medium text-green-600">3 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Cost saved</span>
                      <span className="font-medium text-green-600">₹2,500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
