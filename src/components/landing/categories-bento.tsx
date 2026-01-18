"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Code,
  PaintBrush,
  PencilLine,
  Megaphone,
  VideoCamera,
  Briefcase,
  Brain,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import {
  DevIllustration,
  DesignIllustration,
  WritingIllustration,
  MarketingIllustration,
  VideoIllustration,
  BusinessIllustration,
  AIIllustration,
} from "./category-illustrations";

// Icon and illustration mapping
const iconMap: Record<string, PhosphorIcon> = {
  Code,
  PaintBrush,
  PencilLine,
  Megaphone,
  VideoCamera,
  Briefcase,
  Brain,
};

const illustrationMap: Record<string, React.ComponentType<{ color: string }>> = {
  dev: DevIllustration,
  design: DesignIllustration,
  writing: WritingIllustration,
  marketing: MarketingIllustration,
  video: VideoIllustration,
  business: BusinessIllustration,
  ai: AIIllustration,
};

// Type for API category data
interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color_hex: string;
  illustration_key: string;
  size: "large" | "medium" | "small" | "wide";
  jobsCount: number;
}

// Fallback static data
const fallbackCategories: CategoryData[] = [
  {
    id: "development",
    name: "Web & App Development",
    slug: "development",
    icon: "Code",
    jobsCount: 0,
    color_hex: "#3B82F6",
    size: "large",
    illustration_key: "dev",
  },
  {
    id: "design",
    name: "Design & Creative",
    slug: "design",
    icon: "PaintBrush",
    jobsCount: 0,
    color_hex: "#A855F7",
    size: "medium",
    illustration_key: "design",
  },
  {
    id: "writing",
    name: "Writing & Translation",
    slug: "writing",
    icon: "PencilLine",
    jobsCount: 0,
    color_hex: "#22C55E",
    size: "medium",
    illustration_key: "writing",
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    slug: "marketing",
    icon: "Megaphone",
    jobsCount: 0,
    color_hex: "#F97316",
    size: "medium",
    illustration_key: "marketing",
  },
  {
    id: "video",
    name: "Video & Animation",
    slug: "video",
    icon: "VideoCamera",
    jobsCount: 0,
    color_hex: "#EF4444",
    size: "medium",
    illustration_key: "video",
  },
  {
    id: "business",
    name: "Business Consulting",
    slug: "business",
    icon: "Briefcase",
    jobsCount: 0,
    color_hex: "#06B6D4",
    size: "small",
    illustration_key: "business",
  },
  {
    id: "ai-data",
    name: "AI & Data Science",
    slug: "ai-data",
    icon: "Brain",
    jobsCount: 0,
    color_hex: "#8B5CF6",
    size: "wide",
    illustration_key: "ai",
  },
];

