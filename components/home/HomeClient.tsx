"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Wrench,
  Award,
  Database,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Cpu,
} from "lucide-react";
import { FALLBACK_TOOLS, FALLBACK_CREDITS } from "@/lib/db/fallbackData";
import { BrandLogoRenderer } from "../ui/BrandLogoRenderer";

export function HomeClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [advisorPrompt, setAdvisorPrompt] = useState("");
  const [advisorResponse, setAdvisorResponse] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);

  const filteredTools = FALLBACK_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const filteredCredits = FALLBACK_CREDITS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const handleConsultAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorPrompt.trim()) return;

    setIsConsulting(true);
    setAdvisorResponse("");

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: advisorPrompt }),
      });
      const data = await res.json();
      setAdvisorResponse(data.recommendation || "Our AI Advisor recommends checking AWS Activate or Stripe Atlas for your startup formation needs!");
    } catch (err) {
      setAdvisorResponse(
        "Based on your requirements, we recommend starting with AWS Activate (up to $100k free compute), Microsoft Founders Hub (highly open to early bootstrappers, $150k Azure), Retool ($25k in-house builders), and Stripe Atlas for company incorporation."
      );
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Search Header */}
      <section className="relative -mt-16 md:-mt-24 pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
           <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-1.5 transition-all">
                <Search className="h-5 w-5 text-slate-400 ml-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Find tools, AWS credits, Supabase promo..."
                  className="flex-grow bg-transparent text-base font-medium text-slate-900 dark:text-white px-4 py-3.5 focus:outline-none focus:ring-0"
                />
                <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span className="text-slate-500">Trending:</span>
              <button onClick={() => setSearchTerm("jwt")} className="hover:text-blue-500 transition border-b border-transparent hover:border-blue-500 pb-0.5">JWT Decoder</button>
              <button onClick={() => setSearchTerm("neon")} className="hover:text-blue-500 transition border-b border-transparent hover:border-blue-500 pb-0.5">Neon Postgres</button>
              <button onClick={() => setSearchTerm("vercel")} className="hover:text-blue-500 transition border-b border-transparent hover:border-blue-500 pb-0.5">Vercel Credits</button>
              <button onClick={() => setSearchTerm("stripe")} className="hover:text-blue-500 transition border-b border-transparent hover:border-blue-500 pb-0.5">Stripe Atlas</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hub Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4 max-w-7xl">
        <Link href="/tools" className="group bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wrench className="h-24 w-24 -rotate-12" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-8 border border-blue-100 dark:border-blue-900/30">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-3 tracking-tight">Free Utility Tools</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Essential developer utilities that run 100% in your browser. Secure, fast, and completely free.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Open Web Tools <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/credits" className="group bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Award className="h-24 w-24 -rotate-12" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-900/30">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-3 tracking-tight">Startup Credits</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Access thousands in cloud credits and SaaS discounts. Verified programs for early-stage ventures.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Claim Your Credits <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/directory" className="group bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database className="h-24 w-24 -rotate-12" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-8 border border-purple-100 dark:border-purple-900/30">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-3 tracking-tight">Platform Index</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Discover the best infrastructure for your stack. Detailed reviews of DBs, hosting, and AI APIs.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Explore Platforms <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Dynamic Results Highlight */}
      {(searchTerm || filteredTools.length > 0 || filteredCredits.length > 0) && (
        <section className="container mx-auto px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Tools Results */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Relevant Dev Tools</h2>
                    <Link href="/tools" className="text-xs font-bold text-blue-600">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredTools.map((tool) => (
                      <Link key={tool.id} href={`/tools/${tool.slug}`} className="group bg-white dark:bg-[#0B1120] p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{tool.description.slice(0, 50)}...</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Credits Results */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Available Credits</h2>
                    <Link href="/credits" className="text-xs font-bold text-emerald-600">Explore Store</Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredCredits.map((credit) => (
                      <Link key={credit.id} href={`/credits/${credit.slug}`} className="group bg-white dark:bg-[#0B1120] p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3 text-left">
                          <BrandLogoRenderer companyName={credit.company} officialUrl={credit.officialUrl} size={32} />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{credit.name}</h4>
                            <span className="text-[9px] font-black uppercase text-emerald-500">{credit.creditValue}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
           </div>
        </section>
      )}

      {/* AI Advisor Integrated Tool */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="bg-[#0B1120] dark:bg-[#0F172A] rounded-[2.5rem] border border-slate-800/50 p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full -ml-32 -mb-32" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Smart Advisor</span>
              </div>
              <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-[1.1]">
                Not sure where to start? <span className="text-slate-400">Ask the Resource Advisor.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Describe your project, your stack, and your goals. Our AI will map out the perfect set of credits, tools, and platforms for your journey.
              </p>
            </div>

            <div className="lg:col-span-3">
               <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] space-y-6 backdrop-blur-sm">
                  <form onSubmit={handleConsultAdvisor} className="space-y-4">
                    <textarea
                      value={advisorPrompt}
                      onChange={(e) => setAdvisorPrompt(e.target.value)}
                      rows={3}
                      placeholder="e.g. We are building a high-traffic e-commerce with Next.js and need a managed Postgres DB with $10k+ free credits..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                    <button 
                      type="submit" 
                      disabled={isConsulting}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      {isConsulting ? "Consulting AI..." : "Generate My Roadmap"}
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </form>

                  {advisorResponse && (
                    <div className="bg-slate-950/60 border border-white/5 p-6 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest leading-none">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        Ai Suggestions
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-mono">
                        {advisorResponse}
                      </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
