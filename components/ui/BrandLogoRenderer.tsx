"use client";

import React, { useState } from "react";
import { BrandEvo } from "@/lib/brand-logos";
import { getBrandData, domainFromUrl } from "@/lib/brand-data";

// Google's favicon service only serves crisp icons at these fixed sizes;
// requesting an in-between size (e.g. sz=100) silently returns a blurry
// 16x16 placeholder instead of a 4xx, so we always snap up to one of these.
const FAVICON_BUCKETS = [32, 64, 128, 256];

function faviconSizeFor(displaySize: number): number {
  const target = displaySize * 2; // fetch at 2x for retina screens
  return FAVICON_BUCKETS.find((b) => b >= target) ?? 256;
}

interface BrandLogoRendererProps {
  companyName: string;
  /** The record's real official URL (e.g. credit.officialUrl / item.officialUrl).
   *  When provided, the real logo is resolved from this domain instead of
   *  guessing one from the display name. */
  officialUrl?: string;
  size?: number;
  className?: string;
}

/**
 * BrandLogoRenderer
 *
 * مكون موحد لعرض شعار أي شركة.
 * يجلب الشعار الحقيقي للنطاق عبر خدمة Google للأيقونات (لا يحتاج مفتاح API،
 * وتعمل بشكل حي بعكس Clearbit Logo API التي توقفت). عند فشل التحميل فقط
 * يرجع لأيقونة الحرف كحل احتياطي أخير.
 *
 * مثال:
 * <BrandLogoRenderer companyName="AWS Activate" officialUrl={credit.officialUrl} size={48} />
 */
export function BrandLogoRenderer({ companyName, officialUrl, size = 40, className = "" }: BrandLogoRendererProps) {
  const [failed, setFailed] = useState(false);
  const dimStyle = { width: size, height: size, borderRadius: size * 0.25 };

  if (!failed) {
    const brand = getBrandData(companyName || "Unknown");
    const domain = (officialUrl && domainFromUrl(officialUrl)) || brand.domain;
    const logoSrc = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${faviconSizeFor(size)}`;

    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-white flex items-center justify-center ${className}`}
        style={dimStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt={`${companyName || "Company"} logo`}
          width={size}
          height={size}
          loading="lazy"
          className="w-full h-full object-contain p-[15%]"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  const { color } = BrandEvo.getLogo(companyName || "Unknown");

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={dimStyle}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className="block"
      >
        <rect width="48" height="48" rx="8" fill={color} />
        <text
          x="24" y="24"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="20"
        >
          {(companyName || "?").charAt(0).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

export { BrandEvo } from "@/lib/brand-logos";
