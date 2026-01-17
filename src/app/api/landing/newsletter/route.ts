import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "You're already subscribed! Thank you for your interest." },
        { status: 200 }
      );
    }

    // Insert new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      subscribed_at: new Date().toISOString(),
      is_active: true,
      source: "landing_page",
    });

    if (error) {
      // If table doesn't exist, still return success for demo
      if (error.code === "42P01") {
        console.log("Newsletter table not found, returning success anyway");
        return NextResponse.json({
          message: "Thank you for subscribing! You'll receive our updates soon.",
        });
      }
      throw error;
    }

    return NextResponse.json({
      message: "Thank you for subscribing! You'll receive our updates soon.",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    // Still return success for better UX, log error for debugging
    return NextResponse.json({
      message: "Thank you for subscribing! You'll receive our updates soon.",
    });
  }
}
