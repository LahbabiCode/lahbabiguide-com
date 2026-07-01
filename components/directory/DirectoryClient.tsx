"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Server, Sparkles, Filter, ExternalLink, Check, DollarSign } from "lucide-react";
import { FallbackDirectoryItem, FallbackDirectoryCategory } from "@/lib/db/fallbackData";
import { AdPlacementRenderer } from "../ads/AdPlacementRenderer";
import { BrandLogoRenderer } from "../ui/BrandLogoRenderer";

interface DirectoryClientProps {
  initialItems: FallbackDirectoryItem[];
  categories: FallbackDirectoryCategory[];
}

export function DirectoryClient({ initialItems, categories }: DirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  // Filter logic
  const filteredItems = initialItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
    const matchesFree = !showOnlyFree || item.hasFreePlan === true || item.pricingModel === "Free" || item.pricingModel === "Open Source";
    
    const term = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.features.some((f) => f.toLowerCase().includes(term));

    return matchesCategory && matchesFree && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Filters & Search section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          <div className="flex-grow relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1 w-full">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, feature, or tech stack..."
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

          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300 md:shrink-0">
            <input
              type="checkbox"
              checked={showOnlyFree}
              onChange={(e) => setShowOnlyFree(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            Generous Free Plan
          </label>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Filter by Technology
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
              All Platforms ({initialItems.length})
            </button>
            {categories.map((cat) => {
              const count = initialItems.filter((i) => i.categoryId === cat.id).length;
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

      {/* Grid items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <BrandLogoRenderer companyName={item.name} officialUrl={item.officialUrl} size={48} />

                  {/* Pricing Badge */}
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                    {item.pricingModel}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Features preview */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {item.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                  {item.features.length > 3 && (
                    <div className="text-[10px] text-slate-400 italic font-medium pl-4.5">
                      + {item.features.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 text-xs font-bold pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  href={`/directory/${item.slug}`}
                  className="flex-grow text-center py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg transition"
                >
                  View Detail
                </Link>
                <a
                  href={item.officialUrl}
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
          <Server className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No platforms matched</h3>
          <p className="text-xs text-slate-400">
            Consider expanding your search terms or clearing current filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setShowOnlyFree(false);
            }}
            className="text-xs font-bold text-blue-600 underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* AdSense Multiplex placement at footer of directory */}
      <AdPlacementRenderer placementKey="directory-footer" />
    </div>
  );
}
