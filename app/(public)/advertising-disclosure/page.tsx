import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { BadgeDollarSign, Shield, ExternalLink, Eye, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertising Disclosure - Ads and Editorial Independence | LahbabiGuide",
  description:
    "LahbabiGuide advertising disclosure: learn how Google AdSense ads, external links, sponsorships, and editorial independence are handled across our developer resource directory.",
  alternates: { canonical: "https://lahbabiguide.com/advertising-disclosure" },
  openGraph: {
    title: "Advertising Disclosure - Ads and Editorial Independence",
    description:
      "How LahbabiGuide handles AdSense ads, external links, sponsorship labels, and editorial independence.",
    url: "https://lahbabiguide.com/advertising-disclosure",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertising Disclosure - LahbabiGuide",
    description:
      "How LahbabiGuide handles ads, sponsorships, external links, and editorial independence.",
  },
};

export default function AdvertisingDisclosurePage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Advertising Disclosure",
          url: "https://lahbabiguide.com/advertising-disclosure",
          description:
            "Disclosure explaining LahbabiGuide advertising, Google AdSense usage, external links, sponsorship labeling, and editorial independence.",
          isPartOf: {
            "@type": "WebSite",
            name: "LahbabiGuide",
            url: "https://lahbabiguide.com",
          },
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
            <BadgeDollarSign className="h-3.5 w-3.5" />
            Advertising Transparency
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Advertising Disclosure
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            LahbabiGuide is free to use. To support hosting, maintenance, research, and content production, some pages may display advertising or link to third-party websites.
          </p>
        </header>

        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-8">
          {[
            {
              icon: Eye,
              title: "Google AdSense advertising",
              text: "LahbabiGuide displays ads through Google AdSense. Google and its partners may use cookies or similar technologies to serve personalized or non-personalized ads. You can learn more in our Privacy Policy.",
              href: "/privacy",
              label: "Read Privacy Policy",
            },
            {
              icon: Scale,
              title: "Ads do not control rankings",
              text: "Advertising does not determine which tools, credits, or platforms appear in our recommendations. Editorial ordering is based on relevance, usefulness, public information, and user value.",
            },
            {
              icon: ExternalLink,
              title: "External links and provider websites",
              text: "Many listings link to official provider websites. LahbabiGuide is not responsible for third-party pricing, eligibility rules, privacy practices, availability, or final approval decisions.",
            },
            {
              icon: Shield,
              title: "No sale of startup credit codes",
              text: "LahbabiGuide does not sell promo codes, startup credit keys, or guaranteed approvals. We only guide users to official programs and educational resources.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">{item.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.text}</p>
                {item.href && item.label && (
                  <Link href={item.href} className="text-sm font-bold text-blue-600 hover:underline inline-flex">
                    {item.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white space-y-4">
          <h2 className="font-display text-2xl font-black">Sponsored content policy</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            If LahbabiGuide ever publishes sponsored content, paid placements, or affiliate-supported reviews, those relationships will be disclosed clearly on the relevant page. Sponsored relationships will not override our commitment to accurate, useful, and transparent information.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-6">
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Affiliate links</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Some pages on LahbabiGuide include affiliate links to platforms such as cloud hosting providers, developer tools, and other software services. If you click an affiliate link and later sign up or make a purchase, LahbabiGuide may earn a commission at no additional cost to you.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Affiliate relationships never change our editorial recommendations. We only link to platforms we have evaluated independently, and every affiliate link is clearly labeled on the relevant page.
          </p>
        </section>

        <section className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          <p>
            Questions about this disclosure? Visit our <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link> or review our <Link href="/editorial-policy" className="text-blue-600 hover:underline">editorial policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
