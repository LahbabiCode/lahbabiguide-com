import { Metadata } from "next";
import Link from "next/link";
import { getPricingPages } from "@/lib/db/queries";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { BadgeDollarSign, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Software Pricing Guides for Startups | LahbabiGuide",
  description: "Understand pricing for developer platforms including Vercel, Supabase, Neon, and Render with startup-friendly upgrade guidance and alternatives.",
  alternates: { canonical: "https://lahbabiguide.com/pricing" },
  openGraph: { title: "Software Pricing Guides for Startups", description: "Startup-friendly pricing explainers for developer platforms.", url: "https://lahbabiguide.com/pricing" },
};

export const revalidate = 3600;

export default async function PricingIndexPage() {
  const pages = await getPricingPages();
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-12 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Pricing", url: "https://lahbabiguide.com/pricing" }]} />
      <ItemListSchema items={pages.map(p => ({ name: p.title, url: `https://lahbabiguide.com/pricing/${p.slug}`, description: p.description }))} url="https://lahbabiguide.com/pricing" />
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
            <BadgeDollarSign className="h-3.5 w-3.5" /> Pricing Guides
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Developer Platform Pricing Explained</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Understand free plans, paid tiers, upgrade signals, and alternatives before committing startup budget to infrastructure tools.</p>
        </header>
        <SmartAdSlot pageType="pricing" position="after-intro" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map(page => (
            <Link key={page.id} href={`/pricing/${page.slug}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">{page.platform}</span>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white mt-4 group-hover:text-blue-600 transition-colors">{page.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3">{page.description}</p>
              <div className="pt-6 flex items-center text-xs font-black text-blue-600 uppercase tracking-widest">Read pricing guide <ArrowRight className="ml-2 h-4 w-4" /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
