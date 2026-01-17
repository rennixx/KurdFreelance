"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  ChatCircle, 
  CurrencyDollar, 
  Star, 
  TrendUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Bell,
  FileText,
  Users
} from "@phosphor-icons/react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePermissions } from "@/hooks/use-permissions";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "freelancer" | "client" | "admin";
  avatar_url?: string | null;
}

interface FreelancerProfile {
  id: string;
  user_id: string;
  title?: string | null;
  bio?: string | null;
  hourly_rate?: number | null;
  skills?: string[] | null;
  location?: string | null;
  portfolio_url?: string | null;
}

interface DashboardContentProps {
  user: User;
  freelancerProfile?: FreelancerProfile | null;
}

export function DashboardContent({ user, freelancerProfile }: DashboardContentProps) {
  const { isFreelancer, isClient, hasPermission } = usePermissions();
  const [mounted, setMounted] = useState(false);
  
  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const displayName = user.full_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate profile completion
  const profileChecks = {
    basicInfo: !!(user.full_name && user.email),
    profilePhoto: !!user.avatar_url,
    skills: !!(freelancerProfile?.skills && freelancerProfile.skills.length > 0),
    portfolio: !!(freelancerProfile?.portfolio_url || freelancerProfile?.bio),
  };
  
  const completedCount = Object.values(profileChecks).filter(Boolean).length;
  const totalChecks = Object.keys(profileChecks).length;
  const completionPercentage = Math.round((completedCount / totalChecks) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="text-xl bg-green-100 text-green-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName.split(" ")[0]}!</h1>
            <p className="text-gray-500">
              {mounted 
                ? (isFreelancer
                    ? "Here's what's happening with your freelance work"
                    : "Here's an overview of your projects and hires")
                : "Here's what's happening with your work"
              }
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {mounted && hasPermission("jobs:browse") && isFreelancer && (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Find Jobs
              </Link>
            </Button>
          )}
          {mounted && hasPermission("jobs:post") && isClient && (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/my-jobs/post">
                <FileText className="mr-2 h-4 w-4" />
                Post a Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid - Only render after hydration to avoid mismatch */}
      {mounted && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isFreelancer ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CurrencyDollar className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posted Jobs</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Hires</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <CurrencyDollar className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {mounted && isFreelancer ? (
                  <>
                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Complete Profile</p>
                        <p className="text-sm text-muted-foreground">
                          Add skills and portfolio
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/jobs"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Browse Jobs</p>
                        <p className="text-sm text-muted-foreground">
                          Find your next project
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/proposals"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">My Proposals</p>
                        <p className="text-sm text-muted-foreground">
                          Track your submissions
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/earnings"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CurrencyDollar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Earnings</p>
                        <p className="text-sm text-muted-foreground">
                          View your income
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/jobs/post"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Post a Job</p>
                        <p className="text-sm text-muted-foreground">
                          Find talent for your project
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/freelancers"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Browse Freelancers</p>
                        <p className="text-sm text-muted-foreground">
                          Find skilled professionals
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/jobs/my-jobs"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">My Jobs</p>
                        <p className="text-sm text-muted-foreground">
                          Manage your listings
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/contracts"
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Contracts</p>
                        <p className="text-sm text-muted-foreground">
                          View active contracts
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-1">No recent activity</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {mounted 
                    ? (isFreelancer
                        ? "Start by browsing jobs or updating your profile"
                        : "Start by posting a job or browsing freelancers")
                    : "Start by exploring the platform"
                  }
                </p>
                <Button variant="outline" asChild>
                  <Link href={mounted ? (isFreelancer ? "/jobs" : "/jobs/post") : "/dashboard"}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No new notifications
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatCircle className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ChatCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No messages yet
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/messages">View All Messages</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 text-sm ${profileChecks.basicInfo ? '' : 'text-muted-foreground'}`}>
                    {profileChecks.basicInfo ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                    <span>Basic info added</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${profileChecks.profilePhoto ? '' : 'text-muted-foreground'}`}>
                    {profileChecks.profilePhoto ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                    <span>Add profile photo</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${profileChecks.skills ? '' : 'text-muted-foreground'}`}>
                    {profileChecks.skills ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                    <span>Add skills</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${profileChecks.portfolio ? '' : 'text-muted-foreground'}`}>
                    {profileChecks.portfolio ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                    <span>Add portfolio</span>
                  </div>
                </div>
                {completionPercentage < 100 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/edit">Complete Profile</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
