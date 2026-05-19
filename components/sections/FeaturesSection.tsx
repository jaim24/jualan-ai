interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
}

export default function FeaturesSection({ title, subtitle, items }: FeaturesProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {item.icon && (
                <span className="text-3xl block mb-4">{item.icon}</span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
