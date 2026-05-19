"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  LayoutTemplate,
  Plus,
  Search,
  Globe,
  Trash2,
  Edit3,
} from "lucide-react";
import type { Template, Collection } from "@/types";

interface Props {
  templates: Template[];
  collections: Collection[];
}

export default function AdminTemplatesClient({ templates: initial, collections }: Props) {
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState(initial);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleTogglePublish(id: string, current: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from("templates")
      .update({ is_published: !current })
      .eq("id", id);
    if (!error) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_published: !current } : t))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (!error) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink">Templates</h1>
          <p className="text-sm text-ink-muted mt-1">{templates.length} templates</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Template
        </Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="pl-9"
        />
      </div>

      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Badge
              key={c.id}
              className="bg-surface-1 text-ink-muted hover:bg-surface-2 cursor-pointer border-0"
            >
              {c.icon} {c.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-ink-muted">
            <LayoutTemplate size={32} className="mb-3" />
            <p className="text-sm">No templates yet</p>
          </div>
        ) : (
          filtered.map((template) => (
            <div
              key={template.id}
              className="rounded-xl bg-surface-1 border border-hairline/50 p-5 hover:bg-surface-2 transition-colors duration-150 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center">
                  <LayoutTemplate size={18} className="text-ink-muted" />
                </div>
                <Badge
                  className={
                    template.is_published
                      ? "bg-success/10 text-success border-0"
                      : "bg-ink/5 text-ink-muted border-0"
                  }
                >
                  {template.is_published ? "Published" : "Draft"}
                </Badge>
              </div>

              <h3 className="text-sm font-medium text-ink mb-1">{template.name}</h3>
              <p className="text-xs text-ink-muted line-clamp-2 mb-3">
                {template.description || "No description"}
              </p>

              <div className="flex items-center gap-2 text-xs text-ink-muted mb-4">
                <span className="px-2 py-0.5 rounded-full bg-ink/5">{template.category}</span>
                <span>{template.usage_count} uses</span>
              </div>

              <div className="flex items-center gap-1 pt-3 border-t border-hairline-soft">
                <button
                  onClick={() => handleTogglePublish(template.id, template.is_published)}
                  className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-success transition-colors"
                  title={template.is_published ? "Unpublish" : "Publish"}
                >
                  <Globe size={14} />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-accent-blue transition-colors"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-gradient-coral transition-colors ml-auto"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
