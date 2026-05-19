import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { FormData } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body: FormData = await request.json();

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
    console.log("Generating landing page for:", body.product_name);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(body) },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const htmlContent = chatCompletion.choices[0]?.message?.content;

    if (!htmlContent) {
      return NextResponse.json(
        { error: "AI gagal generate halaman. Coba lagi." },
        { status: 500 }
      );
    }

    // 6. Save to database
    const { data: landingPage, error: dbError } = await supabase
      .from("landing_pages")
      .insert({
        user_id: user.id,
        title: body.product_name,
        product_name: body.product_name,
        niche: body.category,
        html_content: htmlContent,
        form_data: body,
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

    // 7. Update pages_generated count
    await supabase
      .from("profiles")
      .update({ pages_generated: (profile?.pages_generated || 0) + 1 })
      .eq("id", user.id);

    console.log("Landing page created:", landingPage.id);

    return NextResponse.json({
      id: landingPage.id,
      html: htmlContent,
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
