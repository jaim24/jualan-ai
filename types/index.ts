export interface FormData {
  // Step 1 — Informasi Produk
  product_name: string;
  description: string;
  category: string;
  price: string;
  product_image: string; // URL gambar dari Supabase Storage

  // Step 2 — Manfaat & Target
  benefits: string;
  target_audience: string;
  problem_solved: string;

  // Step 3 — Gaya & CTA
  style: string;
  cta_text: string;
  cta_link: string;
  color: string;
}

export interface LandingPage {
  id: string;
  user_id: string;
  title: string;
  product_name: string;
  niche: string | null;
  html_content: string;
  form_data: FormData | null;
  is_published: boolean;
  slug: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  plan: "free" | "starter" | "pro";
  pages_generated: number;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  sections: SectionTemplate[];
  is_published: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface SectionTemplate {
  type: string;
  default_data: Record<string, unknown>;
  locked: boolean;
  order: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  template_count: number;
  created_at: string;
}

export interface GenerateResponse {
  id: string;
  html: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
}

export interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalTemplates: number;
  totalUsers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "create" | "publish" | "edit" | "delete";
  message: string;
  user_name: string | null;
  created_at: string;
}
