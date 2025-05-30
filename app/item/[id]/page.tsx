"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  MapPin,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Flag,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ItemDetailPage() {
  const [claimText, setClaimText] = useState("")
  const [showClaimForm, setShowClaimForm] = useState(false)

  // Mock item data - in real app, this would come from params and API
  const item = {
    id: 1,
    title: "iPhone 14 Pro - Space Black",
    description:
      "Lost my iPhone 14 Pro in space black color. Has a clear case with a small crack on the back. Last seen in the library on the 2nd floor near the study tables. The phone has a mountain landscape wallpaper and contains my student ID card behind the case. Very important as it contains all my academic work and personal photos. Please contact me if found - willing to provide reward.",
    type: "lost",
    category: "Electronics",
    location: "Library 2nd Floor",
    specificLocation: "Near the study tables, section C",
    dateReported: "2024-01-15",
    timeReported: "14:30",
    dateLost: "2024-01-14",
    timeLost: "16:45",
    status: "active",
    views: 156,
    claims: 3,
    tags: ["urgent", "valuable", "electronic", "reward"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    owner: {
      name: "Sarah Ahmed",
      role: "Student",
      department: "Computer Science",
      joinDate: "2023-09-01",
      itemsPosted: 2,
      itemsRecovered: 1,
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  }

  const recentClaims = [
    {
      id: 1,
      claimant: "Ahmed Khan",
      date: "2024-01-15",
      status: "pending",
      message: "I found a phone matching this description in the library yesterday...",
    },
    {
      id: 2,
      claimant: "Maria Ali",
      date: "2024-01-15",
      status: "rejected",
      message: "I have an iPhone but it's a different model...",
    },
  ]

  const handleClaim = () => {
    if (claimText.trim()) {
      setShowClaimForm(false)
      setClaimText("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "claimed":
        return "bg-yellow-100 text-yellow-800"
      case "returned":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getClaimStatusColor = (status: string) => {
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
              <Link href="/browse" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Item Details</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
          <div className="lg:col-span-2 space-y-6">
           
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {item.images.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {item.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${item.title} ${index + 2}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.type === "lost" ? "Lost" : "Found"} on {item.dateLost || item.dateReported}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      variant={item.type === "lost" ? "destructive" : "default"}
                      className={item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    >
                      {item.type === "lost" ? "Lost" : "Found"}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">General Location:</span> {item.location}
                      </p>
                      <p>
                        <span className="font-medium">Specific Location:</span> {item.specificLocation}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Time Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Date {item.type}:</span> {item.dateLost || item.dateReported}
                      </p>
                      <p>
                        <span className="font-medium">Time {item.type}:</span> {item.timeLost || item.timeReported}
                      </p>
                      <p>
                        <span className="font-medium">Reported:</span> {item.dateReported}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.views} views
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {item.claims} claims
                    </span>
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Claim Form */}
            {!showClaimForm ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.type === "lost" ? "Found This Item?" : "Is This Yours?"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.type === "lost"
                      ? "If you found this item, click below to help return it to the owner."
                      : "If this item belongs to you, click below to claim it."}
                  </p>
                  <Button onClick={() => setShowClaimForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    {item.type === "lost" ? "I Found This Item" : "This Is Mine"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{item.type === "lost" ? "Report Found Item" : "Claim This Item"}</CardTitle>
                  <CardDescription>
                    Provide details to help verify your {item.type === "lost" ? "find" : "claim"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="claim-description">
                      {item.type === "lost" ? "Describe where and when you found it" : "Provide proof of ownership"}
                    </Label>
                    <Textarea
                      id="claim-description"
                      value={claimText}
                      onChange={(e) => setClaimText(e.target.value)}
                      placeholder={
                        item.type === "lost"
                          ? "I found this item at... It was located..."
                          : "This is my item because... I can prove ownership by..."
                      }
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={handleClaim} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Submit {item.type === "lost" ? "Found Report" : "Claim"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowClaimForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Claims */}
            {recentClaims.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Claims</CardTitle>
                  <CardDescription>Other users who have claimed this item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentClaims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{claim.claimant}</p>
                          <p className="text-sm text-gray-600">{claim.date}</p>
                        </div>
                        <Badge className={getClaimStatusColor(claim.status)}>{claim.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-700">{claim.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle>Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {item.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{item.owner.name}</h4>
                      {item.owner.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{item.owner.role}</p>
                    <p className="text-sm text-gray-600">{item.owner.department}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {item.owner.joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{item.owner.itemsPosted} items posted</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>{item.owner.itemsRecovered} items recovered</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link href="/chat">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>• Always meet in public, well-lit areas on campus</p>
                <p>• Verify ownership through detailed questions</p>
                <p>• Use the campus security office for exchanges</p>
                <p>• Report suspicious behavior to administrators</p>
                <p>• Never share personal information unnecessarily</p>
              </CardContent>
            </Card>

            {/* Similar Items */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Items</CardTitle>
                <CardDescription>Other items you might be interested in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Similar item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">iPhone 13 Pro</p>
                      <p className="text-xs text-gray-600">Library 1st Floor</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
