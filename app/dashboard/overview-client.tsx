"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  Globe,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Selamat datang kembali, {profile?.full_name || "User"}
          </p>
        </div>
        <Button onClick={() => router.push("/generate")} className="gap-2">
          <Plus size={16} />
          Buat Project Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-violet/10 flex items-center justify-center">
              <FileText size={20} className="text-gradient-violet" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{stats.totalPages}</p>
              <p className="text-xs text-ink-muted">Total Projects</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Globe size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{stats.publishedPages}</p>
              <p className="text-xs text-ink-muted">Published</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <Eye size={20} className="text-accent-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{stats.totalViews}</p>
              <p className="text-xs text-ink-muted">Total Views</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-orange/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-gradient-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink capitalize">{plan}</p>
              <p className="text-xs text-ink-muted">
                {maxPages === Infinity ? "Unlimited" : `${stats.totalPages}/${maxPages} used`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          {recentPages.length > 0 && (
            <a
              href="/dashboard/projects"
              className="text-sm text-accent-blue hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </a>
          )}
        </CardHeader>
        <CardContent>
          {recentPages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-2 flex items-center justify-center">
                <FileText size={24} className="text-ink-muted" />
              </div>
              <p className="text-sm text-ink-muted mb-4">
                Belum ada project. Buat yang pertama!
              </p>
              <Button onClick={() => router.push("/generate")} variant="secondary" className="gap-2">
                <Plus size={16} />
                Buat Project
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-hairline-soft">
              {recentPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-ink-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {page.title}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {new Date(page.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={page.is_published ? "success" : "default"}>
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
        </CardContent>
      </Card>

      {/* Upgrade Banner */}
      {plan === "free" && stats.totalPages >= 1 && (
        <Card className="bg-gradient-to-r from-gradient-violet/10 to-gradient-magenta/10 border-gradient-violet/20">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">
                Upgrade untuk fitur lebih banyak
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Kamu sudah pakai {stats.totalPages}/{maxPages} project gratis. Upgrade ke Starter untuk 10 project.
              </p>
            </div>
            <Button size="sm" className="shrink-0">
              Upgrade Sekarang
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
