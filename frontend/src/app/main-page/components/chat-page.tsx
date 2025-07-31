"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Wifi, WifiOff, Mic, Paperclip, MoreVertical } from "lucide-react"

export default function ChatPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI farming assistant. How can I help you today? 🌱",
      time: "10:30 AM",
    },
    {
      id: 2,
      type: "user",
      content: "My rice plants have yellow leaves. What should I do?",
      time: "10:32 AM",
    },
    {
      id: 3,
      type: "bot",
      content:
        "Yellow leaves in rice can indicate nitrogen deficiency or waterlogging. Can you tell me about your watering schedule and when you last applied fertilizer?",
      time: "10:33 AM",
    },
    {
      id: 4,
      type: "user",
      content: "I watered them 2 days ago and applied urea fertilizer last week.",
      time: "10:35 AM",
    },
    {
      id: 5,
      type: "bot",
      content:
        "Based on your information, this seems like nitrogen deficiency. I recommend applying a balanced NPK fertilizer and ensuring proper drainage. Would you like specific product recommendations for your region?",
      time: "10:36 AM",
    },
  ])

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content:
          "Thank you for that information. Based on what you've described, I recommend checking your soil pH and considering a nitrogen-rich fertilizer. Would you like specific product recommendations?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const quickQuestions = [
    "What fertilizer should I use for wheat?",
    "When is the best time to plant rice?",
    "How to control pests naturally?",
    "Soil pH testing methods",
    "Irrigation scheduling tips",
    "Crop rotation benefits",
  ]

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">💬 AI Farm Expert Assistant</h2>
              <p className="text-green-100 text-sm">Get instant farming advice</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isOnline ? "default" : "secondary"}
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
                className={`rounded-full text-xs ${isOnline ? "bg-green-700 hover:bg-green-800" : "bg-gray-500 hover:bg-gray-600"}`}
              >
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? "Online" : "Offline"}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Chat Messages */}
        <Card className="flex-1 rounded-2xl border-2 border-green-100 shadow-lg overflow-hidden">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.type === "user" ? "bg-green-500 text-white" : "bg-green-50 text-green-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-green-600" />}
                      {msg.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.type === "user" ? "text-green-100" : "text-green-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Message Input */}
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isOnline ? "Type your farming question..." : "You're offline"}
                disabled={!isOnline}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-xl"
              />
              <Button
                onClick={sendMessage}
                disabled={!isOnline || !message.trim()}
                className="bg-green-500 hover:bg-green-600 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Quick Questions */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200"
            onClick={() => setMessage("What fertilizer should I use for wheat?")}
          >
            Fertilizer advice
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200"
            onClick={() => setMessage("When is the best time to plant rice?")}
          >
            Planting schedule
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-green-50 text-green-600 border-green-200"
            onClick={() => setMessage("How to control pests naturally?")}
          >
            Pest control
          </Badge>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-4 lg:p-6 h-[calc(100vh-120px)] flex flex-col gap-6">
        {/* Desktop Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2">💬 AI Farm Expert Assistant</h2>
              <p className="text-green-100">Get instant farming advice and solutions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-right">
                <p className="text-green-100 text-sm">Response time</p>
                <p className="text-white font-semibold">~2 seconds</p>
              </div>
              <Button
                variant={isOnline ? "default" : "secondary"}
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
                className={`rounded-full ${isOnline ? "bg-green-700 hover:bg-green-800" : "bg-gray-500 hover:bg-gray-600"}`}
              >
                {isOnline ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                {isOnline ? "Online" : "Offline"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Chat Messages */}
          <Card className="lg:col-span-3 rounded-2xl border-2 border-green-100 shadow-lg overflow-hidden flex flex-col">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] lg:max-w-[70%] p-4 rounded-2xl ${
                        msg.type === "user"
                          ? "bg-green-500 text-white"
                          : "bg-green-50 text-green-800 border border-green-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {msg.type === "bot" && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {msg.type === "user" && (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-2 ${msg.type === "user" ? "text-green-100" : "text-green-500"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Message Input */}
              <div className="border-t p-4 bg-green-50">
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isOnline ? "Type your farming question..." : "You're offline"}
                    disabled={!isOnline}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 rounded-xl border-2"
                  />
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={sendMessage}
                    disabled={!isOnline || !message.trim()}
                    className="bg-green-500 hover:bg-green-600 rounded-xl px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desktop Quick Questions Sidebar */}
          <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700 text-lg">💡 Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="w-full cursor-pointer hover:bg-green-50 text-green-600 border-green-200 p-3 h-auto text-left justify-start text-wrap"
                  onClick={() => setMessage(question)}
                >
                  {question}
                </Badge>
              ))}

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-green-700 mb-3">Chat Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Messages today</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Avg response</span>
                    <span className="font-medium text-green-600">2.1s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Satisfaction</span>
                    <span className="font-medium text-green-600">98%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
