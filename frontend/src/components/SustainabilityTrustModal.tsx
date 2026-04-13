"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, Leaf, Droplets, ThermometerSun, Brain, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function SustainabilityTrustModal({ isOpen, onClose, product }: { isOpen: boolean; onClose: () => void, product: any }) {
    const [analyzing, setAnalyzing] = useState(true);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        if (isOpen && product) {
            setAnalyzing(true);
            // Simulate AI Cross-Referencing Knowledge Nodes
            setTimeout(() => {
                setReport({
                    score: 94,
                    grade: "Sovereign A+",
                    verificationId: `KIDO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                    stats: [
                        { label: "Organic Protocol", value: "Compliant", icon: <Leaf size={14} />, status: "success" },
                        { label: "Soil Health", value: "Optimal", icon: <Droplets size={14} />, status: "success" },
                        { label: "Carbon Footprint", value: "Low", icon: <Zap size={14} />, status: "success" },
                        { label: "Traceability", value: "85%", icon: <ShieldCheck size={14} />, status: "info" }
                    ],
                    dnaSequence: "AG-72-KM-01-NODE-SUCCESS"
                });
                setAnalyzing(false);
            }, 2500);
        }
    }, [isOpen, product]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="relative z-10 w-full max-w-2xl bg-[#040d0a] rounded-[4rem] border border-secondary/20 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="bg-secondary p-10 text-primary relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-20 translate-x-20" />
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} className="text-primary/60" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Kido Governance Node</span>
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black font-serif italic uppercase leading-none tracking-tighter">
                                        Sustainability <span className="opacity-40 block">Vetting Report</span>
                                    </h2>
                                </div>
                                <button onClick={onClose} className="p-4 bg-black/5 hover:bg-black/10 rounded-full transition-all">
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-10 lg:p-16 flex-1 space-y-12">
                            {analyzing ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-10">
                                    <div className="relative">
                                        <Loader2 className="animate-spin text-secondary" size={80} />
                                        <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={32} />
                                    </div>
                                    <div className="text-center space-y-4">
                                        <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse italic">
                                            Cross-Referencing Kido Knowledge Nodes
                                        </p>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest max-w-sm mx-auto">
                                            Analyzing harvest protocols, soil telemetry and organic certificate validity...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-12 animate-in fade-in duration-700">
                                    {/* Score Card */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white/5 rounded-[3rem] p-8 border border-white/5 flex flex-col items-center justify-center relative group">
                                            <div className="absolute inset-0 bg-secondary/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Vetting Score</span>
                                            <h3 className="text-7xl font-black font-serif italic text-white leading-none">{report.score}<span className="text-3xl text-secondary">%</span></h3>
                                        </div>
                                        <div className="bg-white/5 rounded-[3rem] p-8 border border-white/5 flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Platform Grade</span>
                                            <h3 className="text-4xl font-black font-serif italic text-secondary leading-none">{report.grade}</h3>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {report.stats.map((s: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 ${s.status === 'success' ? 'text-green-400' : 'text-secondary'}`}>
                                                        {s.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{s.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Blockchain DNA */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                                                <Zap size={14} /> Neural DNA Signature
                                            </h4>
                                            <span className="text-[10px] font-mono text-white/20">{report.verificationId}</span>
                                        </div>
                                        <div className="bg-[#1a3c34]/20 p-6 rounded-3xl border border-secondary/10 font-mono text-[9px] text-secondary/60 leading-relaxed overflow-hidden break-all">
                                            {report.dnaSequence}-HASH-{product.id}-{Date.now()}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="pt-6">
                                        <button onClick={onClose} className="w-full bg-white text-primary py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-secondary transition-all shadow-xl">
                                            Seal Protocol Access
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
