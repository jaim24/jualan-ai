interface FooterProps {
  brand?: string;
  links?: { label: string; href: string }[];
  copyright?: string;
}

export default function FooterSection({ brand, links, copyright }: FooterProps) {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-gray-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {brand && (
          <span className="text-lg font-bold text-gray-900">{brand}</span>
        )}
        {links && links.length > 0 && (
          <nav className="flex flex-wrap items-center gap-6">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
        {copyright && (
          <p className="text-xs text-gray-400">{copyright}</p>
        )}
      </div>
    </footer>
  );
}
