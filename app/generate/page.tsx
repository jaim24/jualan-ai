import GenerateForm from "@/components/GenerateForm";

export default function GeneratePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 h-14 border-b border-hairline-soft">
        <a
          href="/"
          className="text-lg font-medium tracking-[-1px] text-ink"
        >
          Jualan AI
        </a>
        <a
          href="/dashboard"
          className="px-4 py-2.5 text-sm font-medium tracking-[-0.14px] text-ink bg-surface-1 rounded-full hover:bg-surface-2 transition-colors"
        >
          Dashboard
        </a>
      </nav>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-medium leading-[1] tracking-[-1.5px] text-ink mb-3">
            Buat Landing Page Baru
          </h1>
          <p className="text-[15px] leading-[1.3] tracking-[-0.15px] text-ink-muted">
            Isi form di bawah, AI akan generate landing page untukmu.
          </p>
        </div>
        <GenerateForm />
      </main>
    </div>
  );
}
