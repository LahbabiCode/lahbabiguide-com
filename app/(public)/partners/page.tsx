import { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Handshake, Megaphone, Mail, BarChart3, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Partner With LahbabiGuide - Reach Startup Founders",
  description: "Partner with LahbabiGuide to reach startup founders, software engineers, and technical decision-makers. Sponsored content, newsletter mention, custom research, and brand partnerships.",
  alternates: { canonical: "https://lahbabiguide.com/partners" },
  openGraph: {
    title: "Partner With LahbabiGuide",
    description: "Reach startup founders and developers through LahbabiGuide partnership options.",
    url: "https://lahbabiguide.com/partners",
  },
};

const options = [
  {
    icon: Megaphone,
    title: "Sponsored content",
    description: "Sponsored sections, listicles, or reviews published on LahbabiGuide. Always clearly labeled as sponsored.",
  },
  {
    icon: Mail,
    title: "Newsletter mention",
    description: "Dedicated sponsored section in the weekly LahbabiGuide newsletter reaching active founders and engineers.",
  },
  {
    icon: BookOpen,
    title: "Custom research",
    description: "Original research reports, comparison studies, or trend analysis co-published with your brand.",
  },
  {
    icon: BarChart3,
    title: "Brand partnerships",
    description: "Long-term collaborations including annual sponsorships, content partnerships, and category presence.",
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120] min-h-screen py-16 transition-colors duration-300">
      <JsonLd>
        {{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Partner With LahbabiGuide",
          url: "https://lahbabiguide.com/partners",
          description: "Partnership options for brands that want to reach startup founders and developers.",
        }}
      </JsonLd>
      <div className="container mx-auto px-4 max-w-5xl space-y-14">
        <header className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            <Handshake className="h-3.5 w-3.5" />
            Direct Partnerships
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Partner With LahbabiGuide
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            LahbabiGuide is a curated resource hub for startup founders and software engineers. We work with partners who share our commitment to honest, useful, developer-first information.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <div key={opt.title} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
              <opt.icon className="h-9 w-9 text-blue-600" />
              <h2 className="font-display text-xl font-black text-slate-900 dark:text-white">{opt.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{opt.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] p-8 md:p-12 space-y-6">
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">Why partner with us</h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><BarChart3 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Curated, high-intent audience of startup founders and developers.</li>
            <li className="flex gap-3"><BarChart3 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Editorial independence preserved on every collaboration.</li>
            <li className="flex gap-3"><BarChart3 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Sponsored placements always clearly labeled on the site.</li>
            <li className="flex gap-3"><BarChart3 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Direct access to LahbabiGuide analytics and audience insights.</li>
          </ul>
        </section>

        <section className="text-center space-y-4">
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Ready to talk?</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Send a short description of your brand and goals. We reply within 5 business days.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition">
              Submit a Sponsor Request <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="mailto:partners@lahbabiguide.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition">
              Email Partners Team
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
