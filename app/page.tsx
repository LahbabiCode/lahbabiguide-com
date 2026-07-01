import { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrendingUp, Globe, ShieldCheck, Zap, Code, Terminal, Server, Star } from "lucide-react";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Dev Tools & Startup Credits Directory | LahbabiGuide",
  description: "Discover verified startup credits from AWS, Google, and Stripe. Access a curated directory of free developer utilities and platform comparisons.",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] pb-24 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description: "Directory of developer tools and startup credits.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }}
      </JsonLd>

      {/* 1. SEO Rich Hero + Interaction Wrapper */}
      <section className="relative pt-20 md:pt-32 pb-6 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_40%)]" />

        <div className="container mx-auto max-w-5xl text-center space-y-8 relative z-10">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm transition-all hover:bg-blue-50 dark:hover:bg-slate-800/50">
              <Zap className="h-3.5 w-3.5 fill-blue-600" />
              Verified Developer Resource Index
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Scale Your <span className="text-blue-600">Startup</span> <br className="hidden md:block" /> 
            Faster with Free <span className="relative">
              Resources
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400 opacity-40" viewBox="0 0 100 20" preserveAspectRatio="none">
                 <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            LahbabiGuide.com is a professional directory assisting developers and entrepreneurs in accessing <strong>verified startup credits</strong>, free developer utilities, and infrastructure comparisons.
          </p>
        </div>
      </section>

      {/* 2. Interaction Component Layer */}
      <HomeClient />

      <div className="container mx-auto px-4 max-w-7xl mt-16 space-y-24">
        
        {/* 3. High Viewability Ad Section */}
        <div className="max-w-4xl mx-auto">
          <AdPlacementRenderer placementKey="header-banner" />
        </div>

        {/* 4. Directory Categories (Static Indexable Grid) */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">Curated Categories</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
               Find exactly what you need to optimize your production pipeline or legal startup formation.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Terminal, name: "Web Utilities", count: "10+ Tools", color: "blue", link: "/tools" },
              { icon: Server, name: "Cloud Hosting", count: "15+ Platforms", color: "indigo", link: "/directory" },
              { icon: Code, name: "SaaS Credits", count: "20+ Programs", color: "emerald", link: "/credits" },
              { icon: Star, name: "Comparisons", count: "5+ Reviews", color: "pink", link: "/compare" },
            ].map((cat, i) => (
              <Link key={i} href={cat.link} className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <div className={`h-12 w-12 rounded-2xl bg-${cat.color}-500/10 text-${cat.color}-600 dark:text-${cat.color}-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                   <cat.icon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{cat.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SEO Text Blocks (Why LahbabiGuide?) */}
        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Authority Directory</span>
                <h2 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  Transparent Reviews for <br /> Modern Developers
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  Navigating the landscape of cloud providers and developer tools can be overwhelming. LahbabiGuide simplifies this by providing 
                  objective data on free tiers, startup grants, and performance benchmarks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { title: "No Hidden Costs", desc: "We only feature programs with clear free entry or verified credits." },
                   { title: "Safe for Keys", desc: "Our utilities are client-side only. Your sensitive data never leaves your browser." },
                   { title: "VC Partnered", desc: "Links to official programs from AWS Activate to Google Cloud Founders." },
                   { title: "Always Fresh", desc: "Weekly manual checks to ensure all promo keys and URLs are valid." },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h5>
                     </div>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-blue-600/5 rounded-full blur-3xl absolute -top-12 -left-12 w-full h-full" />
              <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black italic">!</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 dark:text-white leading-none">Security Insight</span>
                    <span className="text-[10px] font-bold text-slate-400">Lahbabi Intelligence Unit</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    &quot;Most developer tools on the web tracking your usage. LahbabiGuide uses client-side encryption and zero-server-log policy for all utility modules, ensuring your JSON blobs and secret keys stay yours alone.&quot;
                  </p>
                  <div className="flex items-center gap-2 opacity-50">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-mono tracking-tighter">TRUST_SCORE: 100/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AdSense Safe Multiplex Placement */}
        <div className="py-12 border-y border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col items-center gap-4 mb-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">Advertisement</span>
          </div>
          <AdPlacementRenderer placementKey="blog-multiplex" />
        </div>

        {/* 7. Final CTA / SEO Footer Link Block */}
        <section className="text-center py-20 space-y-8">
           <h2 className="font-display text-4xl font-black text-slate-900 dark:text-white tracking-tight">Ready to optimize your stack?</h2>
           <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
             Whether you need a quick JSON formatter or a $100k cloud credit program, LahbabiGuide is your technical partner in growth.
           </p>
           <div className="flex flex-wrap justify-center gap-4">
             <Link href="/credits" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">Browse Credits</Link>
             <Link href="/tools" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors">Open Toolkit</Link>
           </div>
        </section>
      </div>
    </div>
  );
}
