"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setVerified(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Gagal update password. Coba lagi.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle size={28} className="text-success" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-ink mb-3">
            Password Berhasil Diubah
          </h1>
          <p className="text-sm text-ink-muted mb-6">
            Kamu akan diarahkan ke halaman login dalam 3 detik.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="text-xl font-medium tracking-tight text-ink">
            Jualan AI
          </a>
          <p className="mt-2 text-sm text-ink-muted">Buat password baru</p>
        </div>

        {!verified ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-ink/5 flex items-center justify-center">
              <AlertCircle size={28} className="text-ink-muted" />
            </div>
            <p className="text-sm text-ink-muted">
              Link reset password tidak valid atau sudah kadaluarsa.
            </p>
            <a
              href="/forgot-password"
              className="inline-block mt-6 px-6 py-3 text-sm font-medium text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
            >
              Minta Link Baru
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-sm text-gradient-coral bg-gradient-coral/10 rounded-md border border-gradient-coral/20">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="new-password" className="text-xs font-medium text-ink-muted">
                Password Baru
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className="text-xs font-medium text-ink-muted">
                Konfirmasi Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                required
              />
            </div>

            <Button type="submit" disabled={loading || !password} className="mt-2">
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
