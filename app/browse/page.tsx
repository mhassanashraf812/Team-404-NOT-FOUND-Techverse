import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, Clock, Eye, MessageCircle, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function BrowsePage() {
  const items = [
    {
      id: 1,
      title: "iPhone 14 Pro - Space Black",
      description:
        "Lost my iPhone 14 Pro in space black color. Has a clear case with a small crack on the back. Last seen in the library.",
      type: "lost",
      category: "Electronics",
      location: "Library 2nd Floor",
      date: "2024-01-15",
      time: "2 hours ago",
      views: 45,
      claims: 2,
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 2,
      title: "Blue Jansport Backpack",
      description:
        "Found a blue Jansport backpack near the engineering building. Contains some textbooks and notebooks.",
      type: "found",
      category: "Bags",
      location: "Engineering Building",
      date: "2024-01-15",
      time: "4 hours ago",
      views: 23,
      claims: 1,
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 3,
      title: "Student ID Card - Ahmed Khan",
      description: "Found a student ID card belonging to Ahmed Khan. Found in the cafeteria area.",
      type: "found",
      category: "Documents",
      location: "Cafeteria",
      date: "2024-01-14",
      time: "1 day ago",
      views: 67,
      claims: 0,
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 4,
      title: "Silver MacBook Air",
      description: "Lost my MacBook Air (13-inch, Silver) in the computer lab. Has several stickers on the back.",
      type: "lost",
      category: "Electronics",
      location: "Computer Lab A",
      date: "2024-01-14",
      time: "1 day ago",
      views: 89,
      claims: 3,
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 5,
      title: "Red Umbrella",
      description: "Found a red umbrella near the main entrance. Appears to be in good condition.",
      type: "found",
      category: "Personal Items",
      location: "Main Entrance",
      date: "2024-01-13",
      time: "2 days ago",
      views: 34,
      claims: 1,
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: 6,
      title: "Physics Textbook - Halliday",
      description:
        "Lost my Physics textbook (Fundamentals of Physics by Halliday). Has my name written inside the cover.",
      type: "lost",
      category: "Books",
      location: "Library",
      date: "2024-01-13",
      time: "2 days ago",
      views: 12,
      claims: 0,
      images: ["/placeholder.svg?height=200&width=300"],
    },
  ]

  const categories = [
    "All Categories",
    "Electronics",
    "Bags",
    "Documents",
    "Books",
    "Personal Items",
    "Clothing",
    "Accessories",
  ]

  const locations = [
    "All Locations",
    "Library",
    "Engineering Building",
    "Computer Lab A",
    "Computer Lab B",
    "Cafeteria",
    "Main Entrance",
    "Parking Area",
    "Sports Complex",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">UMT Lost & Found</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/report">
                <Button className="bg-blue-600 hover:bg-blue-700">Report Item</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Search through lost and found items from the UMT community</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search items..." className="pl-10" />
                  </div>
                </div>

                {/* Item Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Item Type</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lost" />
                      <label htmlFor="lost" className="text-sm text-gray-700">
                        Lost Items
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="found" />
                      <label htmlFor="found" className="text-sm text-gray-700">
                        Found Items
                      </label>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location.toLowerCase().replace(" ", "-")}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{items.length} items found</p>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                    <SelectItem value="most-claimed">Most Claimed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <Badge
                        variant={item.type === "lost" ? "destructive" : "default"}
                        className={item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {item.type === "lost" ? "Lost" : "Found"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.views}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {item.claims}
                          </span>
                        </div>

                        <Badge variant="outline">{item.category}</Badge>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          {item.type === "lost" ? "I Found This" : "This is Mine"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
