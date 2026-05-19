"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import type { Profile } from "@/types";

interface SettingsClientProps {
  profile: Profile | null;
  email: string;
}

export default function SettingsClient({ profile, email }: SettingsClientProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 2MB.");
      return;
    }

    setUploading(true);
    setMessage("");

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setMessage("Gagal upload. Coba lagi.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile?.id);

    if (updateError) {
      setMessage("Gagal menyimpan avatar.");
    } else {
      setAvatarUrl(publicUrl);
      setMessage("Avatar berhasil diupload!");
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile?.id);

    if (error) {
      setMessage("Gagal menyimpan. Coba lagi.");
    } else {
      setMessage("Berhasil disimpan!");
    }
    setSaving(false);
  }

  const plan = profile?.plan || "free";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
          Settings
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Kelola akun dan preferensi kamu
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-medium text-ink-muted">
                    {fullName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-2 border border-hairline flex items-center justify-center hover:bg-surface-1 transition-colors"
              >
                <Camera size={12} className="text-ink-muted" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Foto Profil</p>
              <p className="text-xs text-ink-muted">JPG, PNG, WebP. Maks 2MB.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-name" className="text-sm font-medium text-ink-muted">
              Nama Lengkap
            </label>
            <Input
              id="settings-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-muted">
              Email
            </label>
            <Input value={email} disabled className="opacity-60" />
            <p className="text-xs text-ink-muted">Email tidak bisa diubah</p>
          </div>

          {message && (
            <p className={`text-sm ${message.includes("Gagal") ? "text-gradient-coral" : "text-success"}`}>
              {message}
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>Kelola subscription kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-2 rounded-md">
            <div>
              <p className="text-sm font-medium text-ink capitalize">{plan} Plan</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {plan === "free" && "1 project, download HTML"}
                {plan === "starter" && "10 projects, custom domain"}
                {plan === "pro" && "Unlimited projects, prioritas AI, analytics"}
              </p>
            </div>
            <Badge variant={plan === "pro" ? "purple" : plan === "starter" ? "success" : "default"}>
              {plan === "free" ? "Free" : "Active"}
            </Badge>
          </div>
          <a href="/pricing">
            <Button variant="secondary" className="w-full">
              {plan === "free" ? "Upgrade ke Starter — Rp49.000/bulan" : "Upgrade ke Pro — Rp149.000/bulan"}
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="border-gradient-coral/20">
        <CardHeader>
          <CardTitle className="text-gradient-coral">Danger Zone</CardTitle>
          <CardDescription>Tindakan yang tidak bisa dibatalkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm">
            Hapus Akun
          </Button>
          <p className="text-xs text-ink-muted mt-2">
            Semua data dan project kamu akan dihapus permanen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
