import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProjectDetailClient from "./project-detail-client";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    redirect("/dashboard/projects");
  }

  return <ProjectDetailClient project={project} />;
}
