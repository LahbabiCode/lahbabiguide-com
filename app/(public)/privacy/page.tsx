import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Shield, Cookie, Eye, Lock, Server, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Handle Your Data | LahbabiGuide",
  description:
    "LahbabiGuide's Privacy Policy explains how we collect, use, and protect your data. Learn about our zero-tracking tools, Google AdSense usage, cookies, and your rights under GDPR and CCPA.",
  alternates: {
    canonical: "https://lahbabiguide.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy - How We Handle Your Data | LahbabiGuide",
    description:
      "Understand how LahbabiGuide handles your data. Zero-tracking developer tools, AdSense cookie policy, and your rights under GDPR and CCPA.",
    url: "https://lahbabiguide.com/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - How We Handle Your Data | LahbabiGuide",
    description:
      "Understand how LahbabiGuide handles your data. Zero-tracking developer tools, AdSense cookie policy, and your rights.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://lahbabiguide.com/privacy",
          description:
            "LahbabiGuide Privacy Policy: How we collect, use, and protect your data including AdSense and cookie usage.",
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
            <Shield className="h-3.5 w-3.5" />
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            At LahbabiGuide, we take your privacy seriously. This policy explains what data we collect,
            how we use it, and the steps we take to protect it — including details about Google AdSense
            and third-party services.
          </p>
        </header>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-10 prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">1. Information We Collect</h2>
            </div>
            <p className="text-sm leading-relaxed">
              LahbabiGuide operates with a minimal data collection philosophy. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Developer Tools:</strong> All utility tools (JSON Formatter, Base64 Encoder, JWT Decoder, etc.) run entirely in your browser. We do <strong>not</strong> collect, log, store, or transmit any data you input into these tools. Your inputs and outputs never leave your device.</li>
              <li><strong>Account Data:</strong> If you create an account to save favorites or ratings, we collect your email address, display name, and authentication data via Auth.js. We never sell or share this information.</li>
              <li><strong>Usage Analytics:</strong> We may collect anonymized, aggregate traffic data (page views, referral sources) to improve our directory. This data cannot identify individual users.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
                <Cookie className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">2. Cookies & Google AdSense</h2>
            </div>
            <p className="text-sm leading-relaxed">
              LahbabiGuide uses Google AdSense to display advertisements. Google AdSense may use cookies
              and similar technologies to serve ads based on your prior visits to our website or other
              websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads
              based on your visit to our site and/or other sites on the Internet.
            </p>
            <p className="text-sm leading-relaxed">
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized
              advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                aboutads.info
              </a>
              .
            </p>
            <p className="text-sm leading-relaxed">
              <strong>Types of cookies used:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Essential cookies:</strong> Required for authentication and core site functionality (session management).</li>
              <li><strong>Analytics cookies:</strong> Anonymized data to understand how visitors interact with our site.</li>
              <li><strong>Advertising cookies:</strong> Used by Google AdSense to display relevant ads. These are the only third-party cookies we permit.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">3. Data Security</h2>
            </div>
            <p className="text-sm leading-relaxed">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>All data transmissions are encrypted via HTTPS/TLS.</li>
              <li>Authentication is handled through Auth.js with secure session management.</li>
              <li>Developer tool inputs are processed client-side and never reach our servers.</li>
              <li>Our database is hosted on secure, access-controlled infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">4. Third-Party Services</h2>
            </div>
            <p className="text-sm leading-relaxed">
              LahbabiGuide integrates with the following third-party services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Google AdSense:</strong> For displaying advertisements. Google may collect data through cookies and web beacons. See Google&apos;s privacy policy for details.</li>
              <li><strong>Vercel:</strong> For hosting and deployment. Vercel may collect server logs including IP addresses for security purposes.</li>
              <li><strong>Auth.js:</strong> For authentication. Your email and OAuth provider data are processed according to their respective privacy policies.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              External links to startup credit programs, platform directories, and tools redirect to third-party
              websites with their own privacy policies. We are not responsible for the privacy practices of these external sites.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">5. Your Rights</h2>
            </div>
            <p className="text-sm leading-relaxed">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>GDPR (EU users):</strong> Right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data.</li>
              <li><strong>CCPA (California users):</strong> Right to know what personal information is collected, to delete personal information, to opt out of the sale of personal information, and to not be discriminated against for exercising your rights.</li>
              <li><strong>Opt-out of Ad Personalization:</strong> You can opt out of personalized ads through Google Ad Settings or the Network Advertising Initiative opt-out page.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              To exercise any of these rights, please contact us at{" "}
              <strong>privacy@lahbabiguide.com</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">6. Children&apos;s Privacy</h2>
            <p className="text-sm leading-relaxed">
              LahbabiGuide is not directed to children under the age of 13. We do not knowingly collect
              personal information from children under 13. If we become aware that we have collected
              personal data from a child under 13, we will take steps to delete such information promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">7. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">8. Contact Us</h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <strong>privacy@lahbabiguide.com</strong> or visit our{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
            </p>
          </section>

        </div>

        {/* Internal Links for SEO */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-bold">
          <Link href="/terms" className="text-blue-600 hover:underline">Terms of Use</Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link href="/about" className="text-blue-600 hover:underline">About Us</Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
