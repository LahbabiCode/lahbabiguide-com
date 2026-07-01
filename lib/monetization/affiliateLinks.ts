// Real affiliate program placeholders.
// Replace each value with your actual affiliate link from the partner dashboard.
// All labels include "(affiliate)" suffix for AdSense-policy compliance.

export interface AffiliateLink {
  href: string;
  label: string;
  programName: string;
  isAffiliate: boolean;
  disclosureNote: string;
}

// ===== Public affiliate dashboards =====
// Vercel:        https://vercel.com/affiliates
// Render:        https://render.com/affiliate
// DigitalOcean: https://www.digitalocean.com/partners/affiliate
// Railway:       https://railway.com/partners
// Supabase:      https://supabase.com/affiliates
// Neon:          https://neon.tech/affiliate

const AFFILIATE_AFFILIATES: Record<string, string> = {
  // Replace empty strings with your real affiliate URLs once approved.
  vercel: "https://vercel.com/?utm_source=lahbabiguide-affiliate",
  render: "https://render.com/?utm_source=lahbabiguide-affiliate",
  digitalocean: "https://www.digitalocean.com/?refcode=lahbabiguide-affiliate",
  railway: "https://railway.com/?utm_source=lahbabiguide-affiliate",
  supabase: "https://supabase.com/?utm_source=lahbabiguide-affiliate",
  neon: "https://neon.tech/?utm_source=lahbabiguide-affiliate",
  planetscale: "https://planetscale.com/?utm_source=lahbabiguide-affiliate",
  cloudflare: "https://www.cloudflare.com/?utm_source=lahbabiguide-affiliate",
};

const FALLBACK_LINKS: Record<string, string> = {
  vercel: "https://vercel.com",
  render: "https://render.com",
  digitalocean: "https://www.digitalocean.com",
  railway: "https://railway.com",
  supabase: "https://supabase.com",
  neon: "https://neon.tech",
  planetscale: "https://planetscale.com",
  cloudflare: "https://www.cloudflare.com",
};

const AFFILIATE_DISCLOSURE =
  "Some links on this page may be affiliate links. LahbabiGuide may earn a commission at no extra cost to you.";

function buildLink(platform: string, slug: string): { href: string; isAffiliate: boolean } {
  const real = AFFILIATE_AFFILIATES[platform];
  if (real) return { href: real, isAffiliate: true };
  return { href: `${FALLBACK_LINKS[platform] || "#"}${slug ? `?utm_source=lahbabiguide` : ""}`, isAffiliate: false };
}

export function getAffiliateLinksForPage(
  pageType: string,
  slug: string
): AffiliateLink[] {
  const links: AffiliateLink[] = [];

  const push = (platform: string, label: string) => {
    const link = buildLink(platform, slug);
    links.push({
      href: link.href,
      label: `${label}${link.isAffiliate ? " (affiliate)" : ""}`,
      programName: platform.charAt(0).toUpperCase() + platform.slice(1),
      isAffiliate: link.isAffiliate,
      disclosureNote: AFFILIATE_DISCLOSURE,
    });
  };

  if (pageType === "pricing") {
    if (slug === "vercel-pricing") push("vercel", "Sign up for Vercel");
    if (slug === "render-pricing") push("render", "Sign up for Render");
    if (slug === "neon-pricing") push("neon", "Sign up for Neon Postgres");
    if (slug === "railway-pricing") push("railway", "Sign up for Railway");
    if (slug === "digitalocean-pricing") push("digitalocean", "Sign up for DigitalOcean");
    if (slug === "supabase-pricing") push("supabase", "Sign up for Supabase");
  }

  if (pageType === "best") {
    if (slug === "vercel-alternatives" || slug === "best-railway-alternatives") push("render", "Render");
    if (slug === "supabase-alternatives") push("neon", "Neon Postgres");
    if (slug === "free-cloud-credits") push("digitalocean", "DigitalOcean Hatch");
    if (slug === "firebase-alternatives") push("supabase", "Supabase");
    if (slug === "free-postgres-hosting") push("neon", "Neon Postgres");
  }

  if (pageType === "credit-cluster" && slug === "cloud-hosting") {
    push("digitalocean", "DigitalOcean");
  }

  if (pageType === "directory") {
    if (slug === "vercel") push("vercel", "Vercel");
    if (slug === "render") push("render", "Render");
    if (slug === "neon-postgres") push("neon", "Neon Postgres");
    if (slug === "supabase") push("supabase", "Supabase");
    if (slug === "planetscale") push("planetscale", "PlanetScale");
  }

  return links;
}

export const GLOBAL_AFFILIATE_DISCLOSURE = AFFILIATE_DISCLOSURE;
