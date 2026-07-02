"use client";

import { useMemo, useState } from "react";
import { Search, Check, Copy } from "lucide-react";

interface StatusCode {
  code: number;
  name: string;
  description: string;
}

const CODES: StatusCode[] = [
  { code: 100, name: "Continue", description: "The server received the request headers; the client should send the body." },
  { code: 101, name: "Switching Protocols", description: "The server agrees to switch protocols as requested (e.g. to WebSocket)." },
  { code: 102, name: "Processing", description: "The server accepted the request but has not completed it yet (WebDAV)." },
  { code: 103, name: "Early Hints", description: "Preload hints sent before the final response." },
  { code: 200, name: "OK", description: "The request succeeded and the response contains the result." },
  { code: 201, name: "Created", description: "The request succeeded and a new resource was created." },
  { code: 202, name: "Accepted", description: "The request was accepted for processing but is not finished." },
  { code: 204, name: "No Content", description: "Success with no response body." },
  { code: 205, name: "Reset Content", description: "Success; the client should reset the document view." },
  { code: 206, name: "Partial Content", description: "Partial response to a range request." },
  { code: 301, name: "Moved Permanently", description: "The resource moved permanently to a new URL (SEO-friendly redirect)." },
  { code: 302, name: "Found", description: "Temporary redirect; the original URL should still be used." },
  { code: 303, name: "See Other", description: "Fetch the result with GET at another URL (after POST)." },
  { code: 304, name: "Not Modified", description: "Cached version is still valid; no body returned." },
  { code: 307, name: "Temporary Redirect", description: "Temporary redirect preserving the HTTP method." },
  { code: 308, name: "Permanent Redirect", description: "Permanent redirect preserving the HTTP method." },
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to a client error (malformed syntax)." },
  { code: 401, name: "Unauthorized", description: "Authentication is required or has failed." },
  { code: 402, name: "Payment Required", description: "Reserved; sometimes used for quota/billing limits." },
  { code: 403, name: "Forbidden", description: "The server understood but refuses to authorize the request." },
  { code: 404, name: "Not Found", description: "The requested resource does not exist on the server." },
  { code: 405, name: "Method Not Allowed", description: "The HTTP method is not supported by this resource." },
  { code: 406, name: "Not Acceptable", description: "No representation matches the Accept headers." },
  { code: 408, name: "Request Timeout", description: "The client took too long to send the request." },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state (e.g. edit conflict)." },
  { code: 410, name: "Gone", description: "The resource existed but was permanently removed." },
  { code: 411, name: "Length Required", description: "Content-Length header is required." },
  { code: 412, name: "Precondition Failed", description: "A conditional header (If-Match…) failed." },
  { code: 413, name: "Payload Too Large", description: "The request body exceeds server limits." },
  { code: 414, name: "URI Too Long", description: "The request URI is longer than the server accepts." },
  { code: 415, name: "Unsupported Media Type", description: "The request body format is not supported." },
  { code: 416, name: "Range Not Satisfiable", description: "The requested range is outside the resource size." },
  { code: 418, name: "I'm a teapot", description: "April Fools joke (RFC 2324) — the teapot refuses to brew coffee." },
  { code: 422, name: "Unprocessable Entity", description: "The request is well-formed but semantically invalid (validation errors)." },
  { code: 425, name: "Too Early", description: "The server refuses to process a possibly replayed request." },
  { code: 426, name: "Upgrade Required", description: "The client must switch to a different protocol." },
  { code: 428, name: "Precondition Required", description: "The request must be conditional (prevents lost updates)." },
  { code: 429, name: "Too Many Requests", description: "Rate limit exceeded — slow down." },
  { code: 431, name: "Request Header Fields Too Large", description: "Headers are too large to process." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "Access denied for legal reasons (censorship, DMCA)." },
  { code: 500, name: "Internal Server Error", description: "Generic unexpected server-side failure." },
  { code: 501, name: "Not Implemented", description: "The server does not support the request method/feature." },
  { code: 502, name: "Bad Gateway", description: "An upstream server returned an invalid response." },
  { code: 503, name: "Service Unavailable", description: "The server is overloaded or down for maintenance." },
  { code: 504, name: "Gateway Timeout", description: "An upstream server did not respond in time." },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP protocol version is not supported." },
  { code: 507, name: "Insufficient Storage", description: "The server cannot store the representation (WebDAV)." },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop (WebDAV)." },
  { code: 511, name: "Network Authentication Required", description: "Network access requires authentication (captive portals)." },
];

const CLASSES: { prefix: number; label: string; badge: string; ring: string }[] = [
  { prefix: 1, label: "1xx — Informational", badge: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300", ring: "border-sky-200 dark:border-sky-900" },
  { prefix: 2, label: "2xx — Success", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300", ring: "border-emerald-200 dark:border-emerald-900" },
  { prefix: 3, label: "3xx — Redirection", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300", ring: "border-amber-200 dark:border-amber-900" },
  { prefix: 4, label: "4xx — Client Error", badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300", ring: "border-orange-200 dark:border-orange-900" },
  { prefix: 5, label: "5xx — Server Error", badge: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300", ring: "border-red-200 dark:border-red-900" },
];

export default function HttpStatusRunner() {
  const [query, setQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CODES;
    return CODES.filter(
      (c) =>
        String(c.code).includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [query]);

  const copy = async (code: number) => {
    try {
      await navigator.clipboard.writeText(String(code));
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or text — e.g. 404, timeout, redirect…"
          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No status code matches “{query}”.</p>
      ) : (
        CLASSES.map((cls) => {
          const list = filtered.filter((c) => Math.floor(c.code / 100) === cls.prefix);
          if (list.length === 0) return null;
          return (
            <section key={cls.prefix} className="space-y-2">
              <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls.badge}`}>
                {cls.label}
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {list.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => copy(c.code)}
                    title="Click to copy the code"
                    className={`group flex items-start gap-3 rounded-xl border ${cls.ring} bg-slate-50 dark:bg-slate-950/40 p-3 text-left transition hover:border-blue-400 dark:hover:border-blue-600`}
                  >
                    <span className="font-mono text-lg font-black text-slate-800 dark:text-slate-100 tabular-nums">
                      {c.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 leading-snug">{c.description}</span>
                    </span>
                    <span className="mt-0.5 text-slate-300 group-hover:text-blue-500 transition">
                      {copiedCode === c.code ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })
      )}

      <p className="text-[10px] text-slate-400">
        {CODES.length} standard status codes — click any card to copy its code. Reference: RFC 9110.
      </p>
    </div>
  );
}
