"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import PreviewFrame from "@/components/PreviewFrame";
import type { LandingPage } from "@/types";

interface PreviewClientProps {
  landingPage: LandingPage;
}

export default function PreviewClient({ landingPage }: PreviewClientProps) {
  const [html, setHtml] = useState(landingPage.html_content);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Word count & read time
  const wordCount = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function handleRegenerate() {
    if (!confirm("Yakin ingin generate ulang? Hasil sebelumnya akan hilang.")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landingPage.form_data),
      });
      const data = await res.json();
      if (data.success) {
        setHtml(data.html);
      }
    } catch {
      alert("Gagal regenerate. Coba lagi.");
    }
    setLoading(false);
  }

  async function handleDownload() {
    const res = await fetch(`/api/export?id=${landingPage.id}`);
    if (!res.ok) {
      alert("Gagal download. Coba lagi.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${landingPage.product_name.toLowerCase().replace(/\s+/g, "-")}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/preview/${landingPage.id}`;
    navigator.clipboard.writeText(url);
    alert("Link berhasil disalin!");
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus halaman ini? Tindakan ini tidak bisa dibatalkan.")) return;

    const { error } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", landingPage.id);

    if (error) {
      alert("Gagal menghapus. Coba lagi.");
      return;
    }

    router.push("/dashboard");
  }

  function handleApplyChanges() {
    let updatedHtml = html;

    if (ctaText.trim()) {
      // Replace CTA button text
      updatedHtml = updatedHtml.replace(
        /(<a[^>]*class="[^"]*"[^>]*>)([^<]*)(<\/a>)/g,
        (match, open, text, close) => {
          if (match.includes("cta") || match.includes("btn") || match.includes("button")) {
            return `${open}${ctaText}${close}`;
          }
          return match;
        }
      );
    }

    if (ctaLink.trim()) {
      // Replace CTA link href
      updatedHtml = updatedHtml.replace(
        /(href=["'])(#|https?:\/\/[^"']*)(["'])/g,
        `$1${ctaLink}$3`
      );
    }

    setHtml(updatedHtml);

    // Save to database
    supabase
      .from("landing_pages")
      .update({ html_content: updatedHtml })
      .eq("id", landingPage.id)
      .then(() => {
        alert("Perubahan berhasil diterapkan!");
      });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-14 border-b border-hairline-soft">
        <a href="/" className="text-lg font-medium tracking-[-1px] text-ink">
          Jualan AI
        </a>
        <a
          href="/dashboard"
          className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
        >
          Dashboard
        </a>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel — Controls (40%) */}
        <div className="w-full lg:w-[40%] p-6 border-b lg:border-b-0 lg:border-r border-hairline-soft overflow-y-auto">
          <h1 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
            Preview Landing Page
          </h1>

          {/* Status Badge */}
          <span
            className={`inline-block px-3 py-1 text-[12px] font-medium tracking-[-0.12px] rounded-full mb-6 ${
              landingPage.is_published
                ? "bg-success/10 text-success"
                : "bg-surface-2 text-ink-muted"
            }`}
          >
            {landingPage.is_published ? "Published" : "Draft"}
          </span>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Regenerate"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
            >
              Download HTML
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
            >
              Salin Link
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-gradient-coral bg-gradient-coral/10 rounded-full hover:bg-gradient-coral/20 transition-colors"
            >
              Hapus
            </button>
          </div>

          {/* Quick Edit */}
          <div className="mb-8">
            <h3 className="text-[14px] font-medium tracking-[-0.14px] text-ink mb-4">
              Edit Cepat
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] tracking-[-0.12px] text-ink-muted">
                  Teks CTA baru
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Contoh: Beli Sekarang"
                  className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] tracking-[-0.12px] text-ink-muted">
                  Link / WhatsApp baru
                </label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https://... atau 08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                />
              </div>
              <button
                onClick={handleApplyChanges}
                className="w-full px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
              >
                Terapkan Perubahan
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 text-[13px] tracking-[-0.13px] text-ink-muted">
            <p>
              Dibuat:{" "}
              {new Date(landingPage.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>Jumlah kata: {wordCount}</p>
            <p>Estimasi waktu baca: {readTime} menit</p>
          </div>
        </div>

        {/* Right Panel — Preview (60%) */}
        <div className="w-full lg:w-[60%] p-6 flex flex-col min-h-[500px]">
          <PreviewFrame html={html} />
        </div>
      </div>
    </div>
  );
}
