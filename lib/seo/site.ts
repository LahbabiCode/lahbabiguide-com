/**
 * Centralized site configuration.
 *
 * Every SEO-critical URL (canonical, og:url, sitemap, JSON-LD, internal links)
 * MUST resolve through these helpers so the canonical origin can never drift
 * across the codebase. The value is sourced from NEXT_PUBLIC_SITE_URL so it can
 * be overridden per-environment (staging, preview, production) without code
 * changes.
 */

function normalizeUrl(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  // Trim trailing slash for consistent joining; url() re-adds it where needed.
  return raw.replace(/\/+$/, "");
}

const FALLBACK_SITE_URL = "https://lahbabiguide.com";

/** Canonical site origin without a trailing slash, e.g. "https://lahbabiguide.com". */
export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
  FALLBACK_SITE_URL
);

/** Absolute URL builder. Pass a path starting with "/" (or "" for the origin). */
export function url(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

export const SITE_NAME = "LahbabiGuide";

export const SITE_DESCRIPTION =
  "LahbabiGuide is a curated directory of free browser-based developer tools, verified startup credits, cloud grants, SaaS discounts, and objective platform comparisons for founders and software engineers.";

export const SITE_OG_IMAGE = "/og/default.svg";

/** AdSense publisher client id. Not secret — published on every page. */
export const ADSENSE_CLIENT_ID = "ca-pub-6564248523089374";

/** Canonical locale config used in metadata + hreflang. */
export const SITE_LOCALE = "en_US";
