import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jualan-ai-4uqh-euxls73yn-zaim24s-projects.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/preview", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
