import { getGuides } from "@/lib/db/queries";
import Link from "next/link";
import { Compass, Calendar, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Developer Guides & Tutorials | LahbabiGuide",
  description: "Step-by-step technical guides, modern stack tutorials, and deployment documentation for developers.",
  alternates: {
    canonical: "https://lahbabiguide.com/guides",
  },
  openGraph: {
    title: "Developer Guides & Tutorials | LahbabiGuide",
    description: "Step-by-step technical guides, modern stack tutorials, and deployment documentation for developers.",
    url: "https://lahbabiguide.com/guides",
  },
  twitter: {
    card: "summary",
    title: "Developer Guides & Tutorials | LahbabiGuide",
    description: "Step-by-step technical guides, modern stack tutorials, and deployment documentation for developers.",
  },
};

export const revalidate = 3600;

export default async function GuidesIndexPage() {
  const guides = await getGuides();

  const listItems = guides.map((g) => ({
    name: g.title,
    url: `https://lahbabiguide.com/guides/${g.slug}`,
    description: g.seoDescription,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Guides", url: "https://lahbabiguide.com/guides" },
      ]} />
      <ItemListSchema items={listItems} url="https://lahbabiguide.com/guides" />

      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-violet-600 bg-violet-500/10 rounded-full border border-violet-500/20">
            <Compass className="h-3.5 w-3.5" />
            Tutorials & Instructions
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Comprehensive Developer Guides
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            In-depth tutorials and infrastructure configurations designed for startup teams moving fast.
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-violet-500/50 transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-grow">
                <h3 className="font-extrabold text-xl text-slate-950 dark:text-white group-hover:text-violet-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">
                  {guide.seoDescription}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-medium">
                  {new Date(guide.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="px-3 py-1.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold rounded-lg flex items-center gap-1 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  Read Guide <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
