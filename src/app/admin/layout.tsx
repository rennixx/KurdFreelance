import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin (you would have an admin check here)
  // For now, we'll allow access for demo purposes
  // In production, add proper admin role check

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
