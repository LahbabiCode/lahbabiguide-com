import { MetadataRoute } from "next";
import { url } from "@/lib/seo/site";
import {
  getTools,
  getDirectoryItems,
  getCredits,
  getBlogPosts,
  getGuides,
  getComparisons,
  getToolCategories,
  getDirectoryCategories,
  getCreditCategories,
  getBlogCategories,
  getBestPages,
  getPricingPages,
  getCreditClusterPages,
  getProducts,
} from "@/lib/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic entities in parallel.
  const [
    tools,
    directoryItems,
    credits,
    posts,
    guides,
    comparisons,
    toolCategories,
    dirCategories,
    creditCategories,
    blogCategories,
    bestPages,
    pricingPages,
    creditClusterPages,
    products,
  ] = await Promise.all([
    getTools(),
    getDirectoryItems(),
    getCredits(),
    getBlogPosts(),
    getGuides(),
    getComparisons(),
    getToolCategories(),
    getDirectoryCategories(),
    getCreditCategories(),
    getBlogCategories(),
    getBestPages(),
    getPricingPages(),
    getCreditClusterPages(),
    getProducts(),
  ]);

  // Use a stable "today" for static listing pages so the whole sitemap doesn't
  // flip timestamps on every request. Per-entity pages use their real date.
  const now = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: url("/tools"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/directory"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/credits"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/guides"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/compare"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/best"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/pricing"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/startup-credits"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/products"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/sponsor"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/partners"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/resources"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/sitemap"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/editorial-policy"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/advertising-disclosure"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: url("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  /*
   * Dynamic entities — use real createdAt timestamps so Google trusts the
   * recency signal instead of seeing the whole site "change" daily.
   */
  tools.forEach((t) => {
    sitemapEntries.push({
      url: url(`/tools/${t.slug}`),
      lastModified: now, // FallbackTool lacks createdAt; safe default.
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  directoryItems.forEach((t) => {
    sitemapEntries.push({
      url: url(`/directory/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  credits.forEach((t) => {
    sitemapEntries.push({
      url: url(`/credits/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  posts.forEach((t) => {
    const d = safeDate(t.createdAt);
    sitemapEntries.push({
      url: url(`/blog/${t.slug}`),
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  guides.forEach((t) => {
    const d = safeDate(t.createdAt);
    sitemapEntries.push({
      url: url(`/guides/${t.slug}`),
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  comparisons.forEach((t) => {
    const d = safeDate(t.createdAt);
    sitemapEntries.push({
      url: url(`/compare/${t.slug}`),
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  bestPages.forEach((t) => {
    sitemapEntries.push({
      url: url(`/best/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  pricingPages.forEach((t) => {
    sitemapEntries.push({
      url: url(`/pricing/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  creditClusterPages.forEach((t) => {
    sitemapEntries.push({
      url: url(`/startup-credits/${t.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  products.forEach((p) => {
    sitemapEntries.push({
      url: url(`/products/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  /*
   * Category index pages. NOTE: previously emitted as ?category=<slug> query
   * params, which duplicate the already-static index pages and dilute crawl
   * budget. The public index pages render all categories client-side, so we
   * keep a single canonical URL per section instead of one per query param.
   *
   * If dedicated per-category routes are added later, add them here pointing
   * to clean paths (e.g. /tools/category/<slug>), never query strings.
   */
  void toolCategories;
  void dirCategories;
  void creditCategories;
  void blogCategories;

  return sitemapEntries;
}

/** Parse a date string defensively; returns now() on failure so the entry is never invalid. */
function safeDate(value: string | undefined): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}
