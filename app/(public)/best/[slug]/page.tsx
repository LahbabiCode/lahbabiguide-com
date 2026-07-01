import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBestPageBySlug, getBestPages } from "@/lib/db/queries";
import { BreadcrumbSchema, FaqSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { NewsletterForm } from "@/components/lead/NewsletterForm";
import { getAffiliateLinksForPage, GLOBAL_AFFILIATE_DISCLOSURE } from "@/lib/monetization/affiliateLinks";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, ArrowRight } from "lucide-react";

interface BestPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getBestPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getBestPageBySlug(slug);
  if (!page) return { title: "Best Guide Not Found | LahbabiGuide" };
  const url = `https://lahbabiguide.com/best/${page.slug}`;
  return {
    title: `${page.seoTitle} | LahbabiGuide`,
    description: page.seoDescription,
    keywords: page.tags,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.seoDescription, url, type: "article" },
    twitter: { card: "summary_large_image", title: page.seoTitle, description: page.seoDescription },
  };
}

export default async function BestDetailPage({ params }: BestPageProps) {
  const { slug } = await params;
  const page = await getBestPageBySlug(slug);
  if (!page) notFound();
  const url = `https://lahbabiguide.com/best/${page.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Best", url: "https://lahbabiguide.com/best" }, { name: page.title, url }]} />
      <ItemListSchema items={page.items.map(i => ({ name: i.name, url: `https://lahbabiguide.com${i.href}`, description: i.description }))} url={url} />
      <FaqSchema faqs={page.faqs} />

      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/best" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Best Guides
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-10">
            <header className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/40">
                <Trophy className="h-3.5 w-3.5" /> {page.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{page.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{page.intro}</p>
            </header>

            <SmartAdSlot pageType="best" position="after-intro" />

            <section className="space-y-6">
              {page.items.map((item, index) => (
                <article key={item.href} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
                  <div className="flex items-start gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0">{index + 1}</div>
                    <div className="space-y-3 flex-grow">
                      <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">{item.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                      {item.value && <span className="inline-flex text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1 rounded-full">{item.value}</span>}
                    </div>
                  </div>

                  {(item.pros || item.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.pros && <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-5 space-y-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">Pros</h3>
                        {item.pros.map(pro => <p key={pro} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{pro}</p>)}
                      </div>}
                      {item.cons && <div className="rounded-2xl bg-rose-50/60 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 p-5 space-y-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">Watch out</h3>
                        {item.cons.map(con => <p key={con} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400"><XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />{con}</p>)}
                      </div>}
                    </div>
                  )}

                  <Link href={item.href} className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition">
                    Open full resource <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </section>

            <SmartAdSlot pageType="best" position="mid-content" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              {page.faqs.map(faq => (
                <div key={faq.q} className="space-y-2 border-t border-slate-100 dark:border-slate-800 first:border-t-0 pt-5 first:pt-0">
                  <h3 className="font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </section>

            <SmartAdSlot pageType="best" position="multiplex-end" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">Partner programs</h3>
              {getAffiliateLinksForPage("best", page.slug).length > 0 ? (
                <ul className="space-y-3">
                  {getAffiliateLinksForPage("best", page.slug).map(link => (
                    <li key={link.href} className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4">
                      <a href={link.href} target="_blank" rel="noopener noreferrer sponsored" className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600">
                        {link.label}
                      </a>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-slate-500 dark:text-slate-400">No partner programs linked from this guide yet.</p>}
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{GLOBAL_AFFILIATE_DISCLOSURE}</p>
            </section>

            <NewsletterForm variant="card" source={`best/${page.slug}`} />
          </main>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <SmartAdSlot pageType="best" position="sidebar" />
              <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4">
                <h3 className="font-display text-xl font-black">Need more startup resources?</h3>
                <Link href="/resources" className="block w-full text-center py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Open Resource Hub</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
