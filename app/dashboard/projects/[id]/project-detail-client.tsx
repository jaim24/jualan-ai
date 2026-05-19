"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionRenderer from "@/lib/section-renderer";
import { htmlToSections } from "@/lib/html-to-sections";
import type { SectionData } from "@/types/sections";
import type { LandingPage } from "@/types";
import {
  ArrowLeft,
  Eye,
  Download,
  Globe,
  Trash2,
  Save,
  RefreshCw,
  Pencil,
  Monitor,
  Smartphone,
} from "lucide-react";

interface ProjectDetailClientProps {
  project: LandingPage;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Parse sections from existing data
  useEffect(() => {
    // Try to parse form_data.sections first (if already in JSON format)
    const formData = project.form_data as Record<string, unknown> | null;
    if (formData && Array.isArray((formData as { sections?: unknown }).sections)) {
      setSections((formData as { sections: SectionData[] }).sections);
    } else {
      // Convert HTML to sections
      const parsed = htmlToSections(project.html_content);
      setSections(parsed);
    }
  }, [project]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("landing_pages")
      .update({
        form_data: { ...project.form_data as object, sections },
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    if (error) {
      setMessage("Gagal menyimpan. Coba lagi.");
    } else {
      setMessage("Berhasil disimpan!");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus project ini? Tindakan ini tidak bisa dibatalkan.")) return;

    const { error } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", project.id);

    if (!error) {
      router.push("/dashboard/projects");
    } else {
      alert("Gagal menghapus. Coba lagi.");
    }
  }

  async function handleDownload() {
    const res = await fetch(`/api/export?id=${project.id}`);
    if (!res.ok) {
      alert("Gagal download.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.product_name.toLowerCase().replace(/\s+/g, "-")}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateSection(index: number, data: Partial<SectionData>) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...data } as SectionData : s))
    );
  }

  function removeSection(index: number) {
    if (!confirm("Hapus section ini?")) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/projects")}
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={project.is_published ? "success" : "default"}>
                {project.is_published ? "Published" : "Draft"}
              </Badge>
              <span className="text-xs text-ink-muted">
                {new Date(project.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-1.5">
            <Download size={14} />
            Download
          </Button>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/preview/${project.id}`)} className="gap-1.5">
            <Eye size={14} />
            Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            <Save size={14} />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {message && (
        <div role="alert" className={`p-3 text-sm rounded-lg ${message.includes("Gagal") ? "bg-gradient-coral/10 text-gradient-coral" : "bg-success/10 text-success"}`}>
          {message}
        </div>
      )}

      {/* Main Content: Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Section Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-muted">
              Sections ({sections.length})
            </h2>
          </div>

          {sections.map((section, index) => (
            <Card key={index} className={editingIndex === index ? "border-accent-blue/50" : ""}>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" className="capitalize">
                      {section.type}
                    </Badge>
                    <span className="text-xs text-ink-muted">#{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      aria-label="Pindah ke atas"
                      className="w-7 h-7"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      aria-label="Pindah ke bawah"
                      className="w-7 h-7"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      aria-label="Edit section"
                      className="w-7 h-7"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(index)}
                      aria-label="Hapus section"
                      className="w-7 h-7 text-gradient-coral"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>

                {/* Inline Editor */}
                {editingIndex === index && (
                  <div className="space-y-3 pt-3 border-t border-hairline-soft">
                    {section.type === "hero" && (
                      <>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Title</label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Subtitle</label>
                          <Input
                            value={section.subtitle || ""}
                            onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Button Text</label>
                          <Input
                            value={section.buttonText || ""}
                            onChange={(e) => updateSection(index, { buttonText: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {section.type === "cta" && (
                      <>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Title</label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Subtitle</label>
                          <Input
                            value={section.subtitle || ""}
                            onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Button Text</label>
                          <Input
                            value={section.buttonText || ""}
                            onChange={(e) => updateSection(index, { buttonText: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {section.type === "features" && (
                      <>
                        <div>
                          <label className="text-xs text-ink-muted mb-1 block">Section Title</label>
                          <Input
                            value={section.title || ""}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                          />
                        </div>
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-3 bg-surface-2 rounded-lg space-y-2">
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...section.items];
                                newItems[itemIndex] = { ...newItems[itemIndex], title: e.target.value };
                                updateSection(index, { items: newItems });
                              }}
                              placeholder="Feature title"
                            />
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...section.items];
                                newItems[itemIndex] = { ...newItems[itemIndex], description: e.target.value };
                                updateSection(index, { items: newItems });
                              }}
                              placeholder="Feature description"
                            />
                          </div>
                        ))}
                      </>
                    )}

                    {section.type === "pricing" && (
                      <div>
                        <label className="text-xs text-ink-muted mb-1 block">Section Title</label>
                        <Input
                          value={section.title || ""}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                        />
                      </div>
                    )}

                    {section.type === "testimonials" && (
                      <div>
                        <label className="text-xs text-ink-muted mb-1 block">Section Title</label>
                        <Input
                          value={section.title || ""}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                        />
                      </div>
                    )}

                    {section.type === "footer" && (
                      <div>
                        <label className="text-xs text-ink-muted mb-1 block">Copyright</label>
                        <Input
                          value={section.copyright || ""}
                          onChange={(e) => updateSection(index, { copyright: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-muted">Preview</h2>
            <div className="flex items-center gap-1">
              <Button
                variant={previewMode === "desktop" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setPreviewMode("desktop")}
                aria-label="Desktop preview"
                className="w-8 h-8"
              >
                <Monitor size={14} />
              </Button>
              <Button
                variant={previewMode === "mobile" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setPreviewMode("mobile")}
                aria-label="Mobile preview"
                className="w-8 h-8"
              >
                <Smartphone size={14} />
              </Button>
            </div>
          </div>

          <div className="bg-surface-1 rounded-[20px] border border-hairline/50 overflow-hidden">
            <div
              className={`mx-auto overflow-y-auto ${
                previewMode === "mobile" ? "max-w-[390px] h-[600px]" : "w-full h-[700px]"
              }`}
            >
              {sections.length > 0 ? (
                <SectionRenderer sections={sections} />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-ink-muted">
                  Tidak ada sections untuk ditampilkan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
