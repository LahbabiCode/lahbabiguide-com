import { getComparisons } from "@/lib/db/queries";
import Link from "next/link";
import { Scale, Calendar, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Tech Stack Comparisons | LahbabiGuide",
  description: "Objective comparisons between modern tech stacks, hosting providers, and databases.",
  alternates: {
    canonical: "https://lahbabiguide.com/compare",
  },
  openGraph: {
    title: "Tech Stack Comparisons | LahbabiGuide",
    description: "Objective comparisons between modern tech stacks, hosting providers, and databases.",
    url: "https://lahbabiguide.com/compare",
  },
  twitter: {
    card: "summary",
    title: "Tech Stack Comparisons | LahbabiGuide",
    description: "Objective comparisons between modern tech stacks, hosting providers, and databases.",
  },
};

export const revalidate = 3600;

export default async function ComparisonsIndexPage() {
  const comparisons = await getComparisons();

  const listItems = comparisons.map((comp) => ({
    name: comp.title,
    url: `https://lahbabiguide.com/compare/${comp.slug}`,
    description: comp.seoDescription,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Compare", url: "https://lahbabiguide.com/compare" },
      ]} />
      <ItemListSchema items={listItems} url="https://lahbabiguide.com/compare" />

      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-pink-600 bg-pink-500/10 rounded-full border border-pink-500/20">
            <Scale className="h-3.5 w-3.5" />
            Head-to-Head
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Objective Tech Comparisons
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Detailed teardowns of competitor platforms, performance benchmarks, and pricing analyses to help you pick the right tool for the job.
          </p>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-6">
          {comparisons.map((comp) => (
            <Link key={comp.id} href={`/compare/${comp.slug}`} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-pink-500/50 transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {new Date(comp.createdAt).toLocaleDateString()}
                </div>
                <h3 className="font-extrabold text-2xl text-slate-950 dark:text-white group-hover:text-pink-600 transition-colors">
                  {comp.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">
                  {comp.seoDescription}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] uppercase font-bold tracking-wider">
                  {comp.tags.map(tag => (
                    <span key={tag} className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      VS {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center shrink-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-500 transition-colors shadow-sm">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
