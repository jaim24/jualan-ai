import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminTemplatesClient from "./templates-client";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("name");

  return <AdminTemplatesClient templates={templates || []} collections={collections || []} />;
}
