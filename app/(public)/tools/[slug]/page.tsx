import { getTools, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { BreadcrumbSchema, SoftwareApplicationSchema, FaqSchema } from "@/components/seo/JsonLd";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface ToolProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: ToolProps): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return { title: "Tool Not Found | LahbabiGuide" };
  }

  const url = `https://lahbabiguide.com/tools/${tool.slug}`;

  return {
    title: `${tool.seoTitle || `${tool.name} | Free Developer Tool`} | LahbabiGuide`,
    description: tool.seoDescription || tool.description,
    keywords: [...tool.tags, "free developer tool", "browser tool", "online utility", "privacy-first tool"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.seoTitle || tool.name,
      description: tool.seoDescription || tool.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle || tool.name,
      description: tool.seoDescription || tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: ToolProps) {
  const { slug } = await params;
  const tools = await getTools();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(tool.id, "tool");
  const url = `https://lahbabiguide.com/tools/${tool.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <SoftwareApplicationSchema tool={tool} url={url} />
      {tool.faqJson && <FaqSchema faqs={tool.faqJson} />}
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Tools", url: "https://lahbabiguide.com/tools" },
        { name: tool.name, url },
      ]} />
      
      <div className="container mx-auto px-4 max-w-7xl pt-8 pb-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Header */}
              <header className="space-y-6">
                <div className="flex items-center justify-between">
                  <Link href="/tools" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to All Tools
                  </Link>
                  <FavoriteButton id={tool.id} type="tool" showLabel />
                </div>

                <div className="space-y-4">
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {tool.name}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                    {tool.description}
                  </p>
                  <div className="pt-2">
                    <RatingStars 
                      id={tool.id} 
                      type="tool" 
                      initialAverage={aggregateRating.average} 
                      initialCount={aggregateRating.count} 
                    />
                  </div>
                </div>
              </header>

              {/* Tool Canvas area */}
              <div className="bg-white dark:bg-[#0B1120] border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-[400px]">
                <div className="mb-8">
                   <AdPlacementRenderer placementKey="header-banner" />
                </div>
                
                {/* Mock interactive area */}
                <div className="bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <Wrench className="h-8 w-8 text-blue-600" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
                      Interaction Engine Initializing...
                   </p>
                   <p className="text-xs max-w-xs mx-auto">
                     The {tool.name} interactive logic for component <strong>{tool.componentKey}</strong> is loading locally.
                   </p>
                </div>

                <div className="mt-12">
                   <AdPlacementRenderer placementKey="content-middle" />
                </div>
              </div>

              {/* Detailed Explanation / Doc Section for SEO */}
              <div className="space-y-10">
                 <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 space-y-6">
                   <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                     How to use the {tool.name}
                   </h2>
                   <div className="prose dark:prose-invert max-w-none text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      <p>
                        The <strong>{tool.name}</strong> is a free browser-based developer utility built for fast,
                        private, and reliable workflows. It helps you handle common development tasks such as
                        formatting, encoding, decoding, validating, generating, or inspecting data directly from
                        your device without uploading sensitive information to a server.
                      </p>
                      <p>
                        To use this tool, paste or enter your input into the interactive workspace, review the
                        generated output, then copy the result into your application, API client, documentation,
                        CI workflow, or debugging session. LahbabiGuide tools are designed for everyday engineering
                        tasks where speed, clarity, and privacy matter.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Privacy First:</strong> processing happens locally in your browser whenever possible.</li>
                          <li><strong>No Account Required:</strong> open the tool and start working immediately.</li>
                          <li><strong>Developer Friendly:</strong> output is optimized for common API, frontend, backend, and DevOps workflows.</li>
                          <li><strong>Free to Use:</strong> no hidden paywall, subscription, or usage limit for standard use.</li>
                      </ul>
                   </div>
                 </section>

                 <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 space-y-6">
                   <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                     Why developers use {tool.name}
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     <div className="space-y-2">
                       <h3 className="font-bold text-slate-900 dark:text-white">Secure local workflow</h3>
                       <p>
                         Many online utilities require uploading text, tokens, or code snippets to a remote server.
                         LahbabiGuide keeps the workflow lightweight and privacy-conscious by avoiding unnecessary
                         backend processing for developer data.
                       </p>
                     </div>
                     <div className="space-y-2">
                       <h3 className="font-bold text-slate-900 dark:text-white">Optimized for daily debugging</h3>
                       <p>
                         Whether you are reviewing API output, preparing production assets, debugging authentication,
                         or creating test data, this tool is structured to reduce repetitive manual work and improve
                         developer productivity.
                       </p>
                     </div>
                   </div>
                 </section>

                 {tool.tags?.length > 0 && (
                   <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
                     <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">Related topics</h2>
                     <div className="flex flex-wrap gap-2">
                       {tool.tags.map(tag => (
                         <span key={tag} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                           {tag}
                         </span>
                       ))}
                     </div>
                   </section>
                 )}

                 {tool.faqJson && tool.faqJson.length > 0 && (
                   <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 space-y-6">
                     <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                       {tool.name} FAQ
                     </h2>
                     <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
                       {tool.faqJson.map((faq, index) => (
                         <div key={index} className="pt-5 first:pt-0 space-y-2">
                           <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                             {faq.q}
                           </h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                             {faq.a}
                           </p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
              </div>

            </div>

            {/* Sidebar (Right - 4 Cols) */}
            <aside className="lg:col-span-4 space-y-10">
               <div className="sticky top-24 space-y-10">
                  
                  {/* Sidebar Ad Unit */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
                    <AdPlacementRenderer placementKey="header-banner" />
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-l-4 border-blue-600 pl-3">Security Standards</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      All tools on LahbabiGuide are verified browser-native components. We specialize in providing platform-independent utilities that guarantee data integrity and developer privacy.
                    </p>
                  </div>

                  {/* Other Tools CTA */}
                  <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-slate-950/20">
                    <h5 className="font-display font-black text-lg">Need another tool?</h5>
                    <p className="text-xs text-slate-400">Browse our library of 50+ professional developer utilities.</p>
                    <Link href="/tools" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition">
                      Explore All Tools
                    </Link>
                  </div>

                  {/* Sidebar Multiplex placeholder */}
                  <div className="opacity-60">
                    <AdPlacementRenderer placementKey="footer-multiplex" />
                  </div>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
}
