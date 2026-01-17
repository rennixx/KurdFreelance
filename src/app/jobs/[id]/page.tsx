import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { JobDetailContent } from "@/components/jobs/job-detail-content";

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch job with client info
  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
      *,
      client:users!jobs_client_id_fkey (
        id,
        full_name,
        avatar_url,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserProfile = null;
  let hasApplied = false;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    currentUserProfile = profile;

    // Check if user has already applied
    const { data: existingProposal } = await supabase
      .from("proposals")
      .select("id")
      .eq("job_id", id)
      .eq("freelancer_id", user.id)
      .single();

    hasApplied = !!existingProposal;
  }

  // Fetch proposals count
  const { count: proposalCount } = await supabase
    .from("proposals")
    .select("*", { count: "exact", head: true })
    .eq("job_id", id);

  return (
    <JobDetailContent
      job={job}
      currentUser={currentUserProfile}
      hasApplied={hasApplied}
      proposalCount={proposalCount || 0}
    />
  );
}
