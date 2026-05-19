interface HeroProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

export default function HeroSection({ title, subtitle, buttonText, buttonLink, imageUrl }: HeroProps) {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonLink || "#"}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
          >
            {buttonText}
          </a>
        )}
        {imageUrl && (
          <div className="mt-12">
            <img
              src={imageUrl}
              alt={title}
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
