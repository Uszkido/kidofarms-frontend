"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    ZapOff,
    ShieldAlert,
    Loader2,
    Activity,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Lock,
    Unlock
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function MaintenanceGateway() {
    const [loading, setLoading] = useState(false);
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Mocking check for maintenance status
    }, []);

    const toggleMaintenance = async () => {
        const confirmMsg = isMaintenanceMode ?
            "RE-ACTIVATE GLOBAL NODES? (Broadcasting across entire cluster...)" :
            "INITIATE GLOBAL KILL-SWITCH? (All user endpoints will be redirected to maintenance protocol!)";

        if (confirm(confirmMsg)) {
            setLoading(true);
            setTimeout(() => {
                setIsMaintenanceMode(!isMaintenanceMode);
                setLoading(false);
                alert(isMaintenanceMode ? "System Nodes Re-synchronized (v5.2.0)" : "Protocol Zero Active. Network Locked.");
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#060606] text-[#E6EDF3] p-10 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-red-500 group transition-all">
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Exit Emergency Console
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-red-500 rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-red-500">Security Node 00-X</h2>
                        </div>
                        <h1 className="text-7xl font-black font-serif uppercase tracking-tighter text-white italic">
                            Global <span className="text-red-500 italic">Kill-Switch</span>
                        </h1>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert size={14} className="text-red-500" /> Infrastructure Maintenance Portal
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 pb-20">
                    {/* 🔌 THE SWITCH */}
                    <div className="lg:col-span-8 bg-red-500/5 border border-red-500/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-12 h-[500px]">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px]" />

                        <div className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center shadow-[0_0_80px_rgba(239,68,68,0.2)] animate-pulse">
                            <ZapOff size={64} className={isMaintenanceMode ? "text-red-500" : "text-white/20"} />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-3xl font-black font-serif italic text-white uppercase">System <span className="text-red-500">{isMaintenanceMode ? "Locked" : "Operational"}</span></h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                {isMaintenanceMode ?
                                    "Citizen endpoints are currently unreachable. Site performing internal node migration." :
                                    "Global cluster is currently serving traffic to all regions. Activating kill-switch will immediately halt all sessions."
                                }
                            </p>
                        </div>

                        <button
                            onClick={toggleMaintenance}
                            disabled={loading}
                            className={`px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl flex items-center gap-4 ${isMaintenanceMode ?
                                    'bg-white text-primary hover:bg-red-500 hover:text-white' :
                                    'bg-red-500 text-white hover:bg-white hover:text-red-600'
                                }`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : (isMaintenanceMode ? <Unlock size={18} /> : <Lock size={18} />)}
                            {isMaintenanceMode ? "Re-Activate Network" : "Enable Emergency Shutdown"}
                        </button>
                    </div>

                    {/* 🕵️ NETWORK STATUS */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Live Vitals</h4>
                                <RefreshCw size={14} className="text-white/20 animate-spin" />
                            </div>

                            <div className="space-y-6">
                                <StatusRow label="Traffic In" value="8.4 Gbps" active />
                                <StatusRow label="DB Cluster" value="Healthy" active />
                                <StatusRow label="Payment Gateway" value="Online" active />
                                <StatusRow label="CDN Propogation" value="Global" />
                            </div>
                        </div>

                        <div className="bg-[#1a0a0a] border border-red-500/20 rounded-[3rem] p-10 space-y-4">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                                <AlertTriangle size={14} /> Critical Logs
                            </h4>
                            <div className="space-y-3 opacity-40">
                                <p className="text-[8px] font-mono leading-tight">00:24: Protocol-Zero check initiated.</p>
                                <p className="text-[8px] font-mono leading-tight">00:28: Manual node heartbeat verified.</p>
                                <p className="text-[8px] font-mono leading-tight">00:32: Cluster reconciliation complete.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusRow({ label, value, active }: any) {
    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-none">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
            <span className={`text-[10px] font-black uppercase flex items-center gap-2 ${active ? 'text-secondary' : 'text-white/60'}`}>
                {active && <CheckCircle2 size={12} />} {value}
            </span>
        </div>
    );
}
