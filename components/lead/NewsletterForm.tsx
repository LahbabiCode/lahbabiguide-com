"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Send } from "lucide-react";

interface NewsletterFormProps {
  variant?: "card" | "footer";
  source?: string;
}

export function NewsletterForm({ variant = "card", source = "money-page" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setMessage(data.message || "Thanks for subscribing.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const cardClasses =
    variant === "card"
      ? "bg-slate-900 rounded-3xl p-8 text-white space-y-5"
      : "bg-blue-600 rounded-3xl p-6 text-white space-y-4";

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-blue-400" />
        <h3 className="font-display text-xl font-black">
          Get weekly startup credits and tools
        </h3>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        Subscribe to receive new free cloud credits, developer tool launches, and pricing guides straight to your inbox. No spam.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@startup.com"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"} <Send className="h-3.5 w-3.5" />
        </button>
      </form>
      {status === "success" && (
        <p className="flex items-center gap-2 text-emerald-300 text-sm">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </p>
      )}
      {status === "error" && <p className="text-rose-300 text-sm">{message}</p>}
      <p className="text-[10px] text-slate-400 leading-relaxed">
        By subscribing you agree to receive email updates from LahbabiGuide. You can unsubscribe at any time.
      </p>
    </div>
  );
}
