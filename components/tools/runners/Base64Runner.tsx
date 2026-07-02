"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ArrowRightLeft,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";

type Mode = "encode" | "decode";

const SAMPLE_TEXT = "Hello, LahbabiGuide! 👋 Encode me → café, naïve, 日本語.";
const SAMPLE_BASE64 = "SGVsbG8sIExhaGJhYmlHdWlkZSEg8J+Riw==";

/**
 * Encode a UTF-8 string to standard Base64.
 * Uses TextEncoder to get raw bytes, then maps bytes to a binary string so
 * btoa (which is Latin-1 only) receives valid input — this is unicode-safe.
 */
function encodeBase64(input: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunk = 0x8000; // avoid call-stack limits on very large inputs
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const b64 = btoa(binary);
  if (!urlSafe) return b64;
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/**
 * Decode a Base64 (standard or URL-safe) string back to a UTF-8 string.
 * Restores URL-safe chars, re-pads, then decodes bytes via TextDecoder so
 * multi-byte characters come back correctly. Throws on invalid input.
 */
function decodeBase64(input: string): string {
  const cleaned = input.trim().replace(/\s+/g, "");
  if (cleaned === "") return "";

  // Normalize URL-safe alphabet back to standard.
  let normalized = cleaned.replace(/-/g, "+").replace(/_/g, "/");

  // Re-pad to a multiple of 4.
  const pad = normalized.length % 4;
  if (pad === 1) {
    throw new Error("Invalid Base64: length is not valid.");
  }
  if (pad > 0) {
    normalized += "=".repeat(4 - pad);
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error("Invalid Base64: contains characters outside the alphabet.");
  }

  // btoa/atob throw on malformed input — let the caller catch it.
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Runner() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState<string>("");
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Derive output + error purely from state — no effects, never crashes.
  const { output, error } = useMemo<{ output: string; error: string | null }>(() => {
    if (input.trim() === "") return { output: "", error: null };
    try {
      const result =
        mode === "encode"
          ? encodeBase64(input, urlSafe)
          : decodeBase64(input);
      return { output: result, error: null };
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : mode === "decode"
            ? "Could not decode — the input is not valid Base64."
            : "Something went wrong while processing the input.";
      // Make atob's terse DOM error friendlier.
      const friendly = /atob|decode|character/i.test(message)
        ? mode === "decode"
          ? "Invalid Base64 input — check for stray or missing characters."
          : message
        : message;
      return { output: "", error: friendly };
    }
  }, [input, mode, urlSafe]);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (permissions/insecure context) — fail quietly.
    }
  }

  function loadSample() {
    setInput(mode === "encode" ? SAMPLE_TEXT : SAMPLE_BASE64);
  }

  function clearAll() {
    setInput("");
  }

  function swap() {
    // Move the current output into the input and flip the mode, so you can
    // round-trip (encode then decode, or vice versa) with one click.
    if (!output) return;
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  const inputLabel = mode === "encode" ? "Text to encode" : "Base64 to decode";
  const outputLabel = mode === "encode" ? "Base64 output" : "Decoded text";
  const inputPlaceholder =
    mode === "encode"
      ? "Type or paste any text…"
      : "Paste Base64 (standard or URL-safe)…";

  const byteLen =
    mode === "encode" && input
      ? new TextEncoder().encode(input).length
      : input.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
      {/* Header: title + mode toggle */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
            Base64 Encoder / Decoder
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Unicode-safe, runs entirely in your browser.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Mode"
          className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/40"
        >
          {(["encode", "decode"] as const).map((m) => {
            const active = mode === m;
            const Icon = m === "encode" ? Lock : Unlock;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest transition active:scale-95 ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Options row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {mode === "encode" && (
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900"
            />
            URL-safe output
            <span className="font-mono text-[10px] font-normal text-slate-400">
              (- _ , no padding)
            </span>
          </label>
        )}
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700 active:scale-95 dark:text-blue-400"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Load sample
        </button>
      </div>

      {/* Input / Output grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div>
          <label
            htmlFor="b64-input"
            className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            {inputLabel}
          </label>
          <div className="mb-1.5" />
          <textarea
            id="b64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={inputPlaceholder}
            rows={9}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100"
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {input.length.toLocaleString()} chars
              {mode === "encode" && input
                ? ` · ${byteLen.toLocaleString()} bytes`
                : ""}
            </span>
            <button
              onClick={clearAll}
              disabled={!input}
              className="font-bold uppercase tracking-widest transition hover:text-slate-600 disabled:opacity-40 dark:hover:text-slate-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="b64-output"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              {outputLabel}
            </label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:text-blue-600 disabled:opacity-40 dark:hover:text-blue-400"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="mb-1.5" />
          <textarea
            id="b64-output"
            value={error ? "" : output}
            readOnly
            spellCheck={false}
            placeholder="Result appears here…"
            rows={9}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100"
          />
          <div className="mt-1.5 text-[11px] text-slate-400">
            {output ? `${output.length.toLocaleString()} chars` : " "}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={copyOutput}
          disabled={!output}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy result
            </>
          )}
        </button>

        <button
          onClick={swap}
          disabled={!output}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Swap
        </button>

        <button
          onClick={clearAll}
          disabled={!input}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
