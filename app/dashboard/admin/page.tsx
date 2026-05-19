import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminOverview from "./admin-overview";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalPages } = await supabase
    .from("landing_pages")
    .select("*", { count: "exact", head: true });

  const { count: totalTemplates } = await supabase
    .from("templates")
    .select("*", { count: "exact", head: true });

  const { data: recentPages } = await supabase
    .from("landing_pages")
    .select("id, title, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = {
    totalUsers: totalUsers || 0,
    totalPages: totalPages || 0,
    totalTemplates: totalTemplates || 0,
    recentPages: recentPages || [],
  };

  return <AdminOverview stats={stats} />;
}
