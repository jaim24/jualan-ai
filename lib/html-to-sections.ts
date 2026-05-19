/**
 * Utility to convert raw HTML landing page content into structured JSON sections.
 * This is used to migrate existing html_content from the database into the new
 * section-based format.
 */

import type { SectionData } from "@/types/sections";

/**
 * Parse HTML string and extract sections based on common patterns.
 * This is a best-effort parser — results may need manual adjustment.
 */
export function htmlToSections(html: string): SectionData[] {
  const sections: SectionData[] = [];

  // Extract text content helper
  function extractText(str: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "gi");
    const match = regex.exec(str);
    return match ? match[1].trim() : "";
  }

  function extractAllText(str: string, tag: string): string[] {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "gi");
    const results: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match[1].trim()) results.push(match[1].trim());
    }
    return results;
  }

  // Split HTML into section blocks
  const sectionBlocks = html.split(/<section[^>]*>/gi).filter(Boolean);

  // If no sections found, try to parse as a single page
  if (sectionBlocks.length <= 1) {
    // Extract hero from first h1
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const buttonMatch = html.match(/<a[^>]*>([\s\S]*?)<\/a>/i);

    if (h1Match) {
      sections.push({
        type: "hero",
        title: h1Match[1].replace(/<[^>]*>/g, "").trim(),
        subtitle: firstP ? firstP[1].replace(/<[^>]*>/g, "").trim() : undefined,
        buttonText: buttonMatch ? buttonMatch[1].replace(/<[^>]*>/g, "").trim() : undefined,
      });
    }

    // Extract features from lists or repeated patterns
    const h3s = extractAllText(html, "h3");
    const ps = extractAllText(html, "p");

    if (h3s.length >= 2) {
      const items = h3s.slice(0, 6).map((title, i) => ({
        title,
        description: ps[i + 1] || "",
      }));

      sections.push({
        type: "features",
        title: "Fitur Utama",
        items,
      });
    }

    // Add a CTA section
    const lastButton = html.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi);
    if (lastButton && lastButton.length > 1) {
      const ctaMatch = lastButton[lastButton.length - 1].match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
      if (ctaMatch) {
        sections.push({
          type: "cta",
          title: "Siap Memulai?",
          subtitle: "Dapatkan akses sekarang",
          buttonText: ctaMatch[2].replace(/<[^>]*>/g, "").trim(),
          buttonLink: ctaMatch[1],
        });
      }
    }

    // Add footer
    sections.push({
      type: "footer",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
    });

    return sections;
  }

  // Parse each section block
  for (const block of sectionBlocks) {
    const h1 = extractText(block, "h1");
    const h2 = extractText(block, "h2");
    const h3s = extractAllText(block, "h3");
    const ps = extractAllText(block, "p");

    // Hero detection: has h1
    if (h1 && sections.length === 0) {
      sections.push({
        type: "hero",
        title: h1,
        subtitle: ps[0] || undefined,
        buttonText: extractText(block, "a") || undefined,
      });
      continue;
    }

    // Features detection: has multiple h3s
    if (h3s.length >= 2) {
      const items = h3s.map((title, i) => ({
        title,
        description: ps[i] || "",
      }));

      sections.push({
        type: "features",
        title: h2 || "Fitur",
        items,
      });
      continue;
    }

    // Pricing detection: contains price-like text
    if (block.match(/Rp|IDR|\$|\/bulan|\/month/i)) {
      sections.push({
        type: "pricing",
        title: h2 || "Harga",
        tiers: [
          {
            name: h3s[0] || "Basic",
            price: ps.find((p) => p.match(/Rp|IDR|\$/)) || "Rp 0",
            features: ps.filter((p) => !p.match(/Rp|IDR|\$/)).slice(0, 5),
          },
        ],
      });
      continue;
    }

    // CTA detection: short section with button
    if (h2 && ps.length <= 2 && block.includes("<a")) {
      sections.push({
        type: "cta",
        title: h2,
        subtitle: ps[0] || undefined,
        buttonText: extractText(block, "a") || "Mulai Sekarang",
      });
      continue;
    }

    // Footer detection
    if (block.includes("footer") || block.includes("©")) {
      sections.push({
        type: "footer",
        copyright: ps.find((p) => p.includes("©")) || `© ${new Date().getFullYear()}`,
      });
      continue;
    }
  }

  // Ensure at least a footer exists
  if (!sections.find((s) => s.type === "footer")) {
    sections.push({
      type: "footer",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
    });
  }

  return sections;
}
