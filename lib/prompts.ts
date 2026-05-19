export const SYSTEM_PROMPT = `Kamu adalah ahli copywriting dan web designer Indonesia. 
Tugasmu adalah membuat landing page HTML yang lengkap dan siap publish 
berdasarkan informasi produk yang diberikan.

Output harus berupa HANYA kode HTML lengkap (dari <!DOCTYPE html> sampai </html>).
Jangan tambahkan penjelasan, markdown, atau teks apapun selain HTML.

Gunakan Tailwind CSS via CDN untuk styling.
Struktur landing page yang harus dibuat:
1. Header dengan nama produk dan tagline
2. Hero section dengan headline kuat dan deskripsi
3. Bagian "Apa yang Kamu Dapat" (3-5 benefit dengan ikon emoji)
4. Bagian "Untuk Siapa Produk Ini" (target audiens)
5. Bagian harga dengan tombol CTA yang mencolok
6. Footer sederhana

Gunakan bahasa Indonesia yang natural dan persuasif.
Sesuaikan warna dan gaya dengan preferensi yang diberikan.
Pastikan halaman mobile-responsive.`;

export function buildUserPrompt(data: {
  product_name: string;
  category: string;
  description: string;
  price: string;
  product_image: string;
  benefits: string;
  target_audience: string;
  problem_solved: string;
  style: string;
  color: string;
  cta_text: string;
  cta_link: string;
}): string {
  let prompt = `Buat landing page untuk produk berikut:

Nama produk: ${data.product_name}
Kategori: ${data.category}
Deskripsi: ${data.description}
Harga: Rp ${data.price}
Manfaat utama:
${data.benefits}
Target pembeli: ${data.target_audience}
Masalah yang diselesaikan: ${data.problem_solved}
Gaya visual: ${data.style}
Warna utama: ${data.color}
Teks tombol CTA: ${data.cta_text}
Link CTA: ${data.cta_link || "#"}`;

  if (data.product_image) {
    prompt += `\nGambar produk (gunakan sebagai src di tag img di hero section): ${data.product_image}`;
  }

  return prompt;
}
