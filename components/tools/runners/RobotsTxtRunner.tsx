"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Download, Plus, Trash2 } from "lucide-react";

type RuleType = "allow" | "disallow";

interface Rule {
  type: RuleType;
  path: string;
}

interface Group {
  userAgent: string;
  rules: Rule[];
}

type Preset = "allow-all" | "block-all" | "wordpress" | "custom";

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";
const primaryBtn =
  "bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2";
const secondaryBtn =
  "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition inline-flex items-center gap-2";
const iconBtn =
  "rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 hover:text-red-500 hover:border-red-300 transition";

const PRESETS: Record<Exclude<Preset, "custom">, Group[]> = {
  "allow-all": [{ userAgent: "*", rules: [{ type: "allow", path: "/" }] }],
  "block-all": [{ userAgent: "*", rules: [{ type: "disallow", path: "/" }] }],
  wordpress: [
    {
      userAgent: "*",
      rules: [
        { type: "disallow", path: "/wp-admin/" },
        { type: "allow", path: "/wp-admin/admin-ajax.php" },
        { type: "disallow", path: "/wp-login.php" },
        { type: "disallow", path: "/?s=" },
      ],
    },
  ],
};

export default function RobotsTxtRunner() {
  const [preset, setPreset] = useState<Preset>("allow-all");
  const [groups, setGroups] = useState<Group[]>(PRESETS["allow-all"]);
  const [sitemaps, setSitemaps] = useState<string[]>(["https://example.com/sitemap.xml"]);
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p !== "custom") setGroups(JSON.parse(JSON.stringify(PRESETS[p])) as Group[]);
  };

  const markCustom = () => setPreset("custom");

  const updateGroup = (gi: number, next: Partial<Group>) => {
    markCustom();
    setGroups((gs) => gs.map((g, i) => (i === gi ? { ...g, ...next } : g)));
  };

  const updateRule = (gi: number, ri: number, next: Partial<Rule>) => {
    markCustom();
    setGroups((gs) =>
      gs.map((g, i) =>
        i === gi ? { ...g, rules: g.rules.map((r, j) => (j === ri ? { ...r, ...next } : r)) } : g
      )
    );
  };

  const addRule = (gi: number) => {
    markCustom();
    setGroups((gs) =>
      gs.map((g, i) => (i === gi ? { ...g, rules: [...g.rules, { type: "disallow" as RuleType, path: "/" }] } : g))
    );
  };

  const removeRule = (gi: number, ri: number) => {
    markCustom();
    setGroups((gs) => gs.map((g, i) => (i === gi ? { ...g, rules: g.rules.filter((_, j) => j !== ri) } : g)));
  };

  const addGroup = () => {
    markCustom();
    setGroups((gs) => [...gs, { userAgent: "Googlebot", rules: [{ type: "allow", path: "/" }] }]);
  };

  const removeGroup = (gi: number) => {
    markCustom();
    setGroups((gs) => gs.filter((_, i) => i !== gi));
  };

  const output = useMemo(() => {
    const parts: string[] = [];
    for (const g of groups) {
      if (!g.userAgent.trim()) continue;
      parts.push(`User-agent: ${g.userAgent.trim()}`);
      if (g.rules.length === 0) parts.push("Disallow:");
      for (const r of g.rules) {
        const label = r.type === "allow" ? "Allow" : "Disallow";
        parts.push(`${label}: ${r.path.trim()}`);
      }
      parts.push("");
    }
    for (const s of sitemaps) {
      if (s.trim()) parts.push(`Sitemap: ${s.trim()}`);
    }
    return parts.join("\n").trim() + "\n";
  }, [groups, sitemaps]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    try {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "robots.txt";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Builder */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Preset</label>
            <select value={preset} onChange={(e) => applyPreset(e.target.value as Preset)} className={inputCls}>
              <option value="allow-all">Allow everything (default)</option>
              <option value="block-all">Block everything</option>
              <option value="wordpress">WordPress-style</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {groups.map((g, gi) => (
            <div key={gi} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className={labelCls}>User-agent</label>
                  <input value={g.userAgent} onChange={(e) => updateGroup(gi, { userAgent: e.target.value })} className={inputCls} placeholder="* or Googlebot" />
                </div>
                {groups.length > 1 ? (
                  <button type="button" onClick={() => removeGroup(gi)} className={iconBtn} aria-label="Remove group">
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="space-y-2">
                {g.rules.map((r, ri) => (
                  <div key={ri} className="flex items-center gap-2">
                    <select
                      value={r.type}
                      onChange={(e) => updateRule(gi, ri, { type: e.target.value as RuleType })}
                      className="w-32 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-mono text-slate-800 dark:text-slate-100"
                    >
                      <option value="allow">Allow</option>
                      <option value="disallow">Disallow</option>
                    </select>
                    <input value={r.path} onChange={(e) => updateRule(gi, ri, { path: e.target.value })} className={inputCls} placeholder="/path/" />
                    <button type="button" onClick={() => removeRule(gi, ri)} className={iconBtn} aria-label="Remove rule">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addRule(gi)} className={secondaryBtn}>
                  <Plus className="h-3.5 w-3.5" />
                  Add rule
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addGroup} className={secondaryBtn}>
            <Plus className="h-3.5 w-3.5" />
            Add user-agent group
          </button>

          <div>
            <label className={labelCls}>Sitemaps</label>
            <div className="space-y-2">
              {sitemaps.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={(e) => setSitemaps((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                    className={inputCls}
                    placeholder="https://example.com/sitemap.xml"
                  />
                  <button
                    type="button"
                    onClick={() => setSitemaps((arr) => arr.filter((_, j) => j !== i))}
                    className={iconBtn}
                    aria-label="Remove sitemap"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setSitemaps((arr) => [...arr, ""])} className={secondaryBtn}>
                <Plus className="h-3.5 w-3.5" />
                Add sitemap
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label className={labelCls}>robots.txt</label>
            <div className="flex gap-2">
              <button type="button" onClick={copy} className={primaryBtn}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={download} className={secondaryBtn}>
                <Download className="h-3.5 w-3.5" />
                .txt
              </button>
            </div>
          </div>
          <pre className="h-[480px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-xs font-mono text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
