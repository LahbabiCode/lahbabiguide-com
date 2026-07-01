"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const TYPES = [
  { value: "tool-listing", label: "Tool or platform listing" },
  { value: "credit-listing", label: "Startup credit program" },
  { value: "featured", label: "Featured listing upgrade" },
  { value: "newsletter-mention", label: "Newsletter mention" },
  { value: "other", label: "Other partnership" },
];

const BUDGETS = [
  { value: "under-100", label: "Under $100" },
  { value: "100-500", label: "$100 - $500" },
  { value: "500-2000", label: "$500 - $2,000" },
  { value: "2000+", label: "$2,000+" },
];

export function SponsorRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    company: "",
    contactName: "",
    email: "",
    website: "",
    type: "tool-listing",
    budget: "100-500",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setMessage(data.message || "Thanks! We will be in touch within 7 business days.");
        setForm({ company: "", contactName: "", email: "", website: "", type: "tool-listing", budget: "100-500", notes: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Please review the form and try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company" required value={form.company} onChange={(v) => update("company", v)} placeholder="Acme Cloud" />
        <Field label="Contact name" required value={form.contactName} onChange={(v) => update("contactName", v)} placeholder="Jane Founder" />
        <Field label="Email" type="email" required value={form.email} onChange={(v) => update("email", v)} placeholder="you@company.com" />
        <Field label="Website" value={form.website} onChange={(v) => update("website", v)} placeholder="https://" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField label="Request type" value={form.type} onChange={(v) => update("type", v)} options={TYPES} />
        <SelectField label="Monthly budget" value={form.budget} onChange={(v) => update("budget", v)} options={BUDGETS} />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
          placeholder="Tell us about your tool or program and what you are looking for."
          className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        {status === "loading" ? "Submitting..." : "Submit Request"} <Send className="h-3.5 w-3.5" />
      </button>
      {status === "success" && (
        <p className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </p>
      )}
      {status === "error" && <p className="text-rose-600 text-sm">{message}</p>}
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        By submitting, you agree to receive email from LahbabiGuide about your request. We do not share your information with third parties.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
