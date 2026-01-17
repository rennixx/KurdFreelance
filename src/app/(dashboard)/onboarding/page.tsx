import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingContent } from "@/components/onboarding";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // If onboarding is complete, redirect to dashboard
  if (profile.onboarding_completed) {
    redirect("/dashboard");
  }

  return <OnboardingContent user={profile} />;
}
