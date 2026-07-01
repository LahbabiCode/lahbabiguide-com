import { getCredits, getCreditCategories } from "@/lib/db/queries";
import { CreditsDirectoryClient } from "@/components/credits/CreditsDirectoryClient";
import { Award, Sparkles, ShieldCheck } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Startup Credits Directory | Free Cloud Compute & SaaS Deals - LahbabiGuide",
  description: "Explore 20+ verified venture-funded startup credits including AWS Activate, Google for Startups Cloud, Notion, Retool and Stripe Atlas waived processing fees.",
  keywords: ["startup credits", "free cloud compute", "aws activate", "google for startups", "crm discount", "stripe atlas", "bootstrap coupon code"],
  alternates: {
    canonical: "https://lahbabiguide.com/credits",
  },
  openGraph: {
    title: "Startup Credits Directory | Free Cloud Compute & SaaS Deals - LahbabiGuide",
    description: "Explore 20+ verified venture-funded startup credits including AWS Activate, Google for Startups Cloud, Notion, Retool and Stripe Atlas waived processing fees.",
    url: "https://lahbabiguide.com/credits",
  },
  twitter: {
    card: "summary",
    title: "Startup Credits Directory | Free Cloud Compute & SaaS Deals - LahbabiGuide",
    description: "Explore 20+ verified venture-funded startup credits including AWS Activate, Google for Startups Cloud, Notion, Retool and Stripe Atlas waived processing fees.",
  },
};

// Enable standard caching fallback so database doesn't get slammed
export const revalidate = 3600; // static-first with hourly ISR update

export default async function CreditsPage() {
  const [credits, categories] = await Promise.all([
    getCredits(),
    getCreditCategories(),
  ]);

  const listItems = credits.map((c) => ({
    name: c.name,
    url: `https://lahbabiguide.com/credits/${c.slug}`,
    description: c.shortDescription,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Credits", url: "https://lahbabiguide.com/credits" },
      ]} />
      <ItemListSchema items={listItems} url="https://lahbabiguide.com/credits" />

      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        
        {/* Header Breadcrumbs & Titles */}
        <div className="text-center md:text-left space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Award className="h-3.5 w-3.5" />
            Verified VC-Backed Programs
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Startup Credits & Developer Grants Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Boost your early-stage venture! Access premium cloud compute credits, waived payment fees, discounted HubSpot CRM pipelines, and low-code builder codes with step-by-step instructions. No fake promo keys, strictly official partner agreements.
          </p>
        </div>

        {/* Directory Search & Filters hydrate */}
        <CreditsDirectoryClient initialCredits={credits} categories={categories} />

      </div>
    </div>
  );
}
