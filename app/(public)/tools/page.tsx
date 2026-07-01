import { getTools, getToolCategories } from "@/lib/db/queries";
import Link from "next/link";
import { Metadata } from "next";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Developer Tools | LahbabiGuide",
  description: "Handcrafted collection of free utility tools for developers including JSON formatters, Encoders, Decorers, UUID generators, and more. Privacy-focused, browser-native.",
  alternates: {
    canonical: "https://lahbabiguide.com/tools",
  },
};

export const revalidate = 3600;

export default async function ToolsIndexPage() {
  const [tools, categories] = await Promise.all([
    getTools(),
    getToolCategories(),
  ]);

  const sortedTools = [...tools].sort((a, b) => a.order - b.order);

  const itemList = sortedTools.map(t => ({
    name: t.name,
    url: `https://lahbabiguide.com/tools/${t.slug}`,
    description: t.description,
  }));

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Tools", url: "https://lahbabiguide.com/tools" },
      ]} />
      <ItemListSchema items={itemList} url="https://lahbabiguide.com/tools" />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header with Search & Info */}
        <div className="mb-12 space-y-6 max-w-4xl">
          <div className="space-y-4">
             <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                <Wrench className="h-3.5 w-3.5" />
                Developer Utility Engine
             </span>
             <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
               Free Professional <span className="text-blue-600">Developer Tools</span>
             </h1>
             <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
               Handcrafted, open-source utilities for formatting, decoding, and generating developer assets. No trackers, no cookies, just code.
             </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition">
              All Utilities
            </button>
            {categories.map(cat => (
              <button key={cat.id} className="px-5 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-blue-500 transition active:scale-95">
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ad Placement Top */}
        <div className="mb-12">
           <AdPlacementRenderer placementKey="header-banner" />
        </div>

        {/* Grid Layout: Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTools.map((tool, idx) => {
            const isLarge = idx === 0 || idx === 5;
            return (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.slug}`}
                className={`group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 ${isLarge ? "md:col-span-2" : ""}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    {tool.name.slice(0, 1)}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Utility {idx + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                  Open Tool
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ad Placement Bottom Multiplex */}
        <div className="mt-16">
           <AdPlacementRenderer placementKey="footer-multiplex" />
        </div>

        {/* SEO Text Block */}
        <div className="mt-20 p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 max-w-4xl">
           <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">Professional Grade Developer Handhelds</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              <p>
                Developer tools shouldn&apos;t be bloated with ads and trackers. At LahbabiGuide, we build essential utilities that run entirely in your browser. Whether you need to decode a JWT to debug a permission issue or format a messy JSON payload from an API, our tools are built for speed and privacy.
              </p>
              <p>
                Every utility is tested against edge cases. We support industry standards like UUID v4 generation, base64 data URI encoding, and percent-encoding for complex URL structures. All calculations happen locally, meaning your data never leaves your machine.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
