"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SquaresFour,
  Users,
  Briefcase,
  FileText,
  CurrencyDollar,
  Gear,
  Bell,
  MagnifyingGlass,
  List,
  SignOut,
  CaretDown,
  TrendUp,
  TrendDown,
  UserCheck,
  UserMinus,
  Warning,
  CheckCircle,
  Clock,
  Eye,
  Prohibit,
  DotsThreeVertical,
  Flag,
  ChatCircle,
  Shield,
  Pulse,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalFreelancers: number;
  totalClients: number;
  totalJobs: number;
  activeJobs: number;
  totalContracts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingVerifications: number;
  pendingDisputes: number;
  reportsToReview: number;
}

interface RecentActivity {
  id: string;
  type: "user_registered" | "job_posted" | "contract_completed" | "dispute_filed" | "payment_processed";
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface PendingItem {
  id: string;
  type: "verification" | "dispute" | "report";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
  user: {
    name: string;
    avatar?: string;
  };
}

const mockStats: Stats = {
  totalUsers: 12543,
  totalFreelancers: 8234,
  totalClients: 4309,
  totalJobs: 3456,
  activeJobs: 892,
  totalContracts: 2134,
  totalRevenue: 1250000,
  monthlyRevenue: 125000,
  pendingVerifications: 45,
  pendingDisputes: 12,
  reportsToReview: 8,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "user_registered",
    description: "New freelancer registered",
    timestamp: "2 minutes ago",
    user: { name: "Ahmad Hassan" },
  },
  {
    id: "2",
    type: "contract_completed",
    description: "Contract #1234 completed successfully",
    timestamp: "15 minutes ago",
    user: { name: "Sara Ahmad" },
  },
  {
    id: "3",
    type: "job_posted",
    description: "New job posted: 'Mobile App Development'",
    timestamp: "32 minutes ago",
    user: { name: "Layla Hassan" },
  },
  {
    id: "4",
    type: "payment_processed",
    description: "Payment of $2,500 processed",
    timestamp: "1 hour ago",
  },
  {
    id: "5",
    type: "dispute_filed",
    description: "Dispute filed for contract #1198",
    timestamp: "2 hours ago",
    user: { name: "Mohammed Ali" },
  },
];

const mockPendingItems: PendingItem[] = [
  {
    id: "p1",
    type: "verification",
    title: "ID Verification Request",
    description: "Freelancer submitted ID documents for verification",
    priority: "high",
    created_at: "2024-01-28",
    user: { name: "Aram Hawrami" },
  },
  {
    id: "p2",
    type: "dispute",
    title: "Payment Dispute",
    description: "Client claims work was not delivered as promised",
    priority: "high",
    created_at: "2024-01-27",
    user: { name: "Ahmad Hassan" },
  },
  {
    id: "p3",
    type: "report",
    title: "Profile Report",
    description: "User reported for inappropriate content",
    priority: "medium",
    created_at: "2024-01-27",
    user: { name: "Sara Ahmad" },
  },
  {
    id: "p4",
    type: "verification",
    title: "Business Verification",
    description: "Client submitted business documents",
    priority: "low",
    created_at: "2024-01-26",
    user: { name: "TechKurd Solutions" },
  },
];

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/payments", label: "Payments", icon: CurrencyDollar },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminDashboard() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registered":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "job_posted":
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case "contract_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "dispute_filed":
        return <Warning className="h-4 w-4 text-red-500" />;
      case "payment_processed":
        return <CurrencyDollar className="h-4 w-4 text-green-500" />;
    }
  };

  const priorityColor = (priority: PendingItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-green-500" />
              <span className="font-bold text-xl">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-9 w-64" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span>Admin</span>
                    <CaretDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      +12.5% this month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                    <p className="text-2xl font-bold">{mockStats.activeJobs.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      +8.2% this month
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${(mockStats.monthlyRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      +15.3% this month
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <CurrencyDollar className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Actions</p>
                    <p className="text-2xl font-bold">
                      {mockStats.pendingVerifications + mockStats.pendingDisputes + mockStats.reportsToReview}
                    </p>
                    <p className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      Requires attention
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Warning className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockStats.totalFreelancers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Freelancers</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockStats.totalClients.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Clients</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{mockStats.totalContracts.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Contracts</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded">
                <CurrencyDollar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">${(mockStats.totalRevenue / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Actions</CardTitle>
                  <CardDescription>Items requiring admin review</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="verification">Verifications</SelectItem>
                    <SelectItem value="dispute">Disputes</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge className={priorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.user.name} • {item.created_at}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <DotsThreeVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Prohibit className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Pending Items
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {activityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {activity.user?.name && `${activity.user.name} • `}
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <UserCheck className="h-6 w-6" />
                  <span>Verify Users</span>
                  <Badge variant="secondary">{mockStats.pendingVerifications}</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Warning className="h-6 w-6" />
                  <span>Review Disputes</span>
                  <Badge variant="secondary">{mockStats.pendingDisputes}</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Flag className="h-6 w-6" />
                  <span>Check Reports</span>
                  <Badge variant="secondary">{mockStats.reportsToReview}</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <ChatCircle className="h-6 w-6" />
                  <span>Support Tickets</span>
                  <Badge variant="secondary">24</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
