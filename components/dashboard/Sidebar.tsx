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
  Users,
  LayoutTemplate,
  Layers,
  Shield,
  ChevronDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface SidebarProps {
  userName: string;
  userPlan: string;
  userRole?: string;
  avatarUrl?: string | null;
}

export default function Sidebar({ userName, userPlan, userRole, avatarUrl }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const isAdmin = userRole === "admin";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function renderNavItem(item: NavItem) {
    const active = isActive(item.href);
    return (
      <li key={item.href}>
        <a
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px]",
            active
              ? "bg-surface-2 text-ink"
              : "text-ink-muted hover:text-ink hover:bg-surface-1"
          )}
        >
          <item.icon size={18} className="shrink-0" />
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-ink/20 text-[11px] font-medium text-ink">
              {item.badge}
            </span>
          )}
        </a>
      </li>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-canvas">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-hairline-soft">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
            <FileText size={14} className="text-on-primary" />
          </div>
          <span className="text-sm font-medium tracking-tight text-ink">
            Jualan AI
          </span>
        </a>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-1 text-ink-muted"
        >
          <X size={16} />
        </button>
      </div>

      {/* New Project Button */}
      <div className="px-4 py-4">
        <Button
          onClick={() => router.push("/generate")}
          className="w-full gap-2"
          variant="default"
          size="default"
        >
          <Plus size={16} />
          Buat Project Baru
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-6" aria-label="Dashboard navigation">
        <div>
          <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
            Utama
          </p>
          <ul className="flex flex-col gap-0.5">
            {renderNavItem({ href: "/dashboard", label: "Overview", icon: LayoutDashboard })}
            {renderNavItem({ href: "/dashboard/projects", label: "Projects", icon: FolderOpen })}
          </ul>
        </div>

        <div>
          <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
            Lainnya
          </p>
          <ul className="flex flex-col gap-0.5">
            {renderNavItem({ href: "/dashboard/settings", label: "Settings", icon: Settings })}
          </ul>
        </div>

        {isAdmin && (
          <div>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="flex items-center justify-between w-full px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-accent-blue"
            >
              <span className="flex items-center gap-1.5">
                <Shield size={12} />
                Admin
              </span>
              <ChevronDown
                size={12}
                className={cn("transition-transform duration-150", adminOpen && "rotate-180")}
              />
            </button>
            {adminOpen && (
              <ul className="flex flex-col gap-0.5">
                {renderNavItem({ href: "/dashboard/admin", label: "Dashboard", icon: Shield })}
                {renderNavItem({ href: "/dashboard/admin/users", label: "Users", icon: Users })}
                {renderNavItem({ href: "/dashboard/admin/templates", label: "Templates", icon: LayoutTemplate })}
                {renderNavItem({ href: "/dashboard/admin/collections", label: "Collections", icon: Layers })}
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-hairline-soft">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center overflow-hidden text-sm font-medium text-ink shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              userName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">{userName || "User"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                {userPlan}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-accent-blue/10 text-accent-blue">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-muted hover:text-ink rounded-lg hover:bg-surface-1 transition-colors duration-150 min-h-[44px]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-surface-1 border border-hairline text-ink"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/80"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 w-64 border-r border-hairline-soft transition-transform duration-300 bg-canvas",
          "lg:translate-x-0 lg:static lg:z-auto",
          "max-lg:h-screen",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
