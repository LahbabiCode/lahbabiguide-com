# LahbabiGuide Money Engine v2 Design Spec

**Date:** 2026-06-30
**Status:** Approved
**Goal:** Expand revenue streams beyond AdSense by adding affiliate links, lead capture, content scaling automation, and analytics-light revenue visibility while staying AdSense-policy compliant.

---

## 1. Affiliate Monetization

### Approach

Add affiliate links on existing money pages with clear disclosure. Only use platforms that have legitimate public affiliate programs.

### Approved categories

- Cloud hosting: Vercel, Render, DigitalOcean (existing credit), Railway.
- Domains and DNS where relevant.
- Productivity and developer tools with established affiliate programs.

### Disclosures

- Add a small "(affiliate)" tag next to any affiliate link.
- Update `/advertising-disclosure` to disclose affiliate relationships.
- Each pricing page shows a short affiliate note if any external link is an affiliate link.

**File:** `lib/monetization/affiliateLinks.ts`

Shape:

```ts
export interface AffiliateLink {
  href: string;
  label: string;
  programName: string;
  disclosureNote: string;
}
```

Helper:

```ts
export function getAffiliateLinksForPage(pageType: string, slug: string): AffiliateLink[];
```

---

## 2. Lead Capture (Newsletter)

### Approach

Add an inline email capture form on the most-trafficked money pages: best-of, pricing, and startup-credits clusters.

### Behavior

- Simple client-side form posts to `/api/newsletter`.
- Store emails via Prisma model `NewsletterSubscriber` (optional fallback returns success).
- Add a "Thank you" state on the page.
- Comply with CAN-SPAM: include a one-line consent text.

### Placement

- Bottom of `/best/[slug]`, `/pricing/[slug]`, `/startup-credits/[slug]`.
- Footer of `/resources` and `/home`.

### API

- `app/api/newsletter/route.ts` POST handler.
- If `DATABASE_URL` is set and a `NewsletterSubscriber` model exists, insert; otherwise return `{ ok: true, mode: "fallback" }`.

**File:** `app/api/newsletter/route.ts`

**File:** `components/lead/NewsletterForm.tsx`

---

## 3. More Money Pages (Content Scaling)

Add new high-CPC money pages targeting common commercial queries.

### New best-of pages

- `/best/firebase-alternatives`
- `/best/free-postgres-hosting`
- `/best/ai-coding-tools`
- `/best/email-apis-for-developers`
- `/best/developer-analytics-tools`

### New pricing pages

- `/pricing/railway-pricing`
- `/pricing/digitalocean-pricing`

### New credit clusters

- `/startup-credits/mobile-startups`
- `/startup-credits/open-source-projects`

Total new pages: 9.

---

## 4. Lightweight Revenue Analytics

Build a small internal admin endpoint that returns page-level "monetization score" computed from the revenue profile and content length. No external tracking required.

### Endpoint

- `app/api/admin/revenue-score/route.ts` GET handler.
- Returns per-page `monetizationScore` (0-100) and `pageType` and `estimatedCpcBand`.

### Use

- Future admin dashboard for visibility.
- Manual checks to see which pages have weak profiles.

---

## 5. OpenGraph Variants for Money Pages

Generate page-type-specific OG titles to improve CTR from social sharing.

- `/best/[slug]` OG title: "Best [Category] in 2026 - LahbabiGuide".
- `/pricing/[slug]` OG title: "[Platform] Pricing Explained - LahbabiGuide".
- `/startup-credits/[slug]` OG title: "Startup Credits for [Category] - LahbabiGuide".

Already largely covered by page-specific metadata; v2 verifies each existing page has a unique OG title.

---

## 6. Out of scope for v2

- Real ad rotation / A/B testing.
- External analytics dashboard.
- Sponsored listings marketplace.
- Auth for newsletter.
- Double opt-in for newsletter.
- TypeScript strict cleanup.
- Git isolation.

---

## 7. Constraints

- AdSense policy compliance remains top priority.
- No dark patterns in the lead capture form.
- Affiliate links must be clearly marked and disclosed.
- New pages must include metadata, canonical, schema, and AdSense-safe content.
- No personal email storage without consent copy.
