import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationsContent } from "@/components/notifications/notifications-content";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all notifications for the user
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <NotificationsContent notifications={notifications || []} />
    </div>
  );
}
