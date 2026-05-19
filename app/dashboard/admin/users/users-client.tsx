"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Shield, Crown } from "lucide-react";
import type { Profile } from "@/types";

const planStyles: Record<string, string> = {
  free: "bg-ink/5 text-ink-muted",
  starter: "bg-accent-blue/10 text-accent-blue",
  pro: "bg-success/10 text-success",
};

const roleStyles: Record<string, string> = {
  user: "bg-ink/5 text-ink-muted",
  admin: "bg-accent-blue/10 text-accent-blue",
};

export default function AdminUsersClient({ users }: { users: Profile[] }) {
  const [search, setSearch] = useState("");
  const [localUsers, setLocalUsers] = useState(users);

  const filtered = localUsers.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
  );

  async function handleUpgrade(id: string, plan: string) {
    const supabase = createClient();
    const newPlan = plan === "free" ? "starter" : plan === "starter" ? "pro" : "free";
    const { error } = await supabase
      .from("profiles")
      .update({ plan: newPlan })
      .eq("id", id);
    if (!error) {
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, plan: newPlan as Profile["plan"] } : u))
      );
    }
  }

  async function handleToggleRole(id: string, currentRole: string) {
    const supabase = createClient();
    const newRole = currentRole === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);
    if (!error) {
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole as Profile["role"] } : u))
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink">Users</h1>
        <p className="text-sm text-ink-muted mt-1">{localUsers.length} total users</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-9"
        />
      </div>

      <div className="rounded-xl bg-surface-1 border border-hairline/50 overflow-hidden">
        <div className="divide-y divide-hairline-soft">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
              <Users size={32} className="mb-3" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            filtered.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-ink/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center text-sm font-medium text-ink shrink-0">
                    {u.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink truncate">
                        {u.full_name || "No name"}
                      </p>
                      <Badge className={`${roleStyles[u.role] || roleStyles.user} border-0 text-[11px] px-1.5 py-0.5`}>
                        {u.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-muted truncate mt-0.5 font-mono">
                      {u.id.slice(0, 12)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`${planStyles[u.plan] || planStyles.free} border-0 text-[11px] px-1.5 py-0.5`}>
                    {u.plan}
                  </Badge>
                  <span className="text-xs text-ink-muted">{u.pages_generated} pages</span>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleUpgrade(u.id, u.plan)}
                      className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-ink transition-colors"
                      title={`Change plan (current: ${u.plan})`}
                    >
                      <Crown size={14} />
                    </button>
                    <button
                      onClick={() => handleToggleRole(u.id, u.role)}
                      className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-accent-blue transition-colors"
                      title={`Toggle admin role (current: ${u.role})`}
                    >
                      <Shield size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
