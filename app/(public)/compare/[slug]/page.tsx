import { getComparisonBySlug, getComparisons, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Scale, Clock, Tag } from "lucide-react";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { Metadata } from "next";
import { BreadcrumbSchema, ArticleSchema, FaqSchema } from "@/components/seo/JsonLd";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface ComparisonProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const comps = await getComparisons();
  return comps.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: ComparisonProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);

  if (!comp) {
    return { title: "Comparison Not Found | LahbabiGuide" };
  }

  const url = `https://lahbabiguide.com/compare/${comp.slug}`;

  return {
    title: `${comp.seoTitle} | LahbabiGuide`,
    description: comp.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: comp.title,
      description: comp.seoDescription,
      url,
    },
    twitter: {
      card: "summary",
      title: comp.seoTitle,
      description: comp.seoDescription,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonProps) {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(comp.id, "article"); // Using "article" for consistency
  const url = `https://lahbabiguide.com/compare/${comp.slug}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <ArticleSchema post={comp} url={url} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Compare", url: "https://lahbabiguide.com/compare" },
        { name: comp.title, url },
      ]} />
      {comp.faqJson && <FaqSchema faqs={comp.faqJson} />}

      <div className="container mx-auto px-4 max-w-4xl py-12 space-y-10">
        
        {/* Back Link Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link href="/compare" className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Comparisons
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5" />
            {new Date(comp.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Header box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
             <FavoriteButton id={comp.id} type="article" showLabel />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 text-slate-50 dark:text-slate-800/30">
            <Scale className="h-48 w-48 rotate-12" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-pink-50 dark:bg-pink-900/40 rounded-2xl text-pink-600 dark:text-pink-400 mb-2 border border-pink-100 dark:border-pink-900/50">
              <Scale className="h-8 w-8" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto">
              {comp.title}
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              {comp.seoDescription}
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
              {comp.tags.map(t => (
                <span key={t} className="px-3 py-1 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex justify-center mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <RatingStars 
                id={comp.id} 
                type="article" 
                initialAverage={aggregateRating.average} 
                initialCount={aggregateRating.count} 
              />
            </div>
          </div>
        </div>

        <AdPlacementRenderer placementKey="compare-top" />

        {/* Content Body */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="markdown-body prose md:prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <ReactMarkdown>{comp.content}</ReactMarkdown>
          </div>
        </div>

        {/* FAQ Section */}
        {comp.faqJson && comp.faqJson.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {comp.faqJson.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {faq.q}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AdSense Multiplex */}
        <AdPlacementRenderer placementKey="compare-multiplex" />

      </div>
    </div>
  );
}
