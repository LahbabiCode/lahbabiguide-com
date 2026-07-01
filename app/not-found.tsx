import Link from "next/link";
import { Metadata } from "next";
import { Home, Search, Wrench, Award, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | LahbabiGuide",
  description:
    "The page you are looking for does not exist or has been moved. Browse our developer tools, startup credits, or platform directory instead.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-slate-900 dark:text-white">404</h1>
          <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            The page you are looking for does not exist, has been moved, or the URL may be
            incorrect. Try browsing our directory to find what you need.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-50 transition"
          >
            <Wrench className="h-4 w-4" />
            Developer Tools
          </Link>
          <Link
            href="/credits"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-50 transition"
          >
            <Award className="h-4 w-4" />
            Startup Credits
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-600 pt-8">
          If you believe this is an error, please{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
