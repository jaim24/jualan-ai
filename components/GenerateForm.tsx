"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { FormData } from "@/types";

const CATEGORIES = [
  "E-book",
  "Kursus Online",
  "Template",
  "Preset",
  "Webinar",
  "Jasa",
  "Lainnya",
];

const STYLES = [
  { value: "minimalis", label: "Minimalis", colors: ["#1c1c1c", "#ffffff"] },
  { value: "modern-bold", label: "Modern Bold", colors: ["#6a4cf5", "#ff5577"] },
  { value: "profesional", label: "Profesional", colors: ["#0099ff", "#090909"] },
];

const COLORS = [
  { value: "ungu", label: "Ungu", hex: "#6a4cf5" },
  { value: "biru", label: "Biru", hex: "#0099ff" },
  { value: "hijau", label: "Hijau", hex: "#22c55e" },
  { value: "oranye", label: "Oranye", hex: "#ff7a3d" },
  { value: "hitam", label: "Hitam", hex: "#1c1c1c" },
];

const initialFormData: FormData = {
  product_name: "",
  description: "",
  category: "",
  price: "",
  product_image: "",
  benefits: "",
  target_audience: "",
  problem_solved: "",
  style: "minimalis",
  cta_text: "",
  cta_link: "",
  color: "ungu",
};

export default function GenerateForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2MB.");
      return;
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format gambar harus JPG, PNG, WebP, atau GIF.");
      return;
    }

    setUploading(true);
    setError("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      setError("Gagal upload gambar. Coba lagi.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    updateField("product_image", urlData.publicUrl);
    setUploading(false);
  }

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep(): boolean {
    setError("");
    if (step === 1) {
      if (!formData.product_name.trim()) {
        setError("Nama produk wajib diisi.");
        return false;
      }
      if (!formData.description.trim()) {
        setError("Deskripsi produk wajib diisi.");
        return false;
      }
      if (!formData.category) {
        setError("Pilih kategori produk.");
        return false;
      }
      if (!formData.price.trim()) {
        setError("Harga produk wajib diisi.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.benefits.trim()) {
        setError("Manfaat produk wajib diisi.");
        return false;
      }
      if (!formData.target_audience.trim()) {
        setError("Target pembeli wajib diisi.");
        return false;
      }
      if (!formData.problem_solved.trim()) {
        setError("Masalah yang diselesaikan wajib diisi.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.cta_text.trim()) {
        setError("Teks tombol CTA wajib diisi.");
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  }

  function prevStep() {
    setError("");
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Coba lagi.");
        setLoading(false);
        return;
      }

      router.push(`/preview/${data.id}`);
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-full h-1 rounded-full transition-colors ${
                s <= step ? "bg-white" : "bg-surface-2"
              }`}
            />
            <span
              className={`text-[12px] tracking-[-0.12px] ${
                s <= step ? "text-ink" : "text-ink-muted"
              }`}
            >
              {s === 1 && "Produk"}
              {s === 2 && "Manfaat"}
              {s === 3 && "Gaya"}
            </span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 text-sm text-gradient-coral bg-gradient-coral/10 rounded-[10px] border border-gradient-coral/20">
          {error}
        </div>
      )}

      {/* Step 1 — Informasi Produk */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
            Informasi Produk
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Nama Produk
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => updateField("product_name", e.target.value)}
              placeholder='Contoh: "E-book Resep MPASI 100 Menu"'
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Deskripsi Singkat
              <span className="ml-2 text-ink-muted/50">
                ({formData.description.length}/200)
              </span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                updateField("description", e.target.value.slice(0, 200))
              }
              placeholder="Jelaskan produkmu dalam 1-2 kalimat"
              rows={3}
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Kategori Produk
            </label>
            <select
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Harga Produk
            </label>
            <input
              type="text"
              value={formData.price ? `Rp ${Number(formData.price).toLocaleString("id-ID")}` : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                updateField("price", raw);
              }}
              placeholder="Rp 100.000"
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          {/* Upload Gambar Produk */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Gambar Produk
              <span className="ml-2 text-ink-muted/50">(maks 2MB)</span>
            </label>
            {formData.product_image ? (
              <div className="relative">
                <img
                  src={formData.product_image}
                  alt="Preview produk"
                  className="w-full h-40 object-cover rounded-[10px] border border-hairline"
                />
                <button
                  type="button"
                  onClick={() => updateField("product_image", "")}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/70 text-white rounded-full text-xs hover:bg-black/90 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 bg-surface-1 border border-dashed border-hairline rounded-[10px] cursor-pointer hover:bg-surface-2 transition-colors">
                {uploading ? (
                  <span className="text-sm text-ink-muted">Mengupload...</span>
                ) : (
                  <>
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-sm text-ink-muted">Klik untuk upload gambar</span>
                    <span className="text-xs text-ink-muted/50 mt-1">JPG, PNG, WebP, GIF</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Step 2 — Manfaat & Target */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
            Manfaat & Target
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              3 Manfaat Utama
              <span className="ml-2 text-ink-muted/50">
                (pisahkan dengan enter)
              </span>
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                if (lines.length <= 3) {
                  updateField("benefits", e.target.value);
                }
              }}
              placeholder={"Manfaat 1\nManfaat 2\nManfaat 3"}
              rows={4}
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Target Pembeli
            </label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={(e) => updateField("target_audience", e.target.value)}
              placeholder='Contoh: "Ibu baru yang anaknya mulai MPASI"'
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Masalah yang Diselesaikan
            </label>
            <input
              type="text"
              value={formData.problem_solved}
              onChange={(e) => updateField("problem_solved", e.target.value)}
              placeholder="Apa masalah utama yang produkmu selesaikan?"
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>
        </div>
      )}

      {/* Step 3 — Gaya & CTA */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
            Gaya & CTA
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Gaya Visual
            </label>
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => updateField("style", s.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[15px] border transition-colors ${
                    formData.style === s.value
                      ? "border-accent-blue bg-surface-2"
                      : "border-hairline bg-surface-1 hover:bg-surface-2"
                  }`}
                >
                  <div className="flex gap-1">
                    {s.colors.map((c) => (
                      <div
                        key={c}
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] font-medium tracking-[-0.13px] text-ink">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Teks Tombol CTA
            </label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => updateField("cta_text", e.target.value)}
              placeholder='Contoh: "Beli Sekarang" atau "Dapatkan Akses"'
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Link CTA / WhatsApp
              <span className="ml-2 text-ink-muted/50">(opsional)</span>
            </label>
            <input
              type="text"
              value={formData.cta_link}
              onChange={(e) => updateField("cta_link", e.target.value)}
              placeholder="https://... atau 08xxxxxxxxxx"
              className="w-full px-3.5 py-2.5 text-[15px] tracking-[-0.15px] text-ink bg-surface-1 rounded-[10px] border border-hairline placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
              Warna Utama
            </label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateField("color", c.value)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-[10px] border transition-colors ${
                    formData.color === c.value
                      ? "border-accent-blue bg-surface-2"
                      : "border-transparent hover:bg-surface-1"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] tracking-[-0.11px] text-ink-muted">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Kembali
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-5 py-2.5 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                AI sedang membuat halamanmu...
              </span>
            ) : (
              "Generate Landing Page Saya"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
