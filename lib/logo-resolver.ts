import { getCompanyLogo } from "@/lib/logo";

/**
 * LogoResolver - replaces placeholder Unsplash logos with real brand logos.
 * 
 * Every component that displays a company logo should use this component
 * instead of directly using the `logo` field from the database.
 * 
 * Priority chain:
 * 1. Clearbit Logo API (if domain known)
 * 2. Google Favicon (fallback)
 * 3. Branded SVG initial (ultimate fallback)
 */
export function useBrandLogo(companyName: string): string {
  if (!companyName || companyName.trim() === "") {
    return "";
  }
  
  return getCompanyLogo(companyName);
}

/**
 * Resolve a logo URL. If the stored logo is an Unsplash placeholder,
 * we replace it with the real brand logo.
 */
export function resolveLogoUrl(storedLogo: string | null | undefined, companyName: string): string {
  // If no stored logo, use brand service
  if (!storedLogo) {
    return getCompanyLogo(companyName);
  }
  
  // If stored logo is an Unsplash placeholder, replace it
  if (storedLogo.includes("unsplash.com") || storedLogo.includes("placehold")) {
    return getCompanyLogo(companyName);
  }
  
  // Otherwise, use the stored logo (it's a real one)
  return storedLogo;
}