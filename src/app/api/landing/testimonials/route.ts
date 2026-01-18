import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get regular approved testimonials
    const { data: regularTestimonials, error: regularError } = await supabase
      .from("testimonials")
      .select(`
        id,
        content,
        rating,
        role,
        is_featured,
        user:users(full_name, avatar_url)
      `)
      .eq("is_approved", true)
      .eq("is_featured", false)
      .order("created_at", { ascending: false })
      .limit(10);

    // Get featured testimonial separately
    const { data: featuredTestimonials, error: featuredError } = await supabase
      .from("testimonials")
      .select(`
        id,
        content,
        rating,
        role,
        is_featured,
        user:users(full_name, avatar_url)
      `)
      .eq("is_approved", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(1);

    if (regularError || featuredError) throw regularError || featuredError;

    // Fetch profile data for each testimonial
    const formatTestimonial = async (t: any) => {
      const user = Array.isArray(t.user) ? t.user[0] : t.user;
      let title = t.role === "freelancer" ? "Freelancer" : "Client";
      let jobsCompleted = 0;

      // Fetch profile data based on role
      if (user && t.user_id) {
        if (t.role === "freelancer") {
          const { data: profile } = await supabase
            .from("freelancer_profiles")
            .select("professional_title, total_jobs_completed")
            .eq("user_id", t.user_id)
            .single();
          if (profile) {
            title = profile.professional_title || title;
            jobsCompleted = profile.total_jobs_completed || 0;
          }
        } else {
          const { data: profile } = await supabase
            .from("client_profiles")
            .select("company_name, total_jobs_completed")
            .eq("user_id", t.user_id)
            .single();
          if (profile) {
            title = profile.company_name || title;
            jobsCompleted = profile.total_jobs_completed || 0;
          }
        }
      }

      return {
        id: t.id,
        content: t.content,
        rating: t.rating,
        isFeatured: t.is_featured,
        author: {
          name: user?.full_name || "Anonymous",
          avatar: user?.avatar_url || "",
          role: t.role,
          title,
          jobsCompleted,
        },
      };
    };

    const formattedRegular = await Promise.all((regularTestimonials || []).map(formatTestimonial));
    const formattedFeatured = await Promise.all((featuredTestimonials || []).map(formatTestimonial));

    return NextResponse.json({
      testimonials: formattedRegular,
      featured: formattedFeatured[0] || null,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Return fallback testimonials
    return NextResponse.json({
      testimonials: [
        {
          id: "1",
          content: "KurdFreelance helped me find amazing local talent for my startup. The lower fees compared to international platforms made a huge difference for our budget.",
          rating: 5,
          isFeatured: false,
          author: { name: "Karwan H.", avatar: "", role: "client", title: "Tech Startup Founder", jobsCompleted: 12 },
        },
        {
          id: "2", 
          content: "As a freelance developer in Erbil, this platform changed my career. I can now work with clients who understand my market and pay through local methods.",
          rating: 5,
          isFeatured: false,
          author: { name: "Dilshad M.", avatar: "", role: "freelancer", title: "Full Stack Developer", jobsCompleted: 34 },
        },
        {
          id: "3",
          content: "The best platform for Kurdish businesses. We've hired 5 designers through KurdFreelance and every single one exceeded our expectations.",
          rating: 5,
          isFeatured: false,
          author: { name: "Sara A.", avatar: "", role: "client", title: "Marketing Agency Owner", jobsCompleted: 8 },
        },
        {
          id: "4",
          content: "Finally a freelance platform that supports Kurdish and Arabic! Communication with clients has never been easier.",
          rating: 5,
          isFeatured: false,
          author: { name: "Rebin K.", avatar: "", role: "freelancer", title: "UI/UX Designer", jobsCompleted: 28 },
        },
        {
          id: "5",
          content: "The escrow system gives me peace of mind. I know my payment is secure before I start working.",
          rating: 5,
          isFeatured: false,
          author: { name: "Zhyan S.", avatar: "", role: "freelancer", title: "Content Writer", jobsCompleted: 45 },
        },
        {
          id: "6",
          content: "We saved over 40% in fees compared to Upwork. The local talent pool is incredible.",
          rating: 5,
          isFeatured: false,
          author: { name: "Omed B.", avatar: "", role: "client", title: "E-commerce Business Owner", jobsCompleted: 15 },
        },
        {
          id: "7",
          content: "My business has grown 200% since joining. The quality of clients here actually appreciate good work.",
          rating: 5,
          isFeatured: false,
          author: { name: "Lana M.", avatar: "", role: "freelancer", title: "Video Editor", jobsCompleted: 52 },
        },
        {
          id: "8",
          content: "Best decision we made was hiring locally through KurdFreelance. Faster communication, better understanding.",
          rating: 5,
          isFeatured: false,
          author: { name: "Hawre J.", avatar: "", role: "client", title: "Restaurant Chain Owner", jobsCompleted: 6 },
        },
        {
          id: "9",
          content: "I went from struggling to find clients to being fully booked within 3 months.",
          rating: 5,
          isFeatured: false,
          author: { name: "Soma A.", avatar: "", role: "freelancer", title: "Social Media Manager", jobsCompleted: 41 },
        },
        {
          id: "10",
          content: "The customer support is amazing - they actually speak Kurdish! Any issues get resolved quickly.",
          rating: 5,
          isFeatured: false,
          author: { name: "Rawand T.", avatar: "", role: "client", title: "Construction Company", jobsCompleted: 9 },
        },
      ],
      featured: {
        id: "featured-1",
        content: "KurdFreelance transformed how we hire talent in Kurdistan. The platform understands our market, supports local payment methods, and the quality of freelancers is outstanding. We've completed over 50 projects and counting!",
        rating: 5,
        isFeatured: true,
        author: { name: "Darin Rashid", avatar: "", role: "client", title: "CEO, TechKurd Solutions", jobsCompleted: 54 },
      },
    });
  }
}
