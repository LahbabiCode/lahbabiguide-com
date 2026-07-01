# LahbabiGuide Six Engines v3 Design Spec

**Date:** 2026-06-30
**Status:** Approved
**Goal:** Add two more revenue engines (sponsored listings and digital products) plus a partners page so LahbabiGuide generates revenue beyond AdSense and affiliate.

---

## 1. Engine overview

| Engine | Status | Type |
|---|---|---|
| AdSense | live | passive display ads |
| Affiliate | live | per-signup commission |
| Newsletter | live | email capture |
| Sponsored listings | new | one-time + monthly fees |
| Digital products | new | one-time purchases |
| Direct partnerships | new | enterprise deals |

The focus of v3 is launching Sponsored Listings and Digital Products with a Partners landing page.

---

## 2. Sponsored Listings

### Approach

Allow companies, founders, and tool providers to request:
- Adding their tool/credit to the LahbabiGuide directory or credit catalog.
- Featured placement for a period.
- A "Featured" badge on listings.
- Newsletter mention.

This is a manual accept flow in v1 (no payment integration). The page acts as a sales funnel and request intake.

### Routes

- `/sponsor` — public landing page with packages, process, and request form.
- `/sponsor/thanks` — confirmation page after request submission.
- `/api/sponsor` — POST endpoint that captures the request (fallback mode returns success without DB persistence).

### Data shape

```ts
export interface SponsorRequest {
  company: string;
  contactName: string;
  email: string;
  website: string;
  type: "tool-listing" | "credit-listing" | "featured" | "newsletter-mention" | "other";
  budget: "under-100" | "100-500" | "500-2000" | "2000+";
  notes: string;
}
```

The form should NOT ask for payment details. Sales follow-up happens via email after submission.

### Disclosure

The sponsor landing page must include a clear note that:
- Listings are reviewed manually.
- Acceptance is at LahbabiGuide's discretion.
- Sponsored content is labeled when published.

### Files

- `app/(public)/sponsor/page.tsx`
- `app/(public)/sponsor/thanks/page.tsx`
- `app/api/sponsor/route.ts`

### Sitemap

Add `/sponsor` to XML sitemap and footer.

---

## 3. Digital Products

### Approach

Offer one or more low-friction digital products. For v3 we ship a single "Cloud Credits Cheat Sheet" PDF as the lead product, with infrastructure for more products.

### Product

- **Title**: Startup Cloud Credits Cheat Sheet 2026
- **Type**: PDF + Notion link
- **Price**: $9 (or "Free with email signup" for email capture mode)
- **Delivery**: Digital download via email

### Routes

- `/products` — product catalog index.
- `/products/cloud-credits-cheat-sheet` — product detail.
- `/products/[slug]/thanks` — download instructions.
- `/api/products/lead` — POST endpoint that captures buyer email and sends the link (fallback mode returns success).

### Data shape

```ts
export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  price: string;
  format: string;
  contents: string[];
  faqs: { q: string; a: string }[];
  tags: string[];
}
```

### Files

- `lib/db/fallbackData.ts` — add `FALLBACK_PRODUCTS`.
- `lib/db/queries.ts` — add `getProducts`, `getProductBySlug`.
- `app/(public)/products/page.tsx`
- `app/(public)/products/[slug]/page.tsx`
- `app/(public)/products/[slug]/thanks/page.tsx`
- `app/api/products/lead/route.ts`
- `components/product/ProductCard.tsx`
- `components/product/ProductLeadForm.tsx`

### Sitemap

Add `/products` and product detail routes.

---

## 4. Direct Partners Page

### Approach

A clean public page that explains LahbabiGuide's audience and invites direct partnerships.

### Content

- Audience description (founders, developers, technical decision-makers).
- Reach metrics placeholder.
- Partnership options (sponsored content, newsletter mention, custom research).
- Contact CTA.

### Routes

- `/partners`

### Files

- `app/(public)/partners/page.tsx`

### Sitemap

Add `/partners`.

---

## 5. Footer and Navigation Updates

- Add "Sponsor" to footer Directory or Resources.
- Add "Products" to footer.
- Add "Partners" to footer.

---

## 6. Constraints

- All new pages must be English, original, useful, and AdSense compliant.
- No payment processing in v3: requests are form-based.
- Forms must validate inputs and handle errors.
- All disclosures must be clear and human-readable.
- The "Advertisement" label remains on every AdSense unit.
