import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Download,
  Filter,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = {
    totalUsers: 3456,
    totalItems: 1247,
    pendingClaims: 23,
    successRate: 89,
  }

  const pendingItems = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      type: "lost",
      user: "Sarah Ahmed",
      date: "2024-01-15",
      status: "pending_review",
      flagged: true,
    },
    {
      id: 2,
      title: "Blue Backpack",
      type: "found",
      user: "Ahmed Khan",
      date: "2024-01-15",
      status: "pending_review",
      flagged: false,
    },
  ]

  const pendingClaims = [
    {
      id: 1,
      itemTitle: "MacBook Pro",
      claimant: "Hassan",
      owner: "Jane Smith",
      date: "2024-01-15",
      status: "pending_verification",
      priority: "high",
    },
    {
      id: 2,
      itemTitle: "Red Umbrella",
      claimant: "Ali Hassan",
      owner: "Sara Khan",
      date: "2024-01-14",
      status: "pending_verification",
      priority: "medium",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@umt.edu.pk",
      role: "student",
      joinDate: "2024-01-15",
      itemsPosted: 3,
      verified: true,
    },
    {
      id: 2,
      name: "Dr. Ahmed Khan",
      email: "ahmed.khan@umt.edu.pk",
      role: "faculty",
      joinDate: "2024-01-14",
      itemsPosted: 1,
      verified: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_review":
        return "bg-yellow-100 text-yellow-800"
      case "pending_verification":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
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
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">UMT Lost & Found</span>
              </Link>
              <Badge className="bg-red-100 text-red-800">Admin Panel</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the Lost & Found portal and monitor system activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingClaims}</p>
                  <p className="text-sm text-yellow-600">Requires attention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
                  <p className="text-sm text-green-600">+2% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending-items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending-items">Pending Items</TabsTrigger>
            <TabsTrigger value="pending-claims">Pending Claims</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-items" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Pending Items Review</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search items..." className="pl-10 w-64" />
              </div>
            </div>

            <div className="grid gap-6">
              {pendingItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {item.title}
                          {item.flagged && <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Posted by {item.user} on {item.date}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge
                          variant={item.type === "lost" ? "destructive" : "default"}
                          className={item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                        >
                          {item.type === "lost" ? "Lost" : "Found"}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        {item.flagged && <span className="text-sm text-red-600 font-medium">⚠️ Flagged for review</span>}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending-claims" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Pending Claims Verification</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search claims..." className="pl-10 w-64" />
              </div>
            </div>

            <div className="grid gap-6">
              {pendingClaims.map((claim) => (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{claim.itemTitle}</CardTitle>
                        <CardDescription className="mt-2">
                          Claimed by {claim.claimant} • Owner: {claim.owner} • {claim.date}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(claim.priority)}>{claim.priority} priority</Badge>
                        <Badge className={getStatusColor(claim.status)}>{claim.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">Verification required for ownership transfer</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Review Proof
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Add User</Button>
              </div>
            </div>

            <div className="grid gap-6">
              {recentUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {user.name}
                          {user.verified && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {user.email} • Joined {user.joinDate}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge
                          className={
                            user.role === "faculty" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }
                        >
                          {user.role}
                        </Badge>
                        {user.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">{user.itemsPosted} items posted</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>Items posted and recovered over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Monthly activity trends</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Most common types of lost/found items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Category breakdown</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate by Location</CardTitle>
                  <CardDescription>Recovery rates across campus locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Location success rates</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>Active users and platform usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - User engagement metrics</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
