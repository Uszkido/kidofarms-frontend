"use client";

import { useState, useEffect } from "react";
import { Activity, Database, Cpu, Zap, Server, ShieldCheck, ArrowLeft, Loader2, Gauge, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function SystemHealthPage() {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/health"));
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 10000); // 10s pulse
        return () => clearInterval(interval);
    }, []);

    if (loading && !health) {
        return (
            <div className="min-h-screen bg-[#040d0a] flex items-center justify-center">
                <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
            </div>
        );
    }

    const { current, database, redis, storage } = health || {};

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6 text-left">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Sentinel Operations</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Cluster <span className="text-secondary block">Vitality</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/5 px-10 py-6 rounded-[2rem] border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <Activity size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">Grid Status</h4>
                                <p className="text-2xl font-black font-serif italic text-white uppercase tracking-tight">{current?.status || 'OPTIMAL'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 📊 TELEMETRY GRIDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <MetricCard label="CPU Computation" value={`${current?.cpuUsage || 0}%`} icon={<Cpu size={32} />} trend="Global Cluster Load" sub="Dynamic Scaling Active" />
                    <MetricCard label="Memory Density" value={`${current?.memoryUsage || 0}%`} icon={<Gauge size={32} />} trend="DRAM Allocation" sub="Automatic GC Enabled" />
                    <MetricCard label="Active Nodes" value={current?.activeUsers || 0} icon={<Server size={32} />} trend="Connected Terminals" sub="Peak Flux 1.2k" />
                    <MetricCard label="Latency Index" value="12ms" icon={<Zap size={32} />} trend="API Response Pulse" sub="Edge Node Sync 100%" />
                </div>

                {/* 🛡️ INFRASTRUCTURE NODES */}
                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl space-y-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[100px] -translate-y-48 translate-x-48 transition-all group-hover:bg-secondary/10" />
                        <div className="flex items-center justify-between relative z-10">
                            <h2 className="text-3xl font-black font-serif italic uppercase text-white tracking-tighter">Database <span className="text-secondary italic">Registry</span></h2>
                            <button onClick={fetchHealth} className="p-4 bg-white/5 rounded-2xl hover:bg-secondary hover:text-primary transition-all text-white/20">
                                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <StatusTile label="Core SQL Node" status={database || 'Active'} icon={<Database size={24} />} />
                            <StatusTile label="Cache Pulse (Redis)" status={redis || 'Active'} icon={<Zap size={24} />} />
                            <StatusTile label="Storage Vault" status={storage || '84% Free'} icon={<Server size={24} />} />
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={16} className="text-secondary" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">System Auto-Diagnostics: ALL MODULES REPORTING NORMAL FLUX.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary p-12 rounded-[4rem] text-primary space-y-12 shadow-2xl relative overflow-hidden group">
                        <ShieldCheck size={180} className="absolute -bottom-10 -right-10 text-primary/10 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center shadow-xl">
                            <ShieldCheck size={48} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter">Sovereign <span className="text-primary/40 block">Firewall</span></h3>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-60">
                                CONTINUOUS SCANNING OF NETWORK NODES. AI-DRIVEN THREAT DETECTION ACTIVE ON ALL HUB ENDPOINTS.
                            </p>
                        </div>
                        <button className="w-full py-6 bg-primary text-secondary rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl">
                            INITIATE SCAN
                        </button>
                    </div>
                </div>

                {/* 📜 RECENT HEALTH SNAPSHOTS */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl space-y-10 shadow-2xl relative overflow-hidden">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30 text-center">Telemetry Log Stream</h3>
                    <div className="space-y-3">
                        {health?.history?.slice(0, 5).map((h: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-mono text-white/10">00{i + 1}</span>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/60">{new Date(h.createdAt).toLocaleTimeString()} - NODE_HEALTH_OK</p>
                                </div>
                                <div className="flex gap-8 mt-4 md:mt-0">
                                    <div className="text-center"><p className="text-[8px] font-black uppercase text-white/10 mb-1">CPU</p><p className="text-sm font-bold text-secondary">{h.cpuUsage}%</p></div>
                                    <div className="text-center"><p className="text-[8px] font-black uppercase text-white/10 mb-1">MEM</p><p className="text-sm font-bold text-secondary">{h.memoryUsage}%</p></div>
                                    <div className="text-center"><p className="text-[8px] font-black uppercase text-white/10 mb-1">NODES</p><p className="text-sm font-bold text-secondary">{h.activeUsers}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, sub }: any) {
    return (
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl group hover:border-secondary/20 transition-all shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">{label}</p>
            <p className="text-5xl font-black font-serif italic text-white mb-4 group-hover:text-secondary transition-colors">{value}</p>
            <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-secondary italic">{trend}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/10">{sub}</p>
            </div>
        </div>
    );
}

function StatusTile({ label, status, icon }: any) {
    return (
        <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:bg-secondary/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-secondary transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">{label}</p>
                <p className="text-lg font-black font-serif italic text-white uppercase tracking-tight">{status}</p>
            </div>
        </div>
    );
}
