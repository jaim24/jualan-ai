"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/update-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      setError("Gagal mengirim email. Coba lagi.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle size={28} className="text-success" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-ink mb-3">
            Cek Email Kamu
          </h1>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            Kami sudah kirim link reset password ke <strong className="text-ink">{email}</strong>.
            Klik link tersebut untuk membuat password baru.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Login
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
          <p className="mt-2 text-sm text-ink-muted">Reset password</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 text-sm text-gradient-coral bg-gradient-coral/10 rounded-md border border-gradient-coral/20">
              {error}
            </div>
          )}

          <p className="text-sm text-ink-muted mb-2">
            Masukkan email yang terdaftar. Kami akan kirim link reset password.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-medium text-ink-muted">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !email.trim()} className="mt-2">
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-accent-blue hover:underline">
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
