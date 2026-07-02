"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Check, RefreshCw, Wand2, Hash, ListChecks } from "lucide-react";

/**
 * UUID / GUID Generator — fully client-side.
 *
 * Generates RFC 4122 version-4 UUIDs using crypto.randomUUID() when available,
 * falling back to crypto.getRandomValues() (and finally Math.random as a last
 * resort so the tool never crashes in an ancient runtime). Supports formatting
 * options (count, uppercase, hyphens, braces) plus a NIL UUID helper.
 */

const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const COPY_RESET_MS = 2000;

type FormatOptions = {
  uppercase: boolean;
  hyphens: boolean;
  braces: boolean;
};

/** Produce a single canonical (lowercase, hyphenated) v4 UUID. */
function rawUuidV4(): string {
  // Preferred: native, cryptographically strong.
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Fallback: build a v4 UUID from crypto.getRandomValues.
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Per RFC 4122 §4.4: set version (4) and variant (10xx) bits.
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return bytesToUuid(bytes);
  }

  // Last-resort fallback (non-crypto). Keeps the component from throwing in
  // environments without the Web Crypto API. Not for security-sensitive use.
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return bytesToUuid(bytes);
}

/** Convert 16 bytes into the canonical 8-4-4-4-12 hyphenated hex string. */
function bytesToUuid(bytes: Uint8Array): string {
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) {
    hex.push(bytes[i].toString(16).padStart(2, "0"));
  }
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}

/** Apply the user's formatting preferences to a canonical UUID string. */
function formatUuid(canonical: string, opts: FormatOptions): string {
  let out = canonical;
  if (!opts.hyphens) out = out.replace(/-/g, "");
  if (opts.uppercase) out = out.toUpperCase();
  if (opts.braces) out = `{${out}}`;
  return out;
}

function clampCount(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(100, Math.max(1, Math.floor(value)));
}

export default function UuidGeneratorRunner() {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => rawUuidV4()),
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const opts = useMemo<FormatOptions>(
    () => ({ uppercase, hyphens, braces }),
    [uppercase, hyphens, braces],
  );

  // The raw stored UUIDs are always canonical; formatting is applied on render
  // so toggling options never requires regenerating the random values.
  const formatted = useMemo(
    () => uuids.map((u) => formatUuid(u, opts)),
    [uuids, opts],
  );

  const joined = useMemo(() => formatted.join("\n"), [formatted]);

  const regenerate = useCallback(() => {
    try {
      const n = clampCount(count);
      const next = Array.from({ length: n }, () => rawUuidV4());
      setUuids(next);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not generate UUIDs: ${err.message}`
          : "Could not generate UUIDs in this environment.",
      );
    }
  }, [count]);

  const loadNil = useCallback(() => {
    try {
      setUuids([NIL_UUID]);
      setCount(1);
      setError(null);
    } catch {
      setError("Could not load the NIL UUID.");
    }
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, onDone: () => void) => {
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          await navigator.clipboard.writeText(text);
          onDone();
          setError(null);
        } else {
          throw new Error("Clipboard API unavailable");
        }
      } catch {
        setError(
          "Clipboard is not available in this browser context. Try selecting the text manually.",
        );
      }
    },
    [],
  );

  const handleCopyAll = useCallback(() => {
    if (!joined) return;
    void copyToClipboard(joined, () => {
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), COPY_RESET_MS);
    });
  }, [joined, copyToClipboard]);

  const handleCopyItem = useCallback(
    (value: string, index: number) => {
      void copyToClipboard(value, () => {
        setCopiedIndex(index);
        window.setTimeout(() => setCopiedIndex(null), COPY_RESET_MS);
      });
    },
    [copyToClipboard],
  );

  const handleCountChange = useCallback((raw: string) => {
    if (raw === "") {
      setCount(1);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    setCount(clampCount(parsed));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* ---- Controls panel ---- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                UUID / GUID Generator
              </h3>
              <p className="text-[11px] text-slate-400">
                RFC 4122 v4 · generated locally in your browser
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="uuid-count"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5"
              >
                How many (1–100)
              </label>
              <input
                id="uuid-count"
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => handleCountChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <fieldset>
              <legend className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Formatting
              </legend>
              <div className="space-y-2">
                <ToggleRow
                  id="uuid-uppercase"
                  label="Uppercase"
                  checked={uppercase}
                  onChange={setUppercase}
                />
                <ToggleRow
                  id="uuid-hyphens"
                  label="Include hyphens"
                  checked={hyphens}
                  onChange={setHyphens}
                />
                <ToggleRow
                  id="uuid-braces"
                  label="Wrap in braces { }"
                  checked={braces}
                  onChange={setBraces}
                />
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={regenerate}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <button
                type="button"
                onClick={loadNil}
                className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 inline-flex items-center gap-2"
              >
                <Wand2 className="h-3.5 w-3.5" />
                NIL UUID
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              <span className="font-black uppercase tracking-widest text-slate-400">
                Preview
              </span>
              <p className="mt-1 break-all font-mono text-slate-700 dark:text-slate-200">
                {formatUuid("00000000-0000-0000-0000-000000000000", opts)}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Output panel ---- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {formatted.length} result{formatted.length === 1 ? "" : "s"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={formatted.length === 0}
              className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy all
                </>
              )}
            </button>
          </div>

          <div className="max-h-[22rem] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/40">
            {formatted.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-slate-400">
                No UUIDs yet — press Regenerate.
              </p>
            ) : (
              <ul className="space-y-1">
                {formatted.map((value, index) => (
                  <li
                    key={`${value}-${index}`}
                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-white dark:hover:bg-slate-900/60"
                  >
                    <code className="min-w-0 flex-1 break-all font-mono text-sm text-slate-800 dark:text-slate-100">
                      {value}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyItem(value, index)}
                      aria-label={`Copy UUID ${index + 1}`}
                      title="Copy this UUID"
                      className="shrink-0 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 opacity-0 transition hover:text-blue-600 group-hover:opacity-100 focus:opacity-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** A compact accessible checkbox row used for the boolean formatting options. */
function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40"
    >
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700"
      />
    </label>
  );
}
