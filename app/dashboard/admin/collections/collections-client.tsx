"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Plus, Trash2, Edit3, FolderOpen } from "lucide-react";
import type { Collection } from "@/types";

interface Props {
  collections: Collection[];
}

export default function AdminCollectionsClient({ collections: initial }: Props) {
  const [collections, setCollections] = useState(initial);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  async function handleCreate() {
    if (!newName.trim()) return;
    const supabase = createClient();
    const slug = newName.toLowerCase().replace(/\s+/g, "-");
    const { data, error } = await supabase
      .from("collections")
      .insert({ name: newName, slug, description: newDesc || null })
      .select()
      .single();
    if (!error && data) {
      setCollections((prev) => [...prev, data as Collection]);
      setNewName("");
      setNewDesc("");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus collection ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (!error) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink">Collections</h1>
        <p className="text-sm text-ink-muted mt-1">{collections.length} collections</p>
      </div>

      <div className="rounded-xl bg-surface-1 border border-hairline/50 p-6">
        <h2 className="text-sm font-medium text-ink mb-4">Buat Collection Baru</h2>
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama collection"
          />
          <Input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Deskripsi (opsional)"
          />
          <Button onClick={handleCreate} className="gap-2 shrink-0">
            <Plus size={16} />
            Buat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-ink-muted">
            <Layers size={32} className="mb-3" />
            <p className="text-sm">No collections yet</p>
          </div>
        ) : (
          collections.map((c) => (
            <div
              key={c.id}
              className="rounded-xl bg-surface-1 border border-hairline/50 p-5 hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-ink/5 flex items-center justify-center">
                  <FolderOpen size={18} className="text-ink-muted" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">{c.name}</h3>
                  <p className="text-xs text-ink-muted">{c.template_count || 0} templates</p>
                </div>
              </div>
              {c.description && (
                <p className="text-xs text-ink-muted mb-3">{c.description}</p>
              )}
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-hairline-soft">
                <button className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-accent-blue transition-colors">
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-lg hover:bg-ink/5 text-ink-muted hover:text-gradient-coral transition-colors"
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
