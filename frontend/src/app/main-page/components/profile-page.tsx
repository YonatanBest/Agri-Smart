"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch" 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Edit, Globe, Bell, Save, Shield, Smartphone, Mail } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [appNotifications, setAppNotifications] = useState(true)

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">👤 Profile & Settings</h2>
            <p className="text-green-100">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">Profile completion</p>
              <p className="text-white font-bold text-2xl">85%</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl p-1 shadow-sm">
          <TabsTrigger
            value="profile"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Language
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Section */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Farm Profile
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="farmerName" className="text-sm font-medium text-green-700">
                      Farmer Name
                    </Label>
                    <Input
                      id="farmerName"
                      defaultValue="Rajesh Kumar"
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmSize" className="text-sm font-medium text-green-700">
                        Farm Size (hectares)
                      </Label>
                      <Input id="farmSize" defaultValue="2.5" disabled={!isEditing} className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="soilType" className="text-sm font-medium text-green-700">
                        Soil Type
                      </Label>
                      <Select disabled={!isEditing}>
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue placeholder="Clay Loam" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="clay-loam">Clay Loam</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="crops" className="text-sm font-medium text-green-700">
                      Main Crops
                    </Label>
                    <Input
                      id="crops"
                      defaultValue="Rice, Wheat, Maize"
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-green-700">
                      Location
                    </Label>
                    <Input
                      id="location"
                      defaultValue="Punjab, India"
                      disabled={!isEditing}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button className="w-full bg-green-500 hover:bg-green-600 rounded-xl flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Farm Statistics */}
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">📊 Farm Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">2.5</p>
                    <p className="text-sm text-green-600">Hectares</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">3</p>
                    <p className="text-sm text-green-600">Crop Types</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">92%</p>
                    <p className="text-sm text-green-600">Health Score</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-700">45</p>
                    <p className="text-sm text-green-600">Days Active</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <p className="text-sm font-medium text-green-700 mb-2">Account Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold">Premium Member</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-green-700">App Language</Label>
                  <Select>
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">🇺🇸 English</SelectItem>
                      <SelectItem value="hindi">🇮🇳 हिंदी (Hindi)</SelectItem>
                      <SelectItem value="punjabi">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                      <SelectItem value="tamil">🇮🇳 தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="telugu">🇮🇳 తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="bengali">🇮🇳 বাংলা (Bengali)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-green-700">Region</Label>
                  <Select>
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue placeholder="India" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">🇮🇳 India</SelectItem>
                      <SelectItem value="pakistan">🇵🇰 Pakistan</SelectItem>
                      <SelectItem value="bangladesh">🇧🇩 Bangladesh</SelectItem>
                      <SelectItem value="srilanka">🇱🇰 Sri Lanka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-700 mb-2">
                  <strong>Pro Tip:</strong> Choose your local language for better understanding of farming terms and
                  weather updates.
                </p>
                <p className="text-xs text-green-600">Language changes will take effect after restarting the app.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Push Notifications</p>
                      <p className="text-sm text-green-600">Receive app notifications</p>
                    </div>
                  </div>
                  <Switch checked={appNotifications} onCheckedChange={setAppNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">SMS Notifications</p>
                      <p className="text-sm text-green-600">Get farming alerts via SMS</p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Phone Number:</strong> +91-9876543210
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    Change Number
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">🔔 Notification Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-green-700">Weather alerts & forecasts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-green-700">Fertilizer & treatment reminders</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-green-700">Crop health alerts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-green-700">Market price updates</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-green-700">Seasonal farming tips</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-green-700">Equipment maintenance reminders</span>
                  </label>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-green-700 mb-2">Notification Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Morning updates</span>
                      <span className="font-medium">6:00 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Evening summary</span>
                      <span className="font-medium">7:00 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-green-700">
                      Current Password
                    </Label>
                    <Input id="currentPassword" type="password" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-green-700">
                      New Password
                    </Label>
                    <Input id="newPassword" type="password" className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-green-700">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" className="mt-1 rounded-xl" />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 rounded-xl">Update Password</Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">Account Security</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Two-factor authentication enabled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Strong password detected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Account verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">Data Privacy</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Your farm data is encrypted and stored securely. We never share your information without consent.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                    >
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* About Section */}
      <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="font-bold text-green-800 text-xl">FarmAI Assistant</h3>
          <p className="text-sm text-green-600 mt-1">Version 2.1.0</p>
          <p className="text-xs text-green-500 mt-2">Empowering farmers with AI-driven insights</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
            >
              Privacy Policy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
            >
              Terms of Service
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-transparent border-green-200 text-green-600 hover:bg-green-50"
            >
              Help & Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
