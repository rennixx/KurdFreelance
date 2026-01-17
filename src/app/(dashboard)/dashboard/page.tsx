import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile - use maybeSingle to handle missing profiles gracefully
  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If no profile exists, try to create one using upsert
  if (!profile) {
    const { data: newProfile, error: upsertError } = await supabase
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

    if (upsertError) {
      console.error("Failed to upsert profile:", upsertError);
      // Try fetching one more time - maybe RLS issue
      const { data: retryProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (retryProfile) {
        profile = retryProfile;
      } else {
        redirect("/login");
      }
    } else {
      profile = newProfile;
    }
  }

  if (!profile) {
    redirect("/login");
  }

  // Redirect to onboarding if not completed
  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  // Fetch freelancer profile if user is a freelancer
  let freelancerProfile = null;
  if (profile.role === "freelancer") {
    const { data: fpData } = await supabase
      .from("freelancer_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    freelancerProfile = fpData;
  }

  // Ensure role has a default value
  const userWithDefaults = {
    ...profile,
    role: profile.role || "freelancer",
    full_name: profile.full_name || "User",
  };

  return <DashboardContent user={userWithDefaults} freelancerProfile={freelancerProfile} />;
}
