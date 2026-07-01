import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Shield, Scale, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use - Usage Guidelines | LahbabiGuide",
  description:
    "LahbabiGuide Terms of Use govern your use of our developer tools directory, startup credits index, and platform comparison services. Understand your rights and responsibilities when using our free resources.",
  alternates: {
    canonical: "https://lahbabiguide.com/terms",
  },
  openGraph: {
    title: "Terms of Use - Usage Guidelines | LahbabiGuide",
    description:
      "Read LahbabiGuide's terms for using our free developer tools, startup credits directory, and platform comparison services.",
    url: "https://lahbabiguide.com/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use - Usage Guidelines | LahbabiGuide",
    description:
      "Read LahbabiGuide's terms for using our free developer tools, startup credits directory, and platform comparison services.",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Use",
          url: "https://lahbabiguide.com/terms",
          description:
            "LahbabiGuide Terms of Use: Usage guidelines for our developer tools directory, startup credits index, and platform comparison services.",
          isPartOf: {
            "@type": "WebSite",
            name: "LahbabiGuide",
            url: "https://lahbabiguide.com",
          },
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Scale className="h-3.5 w-3.5" />
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Terms of Use
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            By accessing and using LahbabiGuide, you agree to these Terms of Use. Please read them
            carefully before using our developer tools, startup credits directory, or platform
            comparison services.
          </p>
        </header>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-10 prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="text-sm leading-relaxed">
              By accessing or using LahbabiGuide (the "Website"), including our developer tools,
              startup credits directory, platform comparisons, blog, and guides (collectively, the
              "Services"), you agree to be bound by these Terms of Use. If you do not agree, please
              do not use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">2. Description of Services</h2>
            <p className="text-sm leading-relaxed">
              LahbabiGuide provides the following free services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Developer Tools:</strong> Browser-based utilities (JSON formatter, Base64 encoder, JWT decoder, UUID generator, etc.) that process data entirely on your device.</li>
              <li><strong>Startup Credits Directory:</strong> Curated listings of cloud infrastructure credits, SaaS discounts, and developer grants from verified partner programs.</li>
              <li><strong>Platform Directory:</strong> Objective reviews and comparisons of developer platforms including hosting, databases, and frameworks.</li>
              <li><strong>Tech Comparisons:</strong> Head-to-head analyses of competing platforms and tools.</li>
              <li><strong>Blog & Guides:</strong> Technical articles, tutorials, and startup resources.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">3. Use of Developer Tools</h2>
            <p className="text-sm leading-relaxed">
              Our developer tools are provided "as is" for lawful, personal, and commercial use.
              You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Use the tools for any illegal purpose or to process malicious data.</li>
              <li>Attempt to reverse engineer, extract, or exploit the tool implementations.</li>
              <li>Use automated scripts to access the tools in a manner that overloads our infrastructure.</li>
              <li>Misrepresent the origin of data processed through our tools.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              All tools process data client-side. We cannot access, recover, or be held responsible
              for any data you input.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">4. Startup Credits & External Links</h2>
            <p className="text-sm leading-relaxed">
              LahbabiGuide provides links and documentation for third-party startup credit programs,
              but we do not operate or control these programs. Important disclaimers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Credit amounts, eligibility requirements, and availability may change without notice from the provider.</li>
              <li>We do not guarantee approval for any credit program. Approval is solely at the discretion of the program provider.</li>
              <li>We do not sell, trade, or distribute promo codes or referral keys. All links direct to official application pages.</li>
              <li>LahbabiGuide is not responsible for the privacy practices, terms, or content of external websites.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">5. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All content on LahbabiGuide including text, design, code, logos, and data structures
              is the property of LahbabiGuide and its creators unless otherwise stated. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Reproduce, distribute, or create derivative works from our original content without written permission.</li>
              <li>Scrape, crawl, or extract data from our directory through automated means without consent.</li>
              <li>Use the LahbabiGuide name, logo, or brand in any way that implies endorsement without authorization.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              Factual information (such as credit amounts or platform features) is not proprietary,
              but our editorial content, reviews, and analysis are protected.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">6. Disclaimer of Warranties</h2>
            <p className="text-sm leading-relaxed">
              LAHBABIGUIDE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES,
              EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>The accuracy, completeness, or timeliness of credit program information or platform reviews.</li>
              <li>The uninterrupted or error-free operation of developer tools.</li>
              <li>The results obtained from using any tool or service on this website.</li>
              <li>That any defects or errors will be corrected.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">7. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              To the maximum extent permitted by law, LahbabiGuide and its operators shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of or inability to use the Services, even if advised of the
              possibility of such damages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">8. Indemnification</h2>
            <p className="text-sm leading-relaxed">
              You agree to indemnify and hold harmless LahbabiGuide and its operators from any
              claims, damages, losses, or expenses arising from your use of the Services or
              violation of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">9. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to modify these Terms of Use at any time. Changes become effective
              upon posting. Your continued use of the Services after any change constitutes your
              acceptance of the modified Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">10. Contact</h2>
            <p className="text-sm leading-relaxed">
              For questions about these Terms of Use, please contact us at{" "}
              <strong>legal@lahbabiguide.com</strong> or visit our{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
            </p>
          </section>

        </div>

        {/* Internal Links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-bold">
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
