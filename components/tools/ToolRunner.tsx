"use client";

import dynamic from "next/dynamic";
import { Wrench } from "lucide-react";
import type { ComponentType } from "react";

// Loading placeholder shown while a tool's client bundle streams in.
function ToolLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-950/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
        <Wrench className="h-8 w-8 animate-pulse text-blue-600" />
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
        Loading tool…
      </p>
    </div>
  );
}

// Tools are pure client-side utilities — no SSR needed (they use crypto, Date,
// clipboard, etc.). Each runner default-exports a self-contained component.
const opts = { loading: ToolLoading, ssr: false } as const;

// Map of tool.componentKey -> interactive component.
const REGISTRY: Record<string, ComponentType> = {
  "json-formatter": dynamic(() => import("./runners/JsonFormatterRunner"), opts),
  base64: dynamic(() => import("./runners/Base64Runner"), opts),
  "jwt-decoder": dynamic(() => import("./runners/JwtDecoderRunner"), opts),
  "uuid-generator": dynamic(() => import("./runners/UuidGeneratorRunner"), opts),
  "password-generator": dynamic(() => import("./runners/PasswordGeneratorRunner"), opts),
  "url-encoder": dynamic(() => import("./runners/UrlEncoderRunner"), opts),
  "timestamp-converter": dynamic(() => import("./runners/TimestampConverterRunner"), opts),
  "qr-generator": dynamic(() => import("./runners/QrGeneratorRunner"), opts),
  "meta-tags": dynamic(() => import("./runners/MetaTagsRunner"), opts),
  "robots-txt": dynamic(() => import("./runners/RobotsTxtRunner"), opts),
  "css-minifier": dynamic(() => import("./runners/CssMinifierRunner"), opts),
  "js-minifier": dynamic(() => import("./runners/JsMinifierRunner"), opts),
  "http-status": dynamic(() => import("./runners/HttpStatusRunner"), opts),
};

export function ToolRunner({ componentKey }: { componentKey: string }) {
  const Tool = REGISTRY[componentKey];

  if (!Tool) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-950/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
          <Wrench className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
          Tool coming soon
        </p>
        <p className="mx-auto max-w-xs text-xs">
          This utility is being finalized and will be interactive shortly.
        </p>
      </div>
    );
  }

  return <Tool />;
}

export default ToolRunner;
