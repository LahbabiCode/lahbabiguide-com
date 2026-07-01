import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPricingPageBySlug, getPricingPages } from "@/lib/db/queries";
import { BreadcrumbSchema, FaqSchema } from "@/components/seo/JsonLd";
import { SmartAdSlot } from "@/components/ads/SmartAdSlot";
import { NewsletterForm } from "@/components/lead/NewsletterForm";
import { getAffiliateLinksForPage, GLOBAL_AFFILIATE_DISCLOSURE } from "@/lib/monetization/affiliateLinks";
import { ArrowLeft, BadgeDollarSign, CheckCircle2, ArrowRight } from "lucide-react";

interface PricingPageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const pages = await getPricingPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPricingPageBySlug(slug);
  if (!page) return { title: "Pricing Guide Not Found | LahbabiGuide" };
  const url = `https://lahbabiguide.com/pricing/${page.slug}`;
  return {
    title: `${page.seoTitle} | LahbabiGuide`,
    description: page.seoDescription,
    keywords: page.tags,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.seoDescription, url, type: "article" },
    twitter: { card: "summary_large_image", title: page.seoTitle, description: page.seoDescription },
  };
}

export default async function PricingDetailPage({ params }: PricingPageProps) {
  const { slug } = await params;
  const page = await getPricingPageBySlug(slug);
  if (!page) notFound();
  const url = `https://lahbabiguide.com/pricing/${page.slug}`;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://lahbabiguide.com" }, { name: "Pricing", url: "https://lahbabiguide.com/pricing" }, { name: page.title, url }]} />
      <FaqSchema faqs={page.faqs} />
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/pricing" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-3.5 w-3.5" /> Back to Pricing</Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-10">
            <header className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40"><BadgeDollarSign className="h-3.5 w-3.5" /> {page.platform}</span>
              <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{page.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{page.description}</p>
            </header>

            <SmartAdSlot pageType="pricing" position="after-intro" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Free plan overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{page.freePlan}</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
                <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">Paid plans usually cover</h2>
                {page.paidPlans.map(plan => <p key={plan} className="flex gap-2 text-sm text-slate-500 dark:text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{plan}</p>)}
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
                <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">Upgrade when</h2>
                {page.upgradeWhen.map(signal => <p key={signal} className="flex gap-2 text-sm text-slate-500 dark:text-slate-400"><CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />{signal}</p>)}
              </div>
            </section>

            <SmartAdSlot pageType="pricing" position="mid-content" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Alternatives to compare</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.alternatives.map(alt => <Link key={alt.href} href={alt.href} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 hover:border-blue-500 transition-colors"><h3 className="font-bold text-slate-900 dark:text-white">{alt.name}</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{alt.description}</p></Link>)}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Pricing FAQ</h2>
              {page.faqs.map(faq => <div key={faq.q} className="border-t border-slate-100 dark:border-slate-800 first:border-t-0 pt-5 first:pt-0"><h3 className="font-bold text-slate-900 dark:text-white">{faq.q}</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{faq.a}</p></div>)}
            </section>

            <SmartAdSlot pageType="pricing" position="multiplex-end" />

            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">Partner programs</h3>
              {getAffiliateLinksForPage("pricing", page.slug).length > 0 ? (
                <ul className="space-y-3">
                  {getAffiliateLinksForPage("pricing", page.slug).map(link => (
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

            <NewsletterForm variant="card" source={`pricing/${page.slug}`} />
          </main>
          <aside className="lg:col-span-4 space-y-8"><div className="sticky top-24 space-y-8"><SmartAdSlot pageType="pricing" position="sidebar" /><div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4"><h3 className="font-display text-xl font-black">Need the cheaper route?</h3><Link href="/best/free-cloud-credits" className="block text-center py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Find Free Credits <ArrowRight className="inline h-3 w-3 ml-1" /></Link></div></div></aside>
        </div>
      </div>
    </div>
  );
}
