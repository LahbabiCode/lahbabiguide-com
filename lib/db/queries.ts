import { prisma } from "./prisma";
import { ContentStatus } from "@prisma/client";
import {
  FALLBACK_TOOL_CATEGORIES,
  FALLBACK_TOOLS,
  FALLBACK_CREDIT_CATEGORIES,
  FALLBACK_CREDITS,
  FALLBACK_DIRECTORY_CATEGORIES,
  FALLBACK_DIRECTORY_ITEMS,
  FALLBACK_BLOG_CATEGORIES,
  FALLBACK_BLOG_POSTS,
  FALLBACK_GUIDES,
  FALLBACK_COMPARISONS,
  FallbackTool,
  FallbackCredit,
  FallbackCategory,
  FallbackCreditCategory,
  FallbackDirectoryCategory,
  FallbackDirectoryItem,
  FallbackBlogCategory,
  FallbackBlogPost,
  FallbackGuide,
  FallbackComparison,
  FALLBACK_AD_PLACEMENTS,
  FallbackAdPlacement,
  FALLBACK_BEST_PAGES,
  FALLBACK_PRICING_PAGES,
  FALLBACK_CREDIT_CLUSTER_PAGES,
  FALLBACK_BEST_PAGES_V2,
  FALLBACK_PRICING_PAGES_V2,
  FALLBACK_CREDIT_CLUSTER_PAGES_V2,
  FallbackMoneyPage,
  FallbackPricingPage,
  FallbackCreditClusterPage,
  FALLBACK_PRODUCTS,
  FallbackDigitalProduct,
} from "./fallbackData";

import { unstable_cache } from "next/cache";

