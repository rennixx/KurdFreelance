import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Hardcoded categories with mapping to skills.category values
const categoriesConfig = [
  { 
    id: "1", 
    name: "Web & App Development", 
    slug: "development", 
    icon: "Code", 
    color_hex: "#3B82F6",
    illustration_key: "dev",
    size: "large",
    skillCategories: ["Development"], // Maps to skills.category
  },
  { 
    id: "2", 
    name: "Design & Creative", 
    slug: "design", 
    icon: "PaintBrush", 
    color_hex: "#A855F7",
    illustration_key: "design",
    size: "medium",
    skillCategories: ["Design"],
  },
  { 
    id: "3", 
    name: "Writing & Translation", 
    slug: "writing", 
    icon: "PencilLine", 
    color_hex: "#22C55E",
    illustration_key: "writing",
    size: "medium",
    skillCategories: ["Writing"],
  },
  { 
    id: "4", 
    name: "Digital Marketing", 
    slug: "marketing", 
    icon: "Megaphone", 
    color_hex: "#F97316",
    illustration_key: "marketing",
    size: "medium",
    skillCategories: ["Marketing"],
  },
  { 
    id: "5", 
    name: "Video & Animation", 
    slug: "video", 
    icon: "VideoCamera", 
    color_hex: "#EF4444",
    illustration_key: "video",
    size: "medium",
    skillCategories: ["Video & Animation"],
  },
  { 
    id: "6", 
    name: "Business Consulting", 
    slug: "business", 
    icon: "Briefcase", 
    color_hex: "#06B6D4",
    illustration_key: "business",
    size: "small",
    skillCategories: ["Business", "Consulting"],
  },
  { 
    id: "7", 
    name: "AI & Data Science", 
    slug: "ai-data", 
    icon: "Brain", 
    color_hex: "#8B5CF6",
    illustration_key: "ai",
    size: "wide",
    skillCategories: ["Data"],
  },
];

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all skills with their categories from the skills table
    const { data: allSkills, error: skillsError } = await supabase
      .from("skills")
      .select("name, category");

    if (skillsError) {
      console.error("Error fetching skills:", skillsError);
    }

    // Get all open jobs with their skills (include draft for counting)
    const { data: openJobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id, skills, status")
      .in("status", ["open", "draft", "in_progress"]);

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
    }

    // Debug log
    console.log("Jobs found:", openJobs?.length, "Jobs data:", JSON.stringify(openJobs));

    // Build a map of skill name -> skill category (case insensitive)
    const skillToCategoryMap: Record<string, string> = {};
    (allSkills || []).forEach(skill => {
      if (skill.name && skill.category) {
        skillToCategoryMap[skill.name.toLowerCase()] = skill.category;
      }
    });

    // Count jobs for each category
    const categoriesWithCounts = categoriesConfig.map(category => {
      // Count jobs that have at least one skill matching this category
      const jobCount = (openJobs || []).filter(job => {
        if (!job.skills || !Array.isArray(job.skills)) return false;
        
        return job.skills.some((skillName: string) => {
          const skillCategory = skillToCategoryMap[skillName.toLowerCase()];
          return category.skillCategories.includes(skillCategory);
        });
      }).length;

      // Return category without the skillCategories mapping (internal use only)
      const { skillCategories, ...categoryData } = category;
      return {
        ...categoryData,
        jobsCount: jobCount,
      };
    });

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return categories with 0 counts on error
    return NextResponse.json(
      categoriesConfig.map(({ skillCategories, ...cat }) => ({ ...cat, jobsCount: 0 }))
    );
  }
}
