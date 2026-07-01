# LahbabiGuide Money Engine v1 Design Spec

**Date:** 2026-06-30
**Status:** Approved
**Goal:** Transform LahbabiGuide from a tools-only site into a revenue-generating SEO + AdSense + Affiliate money engine by adding high-CPC page types, smart ad placement, and monetization-aware internal linking.

---

## 1. Revenue Profiles

Every page type on LahbabiGuide gets a revenue profile that determines ad placement density, CTA strategy, and internal link targets.

| Page type | Revenue level | Typical CPC | Strategy |
|---|---|---|---|
| Tool detail pages | low-medium | $0.30–0.80 | Light ads; drive to best-of pages |
| Credit detail pages | high | $2.00–8.00 | Multiple ads; comparison CTAs; affiliate potential |
| Platform directory detail | high | $2.00–6.00 | Multiple ads; alternatives CTAs |
| Compare pages | very high | $3.00–12.00 | Multiple ads; pricing/alternatives CTAs |
| Blog articles | medium | $0.50–2.00 | 3-4 ads; link to credits/compare |
| Best-of pages | high | $2.00–8.00 | Multiple ads; affiliate CTAs; lead to credits |
| Pricing pages | very high | $3.00–15.00 | Multiple ads; comparison CTAs; affiliate potential |
| Alternatives pages | very high | $3.00–12.00 | Multiple ads; feature comparison tables |
| Startup credit clusters | high | $2.00–6.00 | Multiple ads; per-industry credit navigation |

**Implementation:** a single TypeScript config file `lib/monetization/revenueProfiles.ts` exporting a map from page type to profile.

---

## 2. Smart Ad Slot Component

Replace direct `<AdPlacementRenderer>` usage in page templates with a `SmartAdSlot` component that reads the revenue profile.

**Interface:**

```ts
<SmartAdSlot pageType="credit" position="after-intro" />
<SmartAdSlot pageType="tool" position="after-content" />
```

**Behavior:**

- High-revenue pages: render up to 5 ad units (after-intro, mid-content, after-faq, sidebar, multiplex-end).
- Medium-revenue pages: render 3 ad units (after-intro, mid-content, multiplex-end).
- Low-revenue pages: render 2 ad units (after-content, multiplex-end).

**Constraints:**

- Never place an ad before the main H1 title.
- Never place an ad directly adjacent to interactive tool controls.
- The "Advertisement" label remains on every unit.
- No sticky bottom ads that cover tool interaction area.

**File:** `components/ads/SmartAdSlot.tsx`

---

## 3. High-CPC Page Routes

### 3.1 Best-of pages

**Route:** `/best/[slug]` and `/best` (index)

Initial pages:

| Slug | Title | Target keyword |
|---|---|---|
| free-developer-tools | Best Free Developer Tools for Startups | best free developer tools |
| free-cloud-credits | Best Free Cloud Credits for Startups | free cloud credits startups |
| vercel-alternatives | Best Vercel Alternatives for Hosting | best vercel alternatives |
| supabase-alternatives | Best Supabase Alternatives for Databases | best supabase alternatives |
| ai-startup-credits | Best AI Startup Credits and Grants | ai startup credits |

Each best-of page contains:

- Ranked list of items with short descriptions.
- Pros/cons comparison summary.
- Internal links to full directory/credit detail pages.
- CTA to relevant compare pages.
- FAQ section.
- Breadcrumb and ItemList schema.

### 3.2 Pricing pages

**Route:** `/pricing/[slug]` and `/pricing` (index)

Initial pages:

| Slug | Title | Target keyword |
|---|---|---|
| vercel-pricing | Vercel Pricing Explained: Free, Pro, Enterprise | vercel pricing |
| supabase-pricing | Supabase Pricing Plans Explained | supabase pricing |
| neon-pricing | Neon Postgres Pricing Explained | neon pricing |
| render-pricing | Render Hosting Pricing Explained | render pricing |

Each pricing page contains:

- Pricing table (free tier, paid tiers, key limits).
- "Is the free plan enough?" section.
- "When to upgrade" guidance.
- Alternatives CTAs.
- FAQ.

### 3.3 Startup credits cluster pages

**Route:** `/startup-credits/[slug]` and `/startup-credits` (index)

Initial pages:

| Slug | Title | Target keyword |
|---|---|---|
| ai-startups | Startup Credits for AI Companies | startup credits ai |
| saas-startups | Startup Credits for SaaS Founders | startup credits saas |
| cloud-hosting | Free Cloud Hosting Credits for Startups | free cloud hosting credits |
| bootstrapped-founders | Credits Available Without VC Funding | startup credits no vc |

Each cluster page contains:

- List of credit programs matching the category.
- Quick comparison table.
- Eligibility tips.
- Internal links to credit detail pages and apply links.

---

## 4. Monetization-Aware Internal Linking

**File:** `lib/seo/internalLinks.ts`

Exports a function:

```ts
getRecommendedLinks(pageType: string, context: { slug?: string; tags?: string[]; category?: string }): { label: string; href: string; priority: number }[]
```

**Rules:**

- Tool pages → link to corresponding best-of page, related tools, and credit cluster.
- Credit pages → link to alternatives, compare pages, pricing pages, best-of pages.
- Directory pages → link to pricing page, alternatives page, compare pages.
- Blog pages → link to related credits, directory, tools, best-of pages.
- Best/pricing/alternatives pages → link to directory detail, credit detail, compare pages.

These links render as "Related Resources" or "Explore Further" sections at the bottom of each page.

---

## 5. Navigation and Sitemap Updates

Add `/best`, `/pricing`, `/startup-credits` to:

- XML sitemap (`app/sitemap.ts`).
- HTML sitemap (`app/(public)/sitemap/page.tsx`).
- Footer under Directory section.
- Resources hub page.

---

## 6. Content Data Source

All new page content lives in `lib/db/fallbackData.ts` as new exported arrays:

- `FALLBACK_BEST_PAGES`
- `FALLBACK_PRICING_PAGES`
- `FALLBACK_CREDIT_CLUSTER_PAGES`

Each with interfaces, slugs, metadata, content blocks, FAQ, and schema data.

Database queries are added in `lib/db/queries.ts` for when these migrate to the database.

---

## 7. Scope boundaries

**In scope for v1:**

- Revenue profiles config.
- SmartAdSlot component.
- 5 best-of pages.
- 4 pricing pages.
- 4 startup credits cluster pages.
- Internal links module.
- Navigation and sitemap updates.
- Build verification.

**Out of scope for v1 (future phases):**

- Affiliate program integration.
- Lead capture / newsletter signup.
- AdSense API revenue dashboard.
- Automated content generation pipeline.
- A/B testing ad layouts.
- Sponsored listing submission system.
- TypeScript strict mode cleanup.
- Git isolation fix.

---

## 8. Constraints

- All content must be English, original, and useful — never thin or duplicate.
- Ad placement must comply with AdSense policies: no more ads than content on any page.
- The "Advertisement" label stays on every ad unit.
- All new pages must have metadata, canonical URLs, OG/Twitter tags, and JSON-LD schema.
- Revenue profiles are advisory, not enforcement — ad count per page is capped by layout, not profile alone.
- No sticky overlay ads, no auto-playing video ads, no ads disguised as content.
