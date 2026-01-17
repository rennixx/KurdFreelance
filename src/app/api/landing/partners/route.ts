import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: partners, error } = await supabase
      .from("partners")
      .select("id, name, logo_url, website_url, partner_type")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(8);

    if (error) throw error;

    return NextResponse.json(partners || []);
  } catch (error) {
    console.error("Error fetching partners:", error);
    // Return fallback partners with placeholder logos
    // Replace logo_url with actual logo files in /public/partners/ folder
    return NextResponse.json([
      {
        id: "1",
        name: "Kurdistan IT Association",
        logo_url: "/partners/kita.svg",
        website_url: "https://kita.iq",
        partner_type: "association",
      },
      {
        id: "2",
        name: "Erbil Chamber of Commerce",
        logo_url: "/partners/ecc.svg",
        website_url: "https://erbilchamber.org",
        partner_type: "chamber",
      },
      {
        id: "3",
        name: "Startup Erbil",
        logo_url: "/partners/startup-erbil.svg",
        website_url: "https://startuperbil.com",
        partner_type: "accelerator",
      },
      {
        id: "4",
        name: "Kurdistan Tech Hub",
        logo_url: "/partners/kth.svg",
        website_url: "https://kurdistantechhub.com",
        partner_type: "hub",
      },
      {
        id: "5",
        name: "FIB Bank",
        logo_url: "/partners/fib.svg",
        website_url: "https://fib.iq",
        partner_type: "payment",
      },
      {
        id: "6",
        name: "FastPay",
        logo_url: "/partners/fastpay.svg",
        website_url: "https://fastpay.iq",
        partner_type: "payment",
      },
    ]);
  }
}
