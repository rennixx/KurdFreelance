"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Check,
  Trash,
  Gift,
  Briefcase,
  FileText,
  Chats,
  CurrencyDollar,
  Megaphone,
  Star,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface NotificationsContentProps {
  notifications: Notification[];
}

const notificationConfig = {
  discount_offer: {
    icon: Gift,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  new_job: {
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  proposal_received: {
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  new_message: {
    icon: Chats,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  payment_received: {
    icon: CurrencyDollar,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  system_alert: {
    icon: Megaphone,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  achievement: {
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  review_received: {
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
};

export function NotificationsContent({
  notifications: initialNotifications,
}: NotificationsContentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [viewFilter, setViewFilter] = useState("all" as "all" | "unread");

  const filteredNotifications = notifications.filter((notification) => {
    if (viewFilter === "all") return true;
    return !notification.is_read;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = async (notificationId: string) => {
    const supabase = createClient();
    await supabase.from("notifications").delete().eq("id", notificationId);

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success("Notification deleted");
  };

  const clearAll = async () => {
    const supabase = createClient();
    await supabase.from("notifications").delete().eq("is_read", true);

    setNotifications((prev) => prev.filter((n) => !n.is_read));
    toast.success("All read notifications cleared");
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getNotificationConfig = (type: string) => {
    return (
      notificationConfig[type as keyof typeof notificationConfig] || {
        icon: Bell,
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={viewFilter === "all" ? "default" : "outline"}
          onClick={() => setViewFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={viewFilter === "unread" ? "default" : "outline"}
          onClick={() => setViewFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        {notifications.filter((n) => n.is_read).length > 0 && (
          <Button variant="ghost" onClick={clearAll}>
            <Trash className="mr-2 h-4 w-4" />
            Clear read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {viewFilter === "unread"
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            const Icon = config.icon;

            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.is_read ? "bg-blue-50/50 border-blue-200" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={
                        `w-12 h-12 flex items-center justify-center rounded-full shrink-0 ` +
                        `${config.bgColor} shadow-sm backdrop-blur-[2px]`
                      }
                      aria-hidden
                    >
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.is_read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
