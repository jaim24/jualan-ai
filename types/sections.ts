export interface HeroSectionData {
  type: "hero";
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesSectionData {
  type: "features";
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
}

export interface PricingTier {
  name: string;
  price: string;
  description?: string;
  features: string[];
  buttonText?: string;
  highlighted?: boolean;
}

export interface PricingSectionData {
  type: "pricing";
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
}

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}

export interface TestimonialsSectionData {
  type: "testimonials";
  title?: string;
  items: Testimonial[];
}

export interface CTASectionData {
  type: "cta";
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface FooterSectionData {
  type: "footer";
  brand?: string;
  links?: { label: string; href: string }[];
  copyright?: string;
}

export interface StatsSectionData {
  type: "stats";
  title?: string;
  items: { value: string; label: string; icon?: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionData {
  type: "faq";
  title?: string;
  items: FAQItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface TeamSectionData {
  type: "team";
  title?: string;
  items: TeamMember[];
}

export interface ContactSectionData {
  type: "contact";
  title?: string;
  subtitle?: string;
  email?: string;
  buttonText?: string;
}

export interface LogoCloudSectionData {
  type: "logo-cloud";
  title?: string;
  logos: { src: string; alt: string; href?: string }[];
}

export type SectionData =
  | HeroSectionData
  | FeaturesSectionData
  | PricingSectionData
  | TestimonialsSectionData
  | CTASectionData
  | FooterSectionData
  | StatsSectionData
  | FAQSectionData
  | TeamSectionData
  | ContactSectionData
  | LogoCloudSectionData;
