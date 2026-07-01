import { getBlogPosts, getBlogCategories } from "@/lib/db/queries";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";

export const metadata: Metadata = {
  title: "Blog & Articles | LahbabiGuide",
  description: "Read our latest thoughts on software engineering, startups, scaling, and developer tools.",
  alternates: {
    canonical: "https://lahbabiguide.com/blog",
  },
  openGraph: {
    title: "Blog & Articles | LahbabiGuide",
    description: "Read our latest thoughts on software engineering, startups, scaling, and developer tools.",
    url: "https://lahbabiguide.com/blog",
  },
  twitter: {
    card: "summary",
    title: "Blog & Articles | LahbabiGuide",
    description: "Read our latest thoughts on software engineering, startups, scaling, and developer tools.",
  },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  const listItems = posts.map(p => ({
    name: p.title,
    url: `https://lahbabiguide.com/blog/${p.slug}`,
    description: p.seoDescription,
  }));

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-12 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Blog", url: "https://lahbabiguide.com/blog" },
      ]} />
      <ItemListSchema items={listItems} url="https://lahbabiguide.com/blog" />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-widest uppercase text-blue-600 bg-blue-500/10 rounded-full border border-blue-500/20">
            <BookOpen className="h-3.5 w-3.5" />
            Engineering & Strategy
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            LahbabiGuide Blog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Technical deep dives, startup scaling strategies, and architectural insights for the modern web.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Categories (Simple tabs) */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-500/20 cursor-pointer">
                All Articles
              </span>
              {categories.map((c) => (
                <span key={c.id} className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500 transition cursor-pointer">
                  {c.name}
                </span>
              ))}
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  {post.featuredImage && (
                    <div className="w-full h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border border-white/20">
                            Article
                         </span>
                      </div>
                    </div>
                  )}
                  <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="font-display font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-grow">
                      {post.seoDescription}
                    </p>
                    <div className="pt-6 flex items-center text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] border-t border-slate-50 dark:border-slate-800">
                      Read Full Article <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Placeholder (AdSense safety) */}
            <div className="pt-8">
               <AdPlacementRenderer placementKey="tool-list-feed" />
            </div>
          </div>

          {/* RIGHT SIDEBAR (For Desktop Ads & Info) */}
          <aside className="lg:col-span-1 space-y-10">
            <div className="sticky top-24 space-y-10">
              
              {/* Sidebar Ad Unit */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
                <AdPlacementRenderer placementKey="blog-top" />
              </div>

              {/* Newsletter / Static Info Callout */}
              <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full -mr-12 -mt-12" />
                <h4 className="font-display font-black text-xl leading-tight">Stay ahead in Engineering</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Join our weekly digest of curated developer tools and startup scaling guides.
                </p>
                <div className="pt-2">
                   <button className="w-full bg-white text-blue-600 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-blue-50 transition">
                      Get Latest Articles
                   </button>
                </div>
              </div>

              {/* Popular Tags Indexing */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-[0.2em] border-l-4 border-blue-600 pl-3">Popular Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Scale', 'Postgres', 'Startup', 'Cloud'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 transition cursor-pointer uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sidebar ad 2 */}
              <div className="opacity-60">
                 <AdPlacementRenderer placementKey="compare-top" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
