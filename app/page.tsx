import { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Jualan AI — Buat Landing Page Produk Digital dengan AI",
  description:
    "Buat landing page produk digitalmu dalam 30 detik. Cukup ceritakan produkmu, AI langsung buatkan halaman penjualan yang menarik. Tanpa coding, tanpa desain.",
  keywords: [
    "landing page generator",
    "AI landing page",
    "buat landing page",
    "landing page produk digital",
    "jualan online",
    "landing page Indonesia",
  ],
  openGraph: {
    title: "Jualan AI — Buat Landing Page Produk Digital dengan AI",
    description:
      "Buat landing page produk digitalmu dalam 30 detik. Tanpa coding, tanpa desain.",
    url: "https://jualan-ai-4uqh-euxls73yn-zaim24s-projects.vercel.app",
    siteName: "Jualan AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jualan AI - AI Landing Page Generator",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jualan AI — Buat Landing Page Produk Digital dengan AI",
    description:
      "Buat landing page produk digitalmu dalam 30 detik. Tanpa coding, tanpa desain.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://jualan-ai-4uqh-euxls73yn-zaim24s-projects.vercel.app",
  },
};

// Static SEO content rendered server-side for crawlers
export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Jualan AI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "AI Landing Page Generator untuk konten kreator Indonesia. Buat landing page produk digital dalam 30 detik.",
            offers: [
              {
                "@type": "Offer",
                name: "Gratis",
                price: "0",
                priceCurrency: "IDR",
              },
              {
                "@type": "Offer",
                name: "Starter",
                price: "49000",
                priceCurrency: "IDR",
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "149000",
                priceCurrency: "IDR",
              },
            ],
          }),
        }}
      />

      {/* Visually hidden SEO content for crawlers */}
      <div className="sr-only">
        <h1>Jualan AI - Buat Landing Page Produk Digital dengan AI</h1>
        <p>
          Jualan AI adalah platform AI Landing Page Generator untuk konten
          kreator Indonesia. Buat landing page produk digital seperti e-book,
          kursus online, template, preset foto, webinar, dan jasa freelance
          dalam 30 detik. Tanpa coding, tanpa desain.
        </p>
        <h2>Cara Kerja</h2>
        <ol>
          <li>Isi form singkat tentang produkmu</li>
          <li>AI generate landing page dalam detik</li>
          <li>Preview, edit, lalu publish atau download</li>
        </ol>
        <h2>Harga</h2>
        <ul>
          <li>Gratis: 1 landing page, download HTML, preview dan edit</li>
          <li>Starter Rp49.000/bulan: 10 landing page, custom domain</li>
          <li>Pro Rp149.000/bulan: Unlimited landing page, prioritas AI, analytics</li>
        </ul>
      </div>

      {/* Client-rendered animated UI */}
      <HomeClient />
    </>
  );
}
