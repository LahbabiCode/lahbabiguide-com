"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ArrowRightLeft,
  Link2,
  AlertCircle,
} from "lucide-react";

type Mode = "encode" | "decode";
type EncodeStrategy = "component" | "uri";

interface QueryParam {
  key: string;
  value: string;
}

interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  path: string;
  hash: string;
  search: string;
  params: QueryParam[];
}

const SAMPLE_ENCODE = "https://example.com/search?q=café & tea/latte#top";
const SAMPLE_DECODE =
  "https://example.com/search?q=caf%C3%A9%20%26%20tea%2Flatte#top";

/**
 * URL Encoder & Decoder
 * - Encode with encodeURIComponent (default) or encodeURI (full URL).
 * - Decode with decodeURIComponent (guarded by try/catch).
 * - Parse URL helper: breaks a full URL into protocol/host/path/query table.
 * All processing is local. Nothing is ever sent to a server.
 */
export default function UrlEncoderRunner() {
  const [mode, setMode] = useState<Mode>("encode");
  const [strategy, setStrategy] = useState<EncodeStrategy>("component");
  const [input, setInput] = useState("");
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedParam, setCopiedParam] = useState<number | null>(null);

  // Compute the transformed output. Never throws — errors are surfaced as a
  // friendly message so the page can never crash.
  const { output, error } = useMemo<{ output: string; error: string | null }>(() => {
    if (!input) return { output: "", error: null };
    try {
      if (mode === "encode") {
        const encoded =
          strategy === "component"
            ? encodeURIComponent(input)
            : encodeURI(input);
        return { output: encoded, error: null };
      }
      // Decode. decodeURIComponent throws URIError on malformed input.
      const decoded = decodeURIComponent(input.replace(/\+/g, " "));
      return { output: decoded, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to process the input.";
      return {
        output: "",
        error:
          mode === "decode"
            ? `Malformed percent-encoding — could not decode. (${message})`
            : message,
      };
    }
  }, [input, mode, strategy]);

  // Attempt to parse the raw input as a full URL for the details table.
  const parsed = useMemo<ParsedUrl | null>(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const url = new URL(trimmed);
      const params: QueryParam[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return {
        protocol: url.protocol.replace(/:$/, ""),
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        hash: url.hash,
        search: url.search,
        params,
      };
    } catch {
      return null;
    }
  }, [input]);

  async function copyText(text: string, onDone: () => void) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      // Clipboard can be blocked (permissions / insecure context). Fail quietly
      // rather than crashing; the user still sees the output text.
    }
  }

  function handleCopyOutput() {
    void copyText(output, () => {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    });
  }

  function handleCopyParam(index: number, value: string) {
    void copyText(value, () => {
      setCopiedParam(index);
      setTimeout(() => setCopiedParam(null), 2000);
    });
  }

  // Swap: move the current output into the input and flip the mode. Handy for
  // round-tripping encode -> decode and back.
  function handleSwap() {
    if (!output) return;
    setInput(output);
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
  }

  function handleClear() {
    setInput("");
  }

  function handleLoadSample() {
    setInput(mode === "encode" ? SAMPLE_ENCODE : SAMPLE_DECODE);
  }

  const inputCls =
    "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
  const primaryBtn =
    "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50";
  const secondaryBtn =
    "inline-flex items-center gap-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 disabled:opacity-50";
  const labelCls =
    "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";

  return (
    <div className="space-y-4">
      {/* Controls panel */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-950/40">
            {(["encode", "decode"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest transition ${
                  mode === m
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                aria-pressed={mode === m}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Encode strategy — only relevant in encode mode */}
          {mode === "encode" && (
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-950/40">
              {(
                [
                  { key: "component", label: "Component" },
                  { key: "uri", label: "Full URL" },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStrategy(s.key)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition ${
                    strategy === s.key
                      ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  aria-pressed={strategy === s.key}
                  title={
                    s.key === "component"
                      ? "encodeURIComponent — escapes reserved characters like & / ? ="
                      : "encodeURI — preserves the structure of a full URL"
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleLoadSample} className={secondaryBtn}>
              <Wand2 className="h-3.5 w-3.5" />
              Load sample
            </button>
            <button
              type="button"
              onClick={handleClear}
              className={secondaryBtn}
              disabled={!input}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          {mode === "encode"
            ? strategy === "component"
              ? "Escapes all reserved characters (&, /, ?, =, #, spaces). Use for a single query value or path segment."
              : "Preserves the overall URL structure — does not escape :, /, ?, &, = or #."
            : "Reverses percent-encoding. '+' is treated as a space. Malformed sequences are reported below."}
        </p>
      </div>

      {/* Input / Output grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
          <label htmlFor="url-input" className={labelCls}>
            {mode === "encode" ? "Text to encode" : "Text to decode"}
          </label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={7}
            placeholder={
              mode === "encode"
                ? "Paste a URL or query value…"
                : "Paste percent-encoded text…"
            }
            className={`${inputCls} resize-y min-h-[9rem]`}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>{input.length.toLocaleString()} chars</span>
            <button
              type="button"
              onClick={handleSwap}
              className={secondaryBtn}
              disabled={!output}
              title="Move the result into the input and flip encode/decode"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Swap
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`${labelCls} mb-0`}>
              {mode === "encode" ? "Encoded result" : "Decoded result"}
            </span>
            <button
              type="button"
              onClick={handleCopyOutput}
              disabled={!output}
              className={`${primaryBtn} !px-3 !py-1.5`}
            >
              {copiedOutput ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {error ? (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              spellCheck={false}
              rows={7}
              placeholder="Result appears here…"
              className={`${inputCls} resize-y min-h-[9rem] cursor-text`}
            />
          )}

          {!error && output && (
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              {output.length.toLocaleString()} chars
            </p>
          )}
        </div>
      </div>

      {/* Parse URL helper */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="h-4 w-4 text-blue-600" />
          <span className={`${labelCls} mb-0`}>Parse URL</span>
        </div>

        {parsed ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {(
                    [
                      ["Protocol", parsed.protocol],
                      ["Host", parsed.host],
                      ["Hostname", parsed.hostname],
                      ["Port", parsed.port || "—"],
                      ["Path", parsed.path || "/"],
                      ["Query", parsed.search || "—"],
                      ["Hash", parsed.hash || "—"],
                    ] as const
                  ).map(([field, val]) => (
                    <tr
                      key={field}
                      className="odd:bg-slate-50/60 dark:odd:bg-slate-950/30"
                    >
                      <td className="w-32 px-3 py-2 align-top text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {field}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-100 break-all">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <span className={labelCls}>
                Query params ({parsed.params.length})
              </span>
              {parsed.params.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  No query parameters found.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40">
                        <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Key
                        </th>
                        <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Value
                        </th>
                        <th className="w-16 px-3 py-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Copy
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {parsed.params.map((p, i) => (
                        <tr
                          key={`${p.key}-${i}`}
                          className="odd:bg-slate-50/60 dark:odd:bg-slate-950/30"
                        >
                          <td className="px-3 py-2 align-top font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 break-all">
                            {p.key}
                          </td>
                          <td className="px-3 py-2 align-top font-mono text-xs text-slate-800 dark:text-slate-100 break-all">
                            {p.value || (
                              <span className="text-slate-400">(empty)</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <button
                              type="button"
                              onClick={() => handleCopyParam(i, p.value)}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95"
                              title="Copy value"
                              aria-label={`Copy value for ${p.key}`}
                            >
                              {copiedParam === i ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Enter a full URL above (including a protocol like{" "}
            <code className="font-mono text-slate-500 dark:text-slate-400">
              https://
            </code>
            ) to break it into protocol, host, path, and query parameters.
          </p>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
        All processing happens locally in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}
