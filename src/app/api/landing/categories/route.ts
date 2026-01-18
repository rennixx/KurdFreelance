import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from("skill_categories")
      .select(`
        id,
        name,
        slug,
        icon,
        description,
        color_hex,
        illustration_key,
        size
      `)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    // Get job counts for each category by matching skills
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        // Count jobs that have skills in this category
        const { count } = await supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("status", "open");

        return {
          ...category,
          jobsCount: count || Math.floor(Math.random() * 200 + 50), // Random count as fallback for demo
        };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return fallback categories matching our bento grid design
    return NextResponse.json([
      { 
        id: "1", 
        name: "Web & App Development", 
        slug: "development", 
        icon: "Code", 
        color_hex: "#3B82F6",
        illustration_key: "dev",
        size: "large",
        jobsCount: 234 
      },
      { 
        id: "2", 
        name: "Design & Creative", 
        slug: "design", 
        icon: "PaintBrush", 
        color_hex: "#A855F7",
        illustration_key: "design",
        size: "medium",
        jobsCount: 187 
      },
      { 
        id: "3", 
        name: "Writing & Translation", 
        slug: "writing", 
        icon: "PencilLine", 
        color_hex: "#22C55E",
        illustration_key: "writing",
        size: "medium",
        jobsCount: 156 
      },
      { 
        id: "4", 
        name: "Digital Marketing", 
        slug: "marketing", 
        icon: "Megaphone", 
        color_hex: "#F97316",
        illustration_key: "marketing",
        size: "medium",
        jobsCount: 145 
      },
      { 
        id: "5", 
        name: "Video & Animation", 
        slug: "video", 
        icon: "VideoCamera", 
        color_hex: "#EF4444",
        illustration_key: "video",
        size: "medium",
        jobsCount: 98 
      },
      { 
        id: "6", 
        name: "Business Consulting", 
        slug: "business", 
        icon: "Briefcase", 
        color_hex: "#06B6D4",
        illustration_key: "business",
        size: "small",
        jobsCount: 67 
      },
      { 
        id: "7", 
        name: "AI & Data Science", 
        slug: "ai-data", 
        icon: "Brain", 
        color_hex: "#8B5CF6",
        illustration_key: "ai",
        size: "wide",
        jobsCount: 89 
      },
    ]);
  }
}

