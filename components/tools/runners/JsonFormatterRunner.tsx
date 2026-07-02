"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Minimize2,
  ShieldCheck,
  FileJson,
  Trash2,
  AlertTriangle,
} from "lucide-react";

type IndentMode = "2" | "4" | "tab";

type ParseErrorInfo = {
  message: string;
  line?: number;
  column?: number;
  position?: number;
};

const SAMPLE_JSON = `{
  "id": "usr_8f14e45fceea167a",
  "name": "Zakaria El Lahbabi",
  "active": true,
  "roles": ["owner", "admin"],
  "profile": {
    "email": "zakaria@lahbabiguide.dev",
    "avatar": null,
    "preferences": { "theme": "dark", "locale": "en-US", "notifications": true }
  },
  "projects": [
    { "id": 101, "title": "LahbabiGuide", "tags": ["nextjs", "react", "tailwind"], "progress": 0.87 },
    { "id": 102, "title": "Cooktools Fleet", "tags": ["sqlite"], "progress": 0.42 }
  ],
  "metrics": { "logins": 1284, "lastSeen": "2026-07-01T09:15:00Z", "score": 98.6 },
  "unicode": "café — naïve — \\u2728",
  "createdAt": "2025-01-14T12:00:00.000Z"
}`;

/**
 * Turn the browser's native JSON.parse SyntaxError into a friendlier object.
 * V8/modern engines expose a character position; we derive line/column from it.
 */
function describeParseError(err: unknown, source: string): ParseErrorInfo {
  const message = err instanceof Error ? err.message : String(err);

  // Modern V8: "... at position 42 (line 3 column 5)"
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return {
      message,
      line: Number(lineColMatch[1]),
      column: Number(lineColMatch[2]),
      position: undefined,
    };
  }

  // Fallback: "... at position 42" — compute line/column ourselves.
  const posMatch = message.match(/at position (\d+)/i);
  if (posMatch) {
    const position = Number(posMatch[1]);
    let line = 1;
    let column = 1;
    for (let i = 0; i < position && i < source.length; i += 1) {
      if (source[i] === "\n") {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
    }
    return { message, line, column, position };
  }

  return { message };
}

function indentToArg(mode: IndentMode): string | number {
  if (mode === "2") return 2;
  if (mode === "4") return 4;
  return "\t";
}

/** Byte size of a UTF-8 string, formatted human-readable. */
function formatBytes(text: string): string {
  const bytes = new TextEncoder().encode(text).length;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function JsonFormatterRunner() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<ParseErrorInfo | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [indent, setIndent] = useState<IndentMode>("2");
  const [copied, setCopied] = useState<boolean>(false);

  const outputBytes = useMemo(() => formatBytes(output), [output]);

  function runFormat(mode: "pretty" | "minify") {
    setValid(null);
    if (!input.trim()) {
      setError({ message: "Nothing to process — paste some JSON first." });
      setOutput("");
      return;
    }
    try {
      const parsed: unknown = JSON.parse(input);
      const result =
        mode === "pretty"
          ? JSON.stringify(parsed, null, indentToArg(indent))
          : JSON.stringify(parsed);
      setOutput(result ?? "");
      setError(null);
      setValid(true);
    } catch (err) {
      setError(describeParseError(err, input));
      setOutput("");
      setValid(false);
    }
  }

  function runValidate() {
    if (!input.trim()) {
      setError({ message: "Nothing to validate — paste some JSON first." });
      setValid(false);
      return;
    }
    try {
      JSON.parse(input);
      setError(null);
      setValid(true);
    } catch (err) {
      setError(describeParseError(err, input));
      setValid(false);
    }
  }

  function loadSample() {
    setInput(SAMPLE_JSON);
    setError(null);
    setValid(null);
    setOutput("");
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setError({ message: "Clipboard access was blocked by your browser." });
    }
  }

  const inputBytes = useMemo(() => formatBytes(input), [input]);

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
            <FileJson className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-50">
              JSON Formatter &amp; Validator
            </h2>
            <p className="text-xs text-slate-400">
              Pretty-print, minify &amp; validate JSON — 100% in your browser.
            </p>
          </div>
        </div>

        {/* Indent selector */}
        <div>
          <label
            htmlFor="json-indent"
            className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5"
          >
            Indent
          </label>
          <select
            id="json-indent"
            value={indent}
            onChange={(e) => setIndent(e.target.value as IndentMode)}
            className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => runFormat("pretty")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Format
        </button>
        <button
          type="button"
          onClick={() => runFormat("minify")}
          className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 inline-flex items-center gap-1.5"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Minify
        </button>
        <button
          type="button"
          onClick={runValidate}
          className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Validate
        </button>

        <div className="mx-1 hidden h-5 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

        <button
          type="button"
          onClick={loadSample}
          className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 inline-flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Load sample
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 inline-flex items-center gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* Error / success banner */}
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">{error.message}</p>
              {(error.line !== undefined || error.position !== undefined) && (
                <p className="mt-0.5 text-xs text-red-500/90">
                  {error.line !== undefined && (
                    <>
                      Line <span className="font-mono">{error.line}</span>
                      {error.column !== undefined && (
                        <>
                          , column{" "}
                          <span className="font-mono">{error.column}</span>
                        </>
                      )}
                    </>
                  )}
                  {error.line === undefined && error.position !== undefined && (
                    <>
                      Position{" "}
                      <span className="font-mono">{error.position}</span>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {valid === true && !error && (
        <div className="mt-4 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <p className="font-semibold">Valid JSON.</p>
          </div>
        </div>
      )}

      {/* Input / Output grid */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="json-input"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Input JSON
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {inputBytes}
            </span>
          </div>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setValid(null);
            }}
            spellCheck={false}
            placeholder='{ "hello": "world" }'
            rows={16}
            className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y leading-relaxed"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="json-output"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Output
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">
                {outputBytes}
              </span>
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 disabled:opacity-40"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            id="json-output"
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Formatted output appears here…"
            rows={16}
            className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y leading-relaxed"
          />
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        Everything runs locally in your browser. Your JSON is never uploaded or
        sent to a server.
      </p>
    </div>
  );
}
