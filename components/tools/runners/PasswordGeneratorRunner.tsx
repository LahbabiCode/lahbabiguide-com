"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Character sets                                                     */
/* ------------------------------------------------------------------ */

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?~",
} as const;

// Characters that are easy to confuse with one another.
const AMBIGUOUS = new Set("O0oIl1|`'\"".split(""));

type SetKey = keyof typeof SETS;

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  count: number;
}

interface Strength {
  entropy: number;
  label: "Weak" | "Fair" | "Strong" | "Very strong";
  percent: number;
  barClass: string;
  textClass: string;
}

/* ------------------------------------------------------------------ */
/*  Crypto helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Returns a uniformly-distributed integer in [0, max) using the Web Crypto
 * API. Rejection sampling removes the modulo bias that a naive
 * `getRandomValues % max` would introduce.
 */
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

/** Fisher–Yates shuffle backed by crypto randomness. */
function secureShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build the active alphabet from the current options. */
function buildPool(opts: Options): { pool: string; groups: string[] } {
  const groups: string[] = [];
  (Object.keys(SETS) as SetKey[]).forEach((key) => {
    if (!opts[key]) return;
    let chars = SETS[key];
    if (opts.excludeAmbiguous) {
      chars = chars
        .split("")
        .filter((c) => !AMBIGUOUS.has(c))
        .join("");
    }
    if (chars.length > 0) groups.push(chars);
  });
  return { pool: groups.join(""), groups };
}

/**
 * Generate a single password. Guarantees at least one character from every
 * selected group (when the requested length allows it), then fills the rest
 * from the combined pool and shuffles.
 */
function generateOne(opts: Options): string {
  const { pool, groups } = buildPool(opts);
  if (pool.length === 0) throw new Error("Select at least one character type.");

  const out: string[] = [];

  // Seed one guaranteed char per group so every enabled type appears.
  for (const group of groups) {
    if (out.length >= opts.length) break;
    out.push(group[secureRandomInt(group.length)]);
  }

  // Fill remaining slots from the full pool.
  while (out.length < opts.length) {
    out.push(pool[secureRandomInt(pool.length)]);
  }

  return secureShuffle(out).join("");
}

/* ------------------------------------------------------------------ */
/*  Strength / entropy                                                 */
/* ------------------------------------------------------------------ */

function computeStrength(length: number, poolSize: number): Strength {
  const entropy = poolSize > 1 ? length * Math.log2(poolSize) : 0;

  let label: Strength["label"];
  let barClass: string;
  let textClass: string;

  if (entropy < 40) {
    label = "Weak";
    barClass = "bg-red-500";
    textClass = "text-red-600 dark:text-red-400";
  } else if (entropy < 60) {
    label = "Fair";
    barClass = "bg-amber-500";
    textClass = "text-amber-600 dark:text-amber-400";
  } else if (entropy < 90) {
    label = "Strong";
    barClass = "bg-emerald-500";
    textClass = "text-emerald-600 dark:text-emerald-400";
  } else {
    label = "Very strong";
    barClass = "bg-emerald-500";
    textClass = "text-emerald-600 dark:text-emerald-400";
  }

  // Cap the visual bar at 128 bits of entropy for a full meter.
  const percent = Math.max(4, Math.min(100, Math.round((entropy / 128) * 100)));

  return { entropy, label, percent, barClass, textClass };
}

