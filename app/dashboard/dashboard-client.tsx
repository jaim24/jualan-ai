"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, LandingPage } from "@/types";

interface DashboardClientProps {
  profile: Profile | null;
  landingPages: LandingPage[];
}

export default function DashboardClient({
  profile,
  landingPages,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const plan = profile?.plan || "free";
  const pagesGenerated = profile?.pages_generated || 0;
  const maxPages = plan === "free" ? 1 : plan === "starter" ? 10 : Infinity;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus halaman ini?")) return;

    const { error } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", id);

    if (!error) {
      router.refresh();
    } else {
      alert("Gagal menghapus. Coba lagi.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-14 border-b border-hairline-soft">
        <a href="/" className="text-lg font-medium tracking-[-1px] text-ink">
          Jualan AI
        </a>
        <div className="flex items-center gap-3">
          <span className="text-[13px] tracking-[-0.13px] text-ink-muted">
            {profile?.full_name || "User"}
          </span>
          <a
            href="/generate"
            className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Buat Halaman Baru
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink-muted bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 bg-surface-1 rounded-[20px]">
            <p className="text-[13px] tracking-[-0.13px] text-ink-muted mb-1">
              Total Halaman
            </p>
            <p className="text-2xl font-medium tracking-[-1px] text-ink">
              {landingPages.length}
            </p>
          </div>
          <div className="p-5 bg-surface-1 rounded-[20px]">
            <p className="text-[13px] tracking-[-0.13px] text-ink-muted mb-1">
              Plan Aktif
            </p>
            <p className="text-2xl font-medium tracking-[-1px] text-ink capitalize">
              {plan}
            </p>
          </div>
          <div className="p-5 bg-surface-1 rounded-[20px]">
            <p className="text-[13px] tracking-[-0.13px] text-ink-muted mb-1">
              Sisa Kuota
            </p>
            <p className="text-2xl font-medium tracking-[-1px] text-ink">
              {maxPages === Infinity
                ? "Unlimited"
                : `${pagesGenerated}/${maxPages} halaman`}
            </p>
          </div>
        </div>

        {/* Landing Pages */}
        <h2 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-6">
          Halaman Saya
        </h2>

        {landingPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-1 rounded-[20px]">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-[15px] tracking-[-0.15px] text-ink-muted mb-6">
              Belum ada halaman. Buat yang pertama!
            </p>
            <a
              href="/generate"
              className="px-6 py-3 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
            >
              Buat Halaman Pertamamu
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landingPages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col p-5 bg-surface-1 rounded-[20px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[15px] font-medium tracking-[-0.15px] text-ink mb-1">
                      {page.title}
                    </h3>
                    <p className="text-[12px] tracking-[-0.12px] text-ink-muted">
                      {new Date(page.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-medium tracking-[-0.11px] rounded-full ${
                      page.is_published
                        ? "bg-success/10 text-success"
                        : "bg-surface-2 text-ink-muted"
                    }`}
                  >
                    {page.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-hairline-soft">
                  <a
                    href={`/preview/${page.id}`}
                    className="px-3 py-2 text-[13px] font-medium tracking-[-0.13px] text-ink bg-surface-2 rounded-full hover:bg-hairline transition-colors"
                  >
                    Preview
                  </a>
                  <a
                    href={`/preview/${page.id}`}
                    className="px-3 py-2 text-[13px] font-medium tracking-[-0.13px] text-ink bg-surface-2 rounded-full hover:bg-hairline transition-colors"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="px-3 py-2 text-[13px] font-medium tracking-[-0.13px] text-gradient-coral bg-gradient-coral/10 rounded-full hover:bg-gradient-coral/20 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade Banner (free plan only) */}
        {plan === "free" && pagesGenerated >= 1 && (
          <div className="mt-10 p-6 bg-gradient-to-r from-gradient-violet/20 to-gradient-magenta/20 rounded-[20px] border border-hairline">
            <p className="text-[15px] tracking-[-0.15px] text-ink mb-4">
              Kamu sudah pakai {pagesGenerated}/{maxPages} halaman gratis.
              Upgrade ke Starter untuk membuat lebih banyak.
            </p>
            <a
              href="/pricing"
              className="inline-block px-5 py-2.5 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
            >
              Upgrade Sekarang
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
