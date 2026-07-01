import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Mail, MessageSquare, Globe, Code, Award, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch | LahbabiGuide",
  description:
    "Contact the LahbabiGuide team for questions about developer tools, startup credits, platform reviews, partnership inquiries, or content submissions. We respond within 24-48 hours.",
  alternates: {
    canonical: "https://lahbabiguide.com/contact",
  },
  openGraph: {
    title: "Contact Us - Get in Touch | LahbabiGuide",
    description:
      "Reach out to the LahbabiGuide team for tool submissions, credit verifications, partnerships, or general inquiries. We typically respond within 24-48 hours.",
    url: "https://lahbabiguide.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - Get in Touch | LahbabiGuide",
    description:
      "Reach out to the LahbabiGuide team for tool submissions, credit verifications, partnerships, or general inquiries.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact LahbabiGuide",
          url: "https://lahbabiguide.com/contact",
          description:
            "Get in touch with the LahbabiGuide team for questions, submissions, or partnership inquiries.",
          mainEntity: {
            "@type": "Organization",
            name: "LahbabiGuide",
            url: "https://lahbabiguide.com",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              availableLanguage: ["English"],
              responseTime: "PT48H",
            },
          },
        }}
      </JsonLd>

      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Hero */}
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Mail className="h-3.5 w-3.5" />
            Get in Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Contact <span className="text-blue-600">LahbabiGuide</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about a developer tool, startup credit program, or platform review?
            Need to report a broken link or submit a new resource? We&apos;d love to hear from you.
          </p>
        </header>

        {/* Contact Methods */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
            How to Reach Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "General Inquiries",
                description:
                  "Questions about our directory, content accuracy, or general feedback about LahbabiGuide. We review all messages and respond within 24-48 hours.",
                action: "contact@lahbabiguide.com",
                actionLabel: "Send Email",
                color: "blue",
              },
              {
                icon: Code,
                title: "Tool or Platform Submissions",
                description:
                  "Built a developer tool that should be in our directory? Know a startup credit program we're missing? Submit it and our team will verify and list it for free.",
                action: "submit@lahbabiguide.com",
                actionLabel: "Submit Resource",
                color: "emerald",
              },
              {
                icon: Award,
                title: "Partnership & Sponsorship",
                description:
                  "Interested in partnering with LahbabiGuide for sponsored content, credit program promotion, or developer community outreach? We work with verified providers only.",
                action: "partners@lahbabiguide.com",
                actionLabel: "Partner With Us",
                color: "purple",
              },
              {
                icon: Globe,
                title: "Report an Issue",
                description:
                  "Found a broken link, outdated credit information, or inaccurate platform review? Help us keep LahbabiGuide accurate by reporting it.",
                action: "issues@lahbabiguide.com",
                actionLabel: "Report Issue",
                color: "orange",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4"
              >
                <div
                  className={`h-12 w-12 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 flex items-center justify-center border border-${item.color}-100 dark:border-${item.color}-900/30`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2">
                  <span className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest inline-block">
                    {item.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-16 space-y-8">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                q: "How long does it take to get a response?",
                a: "We aim to respond to all inquiries within 24-48 business hours. Tool submissions and issue reports may take up to a week if verification is required.",
              },
              {
                q: "Can I submit my own tool or credit program?",
                a: "Absolutely! We welcome submissions from creators and companies. Each submission goes through our verification process to ensure it meets our quality and accuracy standards before publication.",
              },
              {
                q: "Is there a fee to list a tool or credit program?",
                a: "No. LahbabiGuide is a free directory. We do not charge for listings. However, we only publish resources that genuinely benefit developers and startups.",
              },
              {
                q: "How do you verify startup credit programs?",
                a: "Our team manually checks each credit program by visiting the official application page, verifying the credit amounts, eligibility requirements, and ensuring the application link is active and legitimate.",
              },
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{faq.q}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 space-y-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>Typical response time: 24-48 hours</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/tools"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
            >
              Browse Tools Instead
            </Link>
            <Link
              href="/credits"
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors"
            >
              View Startup Credits
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
