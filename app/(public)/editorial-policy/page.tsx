import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { CheckCircle2, ShieldCheck, RefreshCw, FileSearch, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy - How LahbabiGuide Reviews Tools and Credits | LahbabiGuide",
  description:
    "Learn how LahbabiGuide reviews developer tools, verifies startup credit programs, writes platform comparisons, corrects errors, and protects editorial independence.",
  alternates: { canonical: "https://lahbabiguide.com/editorial-policy" },
  openGraph: {
    title: "Editorial Policy - How LahbabiGuide Reviews Tools and Credits",
    description:
      "Our editorial standards for reviewing developer tools, verifying startup credits, and publishing trustworthy platform comparisons.",
    url: "https://lahbabiguide.com/editorial-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Policy - LahbabiGuide",
    description:
      "How LahbabiGuide verifies resources, reviews tools, and maintains editorial independence.",
  },
};

export default function EditorialPolicyPage() {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Verification before publication",
      description:
        "Startup credit listings are checked against official provider pages. We verify application links, stated benefit ranges, eligibility language, and whether a program appears to be active before presenting it as a resource.",
    },
    {
      icon: FileSearch,
      title: "Hands-on product review",
      description:
        "Developer tools and platform reviews are based on public documentation, product behavior, pricing pages, feature lists, and practical developer use cases rather than sponsored ranking claims.",
    },
    {
      icon: Scale,
      title: "Editorial independence",
      description:
        "Advertising, affiliate relationships, or sponsorships do not determine the order of recommendations. If sponsored content is ever published, it will be labeled clearly.",
    },
    {
      icon: RefreshCw,
      title: "Ongoing updates",
      description:
        "Cloud credits, SaaS discounts, and platform pricing change frequently. We periodically review high-value pages and update inaccurate details when issues are reported or discovered.",
    },
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Editorial Policy",
          url: "https://lahbabiguide.com/editorial-policy",
          description:
            "LahbabiGuide editorial policy for tool reviews, startup credit verification, platform comparisons, corrections, and independence.",
          isPartOf: {
            "@type": "WebSite",
            name: "LahbabiGuide",
            url: "https://lahbabiguide.com",
          },
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-5xl space-y-14">
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Editorial Standards
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            How We Review and Verify Resources
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            LahbabiGuide exists to help developers and founders make faster, safer decisions. This policy explains how we evaluate developer tools, verify startup credit programs, review platforms, and correct inaccurate information.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((item) => (
            <div key={item.title} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">{item.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-8">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">Our review process</h2>
          <div className="space-y-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Developer tools</h3>
              <p>We evaluate whether a tool solves a common developer workflow, whether it can run safely in the browser, whether the result is understandable, and whether the page provides enough guidance for practical use. Tools that process sensitive data are described with privacy-first language and clear limitations.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Startup credits</h3>
              <p>Credit program pages are checked against official provider sources whenever possible. We document benefit values as ranges or maximums because final eligibility, approval, duration, and redemption rules are controlled by the provider, not LahbabiGuide.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Platform reviews</h3>
              <p>Platform listings focus on use cases, pricing model, free plan availability, features, limitations, and alternatives. We avoid presenting a tool as universally best because infrastructure choices depend on traffic, team size, compliance needs, and budget.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Corrections</h3>
              <p>If you find outdated pricing, broken links, or inaccurate eligibility information, contact us through the <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>. We review correction requests and update pages when evidence supports a change.</p>
            </div>
          </div>
        </section>

        <section className="text-center space-y-5">
          <Mail className="h-10 w-10 text-blue-600 mx-auto" />
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Report an editorial issue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We welcome corrections from founders, engineers, and providers. Please include the affected URL, the source that supports your correction, and a short explanation.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
            Contact LahbabiGuide
          </Link>
        </section>
      </div>
    </div>
  );
}
