"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"items" | "users">("items");
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === "items") {
      axios.post("/api/items/getadminitems")
        .then(res => setItems(res.data))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      axios.post("/api/getuserforadmin")
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
              <Badge className="bg-red-100 text-red-800">Admin</Badge>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={tab === "items" ? "default" : "outline"}
            onClick={() => setTab("items")}
          >
            All Items
          </Button>
          <Button
            variant={tab === "users" ? "default" : "outline"}
            onClick={() => setTab("users")}
          >
            All Users
          </Button>
        </div>
        {tab === "items" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Items</h1>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.images && item.images.length > 0 && (
                      <div className="relative h-48">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{item.type}</Badge>
                        <Badge>{item.status}</Badge>
                        <Badge>{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 mb-2">
                        <p>Location: {item.location}</p>
                        <p>User: {item.user?.name} ({item.user?.email})</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags && item.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center text-sm text-gray-600">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {item.claims?.length || 0} claims
                        </span>
                        <Button variant="outline" size="sm" className="w-fit">
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        {tab === "users" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Users</h1>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <Card key={user.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        {user.name}
                        {user.verified && <span className="ml-2 text-green-600">✔</span>}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{user.role}</Badge>
                        <Badge>{user.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 mb-2">
                        <p>Department: {user.department}</p>
                        <p>Phone: {user.phone}</p>
                        <p>Joined: {user.joinDate}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{user.itemsPosted} items posted</Badge>
                        <Badge variant="outline">{user.itemsRecovered} recovered</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
