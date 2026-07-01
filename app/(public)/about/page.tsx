import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heart, Target, Shield, Users, Code, Globe, Zap, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About LahbabiGuide - Our Mission & Team | LahbabiGuide",
  description:
    "LahbabiGuide is a curated directory of free developer tools, verified startup credits, and platform comparisons. Learn about our mission to help founders and engineers scale faster with zero-cost resources.",
  alternates: {
    canonical: "https://lahbabiguide.com/about",
  },
  openGraph: {
    title: "About LahbabiGuide - Our Mission & Team",
    description:
      "Discover the team and mission behind LahbabiGuide. We curate the best free developer tools, startup credits, and infrastructure comparisons to help builders move faster.",
    url: "https://lahbabiguide.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About LahbabiGuide - Our Mission & Team",
    description:
      "Discover the team and mission behind LahbabiGuide. Free developer tools, startup credits, and platform comparisons for builders.",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About LahbabiGuide",
          url: "https://lahbabiguide.com/about",
          description:
            "LahbabiGuide is a curated directory of free developer tools, verified startup credits, and platform comparisons built by engineers for engineers.",
          mainEntity: {
            "@type": "Organization",
            name: "LahbabiGuide",
            url: "https://lahbabiguide.com",
            logo: "https://lahbabiguide.com/logo.png",
            description:
              "Free developer tools directory and startup credits index.",
            foundingDate: "2024",
            founder: {
              "@type": "Person",
              name: "Zakaria Lahbabi",
              jobTitle: "Platform Lead",
            },
          },
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Hero */}
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Heart className="h-3.5 w-3.5" />
            Our Mission
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Built by Developers, <br className="hidden md:block" />
            for <span className="text-blue-600">Developers</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            LahbabiGuide was created to solve a painful problem: finding reliable, free developer resources
            scattered across hundreds of websites. We consolidate verified startup credits, browser-native
            utilities, and objective platform reviews into a single, searchable directory.
          </p>
        </header>

        {/* What We Offer */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
            What LahbabiGuide Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Code,
                title: "Free Developer Tools",
                description:
                  "A curated collection of browser-native utilities — JSON formatters, Base64 encoders, JWT decoders, UUID generators, and more. Every tool runs client-side with zero data collection, ensuring your sensitive inputs never leave your browser.",
                color: "blue",
                link: "/tools",
              },
              {
                icon: Award,
                title: "Verified Startup Credits",
                description:
                  "We manually verify and document cloud credit programs from AWS Activate ($100k), Google for Startups ($350k), Microsoft Founders Hub ($150k), Stripe Atlas, and dozens more. Each listing includes eligibility criteria, claim steps, and official application links.",
                color: "emerald",
                link: "/credits",
              },
              {
                icon: Globe,
                title: "Platform Directory & Reviews",
                description:
                  "Objective, data-driven reviews of developer platforms — hosting providers, databases, UI frameworks, and SaaS tools. We compare features, pricing, pros, cons, and alternatives so you can pick the right stack without vendor bias.",
                color: "purple",
                link: "/directory",
              },
              {
                icon: Target,
                title: "Tech Stack Comparisons",
                description:
                  "Head-to-head comparisons between competing platforms — Vercel vs Netlify vs Cloudflare Pages, Prisma vs Drizzle, and more. Our analyses focus on real-world metrics: build times, edge performance, pricing at scale, and developer experience.",
                color: "pink",
                link: "/compare",
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`h-12 w-12 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 flex items-center justify-center mb-6 border border-${item.color}-100 dark:border-${item.color}-900/30`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Our Principles */}
        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-16 space-y-10">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
            Our Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Shield,
                title: "Privacy-First Engineering",
                desc: "All tools run in your browser. We never log, store, or transmit your data. Zero cookies on utility pages, zero tracking scripts, zero server-side processing of user input.",
              },
              {
                icon: Zap,
                title: "Verified & Up-to-Date",
                desc: "Every startup credit listing and platform review is manually checked on a weekly cycle. We verify URLs, pricing, and eligibility requirements so you don't waste time on dead links.",
              },
              {
                icon: Users,
                title: "Community-Driven",
                desc: "Our directory grows with feedback from the developer community. We accept submissions for new tools, credit programs, and platforms, and each undergoes our verification process before publication.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-4 text-center">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/30">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="space-y-8 text-center">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            The Team
          </h2>
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl italic mx-auto shadow-lg shadow-blue-500/20">
              Z
            </div>
            <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
              Zakaria Lahbabi
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Platform Lead & Founder
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Full-stack engineer specializing in scalable production architectures, developer
              platforms, and growth infrastructure. Built LahbabiGuide to consolidate the fragmented
              landscape of free developer resources into one authoritative directory.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 space-y-6">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to accelerate your development?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Whether you need a quick JSON formatter, $100k in cloud credits, or an objective
            comparison of hosting providers, LahbabiGuide has you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/tools"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
            >
              Browse Free Tools
            </Link>
            <Link
              href="/credits"
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors"
            >
              Claim Startup Credits
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
