"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ShieldAlert,
  Clock,
  KeyRound,
  FileJson2,
  Fingerprint,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type DecodedPart = { pretty: string; raw: Record<string, JsonValue> };

type DecodeResult = {
  header: DecodedPart;
  payload: DecodedPart;
  signature: string;
};

type ClaimRow = {
  key: string;
  label: string;
  raw: string;
  extra?: string;
};

// Build a clean, valid sample token deterministically from real objects so the
// base64url is always correct regardless of source-formatting.
const CLEAN_SAMPLE = buildSample();

function buildSample(): string {
  const enc = (obj: Record<string, JsonValue>) =>
    base64UrlEncode(JSON.stringify(obj));
  const header = enc({ alg: "HS256", typ: "JWT" });
  const payload = enc({
    iss: "https://lahbabiguide.com",
    sub: "user_12345",
    name: "Zakaria El Lahbabi",
    aud: "lahbabiguide-app",
    iat: 1714500000,
    nbf: 1714500000,
    exp: 2060000000,
    role: "admin",
  });
  // Fake but well-formed signature segment (decode-only tool, never verified).
  const signature = "3Q9m0k2r8sTfV4pWn1yZ7bXcLqEgHdJ6uKlMoPa2sI";
  return `${header}.${payload}.${signature}`;
}

/* -------------------------------------------------------------------------- */
/*  base64url helpers (browser-safe, no Buffer)                               */
/* -------------------------------------------------------------------------- */

function base64UrlEncode(input: string): string {
  // UTF-8 safe encode.
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(segment: string): string {
  // Normalize base64url -> base64 and restore padding.
  let normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  if (pad === 1) {
    throw new Error("Invalid base64url length.");
  }
  if (pad > 0) {
    normalized += "=".repeat(4 - pad);
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function isPlainObject(value: unknown): value is Record<string, JsonValue> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function decodePart(segment: string, name: string): DecodedPart {
  if (!segment) {
    throw new Error(`The ${name} segment is empty.`);
  }
  let json: string;
  try {
    json = base64UrlDecode(segment);
  } catch {
    throw new Error(`The ${name} is not valid base64url.`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(`The ${name} does not contain valid JSON.`);
  }
  if (!isPlainObject(parsed)) {
    throw new Error(`The ${name} must be a JSON object.`);
  }
  return { pretty: JSON.stringify(parsed, null, 2), raw: parsed };
}

function decodeJwt(token: string): DecodeResult {
  const trimmed = token.trim().replace(/^Bearer\s+/i, "");
  if (!trimmed) {
    throw new Error("Paste a JWT to decode.");
  }
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error(
      `A JWT must have exactly 3 dot-separated parts — found ${parts.length}.`,
    );
  }
  const [headerSeg, payloadSeg, signatureSeg] = parts;
  const header = decodePart(headerSeg, "header");
  const payload = decodePart(payloadSeg, "payload");
  return { header, payload, signature: signatureSeg };
}

/* -------------------------------------------------------------------------- */
/*  Claim formatting                                                          */
/* -------------------------------------------------------------------------- */

const CLAIM_LABELS: Record<string, string> = {
  iss: "Issuer (iss)",
  sub: "Subject (sub)",
  aud: "Audience (aud)",
  exp: "Expires (exp)",
  iat: "Issued At (iat)",
  nbf: "Not Before (nbf)",
};

const TIME_CLAIMS = new Set(["exp", "iat", "nbf"]);

function formatTimeClaim(value: JsonValue): { raw: string; extra: string } {
  if (typeof value !== "number") {
    return { raw: String(value), extra: "not a numeric timestamp" };
  }
  // JWT time claims are seconds since epoch (NumericDate).
  const ms = value * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    return { raw: String(value), extra: "invalid date" };
  }
  return { raw: String(value), extra: date.toLocaleString() };
}

function formatScalar(value: JsonValue): string {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => formatScalar(v)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

type ExpiryState =
  | { kind: "valid"; label: string }
  | { kind: "expired"; label: string }
  | { kind: "notyet"; label: string }
  | { kind: "none" };

function buildClaims(payload: Record<string, JsonValue>): {
  rows: ClaimRow[];
  expiry: ExpiryState;
} {
  const rows: ClaimRow[] = [];
  const order = ["iss", "sub", "aud", "iat", "nbf", "exp"];

  for (const key of order) {
    if (!(key in payload)) continue;
    const value = payload[key];
    if (TIME_CLAIMS.has(key)) {
      const { raw, extra } = formatTimeClaim(value);
      rows.push({ key, label: CLAIM_LABELS[key], raw, extra });
    } else {
      rows.push({ key, label: CLAIM_LABELS[key], raw: formatScalar(value) });
    }
  }

  const expiry = computeExpiry(payload);
  return { rows, expiry };
}

function computeExpiry(payload: Record<string, JsonValue>): ExpiryState {
  const exp = payload.exp;
  const nbf = payload.nbf;
  const nowSec = Date.now() / 1000;

  if (typeof nbf === "number" && nowSec < nbf) {
    const when = new Date(nbf * 1000).toLocaleString();
    return { kind: "notyet", label: `Not valid until ${when}` };
  }

  if (typeof exp !== "number") {
    return { kind: "none" };
  }

  const expDate = new Date(exp * 1000);
  if (Number.isNaN(expDate.getTime())) return { kind: "none" };

  if (nowSec >= exp) {
    return { kind: "expired", label: `Expired ${relativeTime(exp - nowSec)}` };
  }
  return { kind: "valid", label: `Valid — expires ${relativeTime(exp - nowSec)}` };
}

function relativeTime(deltaSec: number): string {
  const abs = Math.abs(deltaSec);
  const past = deltaSec < 0;
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = abs;
  let unit = "second";
  for (let i = 0; i < units.length; i += 1) {
    unit = units[i][1];
    if (value < units[i][0]) break;
    value /= units[i][0];
  }
  const rounded = Math.max(1, Math.floor(value));
  const plural = rounded === 1 ? "" : "s";
  return past
    ? `${rounded} ${unit}${plural} ago`
    : `in ${rounded} ${unit}${plural}`;
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

function ExpiryBadge({ expiry }: { expiry: ExpiryState }) {
  if (expiry.kind === "none") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Clock className="h-3.5 w-3.5" />
        No exp claim
      </span>
    );
  }
  if (expiry.kind === "expired") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
        <XCircle className="h-3.5 w-3.5" />
        Expired
      </span>
    );
  }
  if (expiry.kind === "notyet") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-600 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
        <Clock className="h-3.5 w-3.5" />
        Not yet valid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Valid
    </span>
  );
}

