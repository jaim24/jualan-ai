import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, role, avatar_url")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "user";

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar
        userName={profile?.full_name || user.email || "User"}
        userPlan={profile?.plan || "free"}
        userRole={userRole}
        avatarUrl={profile?.avatar_url}
      />
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
