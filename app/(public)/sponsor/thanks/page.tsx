import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks for your sponsor request | LahbabiGuide",
  description: "Your sponsor or listing request has been received. The LahbabiGuide team will reply within 7 business days.",
  alternates: { canonical: "https://lahbabiguide.com/sponsor/thanks" },
  robots: { index: false, follow: false },
};

export default function SponsorThanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Request received
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Thanks for submitting. The LahbabiGuide team will review your request and reply within 7 business days.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-left space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" /> What happens next
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Initial review within 7 business days</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Email follow-up if additional information is needed</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Listing or partnership confirmation if accepted</li>
          </ul>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition">
            Return Home <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/resources" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition">
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
