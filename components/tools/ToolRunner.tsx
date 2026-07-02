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
// NOTE: next/dynamic requires the options to be an inline object literal in
// every call (it is statically analyzed) — do not extract them to a variable.

// Map of tool.componentKey -> interactive component.
const REGISTRY: Record<string, ComponentType> = {
  "json-formatter": dynamic(() => import("./runners/JsonFormatterRunner"), { loading: ToolLoading, ssr: false }),
  base64: dynamic(() => import("./runners/Base64Runner"), { loading: ToolLoading, ssr: false }),
  "jwt-decoder": dynamic(() => import("./runners/JwtDecoderRunner"), { loading: ToolLoading, ssr: false }),
  "uuid-generator": dynamic(() => import("./runners/UuidGeneratorRunner"), { loading: ToolLoading, ssr: false }),
  "password-generator": dynamic(() => import("./runners/PasswordGeneratorRunner"), { loading: ToolLoading, ssr: false }),
  "url-encoder": dynamic(() => import("./runners/UrlEncoderRunner"), { loading: ToolLoading, ssr: false }),
  "timestamp-converter": dynamic(() => import("./runners/TimestampConverterRunner"), { loading: ToolLoading, ssr: false }),
  "qr-generator": dynamic(() => import("./runners/QrGeneratorRunner"), { loading: ToolLoading, ssr: false }),
  "meta-tags": dynamic(() => import("./runners/MetaTagsRunner"), { loading: ToolLoading, ssr: false }),
  "robots-txt": dynamic(() => import("./runners/RobotsTxtRunner"), { loading: ToolLoading, ssr: false }),
  "css-minifier": dynamic(() => import("./runners/CssMinifierRunner"), { loading: ToolLoading, ssr: false }),
  "js-minifier": dynamic(() => import("./runners/JsMinifierRunner"), { loading: ToolLoading, ssr: false }),
  "http-status": dynamic(() => import("./runners/HttpStatusRunner"), { loading: ToolLoading, ssr: false }),
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