/* ------------------------------------------------------------------ */
/*  Small UI helpers                                                   */
/* ------------------------------------------------------------------ */

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition disabled:opacity-40 ${
        checked
          ? "border-blue-500 bg-blue-50 text-slate-800 dark:border-blue-500/60 dark:bg-blue-950/30 dark:text-slate-100"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-900"
      }`}
    >
      <span className="font-mono">{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function CopyButton({
  value,
  size = "sm",
}: {
  value: string;
  size?: "sm" | "xs";
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Fallback for restrictive contexts.
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const pad = size === "xs" ? "px-2 py-1" : "px-2.5 py-1.5";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex items-center gap-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider transition active:scale-95 ${pad} ${
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
          : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_OPTIONS: Options = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  count: 1,
};

export default function PasswordGeneratorRunner() {
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTIONS);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(<K extends keyof Options>(key: K, value: Options[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }, []);

  // At least one character type must remain enabled.
  const typeCount = useMemo(
    () =>
      Number(opts.uppercase) +
      Number(opts.lowercase) +
      Number(opts.numbers) +
      Number(opts.symbols),
    [opts.uppercase, opts.lowercase, opts.numbers, opts.symbols]
  );

  const poolSize = useMemo(() => buildPool(opts).pool.length, [opts]);

  const strength = useMemo(
    () => computeStrength(opts.length, poolSize),
    [opts.length, poolSize]
  );

  const generate = useCallback(() => {
    try {
      if (typeof crypto === "undefined" || !crypto.getRandomValues) {
        throw new Error("Secure randomness is unavailable in this browser.");
      }
      if (typeCount === 0) {
        throw new Error("Select at least one character type.");
      }
      const n = Math.max(1, Math.min(50, Math.floor(opts.count) || 1));
      const results: string[] = [];
      for (let i = 0; i < n; i++) results.push(generateOne(opts));
      setPasswords(results);
      setError(null);
    } catch (e) {
      setPasswords([]);
      setError(e instanceof Error ? e.message : "Failed to generate password.");
    }
  }, [opts, typeCount]);

  // Generate an initial password on mount (client-only, crypto available).
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allJoined = useMemo(() => passwords.join("\n"), [passwords]);

  const toggleType = useCallback(
    (key: SetKey, value: boolean) => {
      // Prevent disabling the last remaining type.
      if (!value && typeCount <= 1 && opts[key]) return;
      set(key, value);
    },
    [opts, set, typeCount]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-800 dark:bg-[#0B1120]">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
              Secure Password Generator
            </h2>
            <p className="text-xs text-slate-400">
              Cryptographically random — runs entirely in your browser.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpts(DEFAULT_OPTIONS);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Load sample
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* -------------------------------------------------------- */}
        {/*  Controls                                                */}
        {/* -------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Length slider */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="pw-length"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Length
              </label>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-black text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {opts.length}
              </span>
            </div>
            <input
              id="pw-length"
              type="range"
              min={6}
              max={64}
              step={1}
              value={opts.length}
              onChange={(e) => set("length", Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 dark:bg-slate-800"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          {/* Character type toggles */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              Character types
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Toggle
                label="A-Z"
                checked={opts.uppercase}
                onChange={(v) => toggleType("uppercase", v)}
              />
              <Toggle
                label="a-z"
                checked={opts.lowercase}
                onChange={(v) => toggleType("lowercase", v)}
              />
              <Toggle
                label="0-9"
                checked={opts.numbers}
                onChange={(v) => toggleType("numbers", v)}
              />
              <Toggle
                label="!@#$"
                checked={opts.symbols}
                onChange={(v) => toggleType("symbols", v)}
              />
            </div>
          </div>

          {/* Extra options */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              Options
            </label>
            <Toggle
              label="Exclude ambiguous (O 0 l 1 I)"
              checked={opts.excludeAmbiguous}
              onChange={(v) => set("excludeAmbiguous", v)}
            />
          </div>

          {/* Count */}
          <div>
            <label
              htmlFor="pw-count"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5"
            >
              How many
            </label>
            <input
              id="pw-count"
              type="number"
              min={1}
              max={50}
              value={opts.count}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const clamped = Number.isFinite(raw)
                  ? Math.max(1, Math.min(50, Math.floor(raw)))
                  : 1;
                set("count", clamped);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100"
            />
            <p className="mt-1 text-[10px] text-slate-400">Generate 1–50 passwords at once.</p>
          </div>

          <button
            type="button"
            onClick={generate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" /> Generate
          </button>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Output                                                  */}
        {/* -------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Strength meter */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Strength
              </label>
              <span className={`text-[11px] font-black uppercase tracking-wider ${strength.textClass}`}>
                {strength.label} · {Math.round(strength.entropy)} bits
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.barClass}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Passwords */}
          {!error && passwords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {passwords.length > 1 ? `${passwords.length} passwords` : "Password"}
                </label>
                <div className="flex items-center gap-2">
                  {passwords.length > 1 && <CopyButton value={allJoined} />}
                  <button
                    type="button"
                    onClick={generate}
                    aria-label="Regenerate"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> New
                  </button>
                </div>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {passwords.map((pw, i) => (
                  <div
                    key={`${i}-${pw}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <code className="flex-1 break-all font-mono text-sm text-slate-800 dark:text-slate-100">
                      {pw}
                    </code>
                    <CopyButton value={pw} size="xs" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!error && passwords.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/20">
              Adjust the options and press Generate.
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400 dark:border-slate-800/60">
        Uses <span className="font-mono">crypto.getRandomValues</span> — nothing is
        sent to a server.
      </p>
    </div>
  );
}
