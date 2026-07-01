import { NextResponse } from "next/server";
import {
  getTools,
  getCredits,
  getDirectoryItems,
  getBlogPosts,
  getGuides,
  getComparisons,
  getBestPages,
  getPricingPages,
  getCreditClusterPages,
} from "@/lib/db/queries";
import { getRevenueProfile } from "@/lib/monetization/revenueProfiles";

export const dynamic = "force-dynamic";

function scorePage(pageType: keyof ReturnType<typeof getRevenueProfile> | string, contentLength: number): number {
  const profile = getRevenueProfile(pageType as any);
  const base = { low: 25, medium: 50, high: 75, "very-high": 90 }[profile.level] || 30;
  const lengthBonus = Math.min(20, Math.floor(contentLength / 500));
  return Math.min(100, base + lengthBonus);
}

export async function GET() {
  const [tools, credits, platforms, posts, guides, comps, best, pricing, clusters] = await Promise.all([
    getTools(),
    getCredits(),
    getDirectoryItems(),
    getBlogPosts(),
    getGuides(),
    getComparisons(),
    getBestPages(),
    getPricingPages(),
    getCreditClusterPages(),
  ]);

  const items: { url: string; pageType: string; monetizationScore: number; estimatedCpcBand: string }[] = [];

  tools.forEach(t => items.push({ url: `https://lahbabiguide.com/tools/${t.slug}`, pageType: "tool", monetizationScore: scorePage("tool", t.description.length), estimatedCpcBand: "$0.30-0.80" }));
  credits.forEach(c => items.push({ url: `https://lahbabiguide.com/credits/${c.slug}`, pageType: "credit", monetizationScore: scorePage("credit", c.fullDescription.length), estimatedCpcBand: "$2-8" }));
  platforms.forEach(p => items.push({ url: `https://lahbabiguide.com/directory/${p.slug}`, pageType: "directory", monetizationScore: scorePage("directory", p.fullDescription.length), estimatedCpcBand: "$2-6" }));
  posts.forEach(p => items.push({ url: `https://lahbabiguide.com/blog/${p.slug}`, pageType: "blog", monetizationScore: scorePage("blog", p.content.length), estimatedCpcBand: "$0.50-2" }));
  guides.forEach(g => items.push({ url: `https://lahbabiguide.com/guides/${g.slug}`, pageType: "guide", monetizationScore: scorePage("guide", g.content.length), estimatedCpcBand: "$0.50-2" }));
  comps.forEach(c => items.push({ url: `https://lahbabiguide.com/compare/${c.slug}`, pageType: "compare", monetizationScore: scorePage("compare", c.content.length), estimatedCpcBand: "$3-12" }));
  best.forEach(b => items.push({ url: `https://lahbabiguide.com/best/${b.slug}`, pageType: "best", monetizationScore: scorePage("best", b.intro.length + b.items.length * 200), estimatedCpcBand: "$2-8" }));
  pricing.forEach(p => items.push({ url: `https://lahbabiguide.com/pricing/${p.slug}`, pageType: "pricing", monetizationScore: scorePage("pricing", p.freePlan.length + p.paidPlans.join("").length), estimatedCpcBand: "$3-15" }));
  clusters.forEach(c => items.push({ url: `https://lahbabiguide.com/startup-credits/${c.slug}`, pageType: "credit-cluster", monetizationScore: scorePage("credit-cluster", c.intro.length), estimatedCpcBand: "$2-6" }));

  items.sort((a, b) => b.monetizationScore - a.monetizationScore);

  return NextResponse.json({
    ok: true,
    total: items.length,
    topMoney: items.slice(0, 10),
    all: items,
  });
}
