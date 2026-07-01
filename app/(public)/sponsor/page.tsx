import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { SponsorRequestForm } from "@/components/sponsor/SponsorRequestForm";
import { Sparkles, CheckCircle2, BadgeCheck, Megaphone, Mail, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsor LahbabiGuide - Get Listed, Featured, or Newsletter Mention",
  description:
    "Submit your developer tool, startup credit program, or platform for review and possible inclusion in the LahbabiGuide directory. Featured placements, newsletter mentions, and partner sponsorships available.",
  alternates: { canonical: "https://lahbabiguide.com/sponsor" },
  openGraph: {
    title: "Sponsor LahbabiGuide - Get Listed or Featured",
    description: "Get your tool, platform, or startup credit program reviewed and listed on LahbabiGuide.",
    url: "https://lahbabiguide.com/sponsor",
  },
};

const packages = [
  {
    icon: Building2,
    name: "Standard Listing",
    price: "Free",
    description: "Submit your tool, credit program, or platform for editorial review. If it meets quality and relevance standards, we will list it in the directory.",
    bullets: ["Editorial review", "Standard placement", "No payment required", "Reviewed within 7 business days"],
    cta: "Submit for review",
  },
  {
    icon: BadgeCheck,
    name: "Featured Listing",
    price: "$49 / month",
    description: "Get a Featured badge, priority placement in category indexes, and inclusion in the weekly newsletter roundup.",
    bullets: ["Featured badge on listing", "Priority placement", "Newsletter mention", "Permanent listing"],
    cta: "Request featured",
    highlight: true,
  },
  {
    icon: Megaphone,
    name: "Sponsored Newsletter",
    price: "$99 / send",
    description: "A dedicated sponsored section in the LahbabiGuide weekly newsletter. Reaches startup founders and developers.",
    bullets: ["Dedicated sponsored section", "Founder audience", "One link and short copy", "Performance report"],
    cta: "Reserve a slot",
  },
];

export default function SponsorPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Sponsor LahbabiGuide",
          url: "https://lahbabiguide.com/sponsor",
          description: "Submit your tool, credit program, or platform for LahbabiGuide listing and featured placement.",
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-amber-600">
            <Sparkles className="h-3.5 w-3.5" />
            Sponsor LahbabiGuide
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Get Listed, Featured, or Sponsored
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            LahbabiGuide is a curated directory and resource hub for startup founders and software engineers. If your tool, platform, or startup credit program is a strong fit, we want to hear from you.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`bg-white dark:bg-slate-900 border ${
                pkg.highlight
                  ? "border-blue-500 dark:border-blue-400 shadow-xl"
                  : "border-slate-100 dark:border-slate-800"
              } rounded-[2rem] p-8 space-y-5 flex flex-col`}
            >
              {pkg.highlight && (
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40 self-start">
                  Most popular
                </span>
              )}
              <pkg.icon className={`h-9 w-9 ${pkg.highlight ? "text-blue-600" : "text-slate-500"}`} />
              <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">{pkg.name}</h2>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{pkg.price}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{pkg.description}</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {pkg.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">Submit a request</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We review every request within 7 business days. Listings are accepted at LahbabiGuide's discretion based on relevance, accuracy, and audience fit. Sponsored placements are clearly labeled on the site.
            </p>
          </div>
          <SponsorRequestForm />
        </section>

        <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-[2rem] p-8 text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
          <h3 className="font-black uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4" /> Editorial standards
          </h3>
          Sponsored placements and paid listings are always clearly marked on LahbabiGuide. Editorial ordering and recommendations are never influenced by sponsorship. The LahbabiGuide review process remains independent.
        </section>
      </div>
    </div>
  );
}
