import { getCreditBySlug, getCredits, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BrandLogoRenderer } from "@/components/ui/BrandLogoRenderer";
import { resolveLogoUrl } from "@/lib/logo-resolver";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Calendar,
  AlertCircle,
  Compass,
  ShieldCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { Metadata } from "next";
import { BreadcrumbSchema, FaqSchema, JsonLd } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { getRecommendedLinks } from "@/lib/seo/internalLinks";
import { Sparkles } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface CreditDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const credits = await getCredits();
  return credits.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CreditDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const credit = await getCreditBySlug(slug);

  if (!credit) {
    return {
      title: "Credit Program Not Found | LahbabiGuide",
    };
  }

  const url = `https://lahbabiguide.com/credits/${credit.slug}`;

  return {
    title: `${credit.seoTitle || credit.name} | LahbabiGuide`,
    description: credit.seoDescription || credit.shortDescription,
    keywords: [...credit.tags, credit.company, "startup discounts", "apply promo"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: credit.name,
      description: credit.shortDescription,
      url,
      images: credit.logo ? [{ url: credit.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: credit.seoTitle || credit.name,
      description: credit.seoDescription || credit.shortDescription,
      images: credit.logo ? [credit.logo] : undefined,
    },
  };
}

export default async function CreditDetailPage({ params }: CreditDetailProps) {
  const { slug } = await params;
  const credit = await getCreditBySlug(slug);

  if (!credit) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(credit.id, "credit");
  const allCredits = await getCredits();
  const relatedCredits = allCredits
    .filter((c) => c.categoryId === credit.categoryId && c.id !== credit.id)
    .slice(0, 3);

  const url = `https://lahbabiguide.com/credits/${credit.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "Product",
          name: credit.name,
          image: credit.logo,
          description: credit.shortDescription,
          brand: {
            "@type": "Brand",
            name: credit.company,
          },
          offers: {
            "@type": "Offer",
            price: "0.00",
            priceCurrency: "USD",
            url: credit.officialUrl,
          },
        }}
      </JsonLd>

      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Startup Credits", url: "https://lahbabiguide.com/credits" },
        { name: credit.name, url },
      ]} />
      {credit.faqJson && <FaqSchema faqs={credit.faqJson} />}

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link href="/credits" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
          <FavoriteButton id={credit.id} type="credit" showLabel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Master Identity Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
               
               <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                  {credit && (
                    <div className="w-24 h-24 rounded-3xl shrink-0 relative shadow-xl">
                      <BrandLogoRenderer companyName={credit.company} officialUrl={credit.officialUrl} size={96} />
                    </div>
                  )}
                  <div className="space-y-4 flex-grow">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                        {credit.company} Official Program
                      </span>
                      {credit.creditValue && (
                        <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40 uppercase">
                          {credit.creditValue} Benefit
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                      {credit.name}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                      {credit.shortDescription}
                    </p>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Eligibility</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Venture Supported</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Region</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Global Access</span>
                  </div>
                  <div className="flex-grow" />
                  <RatingStars 
                    id={credit.id} 
                    type="credit" 
                    initialAverage={aggregateRating.average} 
                    initialCount={aggregateRating.count} 
                  />
               </div>
            </div>

            {/* Quick Facts for SEO and AdSense trust */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm space-y-6">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Quick Facts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Provider", value: credit.company },
                  { label: "Benefit value", value: credit.creditValue || "Varies by provider" },
                  { label: "Availability", value: credit.countries?.join(", ") || "Global / varies by provider" },
                  { label: "Best for", value: credit.tags?.slice(0, 3).join(", ") || "Early-stage startups" },
                ].map((fact) => (
                  <div key={fact.label} className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fact.label}</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{fact.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Application approval, exact credit amount, duration, and redemption requirements are controlled by the official provider. LahbabiGuide summarizes public program information to help founders prepare before applying.
              </p>
            </div>

            <AdPlacementRenderer placementKey="blog-top" />
            <SmartAdSlot pageType="credit" position="after-intro" />

            {/* Detailed Body segments */}
            <div className="bg-white dark:bg-[#0B1120] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-12 shadow-sm">
                
                {/* Full Overview */}
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Compass className="h-6 w-6 text-blue-600" />
                    Program Overview
                  </h3>
                  <div className="markdown-body prose lg:prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                     {credit.fullDescription}
                  </div>
                </div>

                <hr className="border-slate-50 dark:border-slate-800" />

                {/* Eligibility requirements */}
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    Who is Eligible?
                  </h3>
                  <div className="markdown-body prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-400">
                    <ReactMarkdown>{credit.eligibility}</ReactMarkdown>
                  </div>
                </div>

                <hr className="border-slate-50 dark:border-slate-800" />

                {/* Common rejection reasons */}
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                    Common Rejection Reasons
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Startup credit applications are often rejected for avoidable reasons. Before applying to {credit.company}, review these common issues and prepare accurate company information.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                    {[
                      "Incomplete company website or invalid business email",
                      "Startup outside the supported stage, age, or region",
                      "Previous credits already redeemed on the same provider",
                      "Missing partner, accelerator, or provider ID when required",
                      "Unclear product description or non-software business model",
                    ].map((reason) => (
                      <li key={reason} className="flex items-start gap-2 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 p-4">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>

            <AdPlacementRenderer placementKey="content-middle" />

            {/* Application Steps */}
            <div className="bg-slate-900 dark:bg-[#0F172A] rounded-[2.5rem] p-8 md:p-12 text-white space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
               <h3 className="font-display text-2xl font-black flex items-center gap-3 relative z-10">
                 <CheckCircle2 className="h-6 w-6 text-blue-400" />
                 How to Apply?
               </h3>
               <div className="markdown-body prose prose-invert max-w-none text-slate-300 relative z-10 font-mono text-sm leading-relaxed">
                  <ReactMarkdown>{credit.claimSteps}</ReactMarkdown>
               </div>
               <div className="bg-amber-50/10 border border-amber-300/20 rounded-3xl p-6 text-sm text-amber-100 leading-relaxed relative z-10">
                 LahbabiGuide does not sell promo codes or guarantee approval. Startup credit programs are controlled by the official provider, and eligibility requirements may change without notice. Always verify details on the official application page before applying.
               </div>
               <div className="pt-6 relative z-10">
                  <a 
                    href={credit.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                  >
                    Launch Official Application
                    <ExternalLink className="h-4 w-4" />
                  </a>
               </div>
            </div>

            <AdPlacementRenderer placementKey="footer-multiplex" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-600" /> Related Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getRecommendedLinks("credit", { slug: credit.slug }).map(link => (
                  <Link key={link.href + link.label} href={link.href} className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 hover:border-blue-500 transition-colors">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{link.label}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>


          </div>

          {/* SIDEBAR (Right - 4 Cols) */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-24 space-y-10">
              
              {/* Sticky Sidebar Ads */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
                <AdPlacementRenderer placementKey="header-banner" />
              </div>

              {/* Related Programs sidebar widget */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-l-4 border-emerald-500 pl-3">Related Programs</h4>
                <div className="space-y-4">
                  {relatedCredits.length > 0 ? relatedCredits.map(rel => (
                    <Link key={rel.id} href={`/credits/${rel.slug}`} className="group flex items-center gap-3">
                       <BrandLogoRenderer companyName={rel.company} officialUrl={rel.officialUrl} size={40} />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{rel.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{rel.creditValue}</span>
                       </div>
                    </Link>
                  )) : (
                    <Link href="/credits" className="block rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4 text-xs font-black uppercase tracking-widest text-emerald-600 hover:border-emerald-500 transition-colors">
                      Browse all startup credit programs
                    </Link>
                  )}
                </div>
              </div>

              {/* Disclaimer Side Block */}
              <div className="bg-emerald-600 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full -mr-12 -mt-12" />
                <h4 className="font-display font-black text-xl leading-tight">Verified Policy</h4>
                <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                  We manually verify all startup credit programs. For some, you may need a referral. LahbabiGuide does not sell keys, we guide you to official applications.
                </p>
                <HelpCircle className="h-10 w-10 text-white/10 absolute -bottom-2 -right-2" />
              </div>

              {/* Sidebar Ticker Ad 2 */}
              <div className="opacity-70">
                <AdPlacementRenderer placementKey="tool-list-feed" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
