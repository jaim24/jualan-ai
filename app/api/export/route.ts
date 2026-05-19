import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { cleanHtml, generateFilename } from "@/lib/export";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 1. Validate id
    if (!id) {
      return NextResponse.json(
        { error: "Parameter id wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Check session
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
              // Ignored
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

    // 3. Fetch landing page
    const { data: landingPage } = await supabase
      .from("landing_pages")
      .select("html_content, product_name, user_id, created_at")
      .eq("id", id)
      .single();

    if (!landingPage) {
      return NextResponse.json(
        { error: "Halaman tidak ditemukan." },
        { status: 404 }
      );
    }

    // 4. Check ownership
    if (landingPage.user_id !== user.id) {
      return NextResponse.json(
        { error: "Kamu tidak memiliki akses ke halaman ini." },
        { status: 403 }
      );
    }

    // 5. Inject meta tags
    let html = cleanHtml(landingPage.html_content);
    const metaTags = `
    <meta name="generator" content="Jualan AI - AI Landing Page Generator">
    <meta name="created-at" content="${landingPage.created_at}">`;

    html = html.replace("</head>", `${metaTags}\n</head>`);

    // 6. Return as downloadable file
    const filename = generateFilename(landingPage.product_name);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
