"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Globe, AlertCircle } from "lucide-react";

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";
const primaryBtn =
  "bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function Counter({ value, limit }: { value: number; limit: number }) {
  const over = value > limit;
  return (
    <span className={`text-[10px] font-bold ${over ? "text-red-500" : "text-slate-400"}`}>
      {value}/{limit}
      {over ? " — too long, may be truncated in search results" : ""}
    </span>
  );
}

export default function MetaTagsRunner() {
  const [title, setTitle] = useState("LahbabiGuide — Free Developer Tools & Startup Credits");
  const [description, setDescription] = useState(
    "Discover free developer utilities, startup cloud credits, and in-depth platform comparisons — all in one place."
  );
  const [canonical, setCanonical] = useState("https://lahbabiguide.com/");
  const [siteName, setSiteName] = useState("LahbabiGuide");
  const [image, setImage] = useState("https://lahbabiguide.com/og/default.svg");
  const [twitter, setTwitter] = useState("@lahbabiguide");
  const [ogType, setOgType] = useState<"website" | "article">("website");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const lines: string[] = [];
    if (title) lines.push(`<title>${esc(title)}</title>`);
    if (description) lines.push(`<meta name="description" content="${esc(description)}" />`);
    if (canonical) lines.push(`<link rel="canonical" href="${esc(canonical)}" />`);
    lines.push("");
    lines.push("<!-- Open Graph -->");
    lines.push(`<meta property="og:type" content="${ogType}" />`);
    if (title) lines.push(`<meta property="og:title" content="${esc(title)}" />`);
    if (description) lines.push(`<meta property="og:description" content="${esc(description)}" />`);
    if (canonical) lines.push(`<meta property="og:url" content="${esc(canonical)}" />`);
    if (siteName) lines.push(`<meta property="og:site_name" content="${esc(siteName)}" />`);
    if (image) lines.push(`<meta property="og:image" content="${esc(image)}" />`);
    lines.push("");
    lines.push("<!-- Twitter Card -->");
    lines.push(`<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`);
    if (twitter) lines.push(`<meta name="twitter:site" content="${esc(twitter)}" />`);
    if (title) lines.push(`<meta name="twitter:title" content="${esc(title)}" />`);
    if (description) lines.push(`<meta name="twitter:description" content="${esc(description)}" />`);
    if (image) lines.push(`<meta name="twitter:image" content="${esc(image)}" />`);
    return lines.join("\n");
  }, [title, description, canonical, siteName, image, twitter, ogType]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const displayHost = useMemo(() => {
    try {
      return new URL(canonical).hostname;
    } catch {
      return canonical || "example.com";
    }
  }, [canonical]);

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Page title</label>
              <Counter value={title.length} limit={TITLE_LIMIT} />
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Meta description</label>
              <Counter value={description.length} limit={DESC_LIMIT} />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Canonical URL</label>
              <input value={canonical} onChange={(e) => setCanonical(e.target.value)} className={inputCls} placeholder="https://…" />
            </div>
            <div>
              <label className={labelCls}>Site name</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Social image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} placeholder="https://…/og.png" />
            </div>
            <div>
              <label className={labelCls}>Twitter handle</label>
              <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className={inputCls} placeholder="@site" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Open Graph type</label>
            <select value={ogType} onChange={(e) => setOgType(e.target.value as "website" | "article")} className={inputCls}>
              <option value="website">website</option>
              <option value="article">article</option>
            </select>
          </div>
        </div>

        {/* Previews + output */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Google preview</label>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Globe className="h-3.5 w-3.5" />
                {displayHost}
              </div>
              <p className="text-[#1a0dab] dark:text-blue-400 text-lg leading-snug truncate">
                {title || "Page title preview"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {description || "Meta description preview appears here."}
              </p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Social card preview</label>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <div className="flex h-32 items-center justify-center bg-slate-200 dark:bg-slate-900 text-slate-400 text-xs font-mono break-all px-4">
                {image ? image : "og:image"}
              </div>
              <div className="p-3 space-y-0.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">{displayHost}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{title || "Title"}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{description || "Description"}</p>
              </div>
            </div>
          </div>

          {!title && !description ? (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Enter at least a title or a description to generate meta tags.
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className={labelCls}>Generated HTML</label>
          <button type="button" onClick={copy} className={primaryBtn}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy HTML"}
          </button>
        </div>
        <pre className="max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-xs font-mono text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
          {html}
        </pre>
      </div>
    </div>
  );
}
