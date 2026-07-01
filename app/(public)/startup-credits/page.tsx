import { Metadata } from "next";
import Link from "next/link";
import { getCreditClusterPages } from "@/lib/db/queries";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { Rocket, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Startup Credit Guides by Use Case | LahbabiGuide",
  description: "Browse startup credit clusters for AI startups, SaaS founders, cloud hosting, and bootstrapped founders without VC funding.",
  alternates: { canonical: "https://lahbabiguide.com/startup-credits" },
  openGraph: { title: "Startup Credit Guides by Use Case", description: "Find the right startup credit programs for your business model and infrastructure needs.", url: "https://lahbabiguide.com/startup-credits" },
};

export const revalidate = 3600;

export default async function StartupCreditsIndexPage() {
  const pages = await getCreditClusterPages();
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-12 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Startup Credits", url: "https://lahbabiguide.com/startup-credits" }]} />
      <ItemListSchema items={pages.map(p => ({ name: p.title, url: `https://lahbabiguide.com/startup-credits/${p.slug}`, description: p.description }))} url="https://lahbabiguide.com/startup-credits" />
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600"><Rocket className="h-3.5 w-3.5" /> Credit Clusters</span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Startup Credits by Use Case</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Find cloud, SaaS, and developer credit programs organized by startup type: AI, SaaS, hosting, and bootstrapped founders.</p>
        </header>
        <SmartAdSlot pageType="credit-cluster" position="after-intro" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map(page => <Link key={page.id} href={`/startup-credits/${page.slug}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all"><h2 className="font-display text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{page.title}</h2><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3">{page.description}</p><div className="pt-6 flex items-center text-xs font-black text-blue-600 uppercase tracking-widest">Open credit guide <ArrowRight className="ml-2 h-4 w-4" /></div></Link>)}
        </div>
      </div>
    </div>
  );
}
