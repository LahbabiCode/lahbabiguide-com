import { Metadata } from "next";
import Link from "next/link";
import { getTools, getCredits, getDirectoryItems, getBlogPosts, getGuides, getComparisons } from "@/lib/db/queries";
import { JsonLd } from "@/components/seo/JsonLd";
import { Map, Wrench, Award, Server, BookOpen, Compass, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "HTML Sitemap - Browse All LahbabiGuide Pages | LahbabiGuide",
  description:
    "Browse every major LahbabiGuide page including developer tools, startup credits, platform reviews, blog posts, guides, comparisons, and legal resources.",
  alternates: { canonical: "https://lahbabiguide.com/sitemap" },
  openGraph: {
    title: "HTML Sitemap - Browse All LahbabiGuide Pages",
    description: "Find every major tool, startup credit, platform review, article, guide, and comparison on LahbabiGuide.",
    url: "https://lahbabiguide.com/sitemap",
    type: "website",
  },
};

const corePages = [
  { name: "Home", href: "/" },
  { name: "About LahbabiGuide", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Resource Hub", href: "/resources" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Use", href: "/terms" },
  { name: "Editorial Policy", href: "/editorial-policy" },
  { name: "Advertising Disclosure", href: "/advertising-disclosure" },
];

function SitemapSection({ title, icon: Icon, items }: { title: string; icon: any; items: { name: string; href: string; description?: string }[] }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 hover:border-blue-500 transition-colors">
            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.name}</span>
            {item.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HtmlSitemapPage() {
  const [tools, credits, platforms, posts, guides, comparisons] = await Promise.all([
    getTools(),
    getCredits(),
    getDirectoryItems(),
    getBlogPosts(),
    getGuides(),
    getComparisons(),
  ]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "HTML Sitemap",
          url: "https://lahbabiguide.com/sitemap",
          description: "Human-readable sitemap for LahbabiGuide public pages and resources.",
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Map className="h-3.5 w-3.5" />
            Site Navigation
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            LahbabiGuide HTML Sitemap
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Browse all major LahbabiGuide pages, tools, credits, platform reviews, guides, articles, and comparisons from one indexable page.
          </p>
        </header>

        <SitemapSection title="Core Pages" icon={Compass} items={corePages.map(p => ({ name: p.name, href: p.href }))} />
        <SitemapSection title="Developer Tools" icon={Wrench} items={tools.map(t => ({ name: t.name, href: `/tools/${t.slug}`, description: t.description }))} />
        <SitemapSection title="Startup Credits" icon={Award} items={credits.map(c => ({ name: c.name, href: `/credits/${c.slug}`, description: c.shortDescription }))} />
        <SitemapSection title="Platform Directory" icon={Server} items={platforms.map(p => ({ name: p.name, href: `/directory/${p.slug}`, description: p.description }))} />
        <SitemapSection title="Blog Articles" icon={BookOpen} items={posts.map(p => ({ name: p.title, href: `/blog/${p.slug}`, description: p.seoDescription }))} />
        <SitemapSection title="Guides" icon={Compass} items={guides.map(g => ({ name: g.title, href: `/guides/${g.slug}`, description: g.seoDescription }))} />
        <SitemapSection title="Comparisons" icon={Scale} items={comparisons.map(c => ({ name: c.title, href: `/compare/${c.slug}`, description: c.seoDescription }))} />
      </div>
    </div>
  );
}
