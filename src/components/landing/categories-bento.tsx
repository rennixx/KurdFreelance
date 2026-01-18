"use client";

import Link from "next/link";
import {
  Code,
  PaintBrush,
  PencilLine,
  Megaphone,
  VideoCamera,
  Briefcase,
  Brain,
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

const categories = [
  {
    id: "development",
    name: "Web & App Development",
    slug: "development",
    icon: Code,
    jobCount: "2.4k+",
    colorHex: "#3B82F6", // blue-500
    bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)",
    size: "large",
    Illustration: DevIllustration,
  },
  {
    id: "design",
    name: "Design & Creative",
    slug: "design",
    icon: PaintBrush,
    jobCount: "1.8k+",
    colorHex: "#A855F7", // purple-500
    bgGradient: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 50%, transparent 100%)",
    size: "medium",
    Illustration: DesignIllustration,
  },
  {
    id: "writing",
    name: "Writing & Translation",
    slug: "writing",
    icon: PencilLine,
    jobCount: "1.2k+",
    colorHex: "#22C55E", // green-500
    bgGradient: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, transparent 100%)",
    size: "medium",
    Illustration: WritingIllustration,
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    slug: "marketing",
    icon: Megaphone,
    jobCount: "980+",
    colorHex: "#F97316", // orange-500
    bgGradient: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 50%, transparent 100%)",
    size: "medium",
    Illustration: MarketingIllustration,
  },
  {
    id: "video",
    name: "Video & Animation",
    slug: "video",
    icon: VideoCamera,
    jobCount: "750+",
    colorHex: "#EF4444", // red-500
    bgGradient: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 50%, transparent 100%)",
    size: "medium",
    Illustration: VideoIllustration,
  },
  {
    id: "business",
    name: "Business Consulting",
    slug: "business",
    icon: Briefcase,
    jobCount: "640+",
    colorHex: "#06B6D4", // cyan-500
    bgGradient: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 50%, transparent 100%)",
    size: "small",
    Illustration: BusinessIllustration,
  },
  {
    id: "ai-data",
    name: "AI & Data Science",
    slug: "ai-data",
    icon: Brain,
    jobCount: "520+",
    colorHex: "#8B5CF6", // violet-500
    bgGradient: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 50%, transparent 100%)",
    size: "wide",
    Illustration: AIIllustration,
  },
];

function BentoCard({
  category,
  className = "",
}: {
  category: (typeof categories)[0];
  className?: string;
}) {
  const Icon = category.icon;
  const Illustration = category.Illustration;

  return (
    <Link href={`/jobs?category=${category.slug}`} className={className}>
      <div
        className="relative h-full overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-500 ease-out cursor-pointer group hover:shadow-2xl hover:-translate-y-1"
        style={{
          ["--accent-color" as string]: category.colorHex,
        }}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: category.bgGradient }}
        />

        {/* Decorative circles */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${category.colorHex} 0%, transparent 70%)` }}
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
          <Illustration color={category.colorHex} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform duration-500"
            style={{ 
              background: category.bgGradient,
              borderColor: `${category.colorHex}20`,
            }}
          >
            <Icon
              className="w-6 h-6 md:w-7 md:h-7"
              style={{ color: category.colorHex }}
              weight="duotone"
            />
          </div>

          {/* Title & Count */}
          <div className="mt-auto">
            <h3 className="font-semibold text-base md:text-lg mb-1 group-hover:text-foreground transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {category.jobCount} jobs available
            </p>
          </div>

          {/* Hover Arrow */}
          <div
            className="absolute bottom-5 right-5 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            style={{ background: `${category.colorHex}15` }}
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              style={{ color: category.colorHex }}
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
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium z-20"
          style={{ 
            background: `${category.colorHex}15`,
            color: category.colorHex,
          }}
        >
          {category.jobCount}
        </div>

        {/* Hover border effect */}
        <div 
          className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ borderColor: `${category.colorHex}40` }}
        />
      </div>
    </Link>
  );
}

export function CategoriesBento() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {/* Row 1: Development (large) + Design + Writing */}
      <div className="col-span-2 row-span-2">
        <BentoCard category={categories[0]} className="h-full min-h-[320px]" />
      </div>
      <div className="col-span-1">
        <BentoCard category={categories[1]} className="h-full min-h-[150px]" />
      </div>
      <div className="col-span-1">
        <BentoCard category={categories[2]} className="h-full min-h-[150px]" />
      </div>

      {/* Row 2: Marketing + Video (fill beside development) */}
      <div className="col-span-1">
        <BentoCard category={categories[3]} className="h-full min-h-[150px]" />
      </div>
      <div className="col-span-1">
        <BentoCard category={categories[4]} className="h-full min-h-[150px]" />
      </div>

      {/* Row 3: Business (small) + AI & Data (wide) */}
      <div className="col-span-1">
        <BentoCard category={categories[5]} className="h-full min-h-[150px]" />
      </div>
      <div className="col-span-2 md:col-span-3">
        <BentoCard category={categories[6]} className="h-full min-h-[150px]" />
      </div>
    </div>
  );
}

export default CategoriesBento;
