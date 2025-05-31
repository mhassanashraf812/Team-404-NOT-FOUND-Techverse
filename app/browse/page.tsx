"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MapPin,
  Clock,
  Eye,
  MessageCircle,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ClaimDialog } from "@/components/claim-dialog";
import { ClaimChat } from "@/components/claim-chat";
import { useSocketContext } from "@/components/providers/SocketProvider";

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
  claims: any[];
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
        <BrowsePage session={session} />
      )}
    </div>
  );
};

export default page;

function BrowsePage({ session }: { session: any }) {
  const { refreshMessage } = useSocketContext();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: [] as string[],
    category: "",
    location: "",
    dateRange: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  const categories = [
    "All Categories",
    "Electronics",
    "Bags & Backpacks",
    "Documents & IDs",
    "Books & Stationery",
    "Personal Items",
    "Clothing & Accessories",
    "Sports Equipment",
    "Other",
  ];

  const locations = [
    "All Locations",
    "Library - Ground Floor",
    "Library - 1st Floor",
    "Library - 2nd Floor",
    "Engineering Building",
    "Computer Lab A",
    "Computer Lab B",
    "Cafeteria",
    "Main Entrance",
    "Parking Area",
    "Sports Complex",
    "Auditorium",
    "Admin Block",
  ];
  useEffect(() => {
    fetchItems();
  }, [filters, sortBy, refreshMessage]);

  const fetchItems = async () => {
    try {
      const response = await axios.post("/api/items/getallitems");
      let filteredItems = response.data;

      // Apply filters
      if (filters.search) {
        filteredItems = filteredItems.filter(
          (item: Item) =>
            item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      if (filters.type.length > 0) {
        filteredItems = filteredItems.filter((item: Item) =>
          filters.type.includes(item.type)
        );
      }

      if (filters.category && filters.category !== "All Categories") {
        filteredItems = filteredItems.filter(
          (item: Item) => item.category === filters.category
        );
      }

      if (filters.location && filters.location !== "All Locations") {
        filteredItems = filteredItems.filter(
          (item: Item) => item.location === filters.location
        );
      }

      // Apply date range filter
      if (filters.dateRange) {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );

        filteredItems = filteredItems.filter((item: Item) => {
          const itemDate = new Date(item.createdAt);
          switch (filters.dateRange) {
            case "today":
              return itemDate >= today;
            case "week":
              return itemDate >= weekAgo;
            case "month":
              return itemDate >= monthAgo;
            default:
              return true;
          }
        });
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          filteredItems.sort(
            (a: Item, b: Item) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          filteredItems.sort(
            (a: Item, b: Item) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "most-viewed":
          // Assuming views are stored in a different field
          break;
        case "most-claimed":
          filteredItems.sort(
            (a: Item, b: Item) => b.claims.length - a.claims.length
          );
          break;
      }

      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const handleClaimClick = (item: Item) => {
    setSelectedItem(item);
    setShowClaimDialog(true);
  };

  const handleClaimSuccess = () => {
    fetchItems(); // Refresh the items list
  };

  const ClaimStatus = ({ item }: { item: Item }) => {
    const foundClaim = item.claims.find(
      (c) => c.claimantId === session.user.id
    );
    const [showChat, setShowChat] = useState(false);
    let text = "";
    if (item.type === "LOST") {
      if (foundClaim) {
        text = "I Marked Found";
      } else {
        text = "I Found This";
      }
    } else {
      if (foundClaim) {
        text = "I Marked Claimed";
      } else {
        text = "This is Mine";
      }
    }
    return (
      <>
        {foundClaim && (
          <>
            <p>Your claim's status is {foundClaim.status}</p>
          </>
        )}
        <div className="flex space-x-2 pt-2">
          <Link href={`/item/${item.id}`}>
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          </Link>
          <Button
            disabled={foundClaim}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            onClick={() => handleClaimClick(item)}
          >
            {text}
          </Button>

          {foundClaim && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => setShowChat(true)}
            >
              Chat
            </Button>
          )}
        </div>

        {foundClaim && (
          <ClaimChat
            claimId={foundClaim.id}
            itemId={item.id}
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            receiverId={foundClaim.item.userId}
            session={session}
          />
        )}
      </>
    );
  };

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
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/report">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Report Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Items
          </h1>
          <p className="text-gray-600">
            Search through lost and found items from the UMT community
          </p>
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search items..."
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Item Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Item Type
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lost"
                        checked={filters.type.includes("LOST")}
                        onCheckedChange={() => handleTypeChange("LOST")}
                      />
                      <label htmlFor="lost" className="text-sm text-gray-700">
                        Lost Items
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="found"
                        checked={filters.type.includes("FOUND")}
                        onCheckedChange={() => handleTypeChange("FOUND")}
                      />
                      <label htmlFor="found" className="text-sm text-gray-700">
                        Found Items
                      </label>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Date Range
                  </label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, dateRange: value }))
                    }
                  >
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
              </CardContent>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{items.length} items found</p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
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
              {loading ? (
                <div className="col-span-2 text-center py-8">Loading...</div>
              ) : items.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  No items found
                </div>
              ) : (
                items.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">
                          {item.title}
                        </CardTitle>
                        <Badge
                          variant={
                            item.type === "LOST" ? "destructive" : "default"
                          }
                          className={
                            item.type === "LOST"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {item.type === "LOST" ? "Lost" : "Found"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
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
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {item.claims.length} claims
                            </span>
                          </div>

                          <Badge variant="outline">{item.category}</Badge>
                        </div>

                        <ClaimStatus item={item} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <ClaimDialog
          item={selectedItem}
          open={showClaimDialog}
          onOpenChange={setShowClaimDialog}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
}

const manageClaim = (item: Item, session: any) => {
  const foundClaim = item.claims.find((c) => c.claimantId === session.user.id);
  let text = "";
  if (item.type === "LOST") {
    if (foundClaim) {
      text = "I Marked Found";
    } else {
      text = "I Found This";
    }
  } else {
    if (foundClaim) {
      text = "I Marked Claimed";
    } else {
      text = "This is Mine";
    }
  }
  return text;
};
