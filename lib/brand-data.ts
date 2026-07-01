/**
 * AutoPilote Brand Data Layer
 * 
 * This is the canonical source of truth for brand names, domains, and
 * authoritative logos. Every credit, directory item, and tool that mentions
 * a company brand MUST use data from this service.
 * 
 * This enables:
 * 1. Real company logos (not Unsplash placeholders) → higher AdSense CTR
 * 2. Accurate brand domain linking for SEO credibility
 * 3. Automatic brand consistency across the entire platform
 * 
 * Data sources are merged with priority:
 * 1. Clearbit Logo API (primary, for all known companies)
 * 2. Favicon-based fallback (using Google's favicon service)
 * 3. Hardcoded canonical entries (for edge cases)
 */

export interface BrandEntry {
  name: string;
  domain: string;
  logoUrl: string | null;      // Clearbit CDN URL
  fallbackLogoUrl: string;     // Google favicon fallback
  /** Human-readable category for internal classification */
  category: string;
  /** Whether this brand has an official startup credit program on the site */
  hasCreditProgram: boolean;
  /** Primary color for branded fallback icons (hex) */
  brandColor: string;
}

const CLEARBIT_CDN = "https://logo.clearbit.com";
const GOOGLE_FAVICON = "https://www.google.com/s2/favicons";

function clearbitLogo(domain: string): string {
  return `${CLEARBIT_CDN}/${domain}`;
}

function faviconLogo(domain: string): string {
  return `${GOOGLE_FAVICON}?domain=${domain}&sz=128`;
}

/**
 * The canonical brand registry. Add new companies here as the directory grows.
 * Priority: add real logos for high-traffic pages first (AWS, Google, Microsoft, Stripe, Vercel).
 */
