import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardOverview from "./overview-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: landingPages } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const totalPages = landingPages?.length || 0;
  const publishedPages = landingPages?.filter((p) => p.is_published).length || 0;
  const totalViews = landingPages?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
  const recentPages = landingPages?.slice(0, 5) || [];

  return (
    <DashboardOverview
      profile={profile}
      stats={{ totalPages, publishedPages, totalViews }}
      recentPages={recentPages}
    />
  );
}
