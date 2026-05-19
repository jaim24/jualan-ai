import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminCollectionsClient from "./collections-client";

export default async function AdminCollectionsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("name");

  return <AdminCollectionsClient collections={collections || []} />;
}
