"use client";

import { useEffect, useState, useRef } from "react";
import { FallbackAdPlacement } from "@/lib/db/fallbackData";

interface AdPlacementRendererProps {
  placementKey: string;
}

// Global cache to avoid multiple redundant calls to the API within the same page load.
let cachedAdsPromise: Promise<FallbackAdPlacement[]> | null = null;
let cachedAds: FallbackAdPlacement[] | null = null;

export function AdPlacementRenderer({ placementKey }: AdPlacementRendererProps) {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [config, setConfig] = useState<FallbackAdPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch configs
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAds() {
      try {
        if (cachedAds) {
          if (isMounted) processAds(cachedAds);
          return;
        }
        
        if (!cachedAdsPromise) {
          cachedAdsPromise = fetch('/api/ads').then(res => res.json());
        }
        
        const data = await cachedAdsPromise;
        cachedAds = data;
        if (isMounted) processAds(data);
      } catch (err) {
        console.error("Failed to load ad configurations:", err);
        if (isMounted) setLoading(false);
      }
    }

    function processAds(ads: FallbackAdPlacement[]) {
      const placement = ads.find(a => a.key === placementKey);
      if (placement) {
        setConfig(placement);
      }
      setLoading(false);
    }
    
    fetchAds();
    
    return () => { isMounted = false; };
  }, [placementKey]);

  // Auto-init AdSense window arrays once loaded in browser thread, only if config is ready and enabled
  useEffect(() => {
    if (loading || !config || !config.enabled) return;

    let timeoutId: NodeJS.Timeout;
    if (typeof window !== "undefined") {
      timeoutId = setTimeout(() => {
        try {
          if (containerRef.current && containerRef.current.offsetWidth >= 200) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        } catch (err) {
          // Safe console check bypassing production crash triggers
        }
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [loading, config]);

  if (!adsEnabled || loading || !config || !config.enabled) return null;

  return (
    <div ref={containerRef} className="w-full my-6 select-none bg-slate-50 border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800 rounded-lg p-3 text-center">
      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
        Advertisement
      </span>

      {/* Production Google AdSense Unit Container */}
      <div className="flex justify-center items-center overflow-hidden min-h-[90px] w-full">
        {/* AdSense ins frame */}
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minWidth: "250px", minHeight: "90px" }}
          data-ad-client="ca-pub-6564248523089374"
          data-ad-slot={config.slotId}
          data-ad-format={config.format}
          {...(config.layoutKey ? { "data-ad-layout-key": config.layoutKey } : {})}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
