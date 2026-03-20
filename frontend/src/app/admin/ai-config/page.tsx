"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Brain, Save, Loader2, ShieldCheck, AlertTriangle, Sliders, ToggleRight, ToggleLeft, RefreshCw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const DEFAULT_CONFIG = {
    farmerAutoApproveThreshold: 80,
    vendorAutoApproveThreshold: 75,
    documentCheckRequired: true,
    flagBelowConfidence: 40,
    reviewQueueEnabled: true,
};

function SliderField({ label, description, value, min, max, onChange }: any) {
    return (
        <div className="space-y-4 bg-white/[0.03] border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-black text-sm text-white uppercase tracking-wide">{label}</p>
                    <p className="text-[11px] text-white/30 mt-1 font-mono">{description}</p>
                </div>
                <span className="text-4xl font-black font-serif text-secondary tabular-nums">{value}<span className="text-xl text-white/20">%</span></span>
            </div>
            <div className="relative">
                <input
                    type="range" min={min} max={max} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
                    style={{ background: `linear-gradient(to right, #C5A059 ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-mono text-white/20">{min}% (Lenient)</span>
                    <span className="text-[9px] font-mono text-white/20">{max}% (Strict)</span>
                </div>
            </div>
        </div>
    );
}

function ToggleField({ label, description, value, onChange }: any) {
    return (
        <div
            onClick={() => onChange(!value)}
            className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-3xl p-8 cursor-pointer hover:border-secondary/30 transition-all group"
        >
            <div>
                <p className="font-black text-sm text-white uppercase tracking-wide group-hover:text-secondary transition-colors">{label}</p>
                <p className="text-[11px] text-white/30 mt-1 font-mono">{description}</p>
            </div>
            {value
                ? <ToggleRight size={36} className="text-secondary flex-shrink-0" />
                : <ToggleLeft size={36} className="text-white/20 flex-shrink-0" />
            }
        </div>
    );
}

export default function AIConfigPage() {
    const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch(getApiUrl("/api/admin/ai-config"))
            .then(r => r.json())
            .then(d => { setConfig({ ...DEFAULT_CONFIG, ...d }); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/ai-config"), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
        } finally {
            setSaving(false);
        }
    };

    const set = (key: string, val: any) => setConfig((prev: any) => ({ ...prev, [key]: val }));

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[900px] mx-auto space-y-12">

                {/* HEADER */}
                <header className="space-y-6">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="w-16 h-1.5 bg-secondary rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Intelligence Core</h2>
                    </div>
                    <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                        AI Verify <span className="text-secondary block">Engine</span>
                    </h1>
                    <p className="text-white/30 text-sm leading-relaxed max-w-lg">
                        Configure the AI&apos;s automatic verification thresholds. Nodes scoring above your Auto-Approve threshold will be instantly cleared. Nodes below the Flag threshold are routed to human review.
                    </p>
                </header>

                {loading ? (
                    <div className="flex items-center gap-4 p-20 justify-center">
                        <Loader2 className="animate-spin text-secondary/30" size={48} />
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* THRESHOLDS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Sliders size={16} className="text-secondary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/60">Auto-Approval Thresholds</h3>
                            </div>
                            <SliderField
                                label="Farmer Auto-Approve"
                                description="AI confidence score above which farmers are instantly approved."
                                value={config.farmerAutoApproveThreshold}
                                min={50} max={100}
                                onChange={(v: number) => set("farmerAutoApproveThreshold", v)}
                            />
                            <SliderField
                                label="Vendor Auto-Approve"
                                description="AI confidence score above which vendors are instantly approved."
                                value={config.vendorAutoApproveThreshold}
                                min={50} max={100}
                                onChange={(v: number) => set("vendorAutoApproveThreshold", v)}
                            />
                            <SliderField
                                label="Flag Below Confidence"
                                description="Scores below this threshold are routed to the Human Review Queue."
                                value={config.flagBelowConfidence}
                                min={10} max={70}
                                onChange={(v: number) => set("flagBelowConfidence", v)}
                            />
                        </div>

                        {/* TOGGLES */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck size={16} className="text-secondary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/60">Verification Protocols</h3>
                            </div>
                            <ToggleField
                                label="Document Verification Required"
                                description="Farmers and vendors must upload valid government ID or CAC documents."
                                value={config.documentCheckRequired}
                                onChange={(v: boolean) => set("documentCheckRequired", v)}
                            />
                            <ToggleField
                                label="Human Review Queue"
                                description="Enable the intermediary queue — low-confidence nodes await admin override before approval."
                                value={config.reviewQueueEnabled}
                                onChange={(v: boolean) => set("reviewQueueEnabled", v)}
                            />
                        </div>

                        {/* RANGE VISUALIZER */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <Brain size={16} className="text-secondary" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/60">Decision Range Visualizer</h3>
                            </div>
                            <div className="relative h-8 bg-white/5 rounded-full overflow-hidden border border-white/10 mt-4">
                                {/* Red zone — below flag */}
                                <div className="absolute left-0 top-0 h-full bg-red-500/30 flex items-center justify-center" style={{ width: `${config.flagBelowConfidence}%` }}>
                                    <span className="text-[8px] font-black uppercase text-red-400 tracking-widest px-2">⚑ Flag</span>
                                </div>
                                {/* Yellow zone — between flag and auto-approve (farmer, lower) */}
                                <div className="absolute top-0 h-full bg-yellow-500/20 flex items-center justify-center" style={{ left: `${config.flagBelowConfidence}%`, width: `${Math.min(config.farmerAutoApproveThreshold, config.vendorAutoApproveThreshold) - config.flagBelowConfidence}%` }}>
                                    <span className="text-[8px] font-black uppercase text-yellow-400 tracking-widest px-1">Review</span>
                                </div>
                                {/* Green zone — above highest threshold */}
                                <div className="absolute top-0 h-full bg-green-500/30 flex items-center justify-center" style={{ left: `${Math.min(config.farmerAutoApproveThreshold, config.vendorAutoApproveThreshold)}%`, width: `${100 - Math.min(config.farmerAutoApproveThreshold, config.vendorAutoApproveThreshold)}%` }}>
                                    <span className="text-[8px] font-black uppercase text-green-400 tracking-widest px-1">✓ Auto</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-white/20">
                                <span>0% (No Confidence)</span>
                                <span>100% (Fully Certain)</span>
                            </div>
                        </div>

                        {/* SAVE */}
                        <button onClick={handleSave} disabled={saving} className="w-full bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20">
                            {saving ? <Loader2 className="animate-spin" /> : saved ? <><CheckCircle size={20} /> Engine Config Committed</> : <><Save size={20} /> Commit Configuration</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
