import { getMediaFiles } from "@/lib/actions/media";
import { MediaManagerClient } from "./MediaManagerClient";

export default async function MediaPage() {
  const initialMedia = await getMediaFiles();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Media Manager</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Upload, manage, and attach images to blog, tools, credits, or directory items.</p>
        </div>
      </div>
      <MediaManagerClient initialMedia={initialMedia} />
    </div>
  );
}
