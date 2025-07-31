"use client"

import { useState } from "react"
import { Home, Activity, MessageCircle, Calendar, User, Sprout, Bell, Leaf } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import HomePage from "./components/home-page"
import MonitorPage from "./components/monitor-page"
import ChatPage from "./components/chat-page"
import CalendarPage from "./components/calendar-page"
import ProfilePage from "./components/profile-page"
import Link from "next/link"

export default function AgriApp() {
  const [currentPage, setCurrentPage] = useState("home")

  const pages = {
    home: <HomePage />,
    monitor: <MonitorPage />,
    chat: <ChatPage />,
    calendar: <CalendarPage />,
    profile: <ProfilePage />,
  }

  const navItems = [
    { id: "home", icon: Home, label: "Home", badge: null },
    { id: "monitor", icon: Activity, label: "Monitor", badge: "2" },
    { id: "chat", icon: MessageCircle, label: "Chat", badge: null },
    { id: "calendar", icon: Calendar, label: "Calendar", badge: "5" },
  ]

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        {/* Mobile Header */}
        <header className="bg-white border-b border-green-100 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">Agrilo</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage("profile")}
              className={`rounded-full p-2 ${
                currentPage === "profile" ? "bg-green-500 text-white" : "text-green-600 hover:bg-green-50"
              }`}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="pb-20">{pages[currentPage as keyof typeof pages]}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-lg">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-2xl ${
                    isActive ? "bg-green-500 text-white shadow-lg" : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Desktop/Tablet Layout with Sidebar */}
      <div className="hidden md:block">
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-green-100">
            {/* Sidebar */}
            <Sidebar variant="inset" className="border-r-2 border-green-100">
              <SidebarHeader className="border-b border-green-100 bg-gradient-to-r from-green-500 to-green-600">
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-white" />
                  </div> */}
                  <div className="text-white">
                    <Link href="/" className="flex">
                        <Leaf className="h-6 w-6 text-green-100" />
                        <span className="text-lg font-bold">Agrilo</span>
                    </Link>
                    <p className="text-xs text-green-100">Smart Farming Solutions</p>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="bg-white">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-900 font-semibold">Farm Management</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPage === item.id
                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              onClick={() => setCurrentPage(item.id)}
                              isActive={isActive}
                              className={`w-full justify-start gap-3 rounded-xl py-3 px-4 ${
                                isActive
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "text-green-700 hover:bg-green-50"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`ml-auto text-xs ${
                                    isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-green-700 font-semibold">Quick Actions</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setCurrentPage("monitor")}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">🔍</span>
                          <span className="font-medium">Crop Diagnosis</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setCurrentPage("chat")}
                          className="w-full justify-start gap-3 rounded-xl py-3 px-4 text-green-700 hover:bg-green-50"
                        >
                          <span className="text-lg">💬</span>
                          <span className="font-medium">Ask AI Expert</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-green-100 bg-gradient-to-r from-green-50 to-green-100">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">RK</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Rajesh Kumar</p>
                      <p className="text-xs text-green-600">2.5 hectares • Punjab</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Bell className="h-3 w-3" />
                    <span>3 pending notifications</span>
                  </div>
                </div>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            {/* Main Content */}
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-green-100 px-4 bg-white/80 backdrop-blur-sm">
                <SidebarTrigger className="-ml-1 text-green-600 hover:bg-green-50" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-green-800 capitalize">
                    {currentPage === "profile"
                      ? "Profile"
                      : navItems.find((item) => item.id === currentPage)?.label || "Dashboard"}
                  </h2>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>System Online</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage("profile")}
                    className={`rounded-full p-2 ml-2 ${
                      currentPage === "profile" ? "bg-green-500 text-white" : "text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </header>

              <main className="flex-1 overflow-auto">{pages[currentPage as keyof typeof pages]}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  )
}
