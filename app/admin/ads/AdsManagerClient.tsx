"use client";

import { useState } from "react";
import { FallbackAdPlacement } from "@/lib/db/fallbackData";
import { updateAdPlacements } from "@/lib/actions/ads";
import { Save, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

export function AdsManagerClient({ initialAds }: { initialAds: FallbackAdPlacement[] }) {
  const [ads, setAds] = useState<FallbackAdPlacement[]>(initialAds);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const handleUpdate = (id: string, field: keyof FallbackAdPlacement, value: any) => {
    setAds(ads.map((ad) => (ad.id === id ? { ...ad, [field]: value } : ad)));
    setSaveStatus("idle");
  };

  const handleGlobalToggle = (enabled: boolean) => {
    setGlobalEnabled(enabled);
    setAds(ads.map(ad => ({ ...ad, enabled })));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    const result = await updateAdPlacements(ads);
    if (result.success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
    }
    setIsSaving(false);
  };

  const resetChanges = () => {
    setAds(initialAds);
    setSaveStatus("idle");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Global Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Global Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enable or disable all ads globally across the website.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {globalEnabled ? "Ads Enabled" : "Ads Disabled"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={globalEnabled} onChange={(e) => handleGlobalToggle(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-opacity ${!globalEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{ad.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md inline-block">Key: {ad.key}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={ad.enabled} onChange={(e) => handleUpdate(ad.id, "enabled", e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Slot ID</label>
                <input
                  type="text"
                  value={ad.slotId}
                  onChange={(e) => handleUpdate(ad.id, "slotId", e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1059586368"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Format</label>
                <select
                  value={ad.format}
                  onChange={(e) => handleUpdate(ad.id, "format", e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">Auto</option>
                  <option value="fluid">Fluid</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="autorelaxed">Multiplex (autorelaxed)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Layout Key (Optional)</label>
                <input
                  type="text"
                  value={ad.layoutKey || ""}
                  onChange={(e) => handleUpdate(ad.id, "layoutKey", e.target.value || null)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. -g6+f-1d-3p+bw"
                />
              </div>
            </div>
            
            {/* Ad Preview (Visual only) */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className={`w-full min-h-[90px] border-2 border-dashed ${ad.enabled ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50' : 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'} rounded-lg flex items-center justify-center`}>
                  <div className="text-center">
                    <p className={`text-xs font-bold uppercase tracking-wider ${ad.enabled ? 'text-slate-400' : 'text-red-400'}`}>
                      {ad.enabled ? 'Ad Preview Layout' : 'Ad Disabled'}
                    </p>
                    {ad.enabled && <p className="text-[10px] text-slate-500 mt-1 font-mono">Format: {ad.format} • Slot: {ad.slotId}</p>}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-4 h-4" />
              Failed to save settings
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={resetChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
