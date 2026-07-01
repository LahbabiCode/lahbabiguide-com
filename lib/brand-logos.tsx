/**
 * شعارات SVG مدمجة - لا تعتمد على أي API خارجي
 * تعمل 100% محليًا وآمنة لـ AdSense
 */

export interface BrandLogo {
  name: string;
  color: string;
  initials: string;
  svg: string;  // SVG as string for direct rendering
}

/**
 * BrandEvo - Brand Evolution Engine
 * نظام متطور للشعارات المدمجة يعمل بدون أي اتصال خارجي
 */
export class BrandEvo {
  /** جلب الشعارات المضمّنة لشركة معينة */
  static getLogo(company: string): { logo: React.ReactNode; color: string } {
    const normalized = company.trim();
    const e = entries[normalized] || entries[this.fuzzyMatch(normalized)];
    
    if (e) {
      return {
        logo: <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect width="48" height="48" rx="8" fill={e.color} />
          <text x="24" y="24" dominantBaseline="central" textAnchor="middle" 
                fill="white" fontFamily="system-ui" fontWeight="700" fontSize="20">
            {e.initials}
          </text>
        </svg>,
        color: e.color
      };
    }

    // Fallback: generic branded initial
    const initial = company.charAt(0).toUpperCase();
    const hash = this.hashCode(company);
    const hue = Math.abs(hash % 360);
    const color = `hsl(${hue}, 55%, 45%)`;
    
    return {
      logo: <svg viewBox="0 0 48 48" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill={color} />
        <text x="24" y="24" dominantBaseline="central" textAnchor="middle" 
              fill="white" fontFamily="system-ui" fontWeight="700" fontSize="20">
          {initial}
        </text>
      </svg>,
      color
    };
  }

  /** هاش سريع لاستخراج لون من اسم الشركة */
  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }

  /** بحث ضبابي (fuzzy) للعثور على أقرب تطابق */
  private static fuzzyMatch(name: string): string | undefined {
    const lower = name.toLowerCase();
    for (const key of Object.keys(entries)) {
      if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
        return key;
      }
    }
    return undefined;
  }
}

const entries: Record<string, { color: string; initials: string }> = {
  // === MAJOR CLOUD ===
  "AWS Activate": { color: "#FF9900", initials: "AW" },
  "Amazon Web Services": { color: "#FF9900", initials: "AW" },
  "AWS": { color: "#FF9900", initials: "AW" },
  "Google for Startups Cloud": { color: "#4285F4", initials: "GC" },
  "Google Cloud": { color: "#4285F4", initials: "GC" },
  "Google Cloud Platform": { color: "#4285F4", initials: "GC" },
  "Google for Startups": { color: "#4285F4", initials: "GS" },
  "Microsoft for Startups Founders Hub": { color: "#00A4EF", initials: "MS" },
  "Microsoft Founders Hub": { color: "#00A4EF", initials: "MF" },
  "Microsoft Azure": { color: "#0078D4", initials: "AZ" },
  "Microsoft": { color: "#00A4EF", initials: "MS" },
  "DigitalOcean": { color: "#0080FF", initials: "DO" },
  "Oracle Cloud": { color: "#F80000", initials: "OC" },
  "IBM Cloud": { color: "#0530AD", initials: "IB" },
  "Alibaba Cloud": { color: "#FF6A00", initials: "AL" },

  // === DATABASE ===
  "Neon Postgres": { color: "#00E5BF", initials: "NE" },
  "Neon": { color: "#00E5BF", initials: "NE" },
  "Supabase": { color: "#3ECF8E", initials: "SU" },
  "PlanetScale": { color: "#FA2F8B", initials: "PS" },
  "Firebase": { color: "#FFCA28", initials: "FB" },
  "MongoDB": { color: "#47A248", initials: "MO" },

  // === HOSTING / DEPLOYMENT ===
  "Vercel": { color: "#000000", initials: "VE" },
  "Render": { color: "#46E3B7", initials: "RE" },
  "Netlify": { color: "#00C7B7", initials: "NE" },
  "Cloudflare": { color: "#F38020", initials: "CF" },
  "Cloudflare Pages": { color: "#F38020", initials: "CF" },
  "Railway": { color: "#0B0D0E", initials: "RW" },
  "Fly.io": { color: "#9D00FF", initials: "FL" },
  "Heroku": { color: "#430098", initials: "HE" },
  "Vercel": { color: "#000000", initials: "VE" },

  // === PAYMENTS ===
  "Stripe Atlas": { color: "#635BFF", initials: "SA" },
  "Stripe": { color: "#635BFF", initials: "ST" },

  // === SaaS / PRODUCTIVITY ===
  "Notion": { color: "#000000", initials: "NO" },
  "Retool": { color: "#4D41D4", initials: "RT" },
  "Airtable": { color: "#18BFFF", initials: "AI" },
  "HubSpot": { color: "#FF7A59", initials: "HU" },
  "Zendesk": { color: "#03363D", initials: "ZD" },

  // === AI ===
  "OpenAI": { color: "#10A37F", initials: "OA" },
  "Anthropic": { color: "#544E39", initials: "AN" },
  "Cohere": { color: "#5B5B5B", initials: "CO" },
  "Hugging Face": { color: "#FFD21E", initials: "HF" },
  "Replicate": { color: "#555555", initials: "RP" },
  "Groq": { color: "#1A1A1A", initials: "GR" },
  "Together AI": { color: "#5B5BFF", initials: "TA" },

  // === MONITORING ===
  "Datadog": { color: "#632CA6", initials: "DD" },
  "New Relic": { color: "#1CE783", initials: "NR" },
  "Sentry": { color: "#FF2244", initials: "SE" },
  "Sentry": { color: "#FF2244", initials: "SE" },

  // === EMAIL ===
  "Mailgun": { color: "#5B5B5B", initials: "MG" },
  "SendGrid": { color: "#1A82E2", initials: "SG" },
  "Resend": { color: "#000000", initials: "RS" },

  // === DEV TOOLS ===
  "GitHub": { color: "#181717", initials: "GH" },
  "GitLab": { color: "#FC6D26", initials: "GL" },
  "Linear": { color: "#5E6AD2", initials: "LI" },
  "LaunchDarkly": { color: "#753F3F", initials: "LD" },

  // === SECURITY ===
  "1Password": { color: "#0094F5", initials: "1P" },
  "Snyk": { color: "#D83533", initials: "SN" },
  "Wiz": { color: "#7A7DFD", initials: "WZ" },

  // === OTHER CREDITS ===
  "Twilio": { color: "#F22F46", initials: "TW" },
  "SendGrid": { color: "#1A82E2", initials: "SG" },
  "Auth0": { color: "#EB5424", initials: "A0" },
  "Okta": { color: "#007DC1", initials: "OK" },
  "Intercom": { color: "#1F8DED", initials: "IN" },
  "Discord": { color: "#5865F2", initials: "DC" },
  "Figma": { color: "#F24E1E", initials: "FI" },
  "Canva": { color: "#00C4CC", initials: "CA" },
  "Loom": { color: "#6A35FF", initials: "LO" },
  "Notion": { color: "#000000", initials: "NO" },
  "ClickUp": { color: "#7B68EE", initials: "CU" },
  "Asana": { color: "#FC636B", initials: "AS" },
};
