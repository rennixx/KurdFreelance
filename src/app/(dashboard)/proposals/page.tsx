import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProposalsContent } from "@/components/proposals/proposals-content";

export default async function ProposalsPage() {
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
    .select("role")
    .eq("id", user.id)
    .single();

  // Freelancers see their proposals, clients see proposals on their jobs
  let proposals;
  
  if (profile?.role === "freelancer") {
    const { data } = await supabase
      .from("proposals")
      .select(`
        *,
        job:jobs (
          id,
          title,
          budget_type,
          budget_min,
          budget_max,
          status,
          client:users!jobs_client_id_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq("freelancer_id", user.id)
      .order("created_at", { ascending: false });

    proposals = data;
  } else {
    // Client - fetch proposals on their jobs
    const { data } = await supabase
      .from("proposals")
      .select(`
        *,
        job:jobs!inner (
          id,
          title,
          budget_type,
          budget_min,
          budget_max,
          status,
          client_id
        ),
        freelancer:users!proposals_freelancer_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("job.client_id", user.id)
      .order("created_at", { ascending: false });

    proposals = data;
  }

  return (
    <div className="container py-8">
      <ProposalsContent
        proposals={proposals || []}
        userRole={profile?.role || "freelancer"}
      />
    </div>
  );
}
