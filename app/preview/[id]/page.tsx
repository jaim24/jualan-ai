import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PreviewClient from "./preview-client";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: landingPage } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!landingPage) {
    redirect("/dashboard");
  }

  return <PreviewClient landingPage={landingPage} />;
}
