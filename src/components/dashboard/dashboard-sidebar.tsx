"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  Settings,
  User,
  Send,
  FolderOpen,
  Star,
  HelpCircle,
} from "lucide-react";

const freelancerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Find Jobs", icon: Briefcase },
  { href: "/proposals", label: "My Proposals", icon: Send, badge: "3" },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/messages", label: "Messages", icon: MessageSquare, badge: "5" },
  { href: "/earnings", label: "Earnings", icon: DollarSign },
  { href: "/profile/edit", label: "Edit Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const clientNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs/post", label: "Post a Job", icon: Briefcase },
  { href: "/jobs", label: "My Jobs", icon: FolderOpen },
  { href: "/freelancers", label: "Find Talent", icon: Users },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/messages", label: "Messages", icon: MessageSquare, badge: "2" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { freelancerProfile, clientProfile } = useAuthStore();

  // Determine which nav items to show based on user type
  const navItems = freelancerProfile ? freelancerNavItems : clientNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-0 lg:border-r lg:bg-white">        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
              K
            </div>
            <span className="font-bold text-xl">KurdFreelance</span>
          </Link>
        </div>        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-green-600" : "text-gray-400"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 pb-4 space-y-2">
            <div className="border-t pt-4">
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-gray-400" />
                Help & Support
              </Link>
            </div>
            
            {/* Upgrade Card (for freelancers) */}
            {freelancerProfile && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">Go Premium</span>
                </div>
                <p className="text-sm text-green-100 mb-3">
                  Get more visibility and priority support
                </p>
                <Link
                  href="/settings?tab=billing"
                  className="block text-center py-2 bg-white text-green-600 rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative",
                  isActive ? "text-green-600" : "text-gray-500"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
                {item.badge && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
