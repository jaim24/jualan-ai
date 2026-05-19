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
          default:
            return null;
        }
      })}
    </div>
  );
}
