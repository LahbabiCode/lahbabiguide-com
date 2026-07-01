import { getBlogPostBySlug, getBlogPosts, getAggregateRating } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag, BookOpen, HelpCircle } from "lucide-react";
import { AdPlacementRenderer } from "@/components/ads/AdPlacementRenderer";
import { Metadata } from "next";
import { BreadcrumbSchema, ArticleSchema, FaqSchema } from "@/components/seo/JsonLd";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { RatingStars } from "@/components/ui/rating-stars";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | LahbabiGuide" };
  }

  const url = `https://lahbabiguide.com/blog/${post.slug}`;

  return {
    title: `${post.seoTitle} | LahbabiGuide`,
    description: post.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      url,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const aggregateRating = await getAggregateRating(post.id, "article");
  const url = `https://lahbabiguide.com/blog/${post.slug}`;
  const readingTime = Math.ceil(post.content.length / 1500);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen transition-colors duration-300">
      <ArticleSchema post={post} url={url} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Blog", url: "https://lahbabiguide.com/blog" },
        { name: post.title, url },
      ]} />
      {post.faqJson && <FaqSchema faqs={post.faqJson} />}

      <div className="container mx-auto px-4 max-w-7xl pt-8 pb-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content (Left) */}
            <article className="lg:col-span-8 space-y-10">
              
              {/* Header */}
              <header className="space-y-6">
                <div className="flex items-center justify-between">
                  <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Blog
                  </Link>
                  <FavoriteButton id={post.id} type="article" showLabel />
                </div>

                <div className="space-y-4">
                  <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                       <Calendar className="h-3.5 w-3.5" />
                       {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                       <BookOpen className="h-3.5 w-3.5" />
                       {readingTime} MIN READ
                    </span>
                  </div>
                </div>
              </header>

              {post.featuredImage && (
                <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 relative h-[300px] md:h-[550px]">
                   <Image 
                     src={post.featuredImage} 
                     alt={post.title} 
                     fill 
                     className="object-cover" 
                     referrerPolicy="no-referrer"
                     priority
                   />
                </div>
              )}

              {/* Top Ad Unit */}
              <AdPlacementRenderer placementKey="blog-top" />

              {/* Content body with improved typography */}
              <div className="bg-white dark:bg-[#0B1120] border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                <div className="markdown-body prose lg:prose-xl dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>

              {/* In-Article Ad Unit */}
              <AdPlacementRenderer placementKey="content-middle" />

              {/* Tags & Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Tags</h4>
                   <div className="flex flex-wrap gap-2">
                     {post.tags?.map(t => (
                       <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 rounded-lg">
                         #{t}
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 text-center md:text-left">
                   <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">Helpful Guide?</h4>
                   <RatingStars 
                     id={post.id} 
                     type="article" 
                     initialAverage={aggregateRating.average} 
                     initialCount={aggregateRating.count} 
                   />
                 </div>
              </div>

              {/* FAQ / Related Questions */}
              {post.faqJson && post.faqJson.length > 0 && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 space-y-8">
                  <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                    Essential FAQs
                  </h3>
                  <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                    {post.faqJson.map((faq, index) => (
                      <div key={index} className="pt-6 first:pt-0 space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                          {faq.q}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multiplex / Footer Ads */}
              <AdPlacementRenderer placementKey="blog-multiplex" />

            </article>

            {/* Sidebar (Right - 3 Cols) */}
            <aside className="lg:col-span-4 space-y-10">
               <div className="sticky top-24 space-y-10">
                  
                  {/* High Performing Display Ad */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
                    <AdPlacementRenderer placementKey="header-banner" />
                  </div>

                  {/* Author / Trust Section */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-500/20">
                        Z
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">Zakaria Lahbabi</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Lead</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Engineering specialized in scaling production architectures and optimizing developer growth platforms.
                    </p>
                  </div>

                  {/* Sidebar Ticker Ad */}
                  <div className="opacity-80">
                    <AdPlacementRenderer placementKey="tool-list-feed" />
                  </div>

                  {/* Quick Action Navigation */}
                  <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4">
                    <h5 className="font-display font-black text-lg">Next Steps?</h5>
                    <div className="grid grid-cols-1 gap-2">
                       <Link href="/credits" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition">Browse Best Startup Credits</Link>
                       <Link href="/tools" className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition">Try Free Dev Utilities</Link>
                    </div>
                  </div>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
}
