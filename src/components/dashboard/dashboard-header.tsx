"use client";

import { useEffect, useState } from "react";
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
  Gear,
  User,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      const supabase = createClient();
      
      // Fetch recent notifications
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    };

    fetchNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Notification update:", payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      discount_offer: "🎉",
      new_job: "💼",
      proposal_received: "📝",
      new_message: "💬",
      payment_received: "💰",
      system_alert: "📢",
      achievement: "⭐",
      review_received: "⭐",
    };
    return icons[type] || "🔔";
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
        {/* Logo - Mobile (left aligned) */}
        <div className="lg:hidden">
          <Link href="/dashboard" className="flex items-center">
            <img
              src="/logo.png"
              alt="KurdFreelance"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0">
                <Bell className="h-7 w-7" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <div className="flex items-center justify-between px-4 py-2">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-muted cursor-pointer border-b last:border-b-0 ${
                        !notification.is_read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      asChild
                    >
                      <Link href="/notifications">View all notifications</Link>
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || "User"} />
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
    </header>
  );
}
