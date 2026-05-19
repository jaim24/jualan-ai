import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, SYSTEM_PROMPT_JSON, buildUserPrompt } from "@/lib/prompts";
import type { FormData } from "@/types";
import type { SectionData } from "@/types/sections";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body: FormData = await request.json();
    const outputFormat = (body as FormData & { format?: string }).format || "json";

    // 2. Validate required fields
    if (!body.product_name || !body.description || !body.category || !body.price) {
      return NextResponse.json(
        { error: "Field produk wajib diisi lengkap." },
        { status: 400 }
      );
    }
    if (!body.benefits || !body.target_audience || !body.problem_solved) {
      return NextResponse.json(
        { error: "Field manfaat dan target wajib diisi." },
        { status: 400 }
      );
    }
    if (!body.cta_text) {
      return NextResponse.json(
        { error: "Teks tombol CTA wajib diisi." },
        { status: 400 }
      );
    }

    // 3. Get user session from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored in route handlers
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 4. Check if free user exceeded limit
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, pages_generated")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "free" && profile.pages_generated >= 1) {
      return NextResponse.json(
        { error: "Kuota gratis habis. Upgrade ke Starter untuk membuat lebih banyak halaman." },
        { status: 403 }
      );
    }

    // 5. Send prompt to Groq API
    console.log("Generating landing page for:", body.product_name, "format:", outputFormat);

    const systemPrompt = outputFormat === "json" ? SYSTEM_PROMPT_JSON : SYSTEM_PROMPT;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildUserPrompt(body) },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiContent = chatCompletion.choices[0]?.message?.content;

    if (!aiContent) {
      return NextResponse.json(
        { error: "AI gagal generate halaman. Coba lagi." },
        { status: 500 }
      );
    }

    // 6. Process output based on format
    let htmlContent = "";
    let sections: SectionData[] | null = null;

    if (outputFormat === "json") {
      // Parse JSON sections from AI
      try {
        // Clean potential markdown code blocks
        const cleanJson = aiContent
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();

        const parsed = JSON.parse(cleanJson);
        sections = parsed.sections || parsed;

        // Generate HTML from sections for backward compatibility
        htmlContent = generateHtmlFromSections(sections!, body);
      } catch (parseError) {
        console.error("JSON parse error, falling back to HTML:", parseError);
        // Fallback: treat as HTML if JSON parsing fails
        htmlContent = aiContent;
      }
    } else {
      htmlContent = aiContent;
    }

    // 7. Save to database
    const formDataWithSections = sections
      ? { ...body, sections }
      : body;

    const { data: landingPage, error: dbError } = await supabase
      .from("landing_pages")
      .insert({
        user_id: user.id,
        title: body.product_name,
        product_name: body.product_name,
        niche: body.category,
        html_content: htmlContent,
        form_data: formDataWithSections,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Gagal menyimpan halaman. Coba lagi." },
        { status: 500 }
      );
    }

    // 8. Update pages_generated count
    await supabase
      .from("profiles")
      .update({ pages_generated: (profile?.pages_generated || 0) + 1 })
      .eq("id", user.id);

    console.log("Landing page created:", landingPage.id);

    return NextResponse.json({
      id: landingPage.id,
      html: htmlContent,
      sections,
      success: true,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}

/**
 * Generate a basic HTML page from JSON sections for backward compatibility
 * (export/download and legacy preview)
 */
function generateHtmlFromSections(sections: SectionData[], formData: FormData): string {
  const color = formData.color === "ungu" ? "#6a4cf5"
    : formData.color === "biru" ? "#0099ff"
    : formData.color === "hijau" ? "#22c55e"
    : formData.color === "oranye" ? "#ff7a3d"
    : "#1c1c1c";

  let body = "";

  for (const section of sections) {
    switch (section.type) {
      case "hero":
        body += `
    <section class="py-20 px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">${section.title}</h1>
        ${section.subtitle ? `<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">${section.subtitle}</p>` : ""}
        ${section.buttonText ? `<a href="${section.buttonLink || "#"}" class="inline-block px-8 py-3 text-white rounded-full font-medium" style="background-color: ${color}">${section.buttonText}</a>` : ""}
        ${section.imageUrl ? `<img src="${section.imageUrl}" alt="${section.title}" class="mt-12 w-full max-w-3xl mx-auto rounded-2xl shadow-xl" />` : ""}
      </div>
    </section>`;
        break;

      case "features":
        body += `
    <section class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        ${section.title ? `<h2 class="text-3xl font-bold text-center text-gray-900 mb-4">${section.title}</h2>` : ""}
        ${section.subtitle ? `<p class="text-center text-gray-600 mb-12">${section.subtitle}</p>` : ""}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${section.items.map((item) => `
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            ${item.icon ? `<span class="text-3xl block mb-4">${item.icon}</span>` : ""}
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
            <p class="text-sm text-gray-600">${item.description}</p>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
        break;

      case "pricing":
        body += `
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-5xl mx-auto">
        ${section.title ? `<h2 class="text-3xl font-bold text-center text-gray-900 mb-12">${section.title}</h2>` : ""}
        <div class="grid grid-cols-1 md:grid-cols-${section.tiers.length} gap-6">
          ${section.tiers.map((tier) => `
          <div class="p-6 rounded-2xl ${tier.highlighted ? "bg-purple-600 text-white shadow-xl" : "bg-white border border-gray-200"}">
            <h3 class="text-xl font-bold mb-2">${tier.name}</h3>
            <div class="text-3xl font-bold mb-4">${tier.price}</div>
            <ul class="space-y-2 mb-6">
              ${tier.features.map((f) => `<li class="text-sm flex items-center gap-2"><span>✓</span>${f}</li>`).join("")}
            </ul>
            <a href="#" class="block w-full py-2.5 text-center rounded-full font-medium ${tier.highlighted ? "bg-white text-purple-600" : "text-white"}" style="${!tier.highlighted ? `background-color: ${color}` : ""}">${tier.buttonText || "Pilih Plan"}</a>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
        break;

      case "testimonials":
        body += `
    <section class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        ${section.title ? `<h2 class="text-3xl font-bold text-center text-gray-900 mb-12">${section.title}</h2>` : ""}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${section.items.map((item) => `
          <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p class="text-sm text-gray-600 italic mb-4">"${item.content}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style="background-color: ${color}">${item.name.charAt(0)}</div>
              <div>
                <p class="text-sm font-medium text-gray-900">${item.name}</p>
                ${item.role ? `<p class="text-xs text-gray-500">${item.role}</p>` : ""}
              </div>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
        break;

      case "cta":
        body += `
    <section class="py-16 px-4">
      <div class="max-w-3xl mx-auto text-center rounded-3xl p-12" style="background-color: ${color}">
        <h2 class="text-3xl font-bold text-white mb-4">${section.title}</h2>
        ${section.subtitle ? `<p class="text-white/80 mb-8">${section.subtitle}</p>` : ""}
        ${section.buttonText ? `<a href="${section.buttonLink || "#"}" class="inline-block px-8 py-3 bg-white rounded-full font-medium" style="color: ${color}">${section.buttonText}</a>` : ""}
      </div>
    </section>`;
        break;

      case "footer":
        body += `
    <footer class="py-12 px-4 border-t border-gray-200">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        ${section.brand ? `<span class="text-lg font-bold text-gray-900">${section.brand}</span>` : ""}
        ${section.links ? `<nav class="flex gap-6">${section.links.map((l) => `<a href="${l.href}" class="text-sm text-gray-500 hover:text-gray-900">${l.label}</a>`).join("")}</nav>` : ""}
        ${section.copyright ? `<p class="text-xs text-gray-400">${section.copyright}</p>` : ""}
      </div>
    </footer>`;
        break;
    }
  }

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.product_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  ${body}
</body>
</html>`;
}
