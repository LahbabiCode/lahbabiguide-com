import { MetadataRoute } from "next";
import { url } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/*?category=*"],
    },
    // Include the canonical host so crawlers always find the authoritative sitemap.
    host: url("/"),
    sitemap: url("/sitemap.xml"),
  };
}
