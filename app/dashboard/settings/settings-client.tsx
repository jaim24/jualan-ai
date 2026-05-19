"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

interface SettingsClientProps {
  profile: Profile | null;
  email: string;
}

export default function SettingsClient({ profile, email }: SettingsClientProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function handleSave() {
    setSaving(true);
    setMessage("");

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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Settings
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Kelola akun dan preferensi kamu
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>Kelola subscription kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
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

          {plan === "free" && (
            <Button variant="secondary" className="w-full">
              Upgrade ke Starter — Rp49.000/bulan
            </Button>
          )}
          {plan === "starter" && (
            <Button variant="secondary" className="w-full">
              Upgrade ke Pro — Rp149.000/bulan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
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
