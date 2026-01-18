import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to submit a testimonial" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, rating } = body;

    // Validate input
    if (!content || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Testimonial must be at least 20 characters long" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get user's profile to determine role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = userData?.role === "freelancer" ? "freelancer" : "client";

    // Check if user already has a pending or approved testimonial
    const { data: existingTestimonial } = await supabase
      .from("testimonials")
      .select("id, is_approved")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingTestimonial) {
      if (existingTestimonial.is_approved) {
        return NextResponse.json(
          { error: "You have already submitted an approved testimonial" },
          { status: 400 }
        );
      }
      
      // Update existing pending testimonial
      const { error: updateError } = await supabase
        .from("testimonials")
        .update({
          content: content.trim(),
          rating,
          role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTestimonial.id);

      if (updateError) throw updateError;

      return NextResponse.json({
        message: "Your testimonial has been updated and is pending review",
        updated: true,
      });
    }

    // Create new testimonial
    const { error: insertError } = await supabase
      .from("testimonials")
      .insert({
        user_id: user.id,
        content: content.trim(),
        rating,
        role,
        is_featured: false,
        is_approved: false,
      });

    if (insertError) throw insertError;

    return NextResponse.json({
      message: "Thank you! Your testimonial has been submitted and is pending review",
      created: true,
    });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial. Please try again later." },
      { status: 500 }
    );
  }
}

// Get current user's testimonial
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}
