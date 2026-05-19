"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-canvas/60 backdrop-blur-xl border-b border-hairline-soft"
      >
        <span className="text-lg font-medium tracking-[-1px] text-ink">
          Jualan AI
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2.5 text-sm font-medium text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="px-4 py-2.5 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Mulai Gratis
          </a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      >
        {/* Animated gradient background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
            style={{ background: "radial-gradient(circle, #6a4cf5, transparent)" }}
          />
          <motion.div
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 30, -30, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-25 blur-[100px]"
            style={{ background: "radial-gradient(circle, #d44df0, transparent)" }}
          />
          <motion.div
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -20, 40, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full opacity-20 blur-[100px]"
            style={{ background: "radial-gradient(circle, #ff7a3d, transparent)" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 text-xs font-medium text-ink-muted bg-surface-1/80 backdrop-blur-sm rounded-full border border-hairline"
          >
            ✨ Gratis untuk 1 landing page pertama
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="max-w-4xl text-5xl md:text-7xl lg:text-[85px] font-medium leading-[0.95] tracking-[-4.25px] text-ink mb-6"
          >
            Buat Landing Page Produk Digitalmu dalam{" "}
            <span className="bg-gradient-to-r from-gradient-violet via-gradient-magenta to-gradient-orange bg-clip-text text-transparent">
              30 Detik
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg leading-[1.3] tracking-[-0.18px] text-ink-muted mb-10"
          >
            Cukup ceritakan produkmu, AI kami langsung buatkan halaman penjualan
            yang menarik. Tanpa coding, tanpa desain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="/generate"
              className="group relative px-8 py-3.5 text-sm font-medium text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">Coba Gratis Sekarang</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gradient-violet to-gradient-magenta opacity-0 group-hover:opacity-10 transition-opacity" />
            </a>
            <a
              href="#contoh"
              className="px-8 py-3.5 text-sm font-medium text-ink bg-surface-1/80 backdrop-blur-sm border border-hairline rounded-full hover:bg-surface-2 transition-colors"
            >
              Lihat Contoh
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-ink-muted/30 rounded-full flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 bg-ink-muted rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Cara Kerja */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #262626, transparent)" }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-4"
          >
            Cara Kerja
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-center text-lg text-ink-muted mb-16 max-w-xl mx-auto"
          >
            Tiga langkah sederhana untuk landing page yang menjual
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📝",
                title: "Isi Form Singkat",
                desc: "Ceritakan nama produk, manfaat, harga, dan target pembelimu.",
                gradient: "from-gradient-violet to-gradient-violet/50",
              },
              {
                icon: "⚡",
                title: "AI Generate dalam Detik",
                desc: "AI kami langsung membuat landing page lengkap dengan copywriting persuasif.",
                gradient: "from-gradient-magenta to-gradient-magenta/50",
              },
              {
                icon: "🚀",
                title: "Preview, Edit & Publish",
                desc: "Lihat hasilnya, edit sesuai keinginan, lalu download atau publish langsung.",
                gradient: "from-gradient-orange to-gradient-orange/50",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative flex flex-col items-center text-center p-8 bg-surface-1 rounded-[20px] border border-hairline/50 overflow-hidden"
              >
                {/* Hover gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-surface-2 text-2xl mb-5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.4] text-ink-muted">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Niche yang Didukung */}
      <section id="contoh" className="py-32 px-6 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #262626, transparent)" }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-4"
          >
            Cocok untuk Semua Niche
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-center text-lg text-ink-muted mb-16 max-w-2xl mx-auto"
          >
            Apapun produk digitalmu, Jualan AI bisa buatkan landing page yang menjual.
          </motion.p>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "E-book", icon: "📚", color: "#6a4cf5" },
              { name: "Kursus Online", icon: "🎓", color: "#d44df0" },
              { name: "Template Notion", icon: "📋", color: "#ff7a3d" },
              { name: "Preset Foto", icon: "📸", color: "#ff5577" },
              { name: "Webinar", icon: "🎥", color: "#6a4cf5" },
              { name: "Jasa Freelance", icon: "💼", color: "#d44df0" },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="relative p-6 rounded-[20px] bg-surface-1 border border-hairline/50 text-center overflow-hidden group cursor-default"
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
                  style={{ background: `radial-gradient(circle at center, ${item.color}, transparent)` }}
                />
                <div className="relative z-10">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <span className="text-[15px] font-medium text-ink">
                    {item.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #262626, transparent)" }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-4"
          >
            Harga Sederhana
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-center text-lg text-ink-muted mb-16 max-w-2xl mx-auto"
          >
            Mulai gratis, upgrade kapan saja.
          </motion.p>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gratis */}
            <motion.div
              variants={fadeUp}
              custom={2}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col p-6 bg-surface-1 rounded-[20px] border border-hairline/50"
            >
              <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
                Gratis
              </h3>
              <p className="text-[15px] text-ink-muted mb-6">Untuk mencoba</p>
              <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
                Rp0
                <span className="text-sm text-ink-muted font-normal">/bulan</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 text-[14px] text-ink-muted">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> 1 landing page
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Download HTML
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Preview & edit
                </li>
              </ul>
              <a
                href="/register"
                className="mt-auto px-6 py-3 text-sm font-medium text-ink bg-surface-2 rounded-full text-center hover:bg-hairline transition-colors"
              >
                Mulai Gratis
              </a>
            </motion.div>

            {/* Starter */}
            <motion.div
              variants={fadeUp}
              custom={3}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col p-6 rounded-[20px] border relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #1c1c1c 0%, #141414 100%)",
                borderColor: "#6a4cf5",
              }}
            >
              {/* Glow effect */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-20 blur-[60px]" style={{ background: "#6a4cf5" }} />
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-gradient-violet text-white rounded-full">
                Populer
              </span>
              <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
                Starter
              </h3>
              <p className="text-[15px] text-ink-muted mb-6">Untuk kreator aktif</p>
              <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
                Rp49rb
                <span className="text-sm text-ink-muted font-normal">/bulan</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 text-[14px] text-ink-muted">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> 10 landing page
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Download HTML
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Preview & edit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Custom domain
                </li>
              </ul>
              <a
                href="/register"
                className="mt-auto px-6 py-3 text-sm font-medium text-black bg-white rounded-full text-center hover:bg-white/90 transition-colors"
              >
                Pilih Starter
              </a>
            </motion.div>

            {/* Pro */}
            <motion.div
              variants={fadeUp}
              custom={4}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col p-6 bg-surface-1 rounded-[20px] border border-hairline/50"
            >
              <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
                Pro
              </h3>
              <p className="text-[15px] text-ink-muted mb-6">Untuk bisnis serius</p>
              <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
                Rp149rb
                <span className="text-sm text-ink-muted font-normal">/bulan</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 text-[14px] text-ink-muted">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Unlimited landing page
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Download HTML
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Preview & edit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Custom domain
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Prioritas AI (Claude)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Analytics
                </li>
              </ul>
              <a
                href="/register"
                className="mt-auto px-6 py-3 text-sm font-medium text-ink bg-surface-2 rounded-full text-center hover:bg-hairline transition-colors"
              >
                Pilih Pro
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #262626, transparent)" }}
        />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-lg font-medium tracking-[-1px] text-ink">
            Jualan AI
          </span>
          <div className="flex items-center gap-6 text-[13px] font-medium text-ink-muted">
            <a href="#" className="hover:text-ink transition-colors">
              Tentang
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Harga
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Kontak
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Kebijakan Privasi
            </a>
          </div>
          <p className="text-[12px] text-ink-muted">
            © 2026 Jualan AI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
