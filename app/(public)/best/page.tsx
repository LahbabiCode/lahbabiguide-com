import { Metadata } from "next";
import Link from "next/link";
import { getBestPages } from "@/lib/db/queries";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { Trophy, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Developer Tools, Credits & Platform Alternatives | LahbabiGuide",
  description: "Browse LahbabiGuide best-of lists for developer tools, cloud credits, hosting alternatives, database alternatives, and AI startup grants.",
  alternates: { canonical: "https://lahbabiguide.com/best" },
  openGraph: {
    title: "Best Developer Tools, Credits & Platform Alternatives",
    description: "Curated best-of pages for high-value developer and startup decisions.",
    url: "https://lahbabiguide.com/best",
  },
};

export const revalidate = 3600;

export default async function BestIndexPage() {
  const pages = await getBestPages();

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-12 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Best", url: "https://lahbabiguide.com/best" }]} />
      <ItemListSchema items={pages.map(p => ({ name: p.title, url: `https://lahbabiguide.com/best/${p.slug}`, description: p.description }))} url="https://lahbabiguide.com/best" />

      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-amber-600">
            <Trophy className="h-3.5 w-3.5" />
            Best-of Guides
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Best Tools, Credits & Alternatives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            High-intent buying and research guides for founders comparing free tools, cloud credits, hosting platforms, database alternatives, and AI startup resources.
          </p>
        </header>

        <SmartAdSlot pageType="best" position="after-intro" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Link key={page.id} href={`/best/${page.slug}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/40">
                  {page.category}
                </span>
                <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{page.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{page.description}</p>
                <div className="pt-4 flex items-center text-xs font-black text-blue-600 uppercase tracking-widest">
                  Read guide <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
