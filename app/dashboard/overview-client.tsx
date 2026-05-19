"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Globe,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  BarChart3,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile, LandingPage } from "@/types";

interface DashboardOverviewProps {
  profile: Profile | null;
  stats: {
    totalPages: number;
    publishedPages: number;
    totalViews: number;
  };
  recentPages: LandingPage[];
}

export default function DashboardOverview({
  profile,
  stats,
  recentPages,
}: DashboardOverviewProps) {
  const router = useRouter();
  const plan = profile?.plan || "free";
  const maxPages = plan === "free" ? 1 : plan === "starter" ? 10 : Infinity;

  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalPages,
      icon: FileText,
    },
    {
      label: "Published",
      value: stats.publishedPages,
      icon: Globe,
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
    },
    {
      label: "Plan",
      value: plan.charAt(0).toUpperCase() + plan.slice(1),
      icon: TrendingUp,
      sub: maxPages === Infinity ? "Unlimited" : `${stats.totalPages}/${maxPages} used`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Dashboard
            </h1>
            <Badge className="bg-success/10 text-success border-0 text-[11px] px-2 py-0.5">
              <Sparkles size={10} className="mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-sm text-ink-muted">
            Selamat datang kembali, {profile?.full_name || "User"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/generate")}
          className="gap-2"
        >
          <Plus size={16} />
          Buat Project Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-surface-1 border border-hairline/50 p-6 hover:bg-surface-2 transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center mb-4">
              <card.icon size={18} className="text-ink-muted" />
            </div>
            <p className="text-2xl font-medium text-ink mb-0.5">{card.value}</p>
            <p className="text-sm text-ink-muted">{card.label}</p>
            {card.sub && (
              <p className="text-xs text-ink-muted/70 mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => router.push("/generate")}
          className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-hairline/50 hover:bg-surface-2 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-lg bg-ink/5 flex items-center justify-center group-hover:bg-ink/10 transition-colors">
            <Rocket size={20} className="text-ink-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">Buat Landing Page</p>
            <p className="text-xs text-ink-muted">Generate dengan AI dalam detik</p>
          </div>
          <ArrowRight size={16} className="text-ink-muted/50 group-hover:text-ink-muted transition-colors" />
        </button>

        <button
          onClick={() => router.push("/dashboard/projects")}
          className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-hairline/50 hover:bg-surface-2 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-lg bg-ink/5 flex items-center justify-center group-hover:bg-ink/10 transition-colors">
            <BarChart3 size={20} className="text-ink-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">Lihat Projects</p>
            <p className="text-xs text-ink-muted">{stats.totalPages} project tersedia</p>
          </div>
          <ArrowRight size={16} className="text-ink-muted/50 group-hover:text-ink-muted transition-colors" />
        </button>

        <button
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-hairline/50 hover:bg-surface-2 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-lg bg-ink/5 flex items-center justify-center group-hover:bg-ink/10 transition-colors">
            <Clock size={20} className="text-ink-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">Pengaturan</p>
            <p className="text-xs text-ink-muted">Profile & billing</p>
          </div>
          <ArrowRight size={16} className="text-ink-muted/50 group-hover:text-ink-muted transition-colors" />
        </button>
      </div>

      <div className="rounded-xl bg-surface-1 border border-hairline/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-ink-muted" />
            <h2 className="text-sm font-medium text-ink">Recent Projects</h2>
          </div>
          {recentPages.length > 0 && (
            <a
              href="/dashboard/projects"
              className="text-sm text-accent-blue hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </a>
          )}
        </div>

        {recentPages.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink/5 flex items-center justify-center">
              <FileText size={24} className="text-ink-muted/50" />
            </div>
            <p className="text-sm text-ink-muted mb-4">
              Belum ada project. Buat yang pertama!
            </p>
            <Button
              onClick={() => router.push("/generate")}
              variant="secondary"
              className="gap-2"
            >
              <Plus size={16} />
              Buat Project
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-hairline-soft">
            {recentPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-ink/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-ink-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {page.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-ink-muted" />
                      <p className="text-xs text-ink-muted">
                        {new Date(page.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    className={
                      page.is_published
                        ? "bg-success/10 text-success border-0"
                        : "bg-ink/5 text-ink-muted border-0"
                    }
                  >
                    {page.is_published ? "Published" : "Draft"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/preview/${page.id}`)}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {plan === "free" && stats.totalPages >= 1 && (
        <div className="rounded-xl bg-surface-1 border border-hairline/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">
                Upgrade untuk fitur lebih banyak
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Kamu sudah pakai {stats.totalPages}/{maxPages} project gratis. Upgrade ke Starter
                untuk 10 project.
              </p>
            </div>
            <Button className="shrink-0">
              Upgrade Sekarang
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
