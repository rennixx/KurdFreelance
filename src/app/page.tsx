"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KurdistanShape from "@/components/landing/kurdistan-shape";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ProfileIllustration,
  DiscoveryIllustration,
  PaymentIllustration,
} from "@/components/landing/how-it-works-illustrations";
import {
  TrustShieldIllustration,
  TrustFeatureCard,
} from "@/components/landing/trust-shield-illustration";
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
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  InstagramLogo,
  UserPlus,
  MagnifyingGlass,
  Handshake,
  Quotes,
  Trophy,
  EnvelopeSimple,
  Check,
  CurrencyDollar,
  LockKey,
  Globe,
  Clock,
  SpinnerGap,
} from "@phosphor-icons/react";

// Icon mapping for dynamic categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  PenNib,
  VideoCamera,
  TrendUp,
  Database,
  MusicNote,
  Camera,
};

// Types
interface Stat {
  freelancersCount: string;
  jobsCount: string;
  totalEarnings: string;
  successRate: string;
}

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  author: {
    name: string;
    avatar: string;
    role: string;
    title: string;
    jobsCompleted: number;
  };
}

interface SuccessStory {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  stats: {
    duration?: string;
    budget?: string;
    result?: string;
  };
  freelancer: {
    name: string;
    avatar: string;
    title: string;
  };
  client: {
    name: string;
    company: string;
  };
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  partner_type: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  jobsCount: number;
}

