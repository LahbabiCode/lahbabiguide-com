import { getDirectoryItems, getDirectoryCategories } from "@/lib/db/queries";
import { DirectoryClient } from "@/components/directory/DirectoryClient";
import { Server } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Developer Platforms & Tools Directory | LahbabiGuide",
  description: "Discover top developer platforms including Vercel, Supabase, Neon Postgres, and more. Compare features, pros, cons, and pricing models.",
  keywords: ["developer platforms", "frontend cloud", "serverless databases", "vercel", "supabase", "neon", "open source alternatives"],
  alternates: {
    canonical: "https://lahbabiguide.com/directory",
  },
  openGraph: {
    title: "Developer Platforms & Tools Directory | LahbabiGuide",
    description: "Discover top developer platforms including Vercel, Supabase, Neon Postgres, and more. Compare features, pros, cons, and pricing models.",
    url: "https://lahbabiguide.com/directory",
  },
  twitter: {
    card: "summary",
    title: "Developer Platforms & Tools Directory | LahbabiGuide",
    description: "Discover top developer platforms including Vercel, Supabase, Neon Postgres, and more. Compare features, pros, cons, and pricing models.",
  },
};

export const revalidate = 3600;

export default async function DirectoryPage() {
  const [items, categories] = await Promise.all([
    getDirectoryItems(),
    getDirectoryCategories(),
  ]);

  const listItems = items.map((c) => ({
    name: c.name,
    url: `https://lahbabiguide.com/directory/${c.slug}`,
    description: c.description,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 transition-colors duration-300">
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://lahbabiguide.com" },
        { name: "Directory", url: "https://lahbabiguide.com/directory" },
      ]} />
      <ItemListSchema items={listItems} url="https://lahbabiguide.com/directory" />

      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        
        {/* Header Breadcrumbs & Titles */}
        <div className="text-center md:text-left space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-widest uppercase text-blue-600 bg-blue-500/10 rounded-full border border-blue-500/20">
            <Server className="h-3.5 w-3.5" />
            Ecosystem Directory
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Developer Platforms & Tech Stack Components
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Explore and compare the best infrastructure, databases, and UI frameworks for your next project. We review popular SaaS tools, open-source alternatives, and generous free-tier platforms.
          </p>
        </div>

        {/* Directory Search & Filters hydrate */}
        <DirectoryClient initialItems={items} categories={categories} />

      </div>
    </div>
  );
}
