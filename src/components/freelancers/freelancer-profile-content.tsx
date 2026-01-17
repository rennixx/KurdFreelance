"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  ChevronLeft,
  Heart,
  Share2,
  Flag,
  ExternalLink,
  Play,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";

interface FreelancerProfileContentProps {
  freelancerId: string;
}

interface FreelancerProfile {
  id: string;
  user_id: string;
  title: string;
  bio: string;
  hourly_rate: number;
  skills: string[];
  experience_level: string;
  availability: string;
  languages: { language: string; proficiency: string }[];
  portfolio_items: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    link?: string;
    category: string;
  }[];
  certifications: { name: string; issuer: string; year: number }[];
  education: { degree: string; institution: string; year: number }[];
  work_experience: { title: string; company: string; duration: string; description: string }[];
  total_earnings: number;
  completed_jobs: number;
  average_rating: number;
  total_reviews: number;
  response_time: string;
  user: {
    full_name: string;
    avatar_url: string;
    email: string;
    location: string;
    created_at: string;
    is_verified: boolean;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    full_name: string;
    avatar_url: string;
  };
  job_title: string;
}

// Mock data for demo
const mockFreelancer: FreelancerProfile = {
  id: "1",
  user_id: "user-1",
  title: "Senior Full Stack Developer & UI/UX Designer",
  bio: `I'm a passionate full-stack developer with over 8 years of experience building web and mobile applications. I specialize in React, Node.js, and cloud technologies.

My journey in tech started when I built my first website at 15. Since then, I've worked with startups and enterprises alike, helping them bring their digital visions to life.

I believe in writing clean, maintainable code and creating intuitive user experiences. Every project I take on receives my full dedication and attention to detail.

When I'm not coding, you'll find me mentoring junior developers, contributing to open-source projects, or exploring the beautiful mountains of Kurdistan.`,
  hourly_rate: 75,
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Figma",
    "UI/UX Design",
    "GraphQL",
  ],
  experience_level: "Expert",
  availability: "Full-time",
  languages: [
    { language: "Kurdish (Sorani)", proficiency: "Native" },
    { language: "Kurdish (Kurmanji)", proficiency: "Fluent" },
    { language: "Arabic", proficiency: "Fluent" },
    { language: "English", proficiency: "Fluent" },
    { language: "Turkish", proficiency: "Conversational" },
  ],
  portfolio_items: [
    {
      id: "p1",
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with real-time inventory, payment processing, and analytics dashboard.",
      image_url: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=600&h=400&fit=crop",
      link: "https://example.com",
      category: "Web Development",
    },
    {
      id: "p2",
      title: "Healthcare App",
      description: "Mobile app connecting patients with doctors for telemedicine consultations.",
      image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      link: "https://example.com",
      category: "Mobile App",
    },
    {
      id: "p3",
      title: "Financial Dashboard",
      description: "Real-time financial analytics dashboard with data visualization and reporting.",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      category: "Data Visualization",
    },
    {
      id: "p4",
      title: "Restaurant Booking System",
      description: "Table reservation system with menu management and customer reviews.",
      image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
      category: "Web Development",
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", year: 2023 },
    { name: "Google Cloud Professional Developer", issuer: "Google", year: 2022 },
    { name: "Meta Front-End Developer", issuer: "Meta", year: 2022 },
  ],
  education: [
    { degree: "Master of Computer Science", institution: "University of Kurdistan", year: 2018 },
    { degree: "Bachelor of Software Engineering", institution: "Salahaddin University", year: 2015 },
  ],
  work_experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Startup",
      duration: "2020 - Present",
      description: "Lead developer for multiple client projects, mentoring junior developers.",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Agency",
      duration: "2017 - 2020",
      description: "Built web applications for various clients across different industries.",
    },
  ],
  total_earnings: 125000,
  completed_jobs: 87,
  average_rating: 4.9,
  total_reviews: 73,
  response_time: "Within 2 hours",
  user: {
    full_name: "Aram Hawrami",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    email: "aram@example.com",
    location: "Erbil, Kurdistan",
    created_at: "2019-03-15",
    is_verified: true,
  },
};

const mockReviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    comment: "Aram is an exceptional developer! He delivered our e-commerce platform ahead of schedule with outstanding quality. His communication was excellent throughout the project.",
    created_at: "2024-01-15",
    client: { full_name: "Sara Ahmad", avatar_url: "" },
    job_title: "E-Commerce Website Development",
  },
  {
    id: "r2",
    rating: 5,
    comment: "Working with Aram was a pleasure. He understood our requirements perfectly and provided valuable suggestions that improved the final product.",
    created_at: "2024-01-02",
    client: { full_name: "Mohammed Ali", avatar_url: "" },
    job_title: "Mobile App Development",
  },
  {
    id: "r3",
    rating: 4,
    comment: "Great work on our dashboard project. Very professional and skilled developer.",
    created_at: "2023-12-20",
    client: { full_name: "Layla Hassan", avatar_url: "" },
    job_title: "Analytics Dashboard",
  },
  {
    id: "r4",
    rating: 5,
    comment: "Aram transformed our outdated website into a modern, responsive platform. Highly recommended!",
    created_at: "2023-12-05",
    client: { full_name: "Omar Karim", avatar_url: "" },
    job_title: "Website Redesign",
  },
];

