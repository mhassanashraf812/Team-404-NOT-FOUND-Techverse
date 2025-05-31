"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import { ClaimChat } from "@/components/claim-chat";
import { useSocketContext } from "@/components/providers/SocketProvider";
import { formatDistanceToNow } from "date-fns";

interface Item {
  id: string;
  title: string;
  description: string;
  type: "LOST" | "FOUND";
  status: "ACTIVE" | "CLAIMED" | "RETURNED" | "EXPIRED" | "ARCHIVED";
  location: string;
  dateFound: string | null;
  dateLost: string | null;
  images: string[];
  tags: string[];
  category: string | null;
  createdAt: string;
  updatedAt: string;
  claims: Claim[];
}

interface Claim {
  id: string;
  itemId: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "DISPUTED";
  proofImages: string[];
  adminNotes?: string;
  claimant: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
}

interface Notification {
  id: string;
  title: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
  };
}

const page = () => {
  const router = useRouter();
  const { data: session, status }: any = useSession({
    required: true,
  });
  useEffect(() => {
    if (session && !["STUDENT", "FACULTY"].includes(session?.user?.role)) {
      router.push("/login");
    }
  }, [session]);
  return (
    <div>
      {session && ["STUDENT", "FACULTY"].includes(session?.user?.role) && (
        <DashboardPage />
      )}
    </div>
  );
};

export default page;

function DashboardPage() {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [foundClaim, setFoundClaim] = useState<Claim | null>(null);
  const { refreshMessage } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    } else {
      fetchItems();
      fetchNotifications();
    }
  }, [refreshMessage]);

  const fetchItems = async () => {
    try {
      const response = await axios.post("/api/items/getitems");
      setItems(response.data);
    } catch (error: any) {
      ToastErrorMessage(error.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const fetchNotifications = async () => {
    try {
      const response = await axios.post("/api/notifications/getnotifications");
      setNotifications(response.data);
      setUnreadCount(
        response.data.filter((n: Notification) => !n.isRead).length
      );
    } catch (error: any) {
      ToastErrorMessage(error.message || "Failed to fetch notifications");
    }
  };

  const handleNotificationClick = async () => {
    try {
      await axios.post("/api/notifications/markread");
      await fetchNotifications();
    } catch (error: any) {
      ToastErrorMessage(
        error.message || "Failed to mark notifications as read"
      );
    }
  };

  const changeClaimStatus = async (claimId: string, status: string) => {
    try {
      await axios.post(`/api/claims/changestatus`, {
        claimId,
        status,
      });
      ToastSuccessMessage("Claim approved successfully");
      fetchItems(); // Refresh items data to update status
    } catch (error: any) {
      ToastErrorMessage(error.message || "Failed to approve claim");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CLAIMED":
        return "bg-blue-100 text-blue-800";
      case "RETURNED":
        return "bg-purple-100 text-purple-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      case "ARCHIVED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "LOST" ? (
      <AlertCircle className="w-5 h-5 text-red-600" />
    ) : (
      <CheckCircle className="w-5 h-5 text-green-600" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "DISPUTED":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your items...</p>
        </div>
      </div>
    );
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
                <span className="text-xl font-semibold text-gray-900">
                  UMT Lost & Found
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/browse">
  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
    <Plus className="w-4 h-4 mr-2" />
    Browse Items
  </Button>
</Link>
              {/* <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button> */}
              <Link href="/report">
  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
    <Plus className="w-4 h-4 mr-2" />
    Report Items
  </Button>
</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your lost and found items.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Items Posted
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {items.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Items Recovered
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {items.filter((item) => item.status === "RETURNED").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Claims
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {items.filter((item) => item.status === "ACTIVE").length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {items.length > 0
                      ? ((items.filter((item) => item.status === "RETURNED").length / items.length) * 100).toFixed(2)
                      : "0.00"}
                    %
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="my-items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-items">My Items</TabsTrigger>
            <TabsTrigger value="activity" onClick={handleNotificationClick}>
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-items" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">My Items</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search my items..."
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Link href="/report" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-6">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <CardDescription>
                      {item.category && (
                        <span className="text-sm text-gray-500">
                          Category: {item.category}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Location: {item.location}</p>
                      <p>
                        {item.type === "LOST"
                          ? `Lost on: ${new Date(
                              item.dateLost || ""
                            ).toLocaleDateString()}`
                          : `Found on: ${new Date(
                              item.dateFound || ""
                            ).toLocaleDateString()}`}
                      </p>
                    </div>

                    {item.claims.map((claim) => (
                      <Card
                        key={claim.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {item.title}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {item.type === "LOST"
                                  ? "Found by"
                                  : "Claimed by"}
                                {claim.claimant.name} on{" "}
                                {new Date(claim.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(claim.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(claim.status)}
                                <span>{claim.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                            <span className="flex items-center text-sm text-gray-600">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {claim.messages.length} messages
                            </span>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                  setFoundClaim(claim);
                                  setShowChat(true);
                                }}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                              {claim.status === "PENDING" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() =>
                                      changeClaimStatus(claim.id, "APPROVED")
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      changeClaimStatus(claim.id, "REJECTED")
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {claim.status === "APPROVED" && (
                                <Button
                                  onClick={() =>
                                    changeClaimStatus(claim.id, "COMPLETED")
                                  }
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark as Returned
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <Badge className="bg-blue-600 text-white">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No notifications yet
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`hover:shadow-md transition-shadow ${
                      !notification.isRead ? "border-l-4 border-l-blue-600" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.isRead ? "bg-gray-300" : "bg-blue-600"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {notification.title}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                            {notification.sender && (
                              <p className="text-xs text-gray-500">
                                • From {notification.sender.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {foundClaim && (
        <ClaimChat
          claimId={foundClaim.id}
          itemId={foundClaim.itemId}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          receiverId={foundClaim.claimant.id}
          session={session}
        />
      )}
    </div>
  );
}
