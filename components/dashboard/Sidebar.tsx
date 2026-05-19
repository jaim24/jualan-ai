"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userName: string;
  userPlan: string;
}

export default function Sidebar({ userName, userPlan }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-hairline-soft">
        <a href="/" className="text-lg font-medium tracking-[-1px] text-ink">
          Jualan AI
        </a>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2 text-ink-muted"
          aria-label="Tutup menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Project Button */}
      <div className="px-4 py-4">
        <Button
          onClick={() => router.push("/generate")}
          className="w-full gap-2"
          size="default"
        >
          <Plus size={16} />
          Buat Project Baru
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-surface-2 text-ink"
                      : "text-ink-muted hover:text-ink hover:bg-surface-1"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-hairline-soft">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-violet flex items-center justify-center text-white text-sm font-medium">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">{userName || "User"}</p>
            <p className="text-xs text-ink-muted capitalize">{userPlan} plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-muted hover:text-ink rounded-lg hover:bg-surface-1 transition-colors min-h-[44px]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-surface-1 border border-hairline text-ink"
        aria-label="Buka menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-canvas border-r border-hairline-soft transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
