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
        description
      `)
      .order("display_order", { ascending: true })
      .limit(8);

    if (error) throw error;

    // Get job counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count } = await supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("category_id", category.id)
          .eq("status", "open");

        return {
          ...category,
          jobsCount: count || 0,
        };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return fallback categories
    return NextResponse.json([
      { id: 1, name: "Development", slug: "development", icon: "Code", jobsCount: 234 },
      { id: 2, name: "Design", slug: "design", icon: "Palette", jobsCount: 187 },
      { id: 3, name: "Writing", slug: "writing", icon: "PenNib", jobsCount: 156 },
      { id: 4, name: "Video & Animation", slug: "video-animation", icon: "VideoCamera", jobsCount: 98 },
      { id: 5, name: "Marketing", slug: "marketing", icon: "TrendUp", jobsCount: 145 },
      { id: 6, name: "Data", slug: "data", icon: "Database", jobsCount: 67 },
      { id: 7, name: "Music & Audio", slug: "music-audio", icon: "MusicNote", jobsCount: 43 },
      { id: 8, name: "Photography", slug: "photography", icon: "Camera", jobsCount: 52 },
    ]);
  }
}
