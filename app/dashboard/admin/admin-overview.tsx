"use client";

import { Users, FileText, LayoutTemplate, TrendingUp, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  totalTemplates: number;
  recentPages: { id: string; title: string; created_at: string; user_id: string }[];
}

export default function AdminOverview({ stats }: { stats: AdminStats }) {
  const router = useRouter();

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/dashboard/admin/users" },
    { label: "Landing Pages", value: stats.totalPages, icon: FileText, href: "/dashboard/admin/templates" },
    { label: "Templates", value: stats.totalTemplates, icon: LayoutTemplate, href: "/dashboard/admin/templates" },
    { label: "Growth", value: "+12%", icon: TrendingUp, href: "#" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink">Admin Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Platform overview & analytics</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push("/dashboard/admin/templates")}
          className="gap-2"
        >
          <LayoutTemplate size={16} />
          Manage Templates
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => router.push(card.href)}
            className="rounded-xl bg-surface-1 border border-hairline/50 p-6 text-left hover:bg-surface-2 transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center mb-4">
              <card.icon size={18} className="text-ink-muted" />
            </div>
            <p className="text-2xl font-medium text-ink mb-1">{card.value}</p>
            <p className="text-sm text-ink-muted">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-1 border border-hairline/50 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-hairline-soft">
          <Activity size={16} className="text-ink-muted" />
          <h2 className="text-sm font-medium text-ink">Recent Landing Pages</h2>
        </div>
        {stats.recentPages.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-8">No pages created yet.</p>
        ) : (
          <div className="divide-y divide-hairline-soft">
            {stats.recentPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center">
                    <FileText size={14} className="text-ink-muted" />
                  </div>
                  <p className="text-sm font-medium text-ink">{page.title}</p>
                </div>
                <p className="text-xs text-ink-muted">
                  {new Date(page.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
