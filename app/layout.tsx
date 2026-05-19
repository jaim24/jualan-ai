import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jualan AI — Buat Landing Page dengan AI",
    template: "%s | Jualan AI",
  },
  description:
    "Buat landing page produk digitalmu dalam 30 detik. Cukup ceritakan produkmu, AI langsung buatkan halaman penjualan yang menarik.",
  metadataBase: new URL(
    "https://jualan-ai-4uqh-euxls73yn-zaim24s-projects.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
