import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: stories, error } = await supabase
      .from("success_stories")
      .select(`
        id,
        title,
        summary,
        full_story,
        category,
        image_url,
        stats,
        freelancer:freelancer_profiles(
          user:users(full_name, avatar_url),
          professional_title
        ),
        client:client_profiles(
          user:users(full_name),
          company_name
        )
      `)
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) throw error;

    const formattedStories = stories?.map((s) => {
      // Supabase returns arrays for joins - get first element
      const freelancer = Array.isArray(s.freelancer) ? s.freelancer[0] : s.freelancer;
      const client = Array.isArray(s.client) ? s.client[0] : s.client;
      const freelancerUser = freelancer?.user ? (Array.isArray(freelancer.user) ? freelancer.user[0] : freelancer.user) : null;
      const clientUser = client?.user ? (Array.isArray(client.user) ? client.user[0] : client.user) : null;
      
      return {
        id: s.id,
        title: s.title,
        summary: s.summary,
        category: s.category,
        image: s.image_url || "/placeholder-project.jpg",
        stats: s.stats || {},
        freelancer: {
          name: freelancerUser?.full_name || "Freelancer",
          avatar: freelancerUser?.avatar_url || "",
          title: freelancer?.professional_title || "",
        },
        client: {
          name: clientUser?.full_name || "Client",
          company: client?.company_name || "",
        },
      };
    }) || [];

    return NextResponse.json(formattedStories);
  } catch (error) {
    console.error("Error fetching success stories:", error);
    // Return fallback stories
    return NextResponse.json([
      {
        id: "1",
        title: "E-commerce Platform Launched in 3 Months",
        summary: "A local retail business transformed their operations with a custom e-commerce solution built by a Kurdish developer.",
        category: "Development",
        image: "/success-ecommerce.jpg",
        stats: {
          duration: "3 months",
          budget: "$4,500",
          result: "200% sales increase",
        },
        freelancer: {
          name: "Ahmad R.",
          avatar: "",
          title: "Full Stack Developer",
        },
        client: {
          name: "Hawkar Trading Co.",
          company: "Retail Business",
        },
      },
      {
        id: "2",
        title: "Brand Identity That Won Regional Award",
        summary: "A startup's complete rebrand led to recognition at the Kurdistan Business Awards for best visual identity.",
        category: "Design",
        image: "/success-branding.jpg",
        stats: {
          duration: "6 weeks",
          budget: "$2,800",
          result: "Award Winner",
        },
        freelancer: {
          name: "Lana H.",
          avatar: "",
          title: "Brand Designer",
        },
        client: {
          name: "Zagros Tech",
          company: "Technology Startup",
        },
      },
      {
        id: "3",
        title: "Mobile App Reaches 50K Users",
        summary: "A delivery app designed and developed locally now serves thousands of customers across the Kurdistan region.",
        category: "Mobile Development",
        image: "/success-app.jpg",
        stats: {
          duration: "5 months",
          budget: "$8,000",
          result: "50K+ users",
        },
        freelancer: {
          name: "Soran M.",
          avatar: "",
          title: "Mobile Developer",
        },
        client: {
          name: "FastDeliver",
          company: "Logistics Startup",
        },
      },
    ]);
  }
}
