"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Globe,
  Link,
} from "lucide-react";
import type { LandingPage } from "@/types";

interface ProjectsClientProps {
  projects: LandingPage[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const router = useRouter();

  // Filter & search
  const filtered = projects
    .filter((p) => {
      if (filter === "published") return p.is_published;
      if (filter === "draft") return !p.is_published;
      return true;
    })
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.product_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("landing_pages").delete().eq("id", id);
    if (!error) {
      router.refresh();
    } else {
      alert("Gagal menghapus. Coba lagi.");
    }
  }

  async function handleTogglePublish(project: LandingPage) {
    const supabase = createClient();
    const slug = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + project.id.slice(0, 8);
    const { error } = await supabase
      .from("landing_pages")
      .update({ is_published: !project.is_published, slug })
      .eq("id", project.id);
    if (!error) {
      router.refresh();
    }
  }

  function copyLink(project: LandingPage) {
    const url = `${window.location.origin}/p/${project.slug}`;
    navigator.clipboard.writeText(url);
    alert("Link berhasil disalin!");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Projects
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {projects.length} project total
          </p>
        </div>
        <Button onClick={() => router.push("/generate")} className="gap-2">
          <Plus size={16} />
          Buat Project Baru
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari project..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "published" | "draft")}
            className="px-3 py-2.5 text-sm bg-surface-1 border border-hairline rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
          >
            <option value="all">Semua</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
            className="px-3 py-2.5 text-sm bg-surface-1 border border-hairline rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ink/5 flex items-center justify-center">
              <FileText size={24} className="text-ink-muted" />
            </div>
            <p className="text-sm text-ink-muted mb-2">
              {search ? "Tidak ada project yang cocok" : "Belum ada project"}
            </p>
            {!search && (
              <Button onClick={() => router.push("/generate")} variant="secondary" size="sm" className="mt-4 gap-2">
                <Plus size={14} />
                Buat Project Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Card key={project.id} className="group hover:border-hairline transition-colors">
              <CardContent className="flex flex-col h-full">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-ink truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {project.niche || "Uncategorized"}
                    </p>
                  </div>
                  <Badge variant={project.is_published ? "success" : "default"}>
                    {project.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-ink-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {project.view_count || 0} views
                  </span>
                  <span>
                    {new Date(project.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-hairline-soft">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => router.push(`/preview/${project.id}`)}
                  >
                    <Eye size={14} />
                    Preview
                  </Button>
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-success transition-colors"
                    title={project.is_published ? "Unpublish" : "Publish"}
                  >
                    <Globe size={14} />
                  </button>
                  {project.is_published && project.slug && (
                    <button
                      onClick={() => copyLink(project)}
                      className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-accent-blue transition-colors"
                      title="Copy public link"
                    >
                      <Link size={14} />
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                    aria-label="Hapus project"
                    className="text-gradient-coral hover:text-gradient-coral"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