// Helper to format job count
function formatJobCount(count: number): string {
  if (count === 0) {
    return "0";
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`;
  }
  return `${count}`;
}

// Helper to generate gradient from hex color
function createBgGradient(hex: string): string {
  // Convert hex to rgba
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `linear-gradient(135deg, rgba(${r},${g},${b},0.15) 0%, rgba(${r},${g},${b},0.05) 50%, transparent 100%)`;
}

function BentoCard({
  category,
  className = "",
}: {
  category: CategoryData;
  className?: string;
}) {
  const Icon = iconMap[category.icon] || Code;
  const Illustration = illustrationMap[category.illustration_key] || DevIllustration;
  const bgGradient = createBgGradient(category.color_hex);
  const jobCount = formatJobCount(category.jobsCount);

  return (
    <Link href={`/jobs?category=${category.slug}`} className={className}>
      <div
        className="relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 transition-all duration-500 ease-out cursor-pointer group hover:shadow-2xl hover:-translate-y-1"
        style={{
          ["--accent-color" as string]: category.color_hex,
        }}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: bgGradient }}
        />

        {/* Decorative circles */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${category.color_hex} 0%, transparent 70%)` }}
        />

        {/* Illustration - positioned based on card size */}
        <div 
          className={`absolute transition-all duration-500 group-hover:scale-105 ${
            category.size === "large" 
              ? "right-2 top-1/2 -translate-y-1/2 w-[65%] h-[70%] opacity-80 group-hover:opacity-100" 
              : category.size === "wide"
              ? "right-4 top-1/2 -translate-y-1/2 w-[70%] h-[80%] opacity-70 group-hover:opacity-90"
              : "right-0 top-6 w-[60%] h-[55%] opacity-60 group-hover:opacity-80"
          }`}
        >
          <Illustration color={category.color_hex} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border group-hover:scale-110 transition-transform duration-500"
            style={{
              background: bgGradient,
              borderColor: `${category.color_hex}20`,
            }}
          >
            <Icon
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              style={{ color: category.color_hex }}
              weight="duotone"
            />
          </div>

          {/* Title & Count */}
          <div className="mt-auto">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 group-hover:text-foreground transition-colors">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {category.jobsCount === 0
                ? "No jobs yet"
                : `${jobCount} ${category.jobsCount === 1 ? "job" : "jobs"} available`
              }
            </p>
          </div>

          {/* Hover Arrow */}
          <div
            className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            style={{ background: `${category.color_hex}15` }}
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
              style={{ color: category.color_hex }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>

        {/* Job count badge */}
        <div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium z-20"
          style={{
            background: `${category.color_hex}15`,
            color: category.color_hex,
          }}
        >
          {jobCount}
        </div>

        {/* Hover border effect */}
        <div 
          className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ borderColor: `${category.color_hex}40` }}
        />
      </div>
    </Link>
  );
}

export function CategoriesBento() {
  const [categories, setCategories] = useState<CategoryData[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/landing/categories");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Find categories by their expected positions
  const largeCategory = categories.find(c => c.size === "large") || categories[0];
  const wideCategory = categories.find(c => c.size === "wide") || categories[categories.length - 1];
  const smallCategory = categories.find(c => c.size === "small") || categories[5];
  const mediumCategories = categories.filter(c => c.size === "medium").slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {/* Row 1: Development (large) - Full width on mobile */}
      <div className="col-span-1 sm:col-span-2 row-span-2">
        <BentoCard category={largeCategory} className="h-full min-h-[200px] sm:min-h-[280px] md:min-h-[320px]" />
      </div>
      {mediumCategories[0] && (
        <div className="col-span-1 sm:col-span-1">
          <BentoCard category={mediumCategories[0]} className="h-full min-h-[140px] sm:min-h-[150px]" />
        </div>
      )}
      {mediumCategories[1] && (
        <div className="col-span-1 sm:col-span-1">
          <BentoCard category={mediumCategories[1]} className="h-full min-h-[140px] sm:min-h-[150px]" />
        </div>
      )}

      {/* Row 2: Marketing + Video (fill beside development) */}
      {mediumCategories[2] && (
        <div className="col-span-1 sm:col-span-1">
          <BentoCard category={mediumCategories[2]} className="h-full min-h-[140px] sm:min-h-[150px]" />
        </div>
      )}
      {mediumCategories[3] && (
        <div className="col-span-1 sm:col-span-1">
          <BentoCard category={mediumCategories[3]} className="h-full min-h-[140px] sm:min-h-[150px]" />
        </div>
      )}

      {/* Row 3: Business (small) + AI & Data (wide) */}
      <div className="col-span-1 sm:col-span-1">
        <BentoCard category={smallCategory} className="h-full min-h-[140px] sm:min-h-[150px]" />
      </div>
      <div className="col-span-1 sm:col-span-2 md:col-span-3">
        <BentoCard category={wideCategory} className="h-full min-h-[140px] sm:min-h-[150px]" />
      </div>
    </div>
  );
}

export default CategoriesBento;
