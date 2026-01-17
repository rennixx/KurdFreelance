import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile with related data
  const { data: profile } = await supabase
    .from("users")
    .select(`
      *,
      freelancer_profile:freelancer_profiles (*),
      client_profile:client_profiles (*)
    `)
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container py-8">
      <SettingsContent user={profile} />
    </div>
  );
}