function JsonPanel({
  title,
  icon,
  pretty,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  pretty: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1120]">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className={accent}>{icon}</span>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
            {title}
          </h3>
        </div>
        <CopyButton text={pretty} label="Copy JSON" />
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-b-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 dark:bg-slate-950/40 dark:text-slate-100">
        <code className="font-mono">{pretty}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function JwtDecoderRunner() {
  const [token, setToken] = useState("");

  const { result, error } = useMemo(() => {
    if (!token.trim()) {
      return { result: null as DecodeResult | null, error: "" };
    }
    try {
      return { result: decodeJwt(token), error: "" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not decode this token.";
      return { result: null as DecodeResult | null, error: message };
    }
  }, [token]);

  const claims = useMemo(() => {
    if (!result) return null;
    try {
      return buildClaims(result.payload.raw);
    } catch {
      return null;
    }
  }, [result]);

  const loadSample = () => setToken(CLEAN_SAMPLE);
  const clearAll = () => setToken("");

  return (
    <div className="space-y-4">
      {/* -- Intro / decode-only notice -- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                JWT Decoder &amp; Inspector
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Paste a JSON Web Token to inspect its header, payload, and
                standard claims. Everything runs locally in your browser.
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
            <button
              type="button"
              onClick={clearAll}
              disabled={!token}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Decode-only warning */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-black uppercase tracking-wider">
              Decode only.
            </span>{" "}
            The signature is <span className="font-semibold">not</span> verified
            — no secret or public key is used and nothing is sent to a server. A
            decoded token is not proof that it is authentic.
          </p>
        </div>
      </div>

      {/* -- Input + claims grid -- */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="jwt-input"
              className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Encoded JWT
            </label>
            {token ? <CopyButton text={token} label="Copy token" /> : null}
          </div>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            spellCheck={false}
            rows={10}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0..."
            className="w-full resize-y break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100"
          />

          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          ) : null}

          {result && !error ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Parsed 3 segments successfully.
            </div>
          ) : null}
        </div>

        {/* Claims table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
              Registered Claims
            </span>
            {claims ? <ExpiryBadge expiry={claims.expiry} /> : null}
          </div>

          {!result ? (
            <div className="flex h-full min-h-[10rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-slate-300 dark:border-slate-800 dark:text-slate-700">
              <Clock className="h-6 w-6" />
              <p className="text-xs font-black uppercase tracking-widest">
                Awaiting a token
              </p>
            </div>
          ) : claims && claims.rows.length > 0 ? (
            <>
              {claims.expiry.kind !== "none" && "label" in claims.expiry ? (
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                  {claims.expiry.label}
                </p>
              ) : null}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-left text-xs">
                  <tbody>
                    {claims.rows.map((row, idx) => (
                      <tr
                        key={row.key}
                        className={
                          idx % 2 === 0
                            ? "bg-white dark:bg-transparent"
                            : "bg-slate-50 dark:bg-slate-950/30"
                        }
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap border-b border-slate-100 px-3 py-2 align-top font-black uppercase tracking-wider text-slate-400 dark:border-slate-800/60"
                        >
                          {row.label}
                        </th>
                        <td className="border-b border-slate-100 px-3 py-2 align-top dark:border-slate-800/60">
                          <div className="break-all font-mono text-slate-700 dark:text-slate-200">
                            {row.raw}
                          </div>
                          {row.extra ? (
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              {row.extra}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Times are shown in your local timezone (
                {Intl.DateTimeFormat().resolvedOptions().timeZone}).
              </p>
            </>
          ) : (
            <div className="flex min-h-[8rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-slate-300 dark:border-slate-800 dark:text-slate-700">
              <Clock className="h-6 w-6" />
              <p className="text-xs font-black uppercase tracking-widest">
                No standard claims found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -- Header + payload JSON panels -- */}
      {result && !error ? (
        <div className="grid gap-4 md:grid-cols-2">
          <JsonPanel
            title="Header"
            icon={<FileJson2 className="h-4 w-4" />}
            pretty={result.header.pretty}
            accent="text-blue-600 dark:text-blue-400"
          />
          <JsonPanel
            title="Payload"
            icon={<FileJson2 className="h-4 w-4" />}
            pretty={result.payload.pretty}
            accent="text-violet-600 dark:text-violet-400"
          />
        </div>
      ) : null}

      {/* -- Signature -- */}
      {result && !error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0B1120] md:p-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-rose-600 dark:text-rose-400">
                <Fingerprint className="h-4 w-4" />
              </span>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                Signature
              </h3>
            </div>
            <CopyButton text={result.signature} label="Copy signature" />
          </div>
          <p className="break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            {result.signature || "(empty)"}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Shown raw (base64url). This tool does not compute or verify the
            signature.
          </p>
        </div>
      ) : null}
    </div>
  );
}
