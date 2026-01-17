"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  SignOut,
  List,
  ChatCircle,
  MagnifyingGlass,
  Gear,
  User,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/");
  };

  const handleRefreshUser = async () => {
    console.log("[HEADER] Refresh button clicked");
    console.log("[HEADER] Current user before refresh:", user);
    
    try {
      await refreshUser();
      console.log("[HEADER] refreshUser completed, reloading page...");
      window.location.reload(); // Reload to apply new permissions
    } catch (error) {
      console.error("[HEADER] Error refreshing user:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button and logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <List className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
              K
            </div>
            <span className="font-bold text-lg">KurdFreelance</span>
          </Link>
        </div>

        {/* Search bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, freelancers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <MagnifyingGlass className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0">
                <Bell className="h-7 w-7" />
                {/* Red dot will show when notifications are implemented */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages */}
          <Button variant="ghost" className="relative h-10 w-10 p-0" asChild>
            <Link href="/messages">
              <ChatCircle className="h-7 w-7" />
              {/* Badge will show when unread messages exist */}
            </Link>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {user?.full_name ? getInitials(user.full_name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.full_name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <Badge variant="secondary" className="text-xs w-fit mt-1">
                    {user?.role || "user"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Gear className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRefreshUser} className="text-blue-600">
                <Bell className="mr-2 h-4 w-4" />
                Refresh Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <SignOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="relative w-full">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, freelancers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