export function FreelancerProfileContent({ freelancerId }: FreelancerProfileContentProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<FreelancerProfile["portfolio_items"][0] | null>(null);

  useEffect(() => {
    const fetchFreelancer = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFreelancer(mockFreelancer);
      setReviews(mockReviews);
      setIsLoading(false);
    };

    fetchFreelancer();
  }, [freelancerId]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved to favorites");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error("Please login to contact this freelancer");
      router.push("/login");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success("Message sent successfully!");
    setContactDialogOpen(false);
    setMessage("");
  };

  const handleHire = () => {
    if (!user) {
      toast.error("Please login to hire this freelancer");
      router.push("/login");
      return;
    }
    toast.success("Hire request sent! The freelancer will be notified.");
    setHireDialogOpen(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Freelancer Not Found</h1>
          <p className="text-gray-600 mb-6">The freelancer profile you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/freelancers")}>
            Browse Freelancers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={freelancer.user.avatar_url} alt={freelancer.user.full_name} />
                      <AvatarFallback className="text-3xl">
                        {freelancer.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {freelancer.user.is_verified && (
                      <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                          {freelancer.user.full_name}
                          {freelancer.user.is_verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </h1>
                        <p className="text-lg text-gray-600 mt-1">{freelancer.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSave}
                          className={isSaved ? "text-red-500" : ""}
                        >
                          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleShare}>
                          <Share2 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Flag className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {freelancer.user.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {freelancer.response_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since {new Date(freelancer.user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(freelancer.average_rating)}
                        <span className="font-semibold ml-1">{freelancer.average_rating}</span>
                        <span className="text-gray-500">({freelancer.total_reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 6 && (
                        <Badge variant="outline">+{freelancer.skills.length - 6} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent"
                >
                  Portfolio ({freelancer.portfolio_items.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent"
                >
                  Reviews ({freelancer.total_reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {freelancer.bio.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-gray-700 mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Work Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {freelancer.work_experience.map((exp, idx) => (
                      <div key={idx} className={idx !== 0 ? "pt-4 border-t" : ""}>
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {freelancer.education.map((edu, idx) => (
                      <div key={idx} className={idx !== 0 ? "pt-4 border-t" : ""}>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {freelancer.certifications.map((cert, idx) => (
                      <div key={idx} className={idx !== 0 ? "pt-4 border-t" : ""}>
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {freelancer.languages.map((lang, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-medium">{lang.language}</span>
                          <Badge variant="outline">{lang.proficiency}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancer.portfolio_items.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedPortfolioItem(item)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {item.category}
                        </Badge>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Portfolio Item Dialog */}
                <Dialog
                  open={!!selectedPortfolioItem}
                  onOpenChange={() => setSelectedPortfolioItem(null)}
                >
                  <DialogContent className="max-w-3xl">
                    {selectedPortfolioItem && (
                      <>
                        <div className="relative h-64 md:h-96 -mx-6 -mt-6 mb-4">
                          <Image
                            src={selectedPortfolioItem.image_url}
                            alt={selectedPortfolioItem.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <DialogHeader>
                          <Badge variant="secondary" className="w-fit mb-2">
                            {selectedPortfolioItem.category}
                          </Badge>
                          <DialogTitle>{selectedPortfolioItem.title}</DialogTitle>
                          <DialogDescription>
                            {selectedPortfolioItem.description}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedPortfolioItem.link && (
                          <Button variant="outline" className="w-fit" asChild>
                            <a
                              href={selectedPortfolioItem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Project
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-4">
                {/* Reviews Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">
                          {freelancer.average_rating}
                        </div>
                        <div className="flex justify-center mt-1">
                          {renderStars(freelancer.average_rating)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {freelancer.total_reviews} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = reviews.filter((r) => r.rating === star).length;
                          const percentage = (count / reviews.length) * 100;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-sm w-8">{star} ★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.client.avatar_url} />
                          <AvatarFallback>
                            {review.client.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">
                                {review.client.full_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {review.job_title}
                              </p>
                            </div>
                            <div className="text-right">
                              {renderStars(review.rating)}
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hire Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600">
                    ${freelancer.hourly_rate}
                    <span className="text-lg font-normal text-gray-500">/hr</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {freelancer.availability}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <Dialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Hire {freelancer.user.full_name.split(" ")[0]}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Hire {freelancer.user.full_name}</DialogTitle>
                        <DialogDescription>
                          Send a hiring request to start working together
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Project Description</Label>
                          <Textarea
                            placeholder="Describe your project and requirements..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Budget</Label>
                            <Input type="number" placeholder="$" />
                          </div>
                          <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Input placeholder="e.g., 2 weeks" />
                          </div>
                        </div>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleHire}
                        >
                          Send Hire Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Me
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact {freelancer.user.full_name}</DialogTitle>
                        <DialogDescription>
                          Send a message to discuss your project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleContact}
                        >
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator className="my-6" />

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>Jobs Completed</span>
                    </div>
                    <span className="font-semibold">{freelancer.completed_jobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Total Earned</span>
                    </div>
                    <span className="font-semibold">
                      ${freelancer.total_earnings.toLocaleString()}+
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Success Rate</span>
                    </div>
                    <span className="font-semibold">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Response Time</span>
                    </div>
                    <span className="font-semibold">{freelancer.response_time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Freelancers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Freelancers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={`/freelancers/${i}`}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <Avatar>
                      <AvatarFallback>F{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        Freelancer Name {i}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        Full Stack Developer
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      $50/hr
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
