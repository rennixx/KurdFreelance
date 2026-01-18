import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const defaultSkills = [
  { name: "JavaScript", category: "Development" },
  { name: "TypeScript", category: "Development" },
  { name: "React", category: "Development" },
  { name: "Next.js", category: "Development" },
  { name: "Node.js", category: "Development" },
  { name: "Python", category: "Development" },
  { name: "PHP", category: "Development" },
  { name: "WordPress", category: "Development" },
  { name: "Flutter", category: "Development" },
  { name: "React Native", category: "Development" },
  { name: "UI Design", category: "Design" },
  { name: "UX Design", category: "Design" },
  { name: "Figma", category: "Design" },
  { name: "Adobe XD", category: "Design" },
  { name: "Graphic Design", category: "Design" },
  { name: "Logo Design", category: "Design" },
  { name: "Illustration", category: "Design" },
  { name: "Content Writing", category: "Writing" },
  { name: "Copywriting", category: "Writing" },
  { name: "Blog Writing", category: "Writing" },
  { name: "Technical Writing", category: "Writing" },
  { name: "Translation", category: "Writing" },
  { name: "SEO", category: "Marketing" },
  { name: "Social Media Marketing", category: "Marketing" },
  { name: "Google Ads", category: "Marketing" },
  { name: "Facebook Ads", category: "Marketing" },
  { name: "Email Marketing", category: "Marketing" },
  { name: "Video Editing", category: "Video & Animation" },
  { name: "Motion Graphics", category: "Video & Animation" },
  { name: "Animation", category: "Video & Animation" },
  { name: "Photography", category: "Photography" },
  { name: "Photo Editing", category: "Photography" },
  { name: "Data Analysis", category: "Data" },
  { name: "Machine Learning", category: "Data" },
  { name: "Data Visualization", category: "Data" },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // Insert all skills
    const { data, error } = await supabase
      .from("skills")
      .upsert(
        defaultSkills.map(skill => ({
          name: skill.name,
          category: skill.category,
        })),
        { onConflict: "name" }
      );

    if (error) {
      console.error("Error seeding skills:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch all skills to verify
    const { data: allSkills, error: fetchError } = await supabase
      .from("skills")
      .select("*");

    return NextResponse.json({
      message: "Skills seeded successfully",
      inserted: defaultSkills.length,
      totalInDb: allSkills?.length || 0,
      skills: allSkills,
    });
  } catch (error) {
    console.error("Error seeding skills:", error);
    return NextResponse.json(
      { error: "Failed to seed skills" },
      { status: 500 }
    );
  }
}
