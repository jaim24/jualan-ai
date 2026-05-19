import type { SectionData } from "@/types/sections";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import FooterSection from "@/components/sections/FooterSection";

interface SectionRendererProps {
  sections: SectionData[];
}

function StatsSection({ data }: { data: Extract<SectionData, { type: "stats" }> }) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{data.title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items.map((item, i) => (
            <div key={i} className="text-center">
              {item.icon && <span className="text-3xl block mb-2">{item.icon}</span>}
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: Extract<SectionData, { type: "faq" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{data.title}</h2>
        )}
        <div className="space-y-4">
          {data.items.map((item, i) => (
            <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                {item.question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 pt-0 text-sm text-gray-600">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ data }: { data: Extract<SectionData, { type: "team" }> }) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{data.title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                {item.name.charAt(0)}
              </div>
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: Extract<SectionData, { type: "contact" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h2>
        )}
        {data.subtitle && <p className="text-gray-600 mb-8">{data.subtitle}</p>}
        {data.email && (
          <a href={`mailto:${data.email}`} className="text-xl text-purple-600 font-medium">
            {data.email}
          </a>
        )}
        {data.buttonText && (
          <div className="mt-6">
            <a
              href={`mailto:${data.email || "#"}`}
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
            >
              {data.buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <div className="bg-white min-h-screen">
      {sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={index} {...section} />;
          case "features":
            return <FeaturesSection key={index} {...section} />;
          case "pricing":
            return <PricingSection key={index} {...section} />;
          case "testimonials":
            return <TestimonialsSection key={index} {...section} />;
          case "cta":
            return <CTASection key={index} {...section} />;
          case "footer":
            return <FooterSection key={index} {...section} />;
          case "stats":
            return <StatsSection key={index} data={section} />;
          case "faq":
            return <FAQSection key={index} data={section} />;
          case "team":
            return <TeamSection key={index} data={section} />;
          case "contact":
            return <ContactSection key={index} data={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
