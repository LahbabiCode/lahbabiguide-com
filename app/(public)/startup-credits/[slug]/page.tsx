import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCreditClusterPageBySlug, getCreditClusterPages, getCredits } from "@/lib/db/queries";
import { BreadcrumbSchema, FaqSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { NewsletterForm } from "@/components/lead/NewsletterForm";
import { getAffiliateLinksForPage, GLOBAL_AFFILIATE_DISCLOSURE } from "@/lib/monetization/affiliateLinks";
import { ArrowLeft, Rocket, CheckCircle2, ArrowRight } from "lucide-react";

interface ClusterProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const pages = await getCreditClusterPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ClusterProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCreditClusterPageBySlug(slug);
  if (!page) return { title: "Credit Guide Not Found | LahbabiGuide" };
  const url = `https://lahbabiguide.com/startup-credits/${page.slug}`;
  return { title: `${page.seoTitle} | LahbabiGuide`, description: page.seoDescription, keywords: page.tags, alternates: { canonical: url }, openGraph: { title: page.title, description: page.seoDescription, url, type: "article" }, twitter: { card: "summary_large_image", title: page.seoTitle, description: page.seoDescription } };
}

export default async function CreditClusterPage({ params }: ClusterProps) {
  const { slug } = await params;
  const page = await getCreditClusterPageBySlug(slug);
  if (!page) notFound();
  const credits = await getCredits();
  const matched = page.creditSlugs.map(slug => credits.find(c => c.slug === slug)).filter(Boolean) as typeof credits;
  const url = `https://lahbabiguide.com/startup-credits/${page.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Startup Credits", url: "https://lahbabiguide.com/startup-credits" }, { name: page.title, url }]} />
      <ItemListSchema items={matched.map(c => ({ name: c.name, url: `https://lahbabiguide.com/credits/${c.slug}`, description: c.shortDescription }))} url={url} />
      <FaqSchema faqs={page.faqs} />
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/startup-credits" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-3.5 w-3.5" /> Back to Credit Guides</Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-10">
            <header className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-6"><span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40"><Rocket className="h-3.5 w-3.5" /> Startup credits</span><h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{page.title}</h1><p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{page.intro}</p></header>
            <SmartAdSlot pageType="credit-cluster" position="after-intro" />
            <section className="space-y-6">{matched.map((credit, index) => <article key={credit.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4"><div className="flex items-start gap-5"><div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">{index + 1}</div><div><h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">{credit.name}</h2><p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{credit.shortDescription}</p><span className="inline-flex mt-3 text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1 rounded-full">{credit.creditValue}</span></div></div><Link href={`/credits/${credit.slug}`} className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition">View credit details <ArrowRight className="h-4 w-4" /></Link></article>)}</section>
            <SmartAdSlot pageType="credit-cluster" position="mid-content" />
            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5"><h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Eligibility tips</h2>{page.eligibilityTips.map(tip => <p key={tip} className="flex gap-2 text-sm text-slate-500 dark:text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{tip}</p>)}</section>
            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6"><h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">FAQ</h2>{page.faqs.map(faq => <div key={faq.q} className="border-t border-slate-100 dark:border-slate-800 first:border-t-0 pt-5 first:pt-0"><h3 className="font-bold text-slate-900 dark:text-white">{faq.q}</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{faq.a}</p></div>)}</section>
            <SmartAdSlot pageType="credit-cluster" position="multiplex-end" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">Partner programs</h3>
              {getAffiliateLinksForPage("credit-cluster", page.slug).length > 0 ? (
                <ul className="space-y-3">
                  {getAffiliateLinksForPage("credit-cluster", page.slug).map(link => (
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

            <NewsletterForm variant="card" source={`startup-credits/${page.slug}`} />
          </main>
          <aside className="lg:col-span-4 space-y-8"><div className="sticky top-24 space-y-8"><SmartAdSlot pageType="credit-cluster" position="sidebar" /><div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4"><h3 className="font-display text-xl font-black">Browse all programs</h3><Link href="/credits" className="block text-center py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">All Startup Credits</Link></div></div></aside>
        </div>
      </div>
    </div>
  );
}
