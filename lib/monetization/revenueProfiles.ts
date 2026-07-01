export type RevenueLevel = "low" | "medium" | "high" | "very-high";

export interface RevenueProfile {
  level: RevenueLevel;
  maxAdUnits: number;
  positions: AdPosition[];
  ctaStrategy: string;
  internalLinkTargets: string[];
}

export type AdPosition =
  | "after-intro"
  | "mid-content"
  | "after-faq"
  | "sidebar"
  | "multiplex-end"
  | "after-content";

export type PageType =
  | "tool"
  | "credit"
  | "directory"
  | "compare"
  | "blog"
  | "guide"
  | "best"
  | "pricing"
  | "alternatives"
  | "credit-cluster"
  | "static";

export const REVENUE_PROFILES: Record<PageType, RevenueProfile> = {
  tool: {
    level: "low",
    maxAdUnits: 2,
    positions: ["after-content", "multiplex-end"],
    ctaStrategy: "drive-to-best",
    internalLinkTargets: ["/best/free-developer-tools", "/tools", "/credits"],
  },
  credit: {
    level: "high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "comparison-and-alternatives",
    internalLinkTargets: ["/compare", "/best/free-cloud-credits", "/startup-credits/cloud-hosting"],
  },
  directory: {
    level: "high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "alternatives-and-pricing",
    internalLinkTargets: ["/best/vercel-alternatives", "/pricing", "/compare"],
  },
  compare: {
    level: "very-high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "pricing-and-signup",
    internalLinkTargets: ["/pricing", "/credits", "/best"],
  },
  blog: {
    level: "medium",
    maxAdUnits: 3,
    positions: ["after-intro", "mid-content", "multiplex-end"],
    ctaStrategy: "link-to-credits-and-tools",
    internalLinkTargets: ["/credits", "/tools", "/best"],
  },
  guide: {
    level: "medium",
    maxAdUnits: 3,
    positions: ["after-intro", "mid-content", "multiplex-end"],
    ctaStrategy: "link-to-tools-and-credits",
    internalLinkTargets: ["/tools", "/credits", "/directory"],
  },
  best: {
    level: "high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "directory-and-affiliate",
    internalLinkTargets: ["/directory", "/credits", "/compare"],
  },
  pricing: {
    level: "very-high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "alternatives-and-compare",
    internalLinkTargets: ["/compare", "/best", "/directory"],
  },
  alternatives: {
    level: "very-high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "pricing-and-compare",
    internalLinkTargets: ["/pricing", "/compare", "/directory"],
  },
  "credit-cluster": {
    level: "high",
    maxAdUnits: 5,
    positions: ["after-intro", "mid-content", "after-faq", "sidebar", "multiplex-end"],
    ctaStrategy: "credit-detail-and-apply",
    internalLinkTargets: ["/credits", "/compare", "/best"],
  },
  static: {
    level: "low",
    maxAdUnits: 1,
    positions: ["multiplex-end"],
    ctaStrategy: "link-to-main-sections",
    internalLinkTargets: ["/tools", "/credits", "/directory"],
  },
};

export function getRevenueProfile(pageType: PageType): RevenueProfile {
  return REVENUE_PROFILES[pageType] || REVENUE_PROFILES.static;
}

export function shouldShowAd(pageType: PageType, position: AdPosition): boolean {
  const profile = getRevenueProfile(pageType);
  return profile.positions.includes(position);
}
