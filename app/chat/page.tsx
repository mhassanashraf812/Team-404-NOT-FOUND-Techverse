"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, Phone, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      itemTitle: "iPhone 14 Pro",
      participant: "Sarah Ahmed",
      participantRole: "Student",
      lastMessage: "I can provide more photos if needed",
      timestamp: "2 min ago",
      unread: 2,
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      itemTitle: "Blue Backpack",
      participant: "Ahmed Khan",
      participantRole: "Faculty",
      lastMessage: "Thank you for finding my backpack!",
      timestamp: "1 hour ago",
      unread: 0,
      status: "approved",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      itemTitle: "MacBook Pro",
      participant: "Dr. Ali Hassan",
      participantRole: "Faculty",
      lastMessage: "Can we meet at the security office?",
      timestamp: "3 hours ago",
      unread: 1,
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Ahmed",
      content: "Hi! I believe this iPhone might be mine. I lost it yesterday in the library.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Hello! Can you describe the phone case and any distinctive features?",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Ahmed",
      content: "It has a clear case with a small crack on the back corner. The wallpaper is a photo of mountains.",
      timestamp: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content: "That matches the description! Can you also tell me what's in the phone case?",
      timestamp: "10:37 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Sarah Ahmed",
      content: "There's my student ID card and a metro card behind the phone in the case.",
      timestamp: "10:40 AM",
      isOwn: false,
    },
    {
      id: 6,
      sender: "Sarah Ahmed",
      content: "I can provide more photos if needed",
      timestamp: "10:42 AM",
      isOwn: false,
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Messages</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Your active claim discussions</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{conversation.participant}</p>
                          <div className="flex items-center space-x-2">
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs">{conversation.unread}</Badge>
                            )}
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.itemTitle}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {conversation.participantRole}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>SA</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Sarah Ahmed</CardTitle>
                        <CardDescription>Claim for: iPhone 14 Pro</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Badge className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Approve Claim</h4>
                  <p className="text-sm text-gray-600">Verify and approve the current claim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">View Item Details</h4>
                  <p className="text-sm text-gray-600">See full item information</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <MoreVertical className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Report Issue</h4>
                  <p className="text-sm text-gray-600">Report inappropriate behavior</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
