import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("landing_pages")
    .select("title, product_name, html_content")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!page) return { title: "Not Found" };

  const desc = page.html_content.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: page.title || page.product_name,
    description: desc,
    openGraph: {
      title: page.title || page.product_name,
      description: desc,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!page) notFound();

  // Increment view count
  await supabase
    .from("landing_pages")
    .update({ view_count: (page.view_count || 0) + 1 })
    .eq("id", page.id);

  return (
    <div className="min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: page.html_content }} />
    </div>
  );
}
