import { getGuideBySlug, getGuides, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { Metadata } from "next";
import { BreadcrumbSchema, ArticleSchema, FaqSchema, JsonLd } from "@/components/seo/JsonLd";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface GuideProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuideProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found | LahbabiGuide" };
  }

  const url = `https://lahbabiguide.com/guides/${guide.slug}`;

  return {
    title: `${guide.seoTitle} | LahbabiGuide`,
    description: guide.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.title,
      description: guide.seoDescription,
      url,
    },
    twitter: {
      card: "summary",
      title: guide.seoTitle,
      description: guide.seoDescription,
    },
  };
}

export default async function GuidePage({ params }: GuideProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(guide.id, "article"); // Using "article" type for guides too or "guide" if I want to be specific.
  // Actually the useFavorites hook uses "article", so I'll stay consistent.
  const url = `https://lahbabiguide.com/guides/${guide.slug}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <ArticleSchema post={guide} url={url} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Guides", url: "https://lahbabiguide.com/guides" },
        { name: guide.title, url },
      ]} />
      {guide.faqJson && <FaqSchema faqs={guide.faqJson} />}
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: guide.title,
          description: guide.seoDescription,
          totalTime: "PT15M"
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-4xl py-12 space-y-10">
        
        {/* Back Link Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/guides" className="hover:text-violet-600 transition flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Guides
          </Link>
        </div>

        {/* Header container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-4">
             <FavoriteButton id={guide.id} type="article" showLabel />
          </div>
          <div className="inline-flex items-center justify-center p-3 bg-violet-50 dark:bg-violet-900/40 rounded-2xl text-violet-600 dark:text-violet-400 mb-2">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {guide.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            {guide.seoDescription}
          </p>
          <div className="flex justify-center mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
             <RatingStars 
                id={guide.id} 
                type="article" 
                initialAverage={aggregateRating.average} 
                initialCount={aggregateRating.count} 
              />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest pt-4">
            <Clock className="h-4 w-4" />
            Last Updated • {new Date(guide.createdAt).toLocaleDateString()}
          </div>
        </div>

        <AdPlacementRenderer placementKey="guide-top" />

        {/* Content Wrapper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="markdown-body prose md:prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
        </div>

        {/* FAQ Section */}
        {guide.faqJson && guide.faqJson.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
              Guide FAQ
            </h3>
            <div className="space-y-6">
              {guide.faqJson.map((faq, index) => (
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

        <AdPlacementRenderer placementKey="guide-multiplex" />

      </div>
    </div>
  );
}
