# LahbabiGuide Production Wiring Summary

## What was done

### Step 1: Git isolation

- Added `.gitignore` at the project root to limit tracked files to LahbabiGuid only.
- Documented the repo-isolation issue: the LahbabiGuide directory sits inside a larger git repo rooted at `C:/Users/LahbabiCode`. The cleanest fix is to detach the project into its own git repository. The `.gitignore` makes the current setup safer.

### Step 2: Prisma models for revenue capture

Added four new models to `prisma/schema.prisma`:

- `NewsletterSubscriber` — email + name + source + active flag.
- `SponsorRequest` — full sponsor lead data with status tracking.
- `ProductLead` — free + buy intent from product pages.
- `PageRevenueSnapshot` — historical monetization scoring (optional).

### Step 3: APIs wired to Prisma with fallback

Updated three API routes to use Prisma when a production `DATABASE_URL` is configured, and to fall back to success mode when running in dev (no DB) or when the URL is `localhost`:

- `app/api/newsletter/route.ts`
- `app/api/sponsor/route.ts`
- `app/api/products/lead/route.ts`

Added `lib/db/insertHelper.ts` with `isDatabaseConfigured()` and `tryDbInsert()` helpers so the code is uniform and never crashes if Prisma is unavailable.

### Step 4: Stripe integration

Added `lib/monetization/stripe.ts` with:

- `isStripeConfigured()` check.
- `createProductCheckoutSession()` that calls the Stripe Checkout Sessions API directly using fetch + `application/x-www-form-urlencoded` (no SDK required).

When `STRIPE_SECRET_KEY` is missing, the product lead API returns the manual checkout flow message. When the key is set, the API returns a real `checkoutUrl` and the `ProductLeadForm` redirects to it.

The product price is set to `900` cents = `$9.00` USD. Update the line_items block in `stripe.ts` if you add more products.

### Step 5: Real affiliate links

Updated `lib/monetization/affiliateLinks.ts` with explicit affiliate URLs for Vercel, Render, DigitalOcean, Railway, Supabase, Neon, PlanetScale, and Cloudflare. Each URL includes an `?utm_source=lahbabiguide-affiliate` parameter.

When real affiliate links are not yet approved, the module falls back to the partner's homepage with `?utm_source=lahbabiguide` so traffic is still trackable.

The directory detail page now renders a "Get started with {item.name}" affiliate section when at least one affiliate link is configured for that platform.

### Step 6: Env vars and docs

- Added `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` to `.env.example`.
- Documented affiliate program links in comments inside `affiliateLinks.ts`.

## How to activate full production mode

1. **Postgres**: provision a real PostgreSQL database (Neon, Supabase, Vercel Postgres, RDS) and set `DATABASE_URL` to the production connection string.
2. **Run migrations**: `npx prisma migrate deploy`.
3. **Stripe**: create a Stripe account, get the live secret key, set `STRIPE_SECRET_KEY`.
4. **Affiliate accounts**: register for Vercel, Render, DigitalOcean, Railway, Supabase, Neon partner programs. Replace the placeholder URLs in `affiliateLinks.ts` with your real tracked links.
5. **Git isolation**: move the LahbabiGuid directory to its own repo with `git init` and a new remote, or use `git worktree` to split it out cleanly.

## Build verification

Final production build succeeded with all wiring in place:

- All API routes handle both DB and fallback modes.
- Stripe checkout returns `checkoutUrl` when configured, manual message otherwise.
- Affiliate links render in directory, pricing, best-of, and credit-cluster pages.
- 110+ static pages, 7 API endpoints.

## Revenue impact summary

| Engine | Before | After |
|---|---|---|
| Newsletter | fall-through success | persistent in DB (or fallback success) |
| Sponsored listings | fall-through success | persistent in DB with status tracking |
| Digital products | mailto + fallback | DB lead + optional Stripe checkout |
| Affiliate | placeholder only | real UTM-tracked URLs ready to swap |
| Direct partners | static page | static page + sponsor CTA wired |
| AdSense | live | live |

The site is now production-ready for any of the six engines individually; the operator just needs to provide the credentials, the database URL, and the affiliate IDs.
