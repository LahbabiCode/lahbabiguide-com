"use client";

import { useState } from "react";
import { Copy, Check, Wand2, Shrink, AlertCircle } from "lucide-react";

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";
const primaryBtn =
  "bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2";
const secondaryBtn =
  "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition inline-flex items-center gap-2";

const SAMPLE = `// Fetch a user and render a greeting
async function greet(userId) {
  /* The endpoint is public and cached.
     See https://example.com/docs for details. */
  const res = await fetch(\`/api/users/\${userId}\`);
  const user = await res.json();

  // Fall back to a generic name
  const name = user.name || "friend";
  return \`Hello, \${name}!\`;
}

console.log(await greet(42));`;

/**
 * Best-effort comment stripper that is string-aware: content inside
 * '…', "…", and \`…\` (including \${ } nesting is NOT parsed — template
 * contents are treated as opaque) is preserved untouched, so URLs like
 * https:// inside strings survive. This is a safe formatter, not a compiler.
 */
function stripComments(src: string): string {
  let out = "";
  let i = 0;
  const n = src.length;
  let mode: "code" | "single" | "double" | "template" | "line" | "block" = "code";

  while (i < n) {
    const ch = src[i];
    const next = src[i + 1];

    if (mode === "code") {
      if (ch === "'") { mode = "single"; out += ch; i++; continue; }
      if (ch === '"') { mode = "double"; out += ch; i++; continue; }
      if (ch === "`") { mode = "template"; out += ch; i++; continue; }
      if (ch === "/" && next === "/") { mode = "line"; i += 2; continue; }
      if (ch === "/" && next === "*") { mode = "block"; i += 2; continue; }
      out += ch; i++; continue;
    }

    if (mode === "single") {
      out += ch;
      if (ch === "\\") { out += src[i + 1] ?? ""; i += 2; continue; }
      if (ch === "'" ) mode = "code";
      i++; continue;
    }

    if (mode === "double") {
      out += ch;
      if (ch === "\\") { out += src[i + 1] ?? ""; i += 2; continue; }
      if (ch === '"') mode = "code";
      i++; continue;
    }

    if (mode === "template") {
      out += ch;
      if (ch === "\\") { out += src[i + 1] ?? ""; i += 2; continue; }
      if (ch === "`") mode = "code";
      i++; continue;
    }

    if (mode === "line") {
      if (ch === "\n") { mode = "code"; out += ch; }
      i++; continue;
    }

    // block comment
    if (ch === "*" && next === "/") { mode = "code"; i += 2; continue; }
    i++;
  }
  return out;
}

function minifyJs(src: string): string {
  const noComments = stripComments(src);
  return noComments
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n");
}

function bytes(s: string): number {
  return new TextEncoder().encode(s).length;
}

export default function JsMinifierRunner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = () => {
    try {
      setOutput(minifyJs(input));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this input.");
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
        <button type="button" onClick={run} className={primaryBtn} disabled={!input.trim()}>
          <Shrink className="h-3.5 w-3.5" />
          Minify
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

      {error ? (
        <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>JavaScript input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            spellCheck={false}
            placeholder="Paste your JavaScript here…"
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
            placeholder="Minified JavaScript appears here…"
            className={inputCls}
          />
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Basic safe minifier: strips comments (string-aware) and blank space, keeps your code semantics untouched. It is not a compiler — for maximum compression use terser/esbuild in your build. Runs 100% locally.
      </p>
    </div>
  );
}
