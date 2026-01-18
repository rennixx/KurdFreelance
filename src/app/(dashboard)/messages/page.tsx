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
      jobs (
        id,
        title
      )
    `)
    .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  // Fetch user data separately and join manually
  const userIds = new Set<string>();
  conversations?.forEach(conv => {
    userIds.add(conv.participant_one);
    userIds.add(conv.participant_two);
  });

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, avatar_url")
    .in("id", Array.from(userIds));

  const userMap = new Map(users?.map(u => [u.id, u]) || []);

  // Join the data manually
  const conversationsWithUsers = (conversations || []).map(conv => ({
    ...conv,
    participant_one_user: userMap.get(conv.participant_one),
    participant_two_user: userMap.get(conv.participant_two),
  }));

  return (
    <div className="container py-8">
      <MessagesContent
        conversations={conversationsWithUsers}
        currentUserId={user.id}
      />
    </div>
  );
}
