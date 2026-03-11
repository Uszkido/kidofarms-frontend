"use client";

import { useState } from "react";
import { ArrowLeft, TrendingUp, Loader2, Download, Filter, Calendar, BarChart3, Database, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);

    const handleExport = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            alert("Neural Sales Manifest Exported to Local Storage.");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1400px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Economic Surveillance</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Yield <span className="text-secondary block">Intelligence</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-white/5 border border-white/10 px-8 py-6 rounded-[2rem] text-white/40 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                            <Calendar size={18} /> Period Control
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={generating}
                            className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            {generating ? <Loader2 className="animate-spin" /> : <> <Download size={18} /> Export Master Ledger </>}
                        </button>
                    </div>
                </header>

                {/* 📊 ANALYTICS GRID */}
                <div className="grid md:grid-cols-12 gap-10">

                    {/* Main Chart Placeholder */}
                    <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
                        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[100px] -translate-y-48 translate-x-48 group-hover:bg-secondary/10 transition-colors" />

                        <div className="relative z-10 flex justify-between items-center mb-16">
                            <div>
                                <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tight">Growth <span className="text-secondary">Trajectory</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Real-time Network Liquidity</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-secondary" />
                                <span className="w-3 h-3 rounded-full bg-white/10" />
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 text-center">
                            <div className="relative">
                                <BarChart3 size={120} className="text-white/5" />
                                <TrendingUp size={64} className="text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black font-serif italic text-white uppercase">Analytics Engine Engaged</h4>
                                <p className="max-w-md text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                                    Compiling harvest weights, vendor commissions, and consumer logistics into a unified economic manifest.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-4 gap-4 mt-auto pt-10 border-t border-white/5">
                            {[10, 30, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-4">
                                    <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden h-24">
                                        <div className="absolute bottom-0 left-0 right-0 bg-secondary/40 transition-all duration-1000" style={{ height: `${h}%` }} />
                                    </div>
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'][i % 8]}</span>
                                </div>
                            )).slice(0, 8)}
                        </div>
                    </div>

                    {/* Side Vitals */}
                    <div className="md:col-span-4 space-y-10">
                        <section className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-3xl shadow-2xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-xl font-black font-serif italic text-white uppercase">Vitals <span className="text-secondary">Summary</span></h3>
                            </div>

                            <div className="space-y-6">
                                <StatRow label="Gross Network Volume" value="₦4.2M" trend="+12.4%" />
                                <StatRow label="Fulfillment Velocity" value="2.4 Days" trend="-0.5%" />
                                <StatRow label="Citizen Retention" value="98.2%" trend="+2.1%" />
                                <StatRow label="Soil Node Efficiency" value="88.5%" trend="+5.0%" />
                            </div>
                        </section>

                        <section className="bg-secondary rounded-[3.5rem] p-10 text-primary shadow-2xl relative overflow-hidden group h-64 flex flex-col justify-center">
                            <Globe className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-3xl font-black font-serif italic uppercase leading-none">Global <br /> Export Ready</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sovereign Link Active</p>
                                <div className="pt-4">
                                    <button className="px-6 py-3 bg-primary text-secondary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">Configure Link</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* 🛡️ DATA INTEGRITY */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 text-center relative overflow-hidden">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-secondary">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Cryptographic Proof</h4>
                            <p className="max-w-xl mx-auto text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] italic">
                                All intelligence presented here is reconciled with the master supply chain ledger and verified by decentralized soil node validators.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatRow({ label, value, trend }: any) {
    return (
        <div className="flex justify-between items-center group/row">
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1 group-hover/row:text-secondary transition-colors">{label}</p>
                <p className="text-2xl font-black font-serif italic text-white">{value}</p>
            </div>
            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {trend}
            </div>
        </div>
    );
}
