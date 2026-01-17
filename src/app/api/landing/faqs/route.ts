import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: faqs, error } = await supabase
      .from("faqs")
      .select("id, question, answer, category")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .limit(8);

    if (error) throw error;

    return NextResponse.json(faqs || []);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    // Return fallback FAQs
    return NextResponse.json([
      {
        id: "1",
        question: "What are the fees on KurdFreelance?",
        answer: "We charge 10-15% service fees, significantly lower than international platforms that charge 20% or more. The exact fee depends on your earnings tier - the more you earn, the lower your fee percentage.",
        category: "fees",
      },
      {
        id: "2",
        question: "What payment methods are supported?",
        answer: "We support local Iraqi banks, FIB, RT Bank, FastPay, and international options like PayPal and Wise. We're constantly adding more local payment options to make transactions easier for Kurdish freelancers and clients.",
        category: "payments",
      },
      {
        id: "3",
        question: "How does the escrow system work?",
        answer: "When a client hires you, they fund the escrow with the agreed amount. The money is held securely by KurdFreelance until you complete the work. Once the client approves the delivery, funds are released to you within 24-48 hours.",
        category: "payments",
      },
      {
        id: "4",
        question: "Is KurdFreelance only for people in Kurdistan?",
        answer: "While we focus on connecting Kurdish talent with opportunities, anyone can join. We welcome freelancers and clients from anywhere who want to work with professionals in or from the Kurdistan region.",
        category: "general",
      },
      {
        id: "5",
        question: "How do I get verified as a freelancer?",
        answer: "Complete your profile, add your portfolio, verify your identity with a government ID, and pass our skills assessment. Verified freelancers get a badge and rank higher in search results.",
        category: "freelancers",
      },
      {
        id: "6",
        question: "What happens if there's a dispute?",
        answer: "Our dedicated support team handles all disputes. We review the contract terms, communication history, and deliverables to make a fair decision. In most cases, disputes are resolved within 5-7 business days.",
        category: "support",
      },
      {
        id: "7",
        question: "Can I hire freelancers for ongoing work?",
        answer: "Absolutely! You can hire freelancers for hourly contracts with weekly payments, or set up milestone-based long-term projects. Many clients establish ongoing relationships with their favorite freelancers.",
        category: "clients",
      },
      {
        id: "8",
        question: "What languages are supported?",
        answer: "The platform fully supports Kurdish (Sorani & Kurmanji), Arabic, and English. You can set your preferred language in settings, and all communications, contracts, and support are available in your chosen language.",
        category: "general",
      },
    ]);
  }
}
