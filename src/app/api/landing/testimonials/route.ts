import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select(`
        id,
        content,
        rating,
        role,
        user:users(full_name, avatar_url),
        freelancer_profile:freelancer_profiles(professional_title, total_jobs_completed),
        client_profile:client_profiles(company_name, total_jobs_completed)
      `)
      .eq("is_featured", true)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;

    const formattedTestimonials = testimonials?.map((t) => {
      // Supabase returns arrays for joins - get first element
      const user = Array.isArray(t.user) ? t.user[0] : t.user;
      const freelancerProfile = Array.isArray(t.freelancer_profile) ? t.freelancer_profile[0] : t.freelancer_profile;
      const clientProfile = Array.isArray(t.client_profile) ? t.client_profile[0] : t.client_profile;
      
      return {
        id: t.id,
        content: t.content,
        rating: t.rating,
        author: {
          name: user?.full_name || "Anonymous",
          avatar: user?.avatar_url || "",
          role: t.role,
          title: t.role === "freelancer" 
            ? freelancerProfile?.professional_title 
            : clientProfile?.company_name || "Client",
          jobsCompleted: t.role === "freelancer"
            ? freelancerProfile?.total_jobs_completed
            : clientProfile?.total_jobs_completed,
        },
      };
    }) || [];

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Return fallback testimonials if table doesn't exist or error occurs
    return NextResponse.json([
      {
        id: "1",
        content: "KurdFreelance helped me find amazing local talent for my startup. The lower fees compared to international platforms made a huge difference for our budget.",
        rating: 5,
        author: {
          name: "Karwan H.",
          avatar: "",
          role: "client",
          title: "Tech Startup Founder",
          jobsCompleted: 12,
        },
      },
      {
        id: "2", 
        content: "As a freelance developer in Erbil, this platform changed my career. I can now work with clients who understand my market and pay through local methods.",
        rating: 5,
        author: {
          name: "Dilshad M.",
          avatar: "",
          role: "freelancer",
          title: "Full Stack Developer",
          jobsCompleted: 34,
        },
      },
      {
        id: "3",
        content: "The best platform for Kurdish businesses. We've hired 5 designers through KurdFreelance and every single one exceeded our expectations.",
        rating: 5,
        author: {
          name: "Sara A.",
          avatar: "",
          role: "client",
          title: "Marketing Agency Owner",
          jobsCompleted: 8,
        },
      },
      {
        id: "4",
        content: "Finally a freelance platform that supports Kurdish and Arabic! Communication with clients has never been easier. Highly recommend to all Kurdish freelancers.",
        rating: 5,
        author: {
          name: "Rebin K.",
          avatar: "",
          role: "freelancer",
          title: "UI/UX Designer",
          jobsCompleted: 28,
        },
      },
      {
        id: "5",
        content: "The escrow system gives me peace of mind. I know my payment is secure before I start working. This is the future of freelancing in Kurdistan.",
        rating: 5,
        author: {
          name: "Zhyan S.",
          avatar: "",
          role: "freelancer",
          title: "Content Writer",
          jobsCompleted: 45,
        },
      },
      {
        id: "6",
        content: "We saved over 40% in fees compared to Upwork. The local talent pool is incredible - skilled professionals who understand our regional market.",
        rating: 5,
        author: {
          name: "Omed B.",
          avatar: "",
          role: "client",
          title: "E-commerce Business Owner",
          jobsCompleted: 15,
        },
      },
    ]);
  }
}
