"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quotes } from "@phosphor-icons/react";

// Type definitions
interface TestimonialAuthor {
  name: string;
  avatar: string;
  role: "freelancer" | "client";
  title: string;
  jobsCompleted: number;
}

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  isFeatured?: boolean;
  author: TestimonialAuthor;
}

// Fallback testimonials data for marquee
const fallbackTestimonials: Testimonial[] = [
  // Row 1 - Freelancers
  {
    id: "1",
    content: "Found my first client within a week of signing up! The platform made it so easy to showcase my portfolio.",
    rating: 5,
    author: {
      name: "Soran Ahmed",
      avatar: "",
      role: "freelancer",
      title: "UI/UX Designer",
      jobsCompleted: 47,
    },
  },
  {
    id: "2",
    content: "Payment protection gives me peace of mind. I can focus on delivering quality work without worrying.",
    rating: 5,
    author: {
      name: "Lana Mustafa",
      avatar: "",
      role: "freelancer",
      title: "Web Developer",
      jobsCompleted: 89,
    },
  },
  {
    id: "3",
    content: "As a Kurdish freelancer, finally having a local platform that understands our market is incredible.",
    rating: 5,
    author: {
      name: "Dilan Karim",
      avatar: "",
      role: "freelancer",
      title: "Content Writer",
      jobsCompleted: 34,
    },
  },
  {
    id: "4",
    content: "The escrow system is fantastic. Clients trust me more knowing their payment is secured.",
    rating: 5,
    author: {
      name: "Reber Hassan",
      avatar: "",
      role: "freelancer",
      title: "Mobile Developer",
      jobsCompleted: 62,
    },
  },
  {
    id: "5",
    content: "Withdrawing earnings is so fast! Within 24 hours, money is in my account. No other platform does this.",
    rating: 5,
    author: {
      name: "Zhina Aziz",
      avatar: "",
      role: "freelancer",
      title: "Graphic Designer",
      jobsCompleted: 51,
    },
  },
  // Row 2 - Clients
  {
    id: "6",
    content: "Best talent pool in Kurdistan! Found an amazing developer who understood exactly what I needed.",
    rating: 5,
    author: {
      name: "Karwan Salih",
      avatar: "",
      role: "client",
      title: "Startup Founder",
      jobsCompleted: 23,
    },
  },
  {
    id: "7",
    content: "Communication was seamless. The platform's messaging system made collaboration so smooth.",
    rating: 5,
    author: {
      name: "Naz Bakir",
      avatar: "",
      role: "client",
      title: "Marketing Director",
      jobsCompleted: 15,
    },
  },
  {
    id: "8",
    content: "Finally, a platform where I can hire local talent who understand Kurdish business culture!",
    rating: 5,
    author: {
      name: "Aram Othman",
      avatar: "",
      role: "client",
      title: "Business Owner",
      jobsCompleted: 31,
    },
  },
  {
    id: "9",
    content: "The quality of freelancers here rivals international platforms, but with better rates and local support.",
    rating: 5,
    author: {
      name: "Sara Jamal",
      avatar: "",
      role: "client",
      title: "Agency Owner",
      jobsCompleted: 45,
    },
  },
  {
    id: "10",
    content: "Hired 5 freelancers for my startup. Every single one delivered exceptional work. Highly recommend!",
    rating: 5,
    author: {
      name: "Hemin Rashid",
      avatar: "",
      role: "client",
      title: "Tech Entrepreneur",
      jobsCompleted: 28,
    },
  },
];

// Fallback featured testimonial (center highlight)
const fallbackFeaturedTestimonial: Testimonial = {
  id: "featured",
  content: "KurdFreelance transformed my career. I went from struggling to find clients to having a full pipeline of projects. The local support team is amazing - they actually speak Kurdish and understand our needs. This platform isn't just about work, it's about building Kurdistan's digital economy together.",
  rating: 5,
  isFeatured: true,
  author: {
    name: "Shad Barzan",
    avatar: "",
    role: "freelancer",
    title: "Full-Stack Developer",
    jobsCompleted: 127,
  },
};

