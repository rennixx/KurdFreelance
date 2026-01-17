import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostJobForm } from "@/components/jobs";

export default async function PostJobPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only clients can post jobs
  if (profile?.role !== "client") {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">
          Describe your project and find the perfect freelancer
        </p>
      </div>
      <PostJobForm userId={user.id} />
    </div>
  );
}
