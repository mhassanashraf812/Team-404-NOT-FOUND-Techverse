import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Users, Shield, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const recentItems = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      type: "lost",
      location: "Library 2nd Floor",
      time: "2 hours ago",
      category: "Electronics",
    },
  
    {
      id: 2,
      title: "Blue Backpack",
      type: "found",
      location: "Engineering Building",
      time: "4 hours ago",
      category: "Bags",
    },
    {
      id: 3,
      title: "Student ID Card",
      type: "found",
      location: "Cafeteria",
      time: "1 day ago",
      category: "Documents",
    },
  ]

  const stats = [
    { label: "Items Recovered", value: "1,247", icon: Shield },
    { label: "Active Users", value: "3,456", icon: Users },
    { label: "Success Rate", value: "89%", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">UMT Lost & Found</h1>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Link href="/auth/login">
          <Button variant="outline" className="w-full sm:w-auto">Sign In</Button>
        </Link>
        <Link href="/auth/register">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Get Started</Button>
        </Link>
      </div>
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find What You've Lost, Return What You've Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            UMT's trusted platform connecting students and faculty to recover lost items and help others find theirs.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search for lost items, locations, or categories..." className="pl-10 h-12 text-lg" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-red-500 hover:bg-red-600">
                Report Lost Item
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Report Found Item
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Browse All Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-600">Latest lost and found items from the UMT community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge
                      variant={item.type === "lost" ? "destructive" : "default"}
                      className={item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    >
                      {item.type === "lost" ? "Lost" : "Found"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.time}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{item.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/browse">
              <Button variant="outline" size="lg">
                View All Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600">Simple steps to recover your lost items or help others</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Report</h4>
              <p className="text-gray-600">
                Report your lost item or found item with detailed description and location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Match</h4>
              <p className="text-gray-600">Our system helps match lost and found items, and users can claim items</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Reunite</h4>
              <p className="text-gray-600">
                Verify ownership through our secure process and reunite with your belongings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">UMT Lost & Found</span>
              </div>
              <p className="text-gray-400">Connecting the UMT community to recover lost items and help others.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link href="/report-lost" className="hover:text-white">
                    Report Lost
                  </Link>
                </li>
                <li>
                  <Link href="/report-found" className="hover:text-white">
                    Report Found
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-white">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="text-gray-400 space-y-2">
                <p>University of Management & Technology</p>
                <p>Lahore, Pakistan</p>
                <p>lostandfound@umt.edu.pk</p>
                <p>+92 42 111 300 200</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UMT Lost & Found Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
