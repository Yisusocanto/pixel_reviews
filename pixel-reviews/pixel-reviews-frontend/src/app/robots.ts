import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://pixel-reviews.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/settings/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
