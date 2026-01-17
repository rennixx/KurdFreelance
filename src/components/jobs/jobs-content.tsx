"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  created_at: string;
  client: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface JobsContentProps {
  jobs: Job[];
}

const categories = [
  "All Categories",
  "Development",
  "Design",
  "Writing",
  "Marketing",
  "Video & Animation",
  "Music & Audio",
  "Data",
  "Admin Support",
];

const experienceLevels = ["Entry", "Intermediate", "Expert"];
const budgetTypes = ["Fixed", "Hourly"];

export function JobsContent({ jobs }: JobsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedBudgetType, setSelectedBudgetType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills?.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (job) => job.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Experience filter
    if (selectedExperience.length > 0) {
      filtered = filtered.filter((job) =>
        selectedExperience.includes(job.experience_level)
      );
    }

    // Budget type filter
    if (selectedBudgetType.length > 0) {
      filtered = filtered.filter((job) =>
        selectedBudgetType
          .map((t) => t.toLowerCase())
          .includes(job.budget_type)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "budget-high":
        filtered.sort((a, b) => b.budget_max - a.budget_max);
        break;
      case "budget-low":
        filtered.sort((a, b) => a.budget_min - b.budget_min);
        break;
    }

    return filtered;
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedExperience,
    selectedBudgetType,
    sortBy,
  ]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">
            {filteredJobs.length} jobs available
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, skill, or keyword..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Experience
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {experienceLevels.map((level) => (
                <DropdownMenuCheckboxItem
                  key={level}
                  checked={selectedExperience.includes(level)}
                  onCheckedChange={(checked) => {
                    setSelectedExperience(
                      checked
                        ? [...selectedExperience, level]
                        : selectedExperience.filter((l) => l !== level)
                    );
                  }}
                >
                  {level}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Budget Type
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {budgetTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedBudgetType.includes(type)}
                  onCheckedChange={(checked) => {
                    setSelectedBudgetType(
                      checked
                        ? [...selectedBudgetType, type]
                        : selectedBudgetType.filter((t) => t !== type)
                    );
                  }}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget-high">Budget: High to Low</SelectItem>
              <SelectItem value="budget-low">Budget: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || selectedCategory !== "All Categories"
                ? "Try adjusting your filters or search query"
                : "Check back later for new opportunities"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-xl font-semibold hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {job.budget_type === "fixed"
                              ? "Fixed Price"
                              : "Hourly"}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(job.created_at)}
                          </span>
                          {job.experience_level && (
                            <span>• {job.experience_level} Level</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatBudget(job)}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills?.length > 5 && (
                        <Badge variant="outline">
                          +{job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={job.client?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {job.client?.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {job.client?.full_name}
                        </span>
                      </div>
                      <Button asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
