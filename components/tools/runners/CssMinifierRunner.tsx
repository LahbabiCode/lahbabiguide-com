"use client";

import { useState } from "react";
import { Copy, Check, Wand2, Shrink, AlignLeft } from "lucide-react";

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";
const primaryBtn =
  "bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2";
const secondaryBtn =
  "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition inline-flex items-center gap-2";

const SAMPLE = `/* Card component */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.card .title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

@media (max-width: 640px) {
  .card {
    padding: 16px;
  }
}`;

function minifyCss(css: string): string {
  let out = css;
  // Strip comments (keep nothing — source maps/licenses are out of scope here).
  out = out.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse all whitespace runs to a single space.
  out = out.replace(/\s+/g, " ");
  // Remove spaces around structural characters.
  out = out.replace(/\s*([{}:;,>~+])\s*/g, "$1");
  // Drop the final semicolon before a closing brace.
  out = out.replace(/;}/g, "}");
  // Remove empty rules.
  out = out.replace(/[^{}]+\{\}/g, "");
  return out.trim();
}

function beautifyCss(css: string): string {
  // Start from the minified form for a stable base.
  const min = minifyCss(css);
  let out = "";
  let indent = 0;
  for (let i = 0; i < min.length; i++) {
    const ch = min[i];
    if (ch === "{") {
      out += " {\n" + "  ".repeat(++indent);
    } else if (ch === "}") {
      indent = Math.max(0, indent - 1);
      out = out.trimEnd() + "\n" + "  ".repeat(indent) + "}\n" + "  ".repeat(indent);
    } else if (ch === ";") {
      out += ";\n" + "  ".repeat(indent);
    } else {
      out += ch;
    }
  }
  return out
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l, idx, arr) => !(l.trim() === "" && (arr[idx - 1] ?? "").trim() === ""))
    .join("\n")
    .trim();
}

function bytes(s: string): number {
  return new TextEncoder().encode(s).length;
}

export default function CssMinifierRunner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = (mode: "minify" | "beautify") => {
    try {
      setOutput(mode === "minify" ? minifyCss(input) : beautifyCss(input));
    } catch {
      // The transforms are regex-based and should never throw, but stay safe.
      setOutput(input);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const inSize = bytes(input);
  const outSize = bytes(output);
  const saved = inSize > 0 && output ? Math.max(0, Math.round((1 - outSize / inSize) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => run("minify")} className={primaryBtn} disabled={!input.trim()}>
          <Shrink className="h-3.5 w-3.5" />
          Minify
        </button>
        <button type="button" onClick={() => run("beautify")} className={secondaryBtn} disabled={!input.trim()}>
          <AlignLeft className="h-3.5 w-3.5" />
          Beautify
        </button>
        <button type="button" onClick={() => setInput(SAMPLE)} className={secondaryBtn}>
          <Wand2 className="h-3.5 w-3.5" />
          Load sample
        </button>
        {output ? (
          <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400">
            {inSize.toLocaleString()} B → {outSize.toLocaleString()} B
            {saved > 0 ? <span className="text-emerald-500"> (−{saved}%)</span> : null}
          </span>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>CSS input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            spellCheck={false}
            placeholder="Paste your CSS here…"
            className={inputCls}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelCls}>Output</label>
            <button type="button" onClick={copy} disabled={!output} className={secondaryBtn}>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={16}
            spellCheck={false}
            placeholder="Minified / beautified CSS appears here…"
            className={inputCls}
          />
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Lightweight regex-based minifier — removes comments and whitespace. For build pipelines use cssnano/Lightning CSS; everything here runs locally in your browser.
      </p>
    </div>
  );
}
