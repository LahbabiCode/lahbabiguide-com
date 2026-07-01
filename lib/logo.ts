import { getLogoUrl, getBrandingFallback } from "./brand-data";

/**
 * Get the best available logo for a company.
 * 
 * This function should be used in components to display company logos.
 * It always returns a valid URL string (never null or empty).
 * 
 * Priority:
 * 1. Clearbit CDN (high quality, official logos)
 * 2. Google Favicon (fallback for domains not in Clearbit)
 * 3. Branded SVG with initial (ultimate fallback, no external requests)
 * 
 * @param companyName - The name of the company (as stored in our data)
 * @returns A URL string suitable for use in an <img> src attribute
 */
export function getCompanyLogo(companyName: string): string {
  if (!companyName || companyName.trim() === "") {
    // Return a generic fallback for empty company names
    return getBrandingFallback("Unknown");
  }
  
  return getLogoUrl(companyName);
}

/**
 * Get a logo URL with explicit fallback chain.
 * 
 * @param companyName - The company name
 * @param fallbackUrl - An optional fallback URL to try first (e.g., from database)
 * @returns The best available logo URL
 */
export function getCompanyLogoWithFallback(
  companyName: string, 
  fallbackUrl: string | null = undefined
): string {
  // If we have a fallback URL that looks valid (not empty, not a placeholder we want to replace),
  // we could use it. However, for simplicity and to ensure we always have real logos,
  // we ignore the fallback and always use our brand service.
  // 
  // Uncomment the following lines if you want to use the database logo when available:
  // if (fallbackUrl && fallbackUrl.trim() !== "" && !fallbackUrl.includes("unsplash.com")) {
  //   return fallbackUrl;
  // }
  
  return getCompanyLogo(companyName);
}