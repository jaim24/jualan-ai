"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "Rp 0",
    period: "selamanya",
    description: "Coba gratis, tanpa komitmen.",
    features: [
      { included: true, text: "1 landing page" },
      { included: true, text: "Download HTML" },
      { included: true, text: "Preview & edit" },
      { included: false, text: "Custom domain" },
      { included: false, text: "Prioritas AI" },
      { included: false, text: "Analytics" },
    ],
    cta: "Mulai Gratis",
    href: "/register",
  },
  {
    name: "Starter",
    price: "Rp 49.000",
    period: "/bulan",
    description: "Untuk kreator yang serius.",
    popular: true,
    features: [
      { included: true, text: "10 landing page" },
      { included: true, text: "Download HTML" },
      { included: true, text: "Preview & edit" },
      { included: true, text: "Custom domain" },
      { included: false, text: "Prioritas AI" },
      { included: false, text: "Analytics" },
    ],
    cta: "Mulai Trial",
    href: "/register",
  },
  {
    name: "Pro",
    price: "Rp 149.000",
    period: "/bulan",
    description: "Untuk bisnis dan power user.",
    features: [
      { included: true, text: "Unlimited landing page" },
      { included: true, text: "Download HTML" },
      { included: true, text: "Preview & edit" },
      { included: true, text: "Custom domain" },
      { included: true, text: "Prioritas AI" },
      { included: true, text: "Analytics" },
    ],
    cta: "Hubungi Kami",
    href: "/register",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-14 border-b border-hairline-soft max-w-5xl mx-auto">
        <a href="/" className="text-sm font-medium tracking-tight text-ink">
          Jualan AI
        </a>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm text-ink-muted hover:text-ink transition-colors">
            Masuk
          </a>
          <Button size="sm" onClick={() => router.push("/register")}>
            Daftar
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent-blue/10 text-accent-blue border-0 mb-4">
            Harga
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-ink mb-3">
            Pilih plan yang tepat
          </h1>
          <p className="text-sm text-ink-muted max-w-md mx-auto">
            Mulai gratis, upgrade kapan pun kamu butuh lebih banyak.
          </p>
        </div>

        {/* Toggle monthly/annual */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={cn("text-sm", !annual ? "text-ink" : "text-ink-muted")}>
            Bulanan
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors duration-200",
              annual ? "bg-accent-blue" : "bg-surface-2"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200",
                annual && "translate-x-5"
              )}
            />
          </button>
          <span className={cn("text-sm", annual ? "text-ink" : "text-ink-muted")}>
            Tahunan
            <span className="ml-1 text-success text-xs">(hemat 20%)</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const displayPrice = annual && plan.price !== "Rp 0"
              ? `Rp ${parseInt(plan.price.replace(/\D/g, "")) * 12 * 0.8}`
              : plan.price;
            const displayPeriod = annual ? "/tahun" : plan.period;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-xl border p-6 flex flex-col",
                  plan.popular
                    ? "bg-surface-2 border-accent-blue/30"
                    : "bg-surface-1 border-hairline/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent-blue text-white border-0 text-[11px] px-3">
                      Terpopuler
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-medium text-ink mb-1">{plan.name}</h2>
                  <p className="text-sm text-ink-muted mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-medium text-ink">
                      {plan.price === "Rp 0" ? "Gratis" : displayPrice}
                    </span>
                    {plan.price !== "Rp 0" && (
                      <span className="text-sm text-ink-muted">{displayPeriod}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <Check size={16} className="text-success shrink-0" />
                      ) : (
                        <X size={16} className="text-ink-muted/40 shrink-0" />
                      )}
                      <span className={feature.included ? "text-ink" : "text-ink-muted/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => router.push(plan.href)}
                  className="w-full"
                  variant={plan.popular ? "default" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-xl font-medium text-ink mb-4">Ada pertanyaan?</h2>
          <p className="text-sm text-ink-muted mb-6">
            Email kami di <a href="mailto:hello@jualan-ai.com" className="text-accent-blue hover:underline">hello@jualan-ai.com</a>
          </p>
          <a href="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
