import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Code,
  Palette,
  PenNib,
  VideoCamera,
  TrendUp,
  Database,
  MusicNote,
  Camera,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Briefcase,
  Shield,
} from "@phosphor-icons/react";

const categories = [
  { name: "Development", icon: Code, count: "2,345 jobs" },
  { name: "Design", icon: Palette, count: "1,234 jobs" },
  { name: "Writing", icon: PenNib, count: "987 jobs" },
  { name: "Video & Animation", icon: VideoCamera, count: "654 jobs" },
  { name: "Marketing", icon: TrendUp, count: "543 jobs" },
  { name: "Data", icon: Database, count: "321 jobs" },
  { name: "Music & Audio", icon: MusicNote, count: "234 jobs" },
  { name: "Photography", icon: Camera, count: "198 jobs" },
];

const featuredFreelancers = [
  {
    name: "Azad K.",
    title: "Full Stack Developer",
    avatar: "",
    rating: 4.9,
    reviews: 47,
    rate: "$25/hr",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    name: "Hana M.",
    title: "UI/UX Designer",
    avatar: "",
    rating: 5.0,
    reviews: 32,
    rate: "$30/hr",
    skills: ["Figma", "UI Design", "Prototyping"],
  },
  {
    name: "Saman R.",
    title: "Content Writer",
    avatar: "",
    rating: 4.8,
    reviews: 28,
    rate: "$20/hr",
    skills: ["SEO", "Blog Writing", "Copywriting"],
  },
  {
    name: "Noor A.",
    title: "Digital Marketer",
    avatar: "",
    rating: 4.9,
    reviews: 51,
    rate: "$22/hr",
    skills: ["SEO", "Social Media", "Google Ads"],
  },
];

const recentJobs = [
  {
    title: "Build WordPress E-commerce Site",
    budget: "$500-800",
    type: "Fixed",
    skills: ["WordPress", "WooCommerce", "PHP"],
    posted: "2 hours ago",
    proposals: 3,
  },
  {
    title: "Mobile App UI Design (iOS & Android)",
    budget: "$30-50/hr",
    type: "Hourly",
    skills: ["Figma", "Mobile Design", "UI/UX"],
    posted: "4 hours ago",
    proposals: 7,
  },
  {
    title: "Arabic to English Translation (Technical)",
    budget: "$200-400",
    type: "Fixed",
    skills: ["Translation", "Arabic", "Technical Writing"],
    posted: "5 hours ago",
    proposals: 12,
  },
];

const stats = [
  { label: "Freelancers", value: "5,000+", icon: Users },
  { label: "Jobs Posted", value: "10,000+", icon: Briefcase },
  { label: "Total Earned", value: "$2M+", icon: TrendUp },
  { label: "Success Rate", value: "98%", icon: Shield },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              🎉 Now serving 5,000+ freelancers in Kurdistan
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Kurdistan&apos;s Best{" "}
              <span className="text-primary">Freelancers</span>
              <br />
              Or Get Hired for Your Skills
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              The local freelance marketplace with lower fees, fast local
              payments, and quality talent. Connect with professionals who
              understand your market.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register?type=client">
                  I&apos;m looking to hire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/register?type=freelancer">
                  I&apos;m looking for work
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>10-15% fees (vs 20% elsewhere)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Local payment methods</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Kurdish & Arabic support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect freelancer for any project
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/jobs?category=${category.name.toLowerCase()}`}
              >
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <category.icon className="h-10 w-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.count}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Get started in just 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and build your professional profile. Showcase your
                skills, portfolio, and experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Work or Talent</h3>
              <p className="text-muted-foreground">
                Browse jobs that match your skills or post a project and receive
                proposals from qualified freelancers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid Securely</h3>
              <p className="text-muted-foreground">
                Work with confidence using our secure escrow system. Get paid
                fast via local payment methods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Freelancers
              </h2>
              <p className="mt-2 text-muted-foreground">
                Top-rated professionals ready to work
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/freelancers">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage src={freelancer.avatar} />
                      <AvatarFallback className="text-lg">
                        {freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{freelancer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {freelancer.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({freelancer.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-primary">
                      {freelancer.rate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Recent Jobs</h2>
              <p className="mt-2 text-muted-foreground">
                New opportunities posted by clients
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/jobs">
                Browse All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        <Link href="#" className="hover:text-primary">
                          {job.title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Posted {job.posted}</span>
                        <span>•</span>
                        <span>{job.proposals} proposals</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{job.budget}</div>
                      <Badge variant="secondary">{job.type} Price</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and businesses already using
            KurdFreelance to connect and grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
