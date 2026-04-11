"use client";

import { useState } from "react";
import {
    X,
    Zap,
    ShieldCheck,
    ShieldAlert,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Binary
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface KidoVisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productImage: string;
    category: string;
}

export default function KidoVisionModal({ isOpen, onClose, productName, productImage, category }: KidoVisionModalProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runAudit = async () => {
        setLoading(true);
        try {
            // Convert image to base64
            const imgRes = await fetch(productImage);
            const blob = await imgRes.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = (reader.result as string).split(',')[1];

                const auditRes = await fetch(getApiUrl("/api/ai/quality-guard"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageBase64: base64data,
                        productName,
                        category
                    })
                });
                const data = await auditRes.json();
                setResult(data);
                setLoading(false);
            };
        } catch (err) {
            console.error(err);
            setResult({ approved: false, rationale: "Neural link failed. Manually verify harvest quality.", score: 0 });
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#040d0a]/90 backdrop-blur-2xl transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative bg-[#0a1a15] border border-secondary/20 w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(197,160,89,0.1)] animate-in zoom-in duration-300">
                {/* Neon Accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side: Product Image HUD */}
                    <div className="w-full md:w-1/2 p-10 border-r border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Sovereign Scan</span>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/30 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative aspect-square rounded-[2.5rem] bg-black/40 overflow-hidden border border-white/10 group">
                            <img src={productImage} alt={productName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                            {/* Scanning Overlay Animation */}
                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/5">
                                    <div className="w-full h-1 bg-secondary shadow-[0_0_20px_rgba(197,160,89,0.8)] animate-scan-y absolute top-0" />
                                    <Loader2 size={48} className="animate-spin text-secondary mb-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Neural Processing...</span>
                                </div>
                            )}

                            {result && (
                                <div className={`absolute top-6 right-6 px-4 py-2 rounded-xl flex items-center gap-2 border ${result.approved ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {result.approved ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{result.approved ? 'Passed' : 'Flagged'}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black font-serif italic text-white uppercase">{productName}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{category} Cluster Node</p>
                        </div>
                    </div>

                    {/* Right Side: AI Audit Report */}
                    <div className="w-full md:w-1/2 p-10 bg-black/20 flex flex-col">
                        {!result && !loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                                <div className="w-24 h-24 bg-secondary/5 border border-secondary/10 rounded-full flex items-center justify-center text-secondary">
                                    <Binary size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black font-serif italic text-white">Initialize <span className="text-secondary">Quality Guard?</span></h3>
                                    <p className="text-white/40 text-xs leading-relaxed max-w-xs">Our Sovereign AI will analyze color, texture, and visual freshness benchmarks.</p>
                                </div>
                                <button
                                    onClick={runAudit}
                                    className="w-full bg-secondary text-primary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/10"
                                >
                                    Activate Vetting Logic
                                </button>
                            </div>
                        ) : result ? (
                            <div className="flex-1 space-y-10 animate-in slide-in-from-right duration-500">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Quality Coefficient</h4>
                                        <span className={`text-4xl font-black font-serif italic ${result.approved ? 'text-secondary' : 'text-red-500'}`}>{result.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${result.approved ? 'bg-secondary' : 'bg-red-500'}`} style={{ width: `${result.score}%` }} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-white/60">
                                        {result.approved ? <CheckCircle2 size={18} className="text-secondary" /> : <AlertCircle size={18} className="text-red-500" />}
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Sovereign Rationale</h4>
                                    </div>
                                    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                                        <p className="text-xs text-white/70 leading-relaxed italic">"{result.rationale}"</p>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4 pt-10">
                                    <button
                                        onClick={onClose}
                                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all border ${result.approved ? 'bg-secondary text-primary border-secondary hover:brightness-110' : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'}`}
                                    >
                                        {result.approved ? 'Authorize Listing' : 'Dismiss Node'}
                                    </button>
                                    {!result.approved && (
                                        <p className="text-center text-[8px] font-bold text-red-500/50 uppercase tracking-[0.2em]">Manual override required for rejection bypass.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center text-secondary">
                                        <Binary size={24} />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Syncing with Market Standards</p>
                                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Neural weights aligning...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan-y {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-y {
                    animation: scan-y 2s linear infinite;
                }
            `}</style>
        </div>
    );
}
