"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Clock,
  CalendarClock,
  ArrowRightLeft,
  Timer,
  Globe,
  MapPin,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Unit = "auto" | "seconds" | "milliseconds";

type ParsedTimestamp = {
  /** Milliseconds since the Unix epoch. */
  ms: number;
  /** Whole seconds since the Unix epoch. */
  seconds: number;
  /** The unit that was actually used to interpret the input. */
  detectedUnit: "seconds" | "milliseconds";
};

type OutputRow = {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Pure helpers (all local, never networked, never throw uncaught)           */
/* -------------------------------------------------------------------------- */

/**
 * Decide whether a numeric timestamp is in seconds or milliseconds.
 * Timestamps in seconds for realistic dates are ~10 digits (until year 2286),
 * whereas milliseconds are ~13 digits. We use magnitude, not just digit count,
 * so negative (pre-1970) values are handled too.
 */
function detectUnit(value: number): "seconds" | "milliseconds" {
  // 1e11 seconds ~= year 5138; anything with |value| >= 1e11 is almost
  // certainly milliseconds. Below that we treat it as seconds.
  return Math.abs(value) >= 1e11 ? "milliseconds" : "seconds";
}

function parseTimestamp(input: string, unit: Unit): ParsedTimestamp {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Enter a Unix timestamp to convert.");
  }

  // Allow a single leading minus, optional decimal (fractional seconds/ms),
  // and surrounding whitespace only.
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error(
      "A Unix timestamp must be a whole number (seconds or milliseconds).",
    );
  }

  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) {
    throw new Error("That number is too large to represent a valid date.");
  }

  const detectedUnit = unit === "auto" ? detectUnit(numeric) : unit;
  const ms = detectedUnit === "seconds" ? numeric * 1000 : numeric;

  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    throw new Error("That value is outside the range of representable dates.");
  }

  return {
    ms: Math.round(ms),
    seconds: Math.floor(ms / 1000),
    detectedUnit,
  };
}

/** ISO-8601 string in UTC, e.g. 2024-05-01T12:00:00.000Z */
function toUtcIso(ms: number): string {
  return new Date(ms).toISOString();
}

/**
 * ISO-8601 string in the browser's local timezone, including the numeric
 * offset, e.g. 2024-05-01T14:00:00.000+02:00
 */
function toLocalIso(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number, len = 2) => String(Math.abs(n)).padStart(len, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const millis = pad(d.getMilliseconds(), 3);

  // getTimezoneOffset is minutes *behind* UTC (positive when west of UTC),
  // so we invert the sign to build the +HH:MM / -HH:MM suffix.
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const offH = pad(Math.trunc(offsetMin / 60));
  const offM = pad(offsetMin % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}${sign}${offH}:${offM}`;
}

/** Human-friendly local date, e.g. "Wed, May 1, 2024, 2:00:00 PM GMT+2" */
function toLocalReadable(ms: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toString();
  }
}

/** Human-friendly UTC date. */
function toUtcReadable(ms: number): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toUTCString();
  }
}

/**
 * Relative time from `now` to `targetMs`, e.g. "in 3 days", "5 minutes ago".
 * Uses Intl.RelativeTimeFormat when available for correct localization.
 */
function relativeTime(targetMs: number, nowMs: number): string {
  const deltaMs = targetMs - nowMs;
  const abs = Math.abs(deltaMs);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  if (abs < 1000) return "just now";

  let unit: Intl.RelativeTimeFormatUnit = "second";
  let amount = Math.round(deltaMs / 1000);
  for (const [u, ms] of units) {
    if (abs >= ms) {
      unit = u;
      amount = Math.round(deltaMs / ms);
      break;
    }
  }

  try {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      amount,
      unit,
    );
  } catch {
    const plural = Math.abs(amount) === 1 ? "" : "s";
    return deltaMs >= 0
      ? `in ${Math.abs(amount)} ${unit}${plural}`
      : `${Math.abs(amount)} ${unit}${plural} ago`;
  }
}

/**
 * Convert a `datetime-local` input value (which is in local time, no offset)
 * into epoch milliseconds. datetime-local has no seconds by default but may
 * include them; Date parsing of that format is treated as local time.
 */
function datetimeLocalToMs(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Pick a date and time to convert.");
  }
  // datetime-local yields e.g. "2024-05-01T14:00" or "2024-05-01T14:00:30".
  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!match) {
    throw new Error("That is not a valid date/time value.");
  }
  const [, y, mo, d, h, mi, s] = match;
  const ms = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    s ? Number(s) : 0,
    0,
  ).getTime();
  if (Number.isNaN(ms)) {
    throw new Error("That date/time could not be interpreted.");
  }
  return ms;
}

/** Produce a `datetime-local`-compatible string (local time) from ms. */
function msToDatetimeLocal(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
      aria-label={copied ? "Copied" : label}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}

function OutputField({
  label,
  value,
  icon,
  mono = true,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <div
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 ${
            mono ? "font-mono" : ""
          }`}
        >
          {icon ? (
            <span className="shrink-0 text-slate-400">{icon}</span>
          ) : null}
          <span className="min-w-0 flex-1 break-all">{value}</span>
        </div>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
      {message}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Live "current timestamp" ticker                                           */
