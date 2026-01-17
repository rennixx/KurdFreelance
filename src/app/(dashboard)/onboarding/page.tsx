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

  // Fetch user profile - use maybeSingle to handle RLS issues gracefully
  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If no profile, create one
  if (!profile) {
    const { data: newProfile } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        role: user.user_metadata?.role || "freelancer",
        onboarding_completed: false,
      }, { onConflict: 'id' })
      .select()
      .single();
    
    profile = newProfile;
  }

  if (!profile) {
    redirect("/login");
  }

  // If onboarding is complete, redirect to dashboard
  if (profile.onboarding_completed) {
    redirect("/dashboard");
  }

  return <OnboardingContent user={profile} />;
}
