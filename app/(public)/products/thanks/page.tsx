import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks for your purchase | LahbabiGuide",
  description: "Your LahbabiGuide product request has been received.",
  alternates: { canonical: "https://lahbabiguide.com/products/thanks" },
  robots: { index: false, follow: false },
};

export default function ProductThanksPage() {
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
            Thanks for your interest
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            We received your request. The LahbabiGuide team will email you the download link or payment instructions shortly.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-left space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Download className="h-3.5 w-3.5" /> What happens next
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Email with download or payment link within 24 hours</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />If you signed up for the newsletter, future updates included</li>
          </ul>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/resources" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-500 transition">
            Browse Resources <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
