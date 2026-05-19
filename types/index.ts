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
