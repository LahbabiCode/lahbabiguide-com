"use client";

import { useState } from "react";
import { Send, CheckCircle2, Download } from "lucide-react";

export function ProductLeadForm({ productTitle, productSlug }: { productTitle: string; productSlug: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"email" | "buy">("email");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/products/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productSlug, name, email, mode }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        setStatus("success");
        setMessage(data.message);
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-5">
      <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">Get {productTitle}</h3>

      <div className="inline-flex items-center bg-slate-100 dark:bg-slate-950/40 rounded-full p-1 border border-slate-200 dark:border-slate-800">
        <button type="button" onClick={() => setMode("email")} className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full ${mode === "email" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300"}`}>Free with email</button>
        <button type="button" onClick={() => setMode("buy")} className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full ${mode === "buy" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300"}`}>Buy instant access</button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@startup.com"
          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        {status === "loading" ? "Submitting..." : mode === "email" ? "Get the PDF" : "Continue to checkout"} <Send className="h-3.5 w-3.5" />
      </button>

      {status === "success" && (
        <p className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle2 className="h-4 w-4" /> {message}</p>
      )}
      {status === "error" && <p className="text-rose-600 text-sm">{message}</p>}

      <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <Download className="h-3 w-3" /> Instant download link delivered by email.
      </p>
    </form>
  );
}
