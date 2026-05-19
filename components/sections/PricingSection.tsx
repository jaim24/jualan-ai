interface PricingTier {
  name: string;
  price: string;
  description?: string;
  features: string[];
  buttonText?: string;
  highlighted?: boolean;
}

interface PricingProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
}

export default function PricingSection({ title, subtitle, tiers }: PricingProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`flex flex-col p-6 rounded-2xl ${
                tier.highlighted
                  ? "bg-purple-600 text-white shadow-xl scale-105"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className={`text-xl font-bold mb-1 ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                {tier.name}
              </h3>
              {tier.description && (
                <p className={`text-sm mb-4 ${tier.highlighted ? "text-purple-100" : "text-gray-500"}`}>
                  {tier.description}
                </p>
              )}
              <div className={`text-3xl font-bold mb-6 ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                {tier.price}
              </div>
              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${tier.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                    <span className={tier.highlighted ? "text-white" : "text-green-500"}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`w-full py-2.5 text-center text-sm font-medium rounded-full transition-colors ${
                  tier.highlighted
                    ? "bg-white text-purple-600 hover:bg-gray-100"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {tier.buttonText || "Pilih Plan"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
