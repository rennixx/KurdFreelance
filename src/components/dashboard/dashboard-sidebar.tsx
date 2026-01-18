"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores";
import { type Permission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/client";
import {
  SquaresFour,
  Briefcase,
  Users,
  FileText,
  ChatCircle,
  CurrencyDollar,
  Gear,
  User,
  PaperPlaneTilt,
  FolderOpen,
  Star,
  Question,
  List,
} from "@phosphor-icons/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredPermission?: Permission;
}

const freelancerNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/jobs", label: "Find Jobs", icon: Briefcase, requiredPermission: "jobs:browse" },
  { href: "/proposals", label: "My Proposals", icon: PaperPlaneTilt, badge: "proposals", requiredPermission: "proposals:view-own" },
  { href: "/contracts", label: "Contracts", icon: FileText, requiredPermission: "contracts:view-own" },
  { href: "/messages", label: "Messages", icon: ChatCircle, badge: "messages" },
  { href: "/earnings", label: "Earnings", icon: CurrencyDollar, requiredPermission: "profile:view-earnings" },
  { href: "/profile/edit", label: "Edit Profile", icon: User, requiredPermission: "profile:edit-own" },
  { href: "/settings", label: "Settings", icon: Gear },
];

const clientNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/my-jobs/post", label: "Post a Job", icon: Briefcase, requiredPermission: "jobs:post" },
  { href: "/my-jobs", label: "My Jobs", icon: FolderOpen, requiredPermission: "jobs:edit-own" },
  { href: "/freelancers", label: "Find Talent", icon: Users, requiredPermission: "freelancers:browse" },
  { href: "/contracts", label: "Contracts", icon: FileText, requiredPermission: "contracts:view-own" },
  { href: "/messages", label: "Messages", icon: ChatCircle, badge: "messages" },
  { href: "/settings", label: "Settings", icon: Gear },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, freelancerProfile, clientProfile, hasPermission, getUserRole } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});

  // Wait for client-side hydration to complete before filtering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch badge counts
  useEffect(() => {
    if (!user?.id || !mounted) return;

    let isCancelled = false;

    const fetchBadgeCounts = async () => {
      if (isCancelled) return;

      try {
        const supabase = createClient();

        // Fetch pending proposals count - only count proposals that have valid jobs
        const { data: proposals } = await supabase
          .from("proposals")
          .select("id, status, job_id")
          .eq("freelancer_id", user.id)
          .not("job_id", "is", null); // Only count proposals with valid jobs

        if (isCancelled) return;

        const pendingProposals = proposals?.filter(p => p.status === "pending" || p.status === "viewed").length || 0;

        // Fetch unread messages count - fetch conversations and filter client-side
        const { data: conversations, error: convError } = await supabase
          .from("conversations")
          .select("id, participants, last_message_sender_id, last_message_read_at, last_message_created_at");

        if (isCancelled) return;

        if (!convError && conversations) {
          // Find conversations where user is a participant
          const userConversations = conversations.filter(conv =>
            conv.participants && conv.participants.includes(user.id)
          );

          // Count unread messages
          const unreadCount = userConversations.filter(conv => {
            // Message sent by someone else
            const sentByOthers = conv.last_message_sender_id !== user.id;
            // Never read OR read before the last message was sent
            const notRead = !conv.last_message_read_at ||
              new Date(conv.last_message_created_at) > new Date(conv.last_message_read_at);

            return sentByOthers && notRead;
          }).length;

          if (!isCancelled) {
            setBadgeCounts({
              proposals: pendingProposals,
              messages: unreadCount,
            });
          }
        } else {
          if (!isCancelled) {
            setBadgeCounts({
              proposals: pendingProposals,
              messages: 0,
            });
          }
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching badge counts:", error);
          setBadgeCounts({
            proposals: 0,
            messages: 0,
          });
        }
      }
    };

    fetchBadgeCounts();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, mounted]);

  // Determine which nav items to show based on user role (not profile existence)
  const userRole = getUserRole();

  // Use a stable default for SSR - always start with freelancer nav items to avoid hydration mismatch
  const allNavItems = !mounted ? freelancerNavItems : (userRole === "freelancer" ? freelancerNavItems : clientNavItems);

  // Only filter nav items based on permissions after hydration and when role is available
  const navItems = mounted && userRole
    ? allNavItems.filter((item) => {
        if (!item.requiredPermission) return true;
        return hasPermission(item.requiredPermission);
      })
    : allNavItems; // Show all items during SSR or when role not loaded yet

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-0 lg:border-r lg:bg-white">        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="KurdFreelance" 
              className="h-10 w-auto"
            />
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
                  {item.badge && badgeCounts[item.badge] > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {badgeCounts[item.badge]}
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
                <Question className="h-5 w-5 text-gray-400" />
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-1">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] h-14 rounded-lg transition-colors relative",
                  isActive ? "text-green-600 bg-green-50" : "text-gray-500"
                )}
              >
                <div className="relative">
                  <item.icon className="h-6 w-6" />
                  {item.badge && badgeCounts[item.badge] > 0 && (
                    <span className="absolute -top-1 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {badgeCounts[item.badge]}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}

          {/* More Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] h-14 rounded-lg transition-colors text-gray-500 hover:bg-gray-50"
                )}
              >
                <List className="h-6 w-6" weight="bold" />
                <span className="text-xs font-medium">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>More Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.slice(4).map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer",
                        isActive ? "text-green-600" : "text-gray-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && badgeCounts[item.badge] > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {badgeCounts[item.badge]}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/help"
                  className="flex items-center gap-3 cursor-pointer text-gray-600"
                >
                  <Question className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}
