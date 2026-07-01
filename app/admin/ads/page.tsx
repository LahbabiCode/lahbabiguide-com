import { getAdPlacements } from "@/lib/db/queries";
import { AdsManagerClient } from "./AdsManagerClient";

export default async function AdminAdsPage() {
  const ads = await getAdPlacements();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          AdSense Manager
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage Google AdSense placements, formats, and visibility across the platform.
        </p>
      </div>

      <AdsManagerClient initialAds={ads} />
    </div>
  );
}
