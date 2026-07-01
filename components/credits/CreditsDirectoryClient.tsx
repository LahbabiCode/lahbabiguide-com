"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Award, CheckCircle, ExternalLink, Sparkles, Filter, ShieldCheck } from "lucide-react";
import { FallbackCredit, FallbackCreditCategory } from "@/lib/db/fallbackData";
import { AdPlacementRenderer } from "../ads/AdPlacementRenderer";
import { BrandLogoRenderer } from "../ui/BrandLogoRenderer";

interface CreditsDirectoryClientProps {
  initialCredits: FallbackCredit[];
  categories: FallbackCreditCategory[];
}

export function CreditsDirectoryClient({ initialCredits, categories }: CreditsDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  // Filter credits based on Category, country matches and title/desc search
  const filteredCredits = initialCredits.filter((credit) => {
    const matchesCategory = selectedCategory === "all" || credit.categoryId === selectedCategory;
    const matchesCountry =
      selectedCountry === "all" ||
      credit.countries.some((c) => c.toLowerCase() === selectedCountry.toLowerCase()) ||
      credit.countries.some((c) => c.toLowerCase() === "global");
    
    const matchesSearch =
      credit.name.toLowerCase().includes(search.toLowerCase()) ||
      credit.company.toLowerCase().includes(search.toLowerCase()) ||
      credit.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      credit.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesCountry && matchesSearch;
  });

  const countries = ["All", "Global", "USA", "Canada", "Europe", "Asia"];

  return (
    <div className="space-y-8">
      
      {/* Search and Filters Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search box input */}
          <div className="flex-grow relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by company, tags, e.g. 'AWS hosting' or 'NoSQL'..."
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Country filter select */}
          <div className="md:w-52 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-transparent text-sm py-2 px-2.5 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-300"
            >
              <option value="all">Any Region</option>
              {countries.slice(1).map((country) => (
                <option key={country} value={country.toLowerCase()}>
                  {country} Eligible
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories shortcut pills */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Filter by Program Theme
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-205"
              }`}
            >
              All Programs ({initialCredits.length})
            </button>
            {categories.map((cat) => {
              const count = initialCredits.filter((c) => c.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-205"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid count summary and Ad placement safety */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
        <span>Displaying {filteredCredits.length} active boost benefits</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Pre-vetted Official Startup Grants
        </span>
      </div>

      {/* Credit Cards list list view grid */}
      {filteredCredits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCredits.map((credit, idx) => (
            <div
              key={credit.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    {credit && (
                      <BrandLogoRenderer companyName={credit.company} officialUrl={credit.officialUrl} size={48} />
                    )}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        {credit.company}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {credit.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Credit Value Badge */}
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900 rounded-lg shadow-sm">
                    {credit.creditValue}
                  </span>
                </div>

                {/* Short desc */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {credit.shortDescription}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-[11px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-150-none">
                    <MapPin className="h-3 w-3 text-red-400" />
                    {credit.countries.join(", ")}
                  </span>
                  
                  {/* Display tags */}
                  <div className="flex flex-wrap gap-1">
                    {credit.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] uppercase tracking-wider font-extrabold text-blue-500 dark:text-blue-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card action links */}
              <div className="mt-6 flex gap-3 text-xs font-bold pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  href={`/credits/${credit.slug}`}
                  className="flex-grow text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg transition"
                >
                  View Requirements
                </Link>
                <a
                  href={credit.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <Award className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No promotions matched your filter</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your query term or picking a different platform category above.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSelectedCountry("all");
            }}
            className="text-xs font-bold text-blue-600 underline"
          >
            Clear All Criteria
          </button>
        </div>
      )}

      {/* AdSense Multiplex placement at footer of directory */}
      <AdPlacementRenderer placementKey="footer-multiplex" />
    </div>
  );
}
