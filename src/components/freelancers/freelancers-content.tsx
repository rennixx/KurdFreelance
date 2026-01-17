"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  Funnel,
  MapPin,
  Star,
  CaretDown,
  Users,
} from "@phosphor-icons/react";

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

interface FreelancerProfile {
  id: string;
  title: string;
  bio: string;
  hourly_rate: number;
  skills: string[];
  location: string;
  availability: string;
}

interface Freelancer {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  freelancer_profile: FreelancerProfile | null;
}

interface FreelancersContentProps {
  freelancers: Freelancer[];
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

const rateRanges = [
  { label: "Any Rate", min: 0, max: Infinity },
  { label: "Under $25/hr", min: 0, max: 25 },
  { label: "$25 - $50/hr", min: 25, max: 50 },
  { label: "$50 - $100/hr", min: 50, max: 100 },
  { label: "$100+/hr", min: 100, max: Infinity },
];

export function FreelancersContent({ freelancers }: FreelancersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRate, setSelectedRate] = useState("Any Rate");
  const [sortBy, setSortBy] = useState("newest");

  const filteredFreelancers = useMemo(() => {
    let filtered = [...freelancers].filter(
      (f) => f.freelancer_profile !== null
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (freelancer) =>
          freelancer.full_name.toLowerCase().includes(query) ||
          freelancer.freelancer_profile?.title?.toLowerCase().includes(query) ||
          freelancer.freelancer_profile?.bio?.toLowerCase().includes(query) ||
          freelancer.freelancer_profile?.skills?.some((skill) =>
            skill.toLowerCase().includes(query)
          )
      );
    }

    // Rate filter
    const rateRange = rateRanges.find((r) => r.label === selectedRate);
    if (rateRange && selectedRate !== "Any Rate") {
      filtered = filtered.filter((freelancer) => {
        const rate = freelancer.freelancer_profile?.hourly_rate || 0;
        return rate >= rateRange.min && rate < rateRange.max;
      });
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "rate-high":
        filtered.sort(
          (a, b) =>
            (b.freelancer_profile?.hourly_rate || 0) -
            (a.freelancer_profile?.hourly_rate || 0)
        );
        break;
      case "rate-low":
        filtered.sort(
          (a, b) =>
            (a.freelancer_profile?.hourly_rate || 0) -
            (b.freelancer_profile?.hourly_rate || 0)
        );
        break;
    }

    return filtered;
  }, [freelancers, searchQuery, selectedCategory, selectedRate, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Freelancers</h1>
          <p className="text-muted-foreground">
            {filteredFreelancers.length} freelancers available
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, or keyword..."
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

          <Select value={selectedRate} onValueChange={setSelectedRate}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rate" />
            </SelectTrigger>
            <SelectContent>
              {rateRanges.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rate-high">Rate: High to Low</SelectItem>
              <SelectItem value="rate-low">Rate: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Freelancers Grid */}
      {filteredFreelancers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No freelancers found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search query or filters"
                : "Check back later for new freelancers"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card
              key={freelancer.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage src={freelancer.avatar_url} />
                    <AvatarFallback className="text-xl">
                      {freelancer.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">
                    {freelancer.full_name}
                  </h3>
                  <p className="text-muted-foreground">
                    {freelancer.freelancer_profile?.title || "Freelancer"}
                  </p>
                </div>

                {freelancer.freelancer_profile?.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {freelancer.freelancer_profile.location}
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">-</span>
                  <span className="text-muted-foreground text-sm">
                    (0 reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {freelancer.freelancer_profile?.skills
                    ?.slice(0, 3)
                    .map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  {(freelancer.freelancer_profile?.skills?.length || 0) > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{freelancer.freelancer_profile!.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${freelancer.freelancer_profile?.hourly_rate || 0}
                  </span>
                  <span className="text-muted-foreground">/hr</span>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/freelancers/${freelancer.id}`}>
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
