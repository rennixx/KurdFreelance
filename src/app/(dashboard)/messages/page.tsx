import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessagesContent } from "@/components/messages/messages-content";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch conversations with participants
  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      participant_one_user:users!conversations_participant_one_fkey (
        id,
        full_name,
        avatar_url
      ),
      participant_two_user:users!conversations_participant_two_fkey (
        id,
        full_name,
        avatar_url
      ),
      job:jobs (
        id,
        title
      )
    `)
    .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  return (
    <div className="container py-8">
      <MessagesContent
        conversations={conversations || []}
        currentUserId={user.id}
      />
    </div>
  );
}
