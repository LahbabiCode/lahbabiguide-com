"use client";

import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { shouldShowAd, type PageType, type AdPosition, getRevenueProfile } from "@/lib/monetization/revenueProfiles";

const POSITION_TO_PLACEMENT_KEY: Record<string, string> = {
  "after-intro": "header-banner",
  "mid-content": "content-middle",
  "after-faq": "content-middle",
  sidebar: "header-banner",
  "multiplex-end": "footer-multiplex",
  "after-content": "content-middle",
};

interface SmartAdSlotProps {
  pageType: PageType;
  position: AdPosition;
  /** Global counter that tracks how many ad units have been rendered so far */
  currentAdCount?: number;
}

/** How many integrated AdPlacementRenderer are also shown on that page type (from layout) */
const BASE_ADS_PER_PAGE: Partial<Record<PageType, number>> = {
  tool: 0,
  credit: 1,  // credit detail has AdPlacementRenderer placements too
  directory: 0,
  compare: 1,
  blog: 1,
  guide: 1,
  best: 1,
  pricing: 1,
  alternatives: 1,
  "credit-cluster": 1,
  static: 0,
};

export function SmartAdSlot({ pageType, position, currentAdCount = 0 }: SmartAdSlotProps) {
  const profile = getRevenueProfile(pageType);
  
  // Check if the ad position is in the allowed positions for this page type
  if (!profile.positions.includes(position)) {
    return null;
  }

  // Enforce maxAdUnits: the check passes only if total ads so far are below the limit
  const baseAds = BASE_ADS_PER_PAGE[pageType] || 0;
  const totalAdCount = currentAdCount + baseAds;
  if (totalAdCount >= profile.maxAdUnits) {
    return null;
  }

  const placementKey = POSITION_TO_PLACEMENT_KEY[position];
  if (!placementKey) return null;

  if (position === "sidebar") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <AdPlacementRenderer placementKey={placementKey} />
      </div>
    );
  }

  if (position === "multiplex-end") {
    return (
      <div className="py-8 border-t border-slate-100 dark:border-slate-800/60">
        <span className="block text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
          Advertisement
        </span>
        <AdPlacementRenderer placementKey={placementKey} />
      </div>
    );
  }

  return <AdPlacementRenderer placementKey={placementKey} />;
}
