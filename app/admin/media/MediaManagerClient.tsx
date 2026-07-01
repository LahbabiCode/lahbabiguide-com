"use client";

import { useState } from "react";
import { uploadMedia, deleteMedia } from "@/lib/actions/media";
import { Copy, Trash2, UploadCloud, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function MediaManagerClient({ initialMedia }: { initialMedia: any[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    altText: "",
    title: "",
    usageTarget: "blog",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("prefix", formData.usageTarget);
    data.append("altText", formData.altText);
    data.append("title", formData.title);
    data.append("usageTarget", formData.usageTarget);
    
    const result = await uploadMedia(data);
    if (result.success && result.media) {
      setMedia([result.media, ...media]);
      setFormData({ altText: "", title: "", usageTarget: "blog" });
      e.target.value = "";
    } else {
      alert(`Upload failed: ${result.error}`);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    const result = await deleteMedia(id);
    if (result.success) {
      setMedia(media.filter((m) => m.id !== id));
    } else {
      alert(`Delete failed: ${result.error}`);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload Sidebar */}
      <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl self-start">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload New Media</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Usage</label>
            <select
              value={formData.usageTarget}
              onChange={(e) => setFormData({ ...formData, usageTarget: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blog">Blog / Article</option>
              <option value="tools">Tool Icon / Preview</option>
              <option value="credits">Startup Credit Logo</option>
              <option value="directory">Directory Logo</option>
              <option value="general">General Asset</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title (Optional)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Hero Image for Next.js Guide"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alt Text</label>
            <input
              type="text"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descriptive text for SEO"
            />
          </div>

          <div className="pt-4">
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:bg-slate-100 dark:border-slate-700">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                )}
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or WEBP (MAX. 800x400px)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="lg:col-span-2 space-y-6">
        {media.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-xl flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No media uploaded</h3>
            <p className="text-slate-500 dark:text-slate-400">Upload your first image to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col group relative">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.altText || item.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                    <button
                      onClick={() => handleCopy(item.url)}
                      className="p-2 bg-white/20 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                      title="Copy URL"
                    >
                      {copiedUrl === item.url ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/20 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 capitalize">
                    {item.usageTarget} • {Math.round(item.sizeBytes / 1024)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