/* -------------------------------------------------------------------------- */

function LiveClock() {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const seconds = Math.floor(now / 1000);
  const localReadable = useMemo(() => toLocalReadable(now), [now]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Current Unix time (seconds)
            </div>
            <div className="mt-0.5 font-mono text-2xl font-black tabular-nums tracking-tight text-slate-800 dark:text-slate-100">
              {seconds}
            </div>
            <div className="mt-0.5 text-xs text-slate-400">{localReadable}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CopyButton text={String(seconds)} label="Copy s" />
          <CopyButton text={String(now)} label="Copy ms" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const SAMPLE_TIMESTAMP = "1714563000";

export default function TimestampConverterRunner() {
  // --- Timestamp -> date state ---
  const [tsInput, setTsInput] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("auto");

  // --- Date -> timestamp state ---
  const [dateInput, setDateInput] = useState<string>("");

  // A slowly-ticking "now" so relative-time strings stay fresh without
  // re-rendering every field each second.
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const tz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
    } catch {
      return "local";
    }
  }, []);

  /* ----- Timestamp -> date ----- */
  const tsResult = useMemo(() => {
    if (!tsInput.trim()) {
      return { parsed: null as ParsedTimestamp | null, error: "" };
    }
    try {
      return { parsed: parseTimestamp(tsInput, unit), error: "" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not read that timestamp.";
      return { parsed: null as ParsedTimestamp | null, error: message };
    }
  }, [tsInput, unit]);

  const tsRows: OutputRow[] = useMemo(() => {
    const p = tsResult.parsed;
    if (!p) return [];
    return [
      {
        key: "utc-iso",
        label: "UTC · ISO 8601",
        value: toUtcIso(p.ms),
        icon: <Globe className="h-3.5 w-3.5" />,
      },
      {
        key: "local-iso",
        label: `Local · ISO 8601 (${tz})`,
        value: toLocalIso(p.ms),
        icon: <MapPin className="h-3.5 w-3.5" />,
      },
      {
        key: "utc-readable",
        label: "UTC · Readable",
        value: toUtcReadable(p.ms),
        icon: <Globe className="h-3.5 w-3.5" />,
      },
      {
        key: "local-readable",
        label: "Local · Readable",
        value: toLocalReadable(p.ms),
        icon: <MapPin className="h-3.5 w-3.5" />,
      },
    ];
  }, [tsResult.parsed, tz]);

  const tsRelative = useMemo(() => {
    const p = tsResult.parsed;
    if (!p) return "";
    try {
      return relativeTime(p.ms, nowMs);
    } catch {
      return "";
    }
  }, [tsResult.parsed, nowMs]);

  /* ----- Date -> timestamp ----- */
  const dateResult = useMemo(() => {
    if (!dateInput.trim()) {
      return { ms: null as number | null, error: "" };
    }
    try {
      return { ms: datetimeLocalToMs(dateInput), error: "" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not read that date.";
      return { ms: null as number | null, error: message };
    }
  }, [dateInput]);

  const dateRelative = useMemo(() => {
    if (dateResult.ms === null) return "";
    try {
      return relativeTime(dateResult.ms, nowMs);
    } catch {
      return "";
    }
  }, [dateResult.ms, nowMs]);

  /* ----- Actions ----- */
  const loadSample = () => {
    setTsInput(SAMPLE_TIMESTAMP);
    setUnit("auto");
  };
  const resetTimestamp = () => {
    setTsInput("");
    setUnit("auto");
  };
  const useNowForTimestamp = () => {
    setUnit("seconds");
    setTsInput(String(Math.floor(Date.now() / 1000)));
  };
  const useNowForDate = () => setDateInput(msToDatetimeLocal(Date.now()));
  const resetDate = () => setDateInput("");

  const unitButtons: { key: Unit; label: string }[] = [
    { key: "auto", label: "Auto" },
    { key: "seconds", label: "Seconds" },
    { key: "milliseconds", label: "Millis" },
  ];

  return (
    <div className="space-y-4">
      {/* -- Header -- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                Unix Timestamp Converter
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Convert Unix timestamps to human dates and back — with UTC and
                local ISO strings, relative time, and a live clock. Everything
                runs locally in your browser.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Sample
            </button>
          </div>
        </div>
      </div>

      {/* -- Live clock -- */}
      <LiveClock />

      {/* -- Timestamp -> date -- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400">
            <Clock className="h-4 w-4" />
          </span>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
            Timestamp → Date
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Input side */}
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="ts-input"
                  className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Unix timestamp
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={useNowForTimestamp}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <Timer className="h-3 w-3" />
                    Now
                  </button>
                  <button
                    type="button"
                    onClick={resetTimestamp}
                    disabled={!tsInput}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Clear
                  </button>
                </div>
              </div>
              <input
                id="ts-input"
                type="text"
                inputMode="numeric"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                spellCheck={false}
                placeholder="1714563000 or 1714563000000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100"
              />
            </div>

            {/* Unit toggle */}
            <div>
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Interpret input as
              </span>
              <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                {unitButtons.map((b, i) => {
                  const active = unit === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setUnit(b.key)}
                      className={`px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition active:scale-95 ${
                        i > 0
                          ? "border-l border-slate-200 dark:border-slate-800"
                          : ""
                      } ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-900"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
              {tsResult.parsed && unit === "auto" ? (
                <p className="mt-2 text-[11px] text-slate-400">
                  Auto-detected as{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-300">
                    {tsResult.parsed.detectedUnit}
                  </span>{" "}
                  based on magnitude.
                </p>
              ) : null}
            </div>

            {tsResult.error ? <ErrorBox message={tsResult.error} /> : null}

            {tsResult.parsed ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                <ArrowRightLeft className="h-4 w-4 shrink-0 text-blue-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {tsRelative || "—"}
                </span>
              </div>
            ) : null}
          </div>

          {/* Output side */}
          <div className="space-y-3">
            {tsResult.parsed ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <OutputField
                    label="Seconds"
                    value={String(tsResult.parsed.seconds)}
                  />
                  <OutputField
                    label="Milliseconds"
                    value={String(tsResult.parsed.ms)}
                  />
                </div>
                {tsRows.map((row) => (
                  <OutputField
                    key={row.key}
                    label={row.label}
                    value={row.value}
                    icon={row.icon}
                  />
                ))}
              </>
            ) : (
              <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-slate-300 dark:border-slate-800 dark:text-slate-700">
                <Clock className="h-6 w-6" />
                <p className="text-xs font-black uppercase tracking-widest">
                  Enter a timestamp
                </p>
                <p className="max-w-[16rem] text-[11px] font-medium normal-case tracking-normal text-slate-400 dark:text-slate-600">
                  Paste seconds or milliseconds. Try the sample above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -- Date -> timestamp -- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-violet-600 dark:text-violet-400">
            <CalendarClock className="h-4 w-4" />
          </span>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
            Date → Timestamp
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Input side */}
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="date-input"
                  className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Local date &amp; time ({tz})
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={useNowForDate}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <Timer className="h-3 w-3" />
                    Now
                  </button>
                  <button
                    type="button"
                    onClick={resetDate}
                    disabled={!dateInput}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Clear
                  </button>
                </div>
              </div>
              <input
                id="date-input"
                type="datetime-local"
                step={1}
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:[color-scheme:dark]"
              />
              <p className="mt-2 text-[11px] text-slate-400">
                The picked time is interpreted in your local timezone.
              </p>
            </div>

            {dateResult.error ? <ErrorBox message={dateResult.error} /> : null}

            {dateResult.ms !== null ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                <ArrowRightLeft className="h-4 w-4 shrink-0 text-violet-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {dateRelative || "—"}
                </span>
              </div>
            ) : null}
          </div>

          {/* Output side */}
          <div className="space-y-3">
            {dateResult.ms !== null ? (
              <>
                <OutputField
                  label="Unix seconds"
                  value={String(Math.floor(dateResult.ms / 1000))}
                />
                <OutputField
                  label="Unix milliseconds"
                  value={String(dateResult.ms)}
                />
                <OutputField
                  label="UTC · ISO 8601"
                  value={toUtcIso(dateResult.ms)}
                  icon={<Globe className="h-3.5 w-3.5" />}
                />
                <OutputField
                  label="Local · ISO 8601"
                  value={toLocalIso(dateResult.ms)}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
              </>
            ) : (
              <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-slate-300 dark:border-slate-800 dark:text-slate-700">
                <CalendarClock className="h-6 w-6" />
                <p className="text-xs font-black uppercase tracking-widest">
                  Pick a date
                </p>
                <p className="max-w-[16rem] text-[11px] font-medium normal-case tracking-normal text-slate-400 dark:text-slate-600">
                  Use the “Now” button to fill in the current moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
