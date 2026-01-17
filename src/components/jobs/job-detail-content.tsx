"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  CurrencyDollar,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Star,
  ChatCircle,
  ArrowLeft,
  CircleNotch,
  CheckCircle,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface Job {
  id: string;
  title: string;
  description: string;
  budget_type: "fixed" | "hourly";
  budget_min: number;
  budget_max: number;
  skills: string[];
  category: string;
  experience_level: string;
  duration: string;
  status: string;
  created_at: string;
  client: {
    id: string;
    full_name: string;
    avatar_url?: string;
    created_at: string;
  };
}

interface User {
  id: string;
  role: "freelancer" | "client" | "admin";
  full_name: string;
}

interface JobDetailContentProps {
  job: Job;
  currentUser: User | null;
  hasApplied: boolean;
  proposalCount: number;
}

export function JobDetailContent({
  job,
  currentUser,
  hasApplied,
  proposalCount,
}: JobDetailContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverLetter: "",
    proposedRate: "",
    estimatedDuration: "",
  });

  const isFreelancer = currentUser?.role === "freelancer";
  const isOwner = currentUser?.id === job.client.id;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatBudget = () => {
    if (job.budget_type === "hourly") {
      return `$${job.budget_min} - $${job.budget_max}/hr`;
    }
    return `$${job.budget_min} - $${job.budget_max}`;
  };

  const handleSubmitProposal = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!proposalData.coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("proposals").insert({
        job_id: job.id,
        freelancer_id: currentUser.id,
        cover_letter: proposalData.coverLetter,
        proposed_rate: parseFloat(proposalData.proposedRate) || null,
        estimated_duration: proposalData.estimatedDuration || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Proposal submitted successfully!");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge variant="secondary">
                      {job.category || "General"}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      Posted {formatTimeAgo(job.created_at)}
                    </span>
                    <span className="text-sm">
                      {proposalCount} proposals
                    </span>
                  </CardDescription>
                </div>
                <Badge
                  variant={job.status === "open" ? "default" : "secondary"}
                >
                  {job.status === "open" ? "Open" : job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CurrencyDollar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">{formatBudget()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Experience Level
                    </p>
                    <p className="font-semibold capitalize">
                      {job.experience_level || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold capitalize">
                      {job.duration || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card>
            <CardContent className="pt-6">
              {!currentUser ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Sign in to apply for this job
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/login?next=/jobs/${job.id}`}>
                      Sign In to Apply
                    </Link>
                  </Button>
                </div>
              ) : isOwner ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    This is your job posting
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/jobs/${job.id}/proposals`}>
                      View Proposals ({proposalCount})
                    </Link>
                  </Button>
                </div>
              ) : !isFreelancer ? (
                <p className="text-sm text-muted-foreground text-center">
                  Only freelancers can apply for jobs
                </p>
              ) : hasApplied ? (
                <div className="space-y-4 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                  <p className="font-medium">You&apos;ve applied for this job</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/proposals">View My Proposals</Link>
                  </Button>
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Proposal</DialogTitle>
                      <DialogDescription>
                        Tell the client why you&apos;re the best fit for this job
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Introduce yourself and explain why you're the perfect fit for this project..."
                          rows={6}
                          value={proposalData.coverLetter}
                          onChange={(e) =>
                            setProposalData({
                              ...proposalData,
                              coverLetter: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="proposedRate">
                            Your Proposed Rate ($)
                          </Label>
                          <Input
                            id="proposedRate"
                            type="number"
                            placeholder={
                              job.budget_type === "hourly"
                                ? "e.g., 25/hr"
                                : "e.g., 500"
                            }
                            value={proposalData.proposedRate}
                            onChange={(e) =>
                              setProposalData({
                                ...proposalData,
                                proposedRate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estimatedDuration">
                            Estimated Completion Time
                          </Label>
                          <Input
                            id="estimatedDuration"
                            placeholder="e.g., 2 weeks"
                            value={proposalData.estimatedDuration}
                            onChange={(e) =>
                              setProposalData({
                                ...proposalData,
                                estimatedDuration: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleSubmitProposal}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit Proposal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.client.avatar_url} />
                  <AvatarFallback>
                    {job.client.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{job.client.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(job.client.created_at).toLocaleDateString(
                      "en-US",
                      { month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Jobs Posted</p>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hire Rate</p>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
