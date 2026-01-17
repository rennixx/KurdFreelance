import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Clock, Users, CurrencyDollar } from "@phosphor-icons/react/dist/ssr";
import { formatDistanceToNow } from "date-fns";

export default async function MyJobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's posted jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select(`
      *,
      proposals:proposals (count)
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-500 mt-1">Manage your posted jobs and view proposals</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/my-jobs/post">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Jobs List */}
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <Link href={`/jobs/${job.id}`} className="hover:text-green-600">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {(job.proposals as any)?.[0]?.count || 0} proposals
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <CurrencyDollar className="h-4 w-4" />
                    {job.budget_type === "fixed" ? (
                      <span>${job.budget_min} - ${job.budget_max}</span>
                    ) : (
                      <span>${job.budget_min} - ${job.budget_max}/hr</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${job.id}/proposals`}>View Proposals</Link>
                  </Button>
                  {job.status === "open" && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job.id}/edit`}>Edit Job</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 text-center mb-6">
              Start by posting your first job to find talented freelancers
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/my-jobs/post">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
