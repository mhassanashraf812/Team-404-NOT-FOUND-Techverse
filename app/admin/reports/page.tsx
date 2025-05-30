"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Shield, TrendingUp, Users, Package, CheckCircle, Download } from "lucide-react"
import Link from "next/link"

export default function AdminReportsPage() {
  const monthlyData = [
    { month: "Jan", lost: 45, found: 38, recovered: 32 },
    { month: "Feb", lost: 52, found: 41, recovered: 35 },
    { month: "Mar", lost: 48, found: 45, recovered: 40 },
    { month: "Apr", lost: 61, found: 52, recovered: 45 },//
    { month: "May", lost: 55, found: 48, recovered: 42 },
    { month: "Jun", lost: 67, found: 58, recovered: 51 },
  ]

  const categoryData = [
    { name: "Electronics", value: 35, color: "#0066CC" },
    { name: "Bags", value: 25, color: "#10B981" },
    { name: "Documents", value: 20, color: "#F59E0B" },
    { name: "Books", value: 12, color: "#EF4444" },
    { name: "Other", value: 8, color: "#6B7280" },
  ]

  const locationData = [
    { location: "Library", items: 45, successRate: 89 },
    { location: "Engineering", items: 32, successRate: 76 },
    { location: "Cafeteria", items: 28, successRate: 82 },
    { location: "Computer Labs", items: 25, successRate: 91 },
    { location: "Sports Complex", items: 18, successRate: 67 },
  ]

  const userEngagementData = [
    { month: "Jan", activeUsers: 1200, newUsers: 150 },
    { month: "Feb", activeUsers: 1350, newUsers: 180 },
    { month: "Mar", activeUsers: 1450, newUsers: 200 },
    { month: "Apr", activeUsers: 1600, newUsers: 220 },
    { month: "May", activeUsers: 1750, newUsers: 190 },
    { month: "Jun", activeUsers: 1890, newUsers: 210 },
  ]

  const stats = {
    totalItems: 1247,
    successRate: 89,
    activeUsers: 3456,
    avgResponseTime: "2.3 hours",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
              </Link>
              <Badge className="bg-red-100 text-red-800">Reports & Analytics</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Select defaultValue="last-30-days">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-3-months">Last 3 months</SelectItem>
                  <SelectItem value="last-year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance and user behavior</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
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
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</p>
                  <p className="text-sm text-green-600">-15% from last month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity Trends</CardTitle>
                  <CardDescription>Lost, found, and recovered items over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="lost" fill="#EF4444" name="Lost Items" />
                      <Bar dataKey="found" fill="#10B981" name="Found Items" />
                      <Bar dataKey="recovered" fill="#0066CC" name="Recovered Items" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate Trend</CardTitle>
                  <CardDescription>Item recovery success rate over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="recovered"
                        stroke="#0066CC"
                        strokeWidth={3}
                        name="Recovered Items"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Items by Category</CardTitle>
                  <CardDescription>Distribution of lost and found items by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Success rates by item category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{category.value}%</p>
                          <p className="text-sm text-gray-500">success rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Location</CardTitle>
                <CardDescription>Item activity and success rates across campus locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Location</th>
                        <th className="text-left p-4 font-medium text-gray-900">Total Items</th>
                        <th className="text-left p-4 font-medium text-gray-900">Success Rate</th>
                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {locationData.map((location, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{location.location}</td>
                          <td className="p-4 text-gray-600">{location.items}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${location.successRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{location.successRate}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                location.successRate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : location.successRate >= 70
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {location.successRate >= 80
                                ? "Excellent"
                                : location.successRate >= 70
                                  ? "Good"
                                  : "Needs Improvement"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Active and new user trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#0066CC"
                        strokeWidth={3}
                        name="Active Users"
                      />
                      <Line type="monotone" dataKey="newUsers" stroke="#10B981" strokeWidth={3} name="New Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Metrics</CardTitle>
                  <CardDescription>Key performance indicators for user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+5.2%</p>
                        <p className="text-xs text-gray-500">vs last week</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                        <p className="text-2xl font-bold text-gray-900">8.5 min</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+12%</p>
                        <p className="text-xs text-gray-500">vs last week</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">User Retention Rate</p>
                        <p className="text-2xl font-bold text-gray-900">78%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+3%</p>
                        <p className="text-xs text-gray-500">vs last month</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Items per User</p>
                        <p className="text-2xl font-bold text-gray-900">2.3</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600">-1%</p>
                        <p className="text-xs text-gray-500">vs last month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
            <CardDescription>Latest platform activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">High activity detected</span> in Electronics category - 15 new items
                    in the last 24 hours
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Success rate improved</span> - Library location now at 89% recovery
                    rate
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Pending verifications</span> - 23 claims awaiting admin approval
                  </p>
                  <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