export default function HomePage() {
  // State for API data
  const [stats, setStats] = useState<Stat | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  // const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          testimonialsRes,
          // storiesRes,
          faqsRes,
          partnersRes,
          categoriesRes,
        ] = await Promise.all([
          fetch("/api/landing/stats"),
          fetch("/api/landing/testimonials"),
          // fetch("/api/landing/success-stories"),
          fetch("/api/landing/faqs"),
          fetch("/api/landing/partners"),
          fetch("/api/landing/categories"),
        ]);

        const [
          statsData,
          testimonialsData,
          // storiesData,
          faqsData,
          partnersData,
          categoriesData,
        ] = await Promise.all([
          statsRes.json(),
          testimonialsRes.json(),
          // storiesRes.json(),
          faqsRes.json(),
          partnersRes.json(),
          categoriesRes.json(),
        ]);

        setStats(statsData);
        setTestimonials(testimonialsData);
        // setSuccessStories(storiesData);
        setFaqs(faqsData);
        setPartners(partnersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Newsletter subscription handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    setSubscribeMessage("");

    try {
      const res = await fetch("/api/landing/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubscribeMessage(data.message || "Thank you for subscribing!");
      setEmail("");
    } catch {
      setSubscribeMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Stats config with icons
  const statsConfig = [
    { key: "freelancersCount", label: "Freelancers", icon: Users },
    { key: "jobsCount", label: "Jobs Posted", icon: Briefcase },
    { key: "totalEarnings", label: "Total Earned", icon: TrendUp },
    { key: "successRate", label: "Success Rate", icon: Shield },
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up for free and build your professional profile. Showcase your skills, portfolio, and experience to attract clients.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: MagnifyingGlass,
      title: "Find Opportunities",
      description:
        "Browse jobs that match your skills or let clients find you. Our smart matching system connects you with the right projects.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Handshake,
      title: "Work & Get Paid",
      description:
        "Collaborate with clients, deliver quality work, and receive secure payments through our escrow system. Simple and safe.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  // Trust badges
  const trustBadges = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Your payments are protected until work is approved",
    },
    {
      icon: LockKey,
      title: "Identity Verified",
      description: "All freelancers go through our verification process",
    },
    {
      icon: CurrencyDollar,
      title: "Low Fees",
      description: "Only 10-15% fees, lower than any competitor",
    },
    {
      icon: Globe,
      title: "Local Support",
      description: "24/7 support in Kurdish, Arabic, and English",
    },
    {
      icon: Clock,
      title: "Fast Payments",
      description: "Get paid within 24-48 hours of approval",
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "Dispute resolution and quality assurance",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating Pill Header */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-4xl bg-background/80 backdrop-blur-lg border rounded-full shadow-lg px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="KurdFreelance" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link href="/login">Log In</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                🎉 Now serving {stats?.freelancersCount || "5,000+"} freelancers
                in Kurdistan
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
              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
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
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
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
            <div className="relative">
              <KurdistanShape />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsConfig.map((stat) => (
              <div key={stat.key} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold">
                  {isLoading ? (
                    <SpinnerGap className="h-6 w-6 mx-auto animate-spin" />
                  ) : (
                    stats?.[stat.key as keyof Stat] || "—"
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: How It Works - Visual Journey */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <Badge variant="outline" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes. Whether you&apos;re hiring or looking for
              work, our platform makes it easy.
            </p>
          </div>

          {/* Step 1: Create Profile */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-24 md:mb-32">
            {/* Illustration */}
            <div className="order-2 lg:order-1">
              <ProfileIllustration />
            </div>
            
            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold shadow-lg shadow-blue-500/25">
                  1
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-blue-500 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                Create Your Profile
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sign up for free and build your professional profile. Showcase your skills, 
                portfolio, and experience to attract the right clients.
              </p>
              <ul className="space-y-3">
                {["Free signup in under 2 minutes", "Showcase your portfolio", "Get verified for more trust"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-500" />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 2: Find Opportunities - Reversed */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-24 md:mb-32">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xl font-bold shadow-lg shadow-purple-500/25">
                  2
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                Find Opportunities
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Browse jobs that match your skills or let clients find you. Our smart 
                matching system connects you with the right projects instantly.
              </p>
              <ul className="space-y-3">
                {["AI-powered job matching", "Real-time notifications", "Direct client invitations"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-purple-500" />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Illustration */}
            <div>
              <DiscoveryIllustration />
            </div>
          </div>

          {/* Step 3: Work & Get Paid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Illustration */}
            <div className="order-2 lg:order-1">
              <PaymentIllustration />
            </div>
            
            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white text-xl font-bold shadow-lg shadow-green-500/25">
                  3
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-green-500 to-transparent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                Work & Get Paid
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Collaborate with clients, deliver quality work, and receive secure payments 
                through our escrow system. Fast, simple, and protected.
              </p>
              <ul className="space-y-3">
                {["100% payment protection", "Milestone-based payments", "Withdraw within 24-48 hours"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Trust & Security - Visual Showcase */}
      <section className="py-16 md:py-24 bg-muted/30 overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="outline" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for Trust & Security
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We prioritize your safety and satisfaction with industry-leading
              protections.
            </p>
          </div>

          {/* Main content: Shield + Features */}
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Features */}
            <div className="space-y-6 order-2 lg:order-1">
              <TrustFeatureCard
                icon={Shield}
                title="Secure Escrow"
                description="Your payments are held safely until you approve the work. Full protection for every transaction."
                color="blue"
                delay={0}
              />
              <TrustFeatureCard
                icon={LockKey}
                title="Identity Verified"
                description="All freelancers go through our verification process to ensure authenticity and trust."
                color="purple"
                delay={100}
              />
              <TrustFeatureCard
                icon={CurrencyDollar}
                title="Low Fees"
                description="Only 10-15% fees, significantly lower than international competitors. Keep more of your earnings."
                color="green"
                delay={200}
              />
            </div>

            {/* Center Shield */}
            <div className="order-1 lg:order-2">
              <TrustShieldIllustration />
            </div>

            {/* Right Features */}
            <div className="space-y-6 order-3">
              <TrustFeatureCard
                icon={Globe}
                title="Local Support"
                description="24/7 support in Kurdish, Arabic, and English. We speak your language."
                color="cyan"
                delay={0}
              />
              <TrustFeatureCard
                icon={Clock}
                title="Fast Payments"
                description="Get paid within 24-48 hours of approval. Quick and reliable withdrawals."
                color="orange"
                delay={100}
              />
              <TrustFeatureCard
                icon={Trophy}
                title="Quality Guarantee"
                description="Not satisfied? We'll make it right. 100% satisfaction guaranteed on every project."
                color="yellow"
                delay={200}
              />
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="mt-16 pt-8 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border">
                <div className="text-2xl md:text-3xl font-bold text-primary">$2M+</div>
                <div className="text-sm text-muted-foreground">Protected Payments</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border">
                <div className="text-2xl md:text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Verified Users</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border">
                <div className="text-2xl md:text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Browse Categories */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Explore
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the perfect freelancer for any project
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6 text-center">
                        <div className="h-10 w-10 mx-auto mb-3 rounded bg-muted" />
                        <div className="h-4 w-20 mx-auto mb-2 rounded bg-muted" />
                        <div className="h-3 w-16 mx-auto rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))
              : categories.map((category) => {
                  const IconComponent =
                    iconMap[category.icon] || Code;
                  return (
                    <Link
                      key={category.id}
                      href={`/jobs?category=${category.slug}`}
                    >
                      <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                        <CardContent className="p-6 text-center">
                          <IconComponent className="h-10 w-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.jobsCount} jobs
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Quotes className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What Our Community Says
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from freelancers and clients who have transformed their
              businesses with KurdFreelance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-24 rounded bg-muted mb-4" />
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted" />
                          <div>
                            <div className="h-4 w-24 rounded bg-muted mb-2" />
                            <div className="h-3 w-32 rounded bg-muted" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              : testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-4">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={testimonial.author.avatar} />
                          <AvatarFallback>
                            {testimonial.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {testimonial.author.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.author.title}
                            {testimonial.author.jobsCompleted > 0 && (
                              <span className="ml-1">
                                • {testimonial.author.jobsCompleted} jobs
                              </span>
                            )}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-auto capitalize text-xs"
                        >
                          {testimonial.author.role}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Section 5: Success Stories - Disabled for now */}
      {/* TODO: Re-enable when success_stories table is created */}

      {/* Section 6: FAQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to know about KurdFreelance.
              </p>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-14 rounded-lg bg-muted" />
                    </div>
                  ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Newsletter */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
              <EnvelopeSimple className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the latest jobs, freelancer tips, and platform updates
              delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubscribing}>
                {isSubscribing ? (
                  <SpinnerGap className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            {subscribeMessage && (
              <p className="mt-4 text-sm flex items-center justify-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section - Infinite Scroll with RNA Wave */}
      <section className="py-12 border-y bg-background overflow-hidden">
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling track */}
          <div className="flex overflow-hidden">
            {/* Scrolling container - duplicated 4x for seamless loop */}
            <div className="flex shrink-0 animate-marquee items-center">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex shrink-0 items-center">
                  {partners.map((partner, partnerIndex) => (
                    <a
                      key={`${setIndex}-${partner.id}`}
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="animate-rna-wave flex items-center justify-center h-16 px-10 transition-all duration-300 hover:!opacity-100 hover:!scale-110"
                      title={partner.name}
                      style={{ animationDelay: `${partnerIndex * 0.2}s` }}
                    >
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="h-12 w-auto max-w-[180px] object-contain"
                        />
                      ) : (
                        <span className="text-lg font-semibold tracking-tight whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors">
                          {partner.name}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </div>
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

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center mb-4">
                <img
                  src="/logo.png"
                  alt="KurdFreelance"
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                Connecting Kurdish talent with global opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">For Clients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/freelancers"
                    className="hover:text-foreground transition-colors"
                  >
                    Find Talent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Post a Job
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">For Freelancers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Create Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KurdFreelance. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FacebookLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkedinLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <InstagramLogo className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
