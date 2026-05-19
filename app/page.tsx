export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-canvas/80 backdrop-blur-md border-b border-hairline-soft">
        <span className="text-lg font-medium tracking-[-1px] text-ink">
          Jualan AI
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Mulai Gratis
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-40 pb-24 px-6">
        <span className="inline-block mb-6 px-4 py-2 text-xs font-medium tracking-[-0.12px] text-ink-muted bg-surface-1 rounded-full border border-hairline">
          Gratis untuk 1 landing page pertama
        </span>
        <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-[85px] font-medium leading-[0.95] tracking-[-4.25px] text-ink mb-6">
          Buat Landing Page Produk Digitalmu dalam 30 Detik
        </h1>
        <p className="max-w-2xl text-lg leading-[1.3] tracking-[-0.18px] text-ink-muted mb-10">
          Cukup ceritakan produkmu, AI kami langsung buatkan halaman penjualan
          yang menarik. Tanpa coding, tanpa desain.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/generate"
            className="px-6 py-3 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Coba Gratis Sekarang
          </a>
          <a
            href="#contoh"
            className="px-6 py-3 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            Lihat Contoh
          </a>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-24 px-6">
        <h2 className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-16">
          Cara Kerja
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-8 bg-surface-1 rounded-[20px]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-violet text-2xl mb-5">
              📝
            </div>
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-3">
              Isi Form Singkat
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted">
              Ceritakan nama produk, manfaat, harga, dan target pembelimu.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-8 bg-surface-1 rounded-[20px]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-magenta text-2xl mb-5">
              ⚡
            </div>
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-3">
              AI Generate dalam Detik
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted">
              AI kami langsung membuat landing page lengkap dengan copywriting
              persuasif.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-8 bg-surface-1 rounded-[20px]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-orange text-2xl mb-5">
              🚀
            </div>
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-3">
              Preview, Edit & Publish
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted">
              Lihat hasilnya, edit sesuai keinginan, lalu download atau publish
              langsung.
            </p>
          </div>
        </div>
      </section>

      {/* Niche yang Didukung */}
      <section id="contoh" className="py-24 px-6">
        <h2 className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-6">
          Cocok untuk Semua Niche
        </h2>
        <p className="text-center text-lg leading-[1.3] tracking-[-0.18px] text-ink-muted mb-16 max-w-2xl mx-auto">
          Apapun produk digitalmu, Jualan AI bisa buatkan landing page yang
          menjual.
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "E-book", gradient: "bg-gradient-violet" },
            { name: "Kursus Online", gradient: "bg-gradient-magenta" },
            { name: "Template Notion", gradient: "bg-gradient-orange" },
            { name: "Preset Foto", gradient: "bg-gradient-coral" },
            { name: "Webinar", gradient: "bg-gradient-violet" },
            { name: "Jasa Freelance", gradient: "bg-gradient-magenta" },
          ].map((item) => (
            <div
              key={item.name}
              className={`relative overflow-hidden p-6 rounded-[20px] ${item.gradient} bg-opacity-20`}
              style={{
                background: `linear-gradient(135deg, ${
                  item.gradient === "bg-gradient-violet"
                    ? "#6a4cf5"
                    : item.gradient === "bg-gradient-magenta"
                    ? "#d44df0"
                    : item.gradient === "bg-gradient-orange"
                    ? "#ff7a3d"
                    : "#ff5577"
                }22, transparent)`,
              }}
            >
              <div className="border border-hairline rounded-[15px] p-6 text-center bg-surface-1/50 backdrop-blur-sm">
                <span className="text-[15px] font-medium tracking-[-0.15px] text-ink">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <h2 className="text-center text-4xl md:text-[62px] font-medium leading-[1] tracking-[-3.1px] text-ink mb-6">
          Harga Sederhana
        </h2>
        <p className="text-center text-lg leading-[1.3] tracking-[-0.18px] text-ink-muted mb-16 max-w-2xl mx-auto">
          Mulai gratis, upgrade kapan saja.
        </p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gratis */}
          <div className="flex flex-col p-6 bg-surface-1 rounded-[20px]">
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
              Gratis
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted mb-6">
              Untuk mencoba
            </p>
            <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
              Rp0
              <span className="text-sm text-ink-muted font-normal">/bulan</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 text-[14px] leading-[1.4] tracking-[-0.14px] text-ink-muted">
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
              className="mt-auto px-6 py-3 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-2 rounded-full text-center hover:bg-hairline transition-colors"
            >
              Mulai Gratis
            </a>
          </div>

          {/* Starter */}
          <div className="flex flex-col p-6 bg-surface-2 rounded-[20px] border border-hairline relative">
            <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-gradient-violet text-white rounded-full">
              Populer
            </span>
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
              Starter
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted mb-6">
              Untuk kreator aktif
            </p>
            <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
              Rp49rb
              <span className="text-sm text-ink-muted font-normal">/bulan</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 text-[14px] leading-[1.4] tracking-[-0.14px] text-ink-muted">
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
              className="mt-auto px-6 py-3 text-sm font-medium tracking-[-0.14px] text-black bg-white rounded-full text-center hover:bg-white/90 transition-colors"
            >
              Pilih Starter
            </a>
          </div>

          {/* Pro */}
          <div className="flex flex-col p-6 bg-surface-1 rounded-[20px]">
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-[-0.8px] text-ink mb-2">
              Pro
            </h3>
            <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted mb-6">
              Untuk bisnis serius
            </p>
            <div className="text-4xl font-medium tracking-[-1px] text-ink mb-6">
              Rp149rb
              <span className="text-sm text-ink-muted font-normal">/bulan</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 text-[14px] leading-[1.4] tracking-[-0.14px] text-ink-muted">
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
              className="mt-auto px-6 py-3 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-2 rounded-full text-center hover:bg-hairline transition-colors"
            >
              Pilih Pro
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-hairline-soft">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-lg font-medium tracking-[-1px] text-ink">
            Jualan AI
          </span>
          <div className="flex items-center gap-6 text-[13px] font-medium tracking-[-0.13px] text-ink-muted">
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
          <p className="text-[12px] tracking-[-0.12px] text-ink-muted">
            © 2026 Jualan AI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
