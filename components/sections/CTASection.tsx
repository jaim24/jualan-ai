interface CTAProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function CTASection({ title, subtitle, buttonText, buttonLink }: CTAProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center bg-purple-600 rounded-3xl p-10 sm:p-16">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonLink || "#"}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-purple-600 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
