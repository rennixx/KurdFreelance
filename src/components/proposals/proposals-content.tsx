"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CurrencyDollar,
  FileText,
  CheckCircle,
  XCircle,
  Warning,
  Eye,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Job {
  id: string;
  title: string;
  budget_type: string;
  budget_min: number;
  budget_max: number;
  status: string;
  client?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface Freelancer {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_rate?: number;
  estimated_duration?: string;
  status: string;
  created_at: string;
  job: Job;
  freelancer?: Freelancer;
}

interface ProposalsContentProps {
  proposals: Proposal[];
  userRole: "freelancer" | "client" | "admin";
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
  },
  viewed: {
    label: "Viewed",
    variant: "outline" as const,
    icon: Eye,
  },
  shortlisted: {
    label: "Shortlisted",
    variant: "default" as const,
    icon: Warning,
  },
  accepted: {
    label: "Accepted",
    variant: "default" as const,
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    variant: "secondary" as const,
    icon: XCircle,
  },
};

export function ProposalsContent({ proposals, userRole }: ProposalsContentProps) {
  const isFreelancer = userRole === "freelancer";
  const [activeTab, setActiveTab] = useState("all");

  const filteredProposals = proposals.filter((proposal) => {
    if (activeTab === "all") return true;
    return proposal.status === activeTab;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatBudget = (job: Job) => {
    if (job.budget_type === "hourly") {
      return `$${job.budget_min} - $${job.budget_max}/hr`;
    }
    return `$${job.budget_min} - $${job.budget_max}`;
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: "secondary" as const,
        icon: Clock,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isFreelancer ? "My Proposals" : "Proposals Received"}
        </h1>
        <p className="text-muted-foreground">
          {isFreelancer
            ? "Track and manage your job proposals"
            : "Review proposals from freelancers"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending (
            {proposals.filter((p) => p.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted (
            {proposals.filter((p) => p.status === "shortlisted").length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted (
            {proposals.filter((p) => p.status === "accepted").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No proposals</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {isFreelancer
                    ? "You haven't submitted any proposals yet. Browse jobs to get started!"
                    : "No proposals have been submitted to your jobs yet."}
                </p>
                {isFreelancer && (
                  <Button asChild className="mt-4">
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => {
                const status = getStatusConfig(proposal.status);
                const StatusIcon = status.icon;

                // Skip proposals without job data
                if (!proposal.job) return null;

                return (
                  <Card key={proposal.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-3 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="min-w-0">
                              <Link
                                href={`/jobs/${proposal.job.id}`}
                                className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                              >
                                {proposal.job.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Submitted {formatTimeAgo(proposal.created_at)}
                                </span>
                              </div>
                            </div>
                            <Badge variant={status.variant} className="self-start sm:self-auto">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          {/* Show client info for freelancers, freelancer info for clients */}
                          {isFreelancer && proposal.job.client && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={proposal.job.client.avatar_url}
                                />
                                <AvatarFallback className="text-xs">
                                  {proposal.job.client.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground truncate">
                                {proposal.job.client.full_name}
                              </span>
                            </div>
                          )}

                          {!isFreelancer && proposal.freelancer && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={proposal.freelancer.avatar_url}
                                />
                                <AvatarFallback className="text-xs">
                                  {proposal.freelancer.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate">
                                {proposal.freelancer.full_name}
                              </span>
                            </div>
                          )}

                          <p className="text-muted-foreground line-clamp-2">
                            {proposal.cover_letter}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">Job Budget: {proposal.job ? formatBudget(proposal.job) : 'N/A'}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                              {proposal.proposed_rate && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">
                                    Your bid:
                                  </span>
                                  <span className="font-medium">
                                    ${proposal.proposed_rate}
                                  </span>
                                </div>
                              )}
                              {proposal.estimated_duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{proposal.estimated_duration}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href={`/jobs/${proposal.job?.id || '#'}`}>
                              View Job
                            </Link>
                          </Button>
                          {!isFreelancer && proposal.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">Accept</Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Reject
                              </Button>
                            </div>
                          )}
                          {isFreelancer && proposal.status === "pending" && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