function TestimonialCard({ 
  testimonial, 
  variant = "default" 
}: { 
  testimonial: Testimonial;
  variant?: "default" | "featured";
}) {
  const isFreelancer = testimonial.author.role === "freelancer";
  
  return (
    <div 
      className={`
        relative rounded-2xl border bg-card p-5 transition-all duration-300
        ${variant === "featured" 
          ? "shadow-xl" 
          : "hover:shadow-lg hover:-translate-y-1"
        }
      `}
      style={{
        background: variant === "featured" 
          ? undefined 
          : isFreelancer 
            ? "linear-gradient(135deg, rgba(34,197,94,0.03) 0%, transparent 50%)" 
            : "linear-gradient(135deg, rgba(59,130,246,0.03) 0%, transparent 50%)",
      }}
    >
      {/* Quote icon for featured */}
      {variant === "featured" && (
        <Quotes 
          className="absolute top-4 right-4 w-10 h-10 text-primary/10" 
          weight="fill"
        />
      )}

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array(testimonial.rating).fill(0).map((_, i) => (
          <Star 
            key={i} 
            className={`${variant === "featured" ? "w-5 h-5" : "w-4 h-4"} fill-yellow-400 text-yellow-400`} 
            weight="fill"
          />
        ))}
      </div>

      {/* Content */}
      <p className={`text-muted-foreground mb-4 ${variant === "featured" ? "text-base leading-relaxed" : "text-sm line-clamp-3"}`}>
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`relative ${variant === "featured" ? "w-12 h-12" : "w-10 h-10"}`}>
          {/* Colored ring based on role */}
          <div 
            className={`absolute inset-0 rounded-full ${variant === "featured" ? "-m-0.5" : "-m-[2px]"}`}
            style={{
              background: isFreelancer 
                ? "linear-gradient(135deg, #22C55E, #16A34A)" 
                : "linear-gradient(135deg, #3B82F6, #2563EB)",
            }}
          />
          <Avatar className={`relative ${variant === "featured" ? "w-12 h-12" : "w-10 h-10"} border-2 border-card`}>
            <AvatarImage src={testimonial.author.avatar} />
            <AvatarFallback className={isFreelancer ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
              {testimonial.author.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${variant === "featured" ? "text-base" : "text-sm"}`}>
            {testimonial.author.name}
          </p>
          <p className={`text-muted-foreground truncate ${variant === "featured" ? "text-sm" : "text-xs"}`}>
            {testimonial.author.title}
            {testimonial.author.jobsCompleted > 0 && (
              <span className="ml-1">• {testimonial.author.jobsCompleted} jobs</span>
            )}
          </p>
        </div>
        {/* Role badge */}
        <div 
          className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
            isFreelancer 
              ? "bg-green-500/10 text-green-600" 
              : "bg-blue-500/10 text-blue-600"
          }`}
        >
          {isFreelancer ? "Freelancer" : "Client"}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [featuredTestimonial, setFeaturedTestimonial] = useState<Testimonial>(fallbackFeaturedTestimonial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/landing/testimonials");
        if (response.ok) {
          const data = await response.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
          if (data.featured) {
            setFeaturedTestimonial(data.featured);
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const row1 = testimonials.filter(t => t.author.role === "freelancer");
  const row2 = testimonials.filter(t => t.author.role === "client");

  return (
    <div className="relative">
      {/* Marquee Row 1 - Scrolling Left */}
      <div className="relative mb-6 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-muted/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-muted/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
          {/* Duplicate for infinite scroll */}
          {[...row1, ...row1].map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="shrink-0 w-[340px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Testimonial - Center */}
      <div className="max-w-2xl mx-auto my-8 px-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-60" />
          <div className="relative">
            <TestimonialCard testimonial={featuredTestimonial} variant="featured" />
          </div>
        </div>
      </div>

      {/* Marquee Row 2 - Scrolling Right */}
      <div className="relative mt-6 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-muted/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-muted/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-4 animate-marquee-reverse hover:[animation-play-state:paused]">
          {/* Duplicate for infinite scroll */}
          {[...row2, ...row2].map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="shrink-0 w-[340px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsMarquee;
