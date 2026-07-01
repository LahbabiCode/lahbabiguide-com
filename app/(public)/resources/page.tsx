import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Wrench, Award, Server, BookOpen, Scale, Rocket, Bug, Network, ArrowRight } from "lucide-react";
import { NewsletterForm } from "@/components/lead/NewsletterForm";

export const metadata: Metadata = {
  title: "Free Developer and Startup Resources | LahbabiGuide",
  description:
    "Explore free developer tools, startup credit programs, platform reviews, technical guides, and stack comparisons for founders and software engineers.",
  alternates: { canonical: "https://lahbabiguide.com/resources" },
  openGraph: {
    title: "Free Developer and Startup Resources | LahbabiGuide",
    description:
      "A curated resource hub for developer tools, startup credits, platform reviews, guides, and tech stack comparisons.",
    url: "https://lahbabiguide.com/resources",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Developer and Startup Resources | LahbabiGuide",
    description: "Tools, credits, platform reviews, guides, and comparisons for builders.",
  },
};

const resourceSections = [
  {
    icon: Wrench,
    title: "Free Developer Tools",
    description: "Browser-native utilities for formatting JSON, decoding JWTs, generating UUIDs, encoding Base64, creating QR codes, and debugging HTTP responses.",
    href: "/tools",
    links: [
      { name: "JSON Formatter", href: "/tools/json-formatter" },
      { name: "JWT Decoder", href: "/tools/jwt-decoder" },
      { name: "HTTP Status Codes", href: "/tools/http-status-codes" },
    ],
  },
  {
    icon: Award,
    title: "Startup Credit Programs",
    description: "Verified cloud grants, SaaS discounts, and startup benefits from AWS, Google Cloud, Microsoft, OpenAI, Stripe, and other providers.",
    href: "/credits",
    links: [
      { name: "AWS Activate", href: "/credits/aws-activate-startups" },
      { name: "Google Cloud Startups", href: "/credits/google-startups-cloud" },
      { name: "Microsoft Founders Hub", href: "/credits/microsoft-founders-hub" },
    ],
  },
  {
    icon: Server,
    title: "Platform Reviews",
    description: "Explore hosting providers, databases, UI frameworks, and developer platforms with pros, cons, pricing notes, and alternatives.",
    href: "/directory",
    links: [
      { name: "Vercel", href: "/directory/vercel" },
      { name: "Supabase", href: "/directory/supabase" },
      { name: "Neon Postgres", href: "/directory/neon-postgres" },
    ],
  },
  {
    icon: BookOpen,
    title: "Technical Guides",
    description: "Step-by-step tutorials for modern web stacks, authentication, local databases, deployment workflows, and startup infrastructure.",
    href: "/guides",
    links: [
      { name: "Auth.js with Next.js", href: "/guides/setting-up-auth-js-nextjs-15" },
      { name: "Local Postgres with Docker", href: "/guides/local-postgres-docker" },
    ],
  },
  {
    icon: Scale,
    title: "Stack Comparisons",
    description: "Objective comparisons of hosting providers, ORMs, databases, and infrastructure choices for startup engineering teams.",
    href: "/compare",
    links: [
      { name: "Vercel vs Cloudflare vs Netlify", href: "/compare/vercel-vs-cloudflare-pages-vs-netlify" },
      { name: "Prisma vs Drizzle", href: "/compare/prisma-vs-drizzle" },
    ],
  },
];

const starterPaths = [
  {
    icon: Rocket,
    title: "I am launching a SaaS",
    description: "Start with cloud credits, choose a hosting platform, then use utility tools for API and deployment workflows.",
    links: [
      { name: "Browse Startup Credits", href: "/credits" },
      { name: "Compare Platforms", href: "/directory" },
      { name: "Open Developer Tools", href: "/tools" },
    ],
  },
  {
    icon: Bug,
    title: "I am debugging APIs",
    description: "Use JSON formatting, JWT inspection, Base64 decoding, URL encoding, and HTTP status lookup tools.",
    links: [
      { name: "JSON Formatter", href: "/tools/json-formatter" },
      { name: "JWT Decoder", href: "/tools/jwt-decoder" },
      { name: "HTTP Status Lookup", href: "/tools/http-status-codes" },
    ],
  },
  {
    icon: Network,
    title: "I am choosing infrastructure",
    description: "Review hosting platforms, serverless databases, and head-to-head comparisons before committing to a stack.",
    links: [
      { name: "Platform Directory", href: "/directory" },
      { name: "Tech Comparisons", href: "/compare" },
      { name: "Developer Guides", href: "/guides" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free Developer and Startup Resources",
          url: "https://lahbabiguide.com/resources",
          description: "Curated LahbabiGuide resource hub for developers and startup founders.",
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Rocket className="h-3.5 w-3.5" />
            Resource Hub
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Free Developer and Startup Resources
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
            A practical starting point for founders and engineers: free tools, verified credits, platform reviews, technical guides, and stack comparisons in one place.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resourceSections.map((section) => (
            <div key={section.title} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6 hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                <section.icon className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">{section.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{section.description}</p>
              </div>
              <div className="space-y-2">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-500 transition-colors">
                    {link.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <Link href={section.href} className="inline-flex text-xs font-black uppercase tracking-widest text-blue-600 hover:underline">
                View all {section.title}
              </Link>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">Recommended starter paths</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Choose the path that matches what you are trying to accomplish today.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {starterPaths.map((path) => (
              <div key={path.title} className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-5">
                <path.icon className="h-9 w-9 text-blue-400" />
                <h3 className="font-display text-xl font-black">{path.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{path.description}</p>
                <div className="space-y-2 pt-2">
                  {path.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold hover:bg-white/10 transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <NewsletterForm variant="card" source="resources" />
        </section>
      </div>
    </div>
  );
}