export const getAdPlacements = unstable_cache(
  async (): Promise<FallbackAdPlacement[]> => {
    try {
      const ads = await prisma.adPlacement.findMany();
      if (ads.length > 0) {
        return ads.map((ad: any) => ({
          id: ad.id,
          key: ad.key,
          name: ad.name,
          slotId: ad.slotId,
          format: ad.format,
          layoutKey: ad.layoutKey,
          enabled: ad.enabled,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getAdPlacements:", error);
    }
    return FALLBACK_AD_PLACEMENTS;
  },
  ["ad-placements"],
  { revalidate: 3600, tags: ["ads"] }
);

export async function getAggregateRating(targetId: string, targetType: string) {
  try {
    const aggregate = await prisma.rating.aggregate({
      _avg: { score: true },
      _count: { score: true },
      where: { targetId, targetType },
    });
    return {
      average: aggregate?._avg?.score || 0,
      count: aggregate?._count?.score || 0,
    };
  } catch (error) {
    console.error("Aggregate rating error:", error);
    return { average: 0, count: 0 };
  }
}

export const getToolCategories = unstable_cache(
  async (): Promise<FallbackCategory[]> => {
    try {
      const categories = await prisma.toolCategory.findMany({
        orderBy: { order: "asc" },
      });
      if (categories.length > 0) {
        return categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          order: c.order,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getToolCategories:", error);
    }
    return FALLBACK_TOOL_CATEGORIES;
  },
  ["tool-categories"],
  { revalidate: 3600, tags: ["tools"] }
);

export const getTools = unstable_cache(
  async (): Promise<FallbackTool[]> => {
    try {
      const tools = await prisma.tool.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { order: "asc" },
      });
      if (tools.length > 0) {
        return tools.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          description: t.description,
          componentKey: t.componentKey || "",
          categoryId: t.categoryId,
          tags: t.tags,
          order: t.order,
          status: "PUBLISHED",
          seoTitle: t.seoTitle || `${t.name} | Free Developer Tool`,
          seoDescription: t.seoDescription || t.description,
          faqJson: (t.faqJson as { q: string; a: string }[]) || [],
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getTools:", error);
    }
    return FALLBACK_TOOLS;
  },
  ["tools-list"],
  { revalidate: 3600, tags: ["tools"] }
);

export const getToolBySlug = async (slug: string): Promise<FallbackTool | null> => {
  const tools = await getTools();
  return tools.find((t) => t.slug === slug) || null;
};

// --- STARTUP CREDITS QUERIES ---

export const getCreditCategories = unstable_cache(
  async (): Promise<FallbackCreditCategory[]> => {
    try {
      const categories = await prisma.creditCategory.findMany({
        orderBy: { order: "asc" },
      });
      if (categories.length > 0) {
        return categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          order: c.order,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getCreditCategories:", error);
    }
    return FALLBACK_CREDIT_CATEGORIES;
  },
  ["credit-categories"],
  { revalidate: 3600, tags: ["credits"] }
);

export const getCredits = unstable_cache(
  async (): Promise<FallbackCredit[]> => {
    try {
      const credits = await prisma.startupCredit.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { order: "asc" },
      });
      if (credits.length > 0) {
        return credits.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          company: c.company,
          logo: c.logo || "",
          creditValue: c.creditValue,
          shortDescription: c.shortDescription,
          fullDescription: c.fullDescription,
          eligibility: c.eligibility,
          claimSteps: c.claimSteps,
          officialUrl: c.officialUrl,
          countries: c.countries,
          tags: c.tags,
          status: "PUBLISHED",
          order: c.order,
          seoTitle: c.seoTitle || c.name,
          seoDescription: c.seoDescription || c.shortDescription,
          faqJson: (c.faqJson as { q: string; a: string }[]) || [],
          categoryId: c.categoryId,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getCredits:", error);
    }
    return FALLBACK_CREDITS;
  },
  ["credits-list"],
  { revalidate: 3600, tags: ["credits"] }
);

export const getCreditBySlug = async (slug: string): Promise<FallbackCredit | null> => {
  const credits = await getCredits();
  return credits.find((c) => c.slug === slug) || null;
};

// --- DEVELOPER PLATFORMS DIRECTORY QUERIES ---

export const getDirectoryCategories = unstable_cache(
  async (): Promise<FallbackDirectoryCategory[]> => {
    try {
      const categories = await prisma.directoryCategory.findMany({
        orderBy: { order: "asc" },
      });
      if (categories.length > 0) {
        return categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          order: c.order,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getDirectoryCategories:", error);
    }
    return FALLBACK_DIRECTORY_CATEGORIES;
  },
  ["directory-categories"],
  { revalidate: 3600, tags: ["directory"] }
);

export const getDirectoryItems = unstable_cache(
  async (): Promise<FallbackDirectoryItem[]> => {
    try {
      const items = await prisma.directoryItem.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { order: "asc" },
      });
      if (items.length > 0) {
        return items.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          fullDescription: c.fullDescription,
          features: c.features,
          pros: c.pros,
          cons: c.cons,
          alternatives: c.alternatives,
          pricingModel: c.pricingModel,
          hasFreePlan: c.hasFreePlan,
          officialUrl: c.officialUrl,
          logoUrl: c.logoUrl,
          status: "PUBLISHED",
          order: c.order,
          seoTitle: c.seoTitle || c.name,
          seoDescription: c.seoDescription || c.description,
          faqJson: (c.faqJson as { q: string; a: string }[]) || [],
          categoryId: c.categoryId,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getDirectoryItems:", error);
    }
    return FALLBACK_DIRECTORY_ITEMS;
  },
  ["directory-items-list"],
  { revalidate: 3600, tags: ["directory"] }
);

export const getDirectoryItemBySlug = async (slug: string): Promise<FallbackDirectoryItem | null> => {
  const items = await getDirectoryItems();
  return items.find((c) => c.slug === slug) || null;
};

// --- BLOG & GUIDES & COMPARISONS QUERIES ---

export const getBlogCategories = unstable_cache(
  async (): Promise<FallbackBlogCategory[]> => {
    try {
      const categories = await prisma.blogCategory.findMany();
      if (categories.length > 0) {
        return categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getBlogCategories:", error);
    }
    return FALLBACK_BLOG_CATEGORIES;
  },
  ["blog-categories"],
  { revalidate: 3600, tags: ["blog"] }
);

export const getBlogPosts = unstable_cache(
  async (): Promise<FallbackBlogPost[]> => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { createdAt: "desc" },
      });
      if (posts.length > 0) {
        return posts.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          content: p.content,
          featuredImage: p.featuredImage,
          status: "PUBLISHED",
          categoryId: p.categoryId,
          tags: p.tags,
          seoTitle: p.seoTitle || p.title,
          seoDescription: p.seoDescription || "",
          faqJson: (p.faqJson as { q: string; a: string }[]) || [],
          createdAt: p.createdAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getBlogPosts:", error);
    }
    return FALLBACK_BLOG_POSTS;
  },
  ["blog-posts-list"],
  { revalidate: 3600, tags: ["blog"] }
);

export const getBlogPostBySlug = async (slug: string): Promise<FallbackBlogPost | null> => {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
};

export const getGuides = unstable_cache(
  async (): Promise<FallbackGuide[]> => {
    try {
      const guides = await prisma.guide.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { createdAt: "desc" },
      });
      if (guides.length > 0) {
        return guides.map((g: any) => ({
          id: g.id,
          title: g.title,
          slug: g.slug,
          content: g.content,
          status: "PUBLISHED",
          seoTitle: g.seoTitle || g.title,
          seoDescription: g.seoDescription || "",
          faqJson: (g.faqJson as { q: string; a: string }[]) || [],
          createdAt: g.createdAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getGuides:", error);
    }
    return FALLBACK_GUIDES;
  },
  ["guides-list"],
  { revalidate: 3600, tags: ["guides"] }
);

export const getGuideBySlug = async (slug: string): Promise<FallbackGuide | null> => {
  const guides = await getGuides();
  return guides.find((g) => g.slug === slug) || null;
};

export const getComparisons = unstable_cache(
  async (): Promise<FallbackComparison[]> => {
    try {
      const comparisons = await prisma.comparison.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { createdAt: "desc" },
      });
      if (comparisons.length > 0) {
        return comparisons.map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          content: c.content,
          tags: c.tags,
          status: "PUBLISHED",
          seoTitle: c.seoTitle || c.title,
          seoDescription: c.seoDescription || "",
          faqJson: (c.faqJson as { q: string; a: string }[]) || [],
          createdAt: c.createdAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn("Database fallback activated for getComparisons:", error);
    }
    return FALLBACK_COMPARISONS;
  },
  ["comparisons-list"],
  { revalidate: 3600, tags: ["comparisons"] }
);

export const getComparisonBySlug = async (slug: string): Promise<FallbackComparison | null> => {
  const comps = await getComparisons();
  return comps.find((c) => c.slug === slug) || null;
};

export const getBestPages = unstable_cache(
  async (): Promise<FallbackMoneyPage[]> => [...FALLBACK_BEST_PAGES, ...FALLBACK_BEST_PAGES_V2],
  ["best-pages-list"],
  { revalidate: 3600, tags: ["best"] }
);

export const getBestPageBySlug = async (slug: string): Promise<FallbackMoneyPage | null> => {
  const pages = await getBestPages();
  return pages.find((p) => p.slug === slug) || null;
};

export const getPricingPages = unstable_cache(
  async (): Promise<FallbackPricingPage[]> => [...FALLBACK_PRICING_PAGES, ...FALLBACK_PRICING_PAGES_V2],
  ["pricing-pages-list"],
  { revalidate: 3600, tags: ["pricing"] }
);

export const getPricingPageBySlug = async (slug: string): Promise<FallbackPricingPage | null> => {
  const pages = await getPricingPages();
  return pages.find((p) => p.slug === slug) || null;
};

export const getCreditClusterPages = unstable_cache(
  async (): Promise<FallbackCreditClusterPage[]> => [...FALLBACK_CREDIT_CLUSTER_PAGES, ...FALLBACK_CREDIT_CLUSTER_PAGES_V2],
  ["credit-cluster-pages-list"],
  { revalidate: 3600, tags: ["credit-clusters"] }
);

export const getCreditClusterPageBySlug = async (slug: string): Promise<FallbackCreditClusterPage | null> => {
  const pages = await getCreditClusterPages();
  return pages.find((p) => p.slug === slug) || null;
};

export const getProducts = unstable_cache(
  async (): Promise<FallbackDigitalProduct[]> => FALLBACK_PRODUCTS,
  ["products-list"],
  { revalidate: 3600, tags: ["products"] }
);

export const getProductBySlug = async (slug: string): Promise<FallbackDigitalProduct | null> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
};

