import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProjectsClient from "./projects-client";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: landingPages } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <ProjectsClient projects={landingPages || []} />;
}