const BRAND_REGISTRY: Record<string, BrandEntry> = {
  // === MAJOR CLOUD PROVIDERS ===
  "AWS Activate": {
    name: "AWS Activate",
    domain: "aws.amazon.com",
    logoUrl: clearbitLogo("aws.amazon.com"),
    fallbackLogoUrl: faviconLogo("aws.amazon.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#FF9900",
  },
  "Amazon Web Services": {
    name: "Amazon Web Services",
    domain: "aws.amazon.com",
    logoUrl: clearbitLogo("aws.amazon.com"),
    fallbackLogoUrl: faviconLogo("aws.amazon.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#FF9900",
  },
  "Google for Startups Cloud": {
    name: "Google for Startups",
    domain: "developers.google.com",
    logoUrl: clearbitLogo("google.com"),
    fallbackLogoUrl: faviconLogo("google.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#4285F4",
  },
  "Google Cloud": {
    name: "Google Cloud",
    domain: "cloud.google.com",
    logoUrl: clearbitLogo("cloud.google.com"),
    fallbackLogoUrl: faviconLogo("cloud.google.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#4285F4",
  },
  "Microsoft Founders Hub": {
    name: "Microsoft Founders Hub",
    domain: "microsoft.com",
    logoUrl: clearbitLogo("microsoft.com"),
    fallbackLogoUrl: faviconLogo("microsoft.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#00A4EF",
  },
  "Microsoft Azure": {
    name: "Microsoft Azure",
    domain: "azure.microsoft.com",
    logoUrl: clearbitLogo("azure.microsoft.com"),
    fallbackLogoUrl: faviconLogo("azure.microsoft.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#0078D4",
  },
  "DigitalOcean": {
    name: "DigitalOcean",
    domain: "digitalocean.com",
    logoUrl: clearbitLogo("digitalocean.com"),
    fallbackLogoUrl: faviconLogo("digitalocean.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#0080FF",
  },

  // === STRIPE & PAYMENTS ===
  "Stripe Atlas": {
    name: "Stripe Atlas",
    domain: "stripe.com",
    logoUrl: clearbitLogo("stripe.com"),
    fallbackLogoUrl: faviconLogo("stripe.com"),
    category: "Payments",
    hasCreditProgram: true,
    brandColor: "#635BFF",
  },
  "Stripe": {
    name: "Stripe",
    domain: "stripe.com",
    logoUrl: clearbitLogo("stripe.com"),
    fallbackLogoUrl: faviconLogo("stripe.com"),
    category: "Payments",
    hasCreditProgram: true,
    brandColor: "#635BFF",
  },

  // === DATABASE & BACKEND ===
  "Neon Postgres": {
    name: "Neon",
    domain: "neon.tech",
    logoUrl: clearbitLogo("neon.tech"),
    fallbackLogoUrl: faviconLogo("neon.tech"),
    category: "Database",
    hasCreditProgram: false,
    brandColor: "#00E5BF",
  },
  "Neon": {
    name: "Neon",
    domain: "neon.tech",
    logoUrl: clearbitLogo("neon.tech"),
    fallbackLogoUrl: faviconLogo("neon.tech"),
    category: "Database",
    hasCreditProgram: false,
    brandColor: "#00E5BF",
  },
  "Supabase": {
    name: "Supabase",
    domain: "supabase.com",
    logoUrl: clearbitLogo("supabase.com"),
    fallbackLogoUrl: faviconLogo("supabase.com"),
    category: "Database",
    hasCreditProgram: false,
    brandColor: "#3ECF8E",
  },
  "PlanetScale": {
    name: "PlanetScale",
    domain: "planetscale.com",
    logoUrl: clearbitLogo("planetscale.com"),
    fallbackLogoUrl: faviconLogo("planetscale.com"),
    category: "Database",
    hasCreditProgram: false,
    brandColor: "#FA2F8B",
  },

  // === HOSTING & DEPLOYMENT ===
  "Vercel": {
    name: "Vercel",
    domain: "vercel.com",
    logoUrl: clearbitLogo("vercel.com"),
    fallbackLogoUrl: faviconLogo("vercel.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#000000",
  },
  "Render": {
    name: "Render",
    domain: "render.com",
    logoUrl: clearbitLogo("render.com"),
    fallbackLogoUrl: faviconLogo("render.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#46E3B7",
  },
  "Netlify": {
    name: "Netlify",
    domain: "netlify.com",
    logoUrl: clearbitLogo("netlify.com"),
    fallbackLogoUrl: faviconLogo("netlify.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#00C7B7",
  },
  "Cloudflare": {
    name: "Cloudflare",
    domain: "cloudflare.com",
    logoUrl: clearbitLogo("cloudflare.com"),
    fallbackLogoUrl: faviconLogo("cloudflare.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#F38020",
  },
  "Cloudflare Pages": {
    name: "Cloudflare Pages",
    domain: "cloudflare.com",
    logoUrl: clearbitLogo("cloudflare.com"),
    fallbackLogoUrl: faviconLogo("cloudflare.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#F38020",
  },
  "Railway": {
    name: "Railway",
    domain: "railway.app",
    logoUrl: clearbitLogo("railway.app"),
    fallbackLogoUrl: faviconLogo("railway.app"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#C137A4",
  },
  "Fly.io": {
    name: "Fly.io",
    domain: "fly.io",
    logoUrl: clearbitLogo("fly.io"),
    fallbackLogoUrl: faviconLogo("fly.io"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#9D00FF",
  },
  "Heroku": {
    name: "Heroku",
    domain: "heroku.com",
    logoUrl: clearbitLogo("heroku.com"),
    fallbackLogoUrl: faviconLogo("heroku.com"),
    category: "Hosting",
    hasCreditProgram: false,
    brandColor: "#430098",
  },

  // === SaaS & PRODUCTIVITY ===
  "Notion": {
    name: "Notion",
    domain: "notion.so",
    logoUrl: clearbitLogo("notion.so"),
    fallbackLogoUrl: faviconLogo("notion.so"),
    category: "Productivity",
    hasCreditProgram: true,
    brandColor: "#000000",
  },
  "Retool": {
    name: "Retool",
    domain: "retool.com",
    logoUrl: clearbitLogo("retool.com"),
    fallbackLogoUrl: faviconLogo("retool.com"),
    category: "Low-Code",
    hasCreditProgram: true,
    brandColor: "#4D41D4",
  },
  "Airtable": {
    name: "Airtable",
    domain: "airtable.com",
    logoUrl: clearbitLogo("airtable.com"),
    fallbackLogoUrl: faviconLogo("airtable.com"),
    category: "No-Code",
    hasCreditProgram: true,
    brandColor: "#18BFFF",
  },
  "HubSpot": {
    name: "HubSpot",
    domain: "hubspot.com",
    logoUrl: clearbitLogo("hubspot.com"),
    fallbackLogoUrl: faviconLogo("hubspot.com"),
    category: "CRM",
    hasCreditProgram: true,
    brandColor: "#FF7A59",
  },
  "Zendesk": {
    name: "Zendesk",
    domain: "zendesk.com",
    logoUrl: clearbitLogo("zendesk.com"),
    fallbackLogoUrl: faviconLogo("zendesk.com"),
    category: "CRM",
    hasCreditProgram: false,
    brandColor: "#03363D",
  },

  // === AI & LLM PROVIDERS ===
  "OpenAI": {
    name: "OpenAI",
    domain: "openai.com",
    logoUrl: clearbitLogo("openai.com"),
    fallbackLogoUrl: faviconLogo("openai.com"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#10A37F",
  },
  "Anthropic": {
    name: "Anthropic",
    domain: "anthropic.com",
    logoUrl: clearbitLogo("anthropic.com"),
    fallbackLogoUrl: faviconLogo("anthropic.com"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#544E39",
  },
  "Cohere": {
    name: "Cohere",
    domain: "cohere.com",
    logoUrl: clearbitLogo("cohere.com"),
    fallbackLogoUrl: faviconLogo("cohere.com"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#5B5B5B",
  },
  "Hugging Face": {
    name: "Hugging Face",
    domain: "huggingface.co",
    logoUrl: clearbitLogo("huggingface.co"),
    fallbackLogoUrl: faviconLogo("huggingface.co"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#FFD21E",
  },
  "Replicate": {
    name: "Replicate",
    domain: "replicate.com",
    logoUrl: clearbitLogo("replicate.com"),
    fallbackLogoUrl: faviconLogo("replicate.com"),
    category: "AI",
    hasCreditProgram: false,
    brandColor: "#555555",
  },
  "Groq": {
    name: "Groq",
    domain: "groq.com",
    logoUrl: clearbitLogo("groq.com"),
    fallbackLogoUrl: faviconLogo("groq.com"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#2A2A2A",
  },
  "Together AI": {
    name: "Together AI",
    domain: "together.ai",
    logoUrl: clearbitLogo("together.ai"),
    fallbackLogoUrl: faviconLogo("together.ai"),
    category: "AI",
    hasCreditProgram: true,
    brandColor: "#5B5BFF",
  },

  // === MONITORING & ANALYTICS ===
  "Datadog": {
    name: "Datadog",
    domain: "datadoghq.com",
    logoUrl: clearbitLogo("datadoghq.com"),
    fallbackLogoUrl: faviconLogo("datadoghq.com"),
    category: "Monitoring",
    hasCreditProgram: true,
    brandColor: "#632CA6",
  },
  "New Relic": {
    name: "New Relic",
    domain: "newrelic.com",
    logoUrl: clearbitLogo("newrelic.com"),
    fallbackLogoUrl: faviconLogo("newrelic.com"),
    category: "Monitoring",
    hasCreditProgram: true,
    brandColor: "#1CE783",
  },
  "Sentry": {
    name: "Sentry",
    domain: "sentry.io",
    logoUrl: clearbitLogo("sentry.io"),
    fallbackLogoUrl: faviconLogo("sentry.io"),
    category: "Monitoring",
    hasCreditProgram: false,
    brandColor: "#FF2244",
  },

  // === EMAIL & COMMUNICATIONS ===
  "Mailgun": {
    name: "Mailgun",
    domain: "mailgun.com",
    logoUrl: clearbitLogo("mailgun.com"),
    fallbackLogoUrl: faviconLogo("mailgun.com"),
    category: "Email",
    hasCreditProgram: true,
    brandColor: "#5B5B5B",
  },
  "SendGrid": {
    name: "SendGrid",
    domain: "sendgrid.com",
    logoUrl: clearbitLogo("sendgrid.com"),
    fallbackLogoUrl: faviconLogo("sendgrid.com"),
    category: "Email",
    hasCreditProgram: false,
    brandColor: "#1A82E2",
  },
  "Resend": {
    name: "Resend",
    domain: "resend.com",
    logoUrl: clearbitLogo("resend.com"),
    fallbackLogoUrl: faviconLogo("resend.com"),
    category: "Email",
    hasCreditProgram: false,
    brandColor: "#000000",
  },

  // === DEVELOPER TOOLS ===
  "GitHub": {
    name: "GitHub",
    domain: "github.com",
    logoUrl: clearbitLogo("github.com"),
    fallbackLogoUrl: faviconLogo("github.com"),
    category: "DevTools",
    hasCreditProgram: true,
    brandColor: "#181717",
  },
  "GitLab": {
    name: "GitLab",
    domain: "gitlab.com",
    logoUrl: clearbitLogo("gitlab.com"),
    fallbackLogoUrl: faviconLogo("gitlab.com"),
    category: "DevTools",
    hasCreditProgram: false,
    brandColor: "#FC6D26",
  },
  "Linear": {
    name: "Linear",
    domain: "linear.app",
    logoUrl: clearbitLogo("linear.app"),
    fallbackLogoUrl: faviconLogo("linear.app"),
    category: "Project Management",
    hasCreditProgram: false,
    brandColor: "#5E6AD2",
  },
  "LaunchDarkly": {
    name: "LaunchDarkly",
    domain: "launchdarkly.com",
    logoUrl: clearbitLogo("launchdarkly.com"),
    fallbackLogoUrl: faviconLogo("launchdarkly.com"),
    category: "Feature Flags",
    hasCreditProgram: false,
    brandColor: "#753F3F",
  },

  // === ADDITIONAL CLOUD PROVIDERS ===
  "Oracle": {
    name: "Oracle Cloud",
    domain: "oracle.com",
    logoUrl: clearbitLogo("oracle.com"),
    fallbackLogoUrl: faviconLogo("oracle.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#F80000",
  },
  "IBM Cloud": {
    name: "IBM Cloud",
    domain: "ibm.com",
    logoUrl: clearbitLogo("ibm.com"),
    fallbackLogoUrl: faviconLogo("ibm.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#0530AD",
  },
  "Alibaba Cloud": {
    name: "Alibaba Cloud",
    domain: "alibabacloud.com",
    logoUrl: clearbitLogo("alibabacloud.com"),
    fallbackLogoUrl: faviconLogo("alibabacloud.com"),
    category: "Cloud Hosting",
    hasCreditProgram: true,
    brandColor: "#FF6A00",
  },

  // === SECURITY ===
  "1Password": {
    name: "1Password",
    domain: "1password.com",
    logoUrl: clearbitLogo("1password.com"),
    fallbackLogoUrl: faviconLogo("1password.com"),
    category: "Security",
    hasCreditProgram: true,
    brandColor: "#0094F5",
  },
  "Snyk": {
    name: "Snyk",
    domain: "snyk.io",
    logoUrl: clearbitLogo("snyk.io"),
    fallbackLogoUrl: faviconLogo("snyk.io"),
    category: "Security",
    hasCreditProgram: true,
    brandColor: "#D83533",
  },
  "Wiz": {
    name: "Wiz",
    domain: "wiz.io",
    logoUrl: clearbitLogo("wiz.io"),
    fallbackLogoUrl: faviconLogo("wiz.io"),
    category: "Security",
    hasCreditProgram: false,
    brandColor: "#7A7DFD",
  },
};

/**
 * Cache for brand data to avoid repeated lookups during a single render.
 * This is a module-level Map that gets reset on server restart (acceptable).
 */
const brandCache = new Map<string, BrandEntry | null>();

/**
 * Get canonical brand data by company name.
 * Falls back to a domain-derived brand entry if not in the registry.
 */
export function getBrandData(companyName: string): BrandEntry {
  if (brandCache.has(companyName)) {
    return brandCache.get(companyName) as BrandEntry;
  }

  // Direct match
  if (BRAND_REGISTRY[companyName]) {
    const entry = BRAND_REGISTRY[companyName];
    brandCache.set(companyName, entry);
    return entry;
  }

  // Fuzzy match: check if any registry key contains the company name (case-insensitive)
  const lowerName = companyName.toLowerCase();
  for (const [key, entry] of Object.entries(BRAND_REGISTRY)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      brandCache.set(companyName, entry);
      return entry;
    }
  }

  // Unknown brand: derive from domain heuristic
  const derivedEntry: BrandEntry = {
    name: companyName,
    domain: extractDomain(companyName),
    logoUrl: clearbitLogo(extractDomain(companyName)),
    fallbackLogoUrl: faviconLogo(extractDomain(companyName)),
    category: "Unknown",
    hasCreditProgram: false,
    brandColor: "#6366F1",
  };

  brandCache.set(companyName, derivedEntry);
  return derivedEntry;
}

/**
 * Get the best available logo URL for a company.
 *
 * Note: the Clearbit Logo API (logo.clearbit.com) was discontinued and no
 * longer resolves, so it is treated as dead here. Google's favicon service
 * is used as the live, key-free source of real logos.
 */
export function getLogoUrl(companyName: string): string {
  const brand = getBrandData(companyName);
  return brand.fallbackLogoUrl || brand.logoUrl || "";
}

/**
 * Get a branded initial avatar (SVG data URI) as ultimate fallback
 * when no logo service is available.
 */
export function getBrandingFallback(companyName: string): string {
  const brand = getBrandData(companyName);
  const initial = companyName.charAt(0).toUpperCase();
  const color = brand.brandColor;
  
  // Return a data URI SVG
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="${color}"/>
      <text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-weight="700" font-size="28">${initial}</text>
    </svg>`
  ).toString("base64")}`;
}

/**
 * Get all brands in a specific category.
 */
export function getBrandsByCategory(category: string): BrandEntry[] {
  return Object.values(BRAND_REGISTRY).filter(
    (b) => b.category === category
  );
}

/**
 * Get all brands that have credit programs.
 */
export function getCreditBrands(): BrandEntry[] {
  return Object.values(BRAND_REGISTRY).filter((b) => b.hasCreditProgram);
}

/**
 * Get brand logo with automatic fallback chain.
 * Returns the best available URL, never null.
 * 
 * Priority:
 * 1. Clearbit CDN (primary)
 * 2. Google Favicon (fallback)
 * 3. Branded SVG with initial (last resort)
 */
export function resolveLogo(companyName: string): string {
  const brand = getBrandData(companyName);
  if (brand.fallbackLogoUrl) return brand.fallbackLogoUrl;
  if (brand.logoUrl) return brand.logoUrl;
  return getBrandingFallback(companyName);
}

/**
 * Extract the registrable domain from a real URL (e.g. a record's
 * officialUrl field). This is far more accurate than guessing a domain
 * from a display name, since it reflects the actual linked site.
 * Returns null if the URL can't be parsed.
 */
export function domainFromUrl(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Extract a plausible domain from a company name.
 */
function extractDomain(companyName: string): string {
  // Remove common suffixes and lowercase
  const cleaned = companyName
    .toLowerCase()
    .replace(/\s+(inc|corp|llc|ltd|io|co|ai|cloud|tech|lab)/g, "")
    .replace(/\s+/g, "")
    .trim();
  return `${cleaned}.com`;
}

/**
 * Get all known brand names for autocomplete/search.
 */
export function getAllBrandNames(): string[] {
  return Object.keys(BRAND_REGISTRY);
}

/**
 * Check if a company is in our registry.
 */
export function isKnownBrand(companyName: string): boolean {
  return !!BRAND_REGISTRY[companyName] || brandCache.has(companyName);
}