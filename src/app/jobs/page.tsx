import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { JobsContent } from "@/components/jobs/jobs-content";
import { Skeleton } from "@/components/ui/skeleton";

export default async function JobsPage() {
  const supabase = await createClient();

  // Fetch jobs with client info
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      *,
      client:users!jobs_client_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <Suspense fallback={<JobsLoadingSkeleton />}>
        <JobsContent jobs={jobs || []} />
      </Suspense>
    </div>
  );
}

function JobsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
