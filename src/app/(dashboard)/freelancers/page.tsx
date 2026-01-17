import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FreelancersContent } from "@/components/freelancers/freelancers-content";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FreelancersPage() {
  const supabase = await createClient();

  // Fetch freelancers with their profiles
  const { data: freelancers, error } = await supabase
    .from("users")
    .select(`
      *,
      freelancer_profile:freelancer_profiles (*)
    `)
    .eq("role", "freelancer")
    .eq("onboarding_completed", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <Suspense fallback={<FreelancersLoadingSkeleton />}>
        <FreelancersContent freelancers={freelancers || []} />
      </Suspense>
    </div>
  );
}

function FreelancersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    </div>
  );
}
