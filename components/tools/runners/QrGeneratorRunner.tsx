"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download, QrCode, AlertCircle, Wand2 } from "lucide-react";

type EcLevel = "L" | "M" | "Q" | "H";

const EC_LEVELS: { value: EcLevel; label: string; hint: string }[] = [
  { value: "L", label: "L — Low", hint: "~7% recovery" },
  { value: "M", label: "M — Medium", hint: "~15% recovery" },
  { value: "Q", label: "Q — Quartile", hint: "~25% recovery" },
  { value: "H", label: "H — High", hint: "~30% recovery" },
];

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";
const primaryBtn =
  "bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-2";
const secondaryBtn =
  "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition inline-flex items-center gap-2";

export default function QrGeneratorRunner() {
  const [text, setText] = useState("https://lahbabiguide.com");
  const [size, setSize] = useState(256);
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generate = useCallback(async (value: string, w: number, ec: EcLevel, dark: string, light: string) => {
    if (!value.trim()) {
      setDataUrl("");
      setError(null);
      return;
    }
    try {
      const url = await QRCode.toDataURL(value, {
        width: w,
        margin: 2,
        errorCorrectionLevel: ec,
        color: { dark, light },
      });
      setDataUrl(url);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the QR code.");
      setDataUrl("");
    }
  }, []);

  // Debounced regeneration whenever any input changes.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void generate(text, size, ecLevel, fg, bg);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, size, ecLevel, fg, bg, generate]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const loadSample = () => setText("https://lahbabiguide.com/tools/qr-generator");

  return (
    <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Text or URL to encode</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="https://example.com or any text…"
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-slate-400">{text.length} characters — generated locally, nothing leaves your browser.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Size — {size}px</label>
              <input
                type="range"
                min={128}
                max={512}
                step={16}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className={labelCls}>Error correction</label>
              <select value={ecLevel} onChange={(e) => setEcLevel(e.target.value as EcLevel)} className={inputCls}>
                {EC_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label} ({l.hint})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent" />
                <input value={fg} onChange={(e) => setFg(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent" />
                <input value={bg} onChange={(e) => setBg(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={loadSample} className={secondaryBtn}>
              <Wand2 className="h-3.5 w-3.5" />
              Load sample
            </button>
            <button type="button" onClick={copyText} className={secondaryBtn}>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy text"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-6 min-h-[280px]">
          {error ? (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : dataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt={`QR code for: ${text.slice(0, 60)}`}
                width={Math.min(size, 320)}
                height={Math.min(size, 320)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
              />
              <a href={dataUrl} download="qr-code.png" className={primaryBtn}>
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </a>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <QrCode className="h-10 w-10" />
              <p className="text-xs font-black uppercase tracking-widest">Enter text to generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
