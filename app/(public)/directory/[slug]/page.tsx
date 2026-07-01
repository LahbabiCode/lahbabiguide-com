import { getDirectoryItemBySlug, getDirectoryItems, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BrandLogoRenderer } from "@/components/ui/BrandLogoRenderer";
import {
  ArrowLeft,
  ExternalLink,
  Server,
  CheckCircle2,
  HelpCircle,
  Compass,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Zap,
} from "lucide-react";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { getAffiliateLinksForPage, GLOBAL_AFFILIATE_DISCLOSURE } from "@/lib/monetization/affiliateLinks";
import { Metadata } from "next";
import { BreadcrumbSchema, FaqSchema, JsonLd } from "@/components/seo/JsonLd";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface DirectoryItemDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getDirectoryItems();
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: DirectoryItemDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    return { title: "Platform Not Found | LahbabiGuide" };
  }

  const url = `https://lahbabiguide.com/directory/${item.slug}`;

  return {
    title: `${item.seoTitle || item.name} | LahbabiGuide`,
    description: item.seoDescription || item.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: item.name,
      description: item.description,
      url,
      images: item.logoUrl ? [{ url: item.logoUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.seoTitle || item.name,
      description: item.seoDescription || item.description,
      images: item.logoUrl ? [item.logoUrl] : undefined,
    },
  };
}

export default async function DirectoryItemPage({ params }: DirectoryItemDetailProps) {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(item.id, "directory");
  const allItems = await getDirectoryItems();
  const relatedItems = allItems
    .filter((c) => c.categoryId === item.categoryId && c.id !== item.id)
    .slice(0, 3);
  
  const url = `https://lahbabiguide.com/directory/${item.slug}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: item.name,
          image: item.logoUrl,
          description: item.description,
          applicationCategory: "DeveloperApplication",
          offers: {
            "@type": "Offer",
            price: item.hasFreePlan ? "0.00" : undefined,
            priceCurrency: "USD",
            url: item.officialUrl,
          },
        }}
      </JsonLd>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Directory", url: "https://lahbabiguide.com/directory" },
        { name: item.name, url },
      ]} />
      {item.faqJson && <FaqSchema faqs={item.faqJson} />}

      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Back Link Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/directory" className="hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate">{item.name}</span>
        </div>

        {/* Content Layout Column split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2-COLUMNS: Overview, Pros/Cons, Features */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title Block & Metadata card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-4">
                <FavoriteButton id={item.id} type="directory" showLabel />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pr-20">
                <BrandLogoRenderer companyName={item.name} officialUrl={item.officialUrl} size={64} />
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      item.pricingModel === "Open Source" 
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {item.pricingModel}
                    </span>
                    {item.hasFreePlan && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Free Plan Available
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    {item.name}
                  </h1>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal space-y-4">
                <p className="font-medium text-slate-800 dark:text-slate-200 text-base">
                  {item.description}
                </p>
                {item.fullDescription && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-sm font-normal">
                    <ReactMarkdown>{item.fullDescription}</ReactMarkdown>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <RatingStars 
                  id={item.id} 
                  type="directory" 
                  initialAverage={aggregateRating.average} 
                  initialCount={aggregateRating.count} 
                />
              </div>
            </div>

            {/* AdSense In-Article unit safe placement */}
            <AdPlacementRenderer placementKey="directory-middle" />

            {/* Core Features */}
            {item.features.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <Layers className="h-5 w-5 text-blue-500" />
                  Key Features & Capabilities
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pros and Cons */}
            {(item.pros.length > 0 || item.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pros */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                    Advantages
                  </h3>
                  <ul className="space-y-3">
                    {item.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                    <ThumbsDown className="h-4 w-4 text-rose-500" />
                    Limitations
                  </h3>
                  <ul className="space-y-3">
                    {item.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {/* Best fit analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-emerald-500" />
                  Best for
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Teams that need {item.pricingModel.toLowerCase()} developer tooling.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Projects that value {item.features.slice(0, 2).join(" and ") || "modern platform features"}.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Founders comparing free, scalable, or startup-friendly platforms.</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-rose-500" />
                  Not ideal for
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />Teams needing guaranteed enterprise support without checking provider terms.</li>
                  <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />Projects where the listed limitations are blockers.</li>
                  <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />Users requiring features not listed in the current LahbabiGuide review.</li>
                </ul>
              </div>
            </div>

            {/* Pricing notes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
              <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Pricing and free plan notes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.name} is listed with a {item.pricingModel.toLowerCase()} pricing model. {item.hasFreePlan ? "A free plan is available, but usage limits, commercial restrictions, or resource quotas may apply." : "A free plan is not currently marked as available in our directory."} Always verify current pricing on the official website before making infrastructure decisions.
              </p>
            </div>

            {getAffiliateLinksForPage("directory", item.slug).length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Get started with {item.name}</h3>
                <div className="space-y-3">
                  {getAffiliateLinksForPage("directory", item.slug).map(link => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer sponsored" className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 transition-colors">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{link.label}</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{GLOBAL_AFFILIATE_DISCLOSURE}</p>
              </div>
            )}

            {/* Program Specific FAQs mapping */}
            {item.faqJson && item.faqJson.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-2 pb-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  Frequently Asked Questions
                </h3>

                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {item.faqJson.map((faq, index) => (
                    <div key={index} className="pt-4 first:pt-0 space-y-1.5 text-sm">
                      <h4 className="font-bold text-slate-950 dark:text-white flex items-start gap-1.5">
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 shrink-0 mt-0.5">
                          Q
                        </span>
                        {faq.q}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 pl-6 gap-1 mb-2 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 1-COLUMN: Quick Action details panel & alternatives */}
          <div className="space-y-6">
            
            {/* Action Box sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-md md:sticky md:top-24 space-y-6">
              
              <div className="space-y-3">
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  Visit Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  This review is informational and based on public product information. LahbabiGuide is not the official provider and does not control pricing, limits, or product availability.
                </p>
              </div>

            </div>

            {/* Sidebar bottom Ad Placement slot */}
            <AdPlacementRenderer placementKey="directory-sidebar" />

            {/* Alternatives */}
            {item.alternatives && item.alternatives.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <Compass className="h-4 w-4 text-slate-400" />
                  Popular Alternatives
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.alternatives.map((alt, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-lg">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related items list display */}
            {relatedItems.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <Server className="h-4 w-4 text-slate-400" />
                  Related Platforms
                </h4>

                <div className="space-y-4">
                  {relatedItems.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/directory/${rel.slug}`}
                      className="group flex gap-3 text-xs"
                    >
                      <BrandLogoRenderer companyName={rel.name} officialUrl={rel.officialUrl} size={40} />
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block truncate">
                          {rel.pricingModel}
                        </span>
                        <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 truncate">
                          {rel.name}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
