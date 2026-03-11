"use client";

import {
    Sprout,
    Camera,
    Zap,
    TrendingUp,
    Box,
    Activity,
    Wallet,
    Plus,
    ShieldCheck,
    ArrowUpRight,
    Search,
    ChevronRight,
    MapPin,
    Droplets
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function SupplierDashboard() {
    const [sensors, setSensors] = useState<any[]>([]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch(getApiUrl("/api/sensors"));
                if (res.ok) setSensors(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        fetchSensors();
    }, []);

    const getSensorVal = (type: string) => sensors.find(s => s.type === type)?.value || "--";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4 px-4 overflow-x-auto no-scrollbar pb-2">
                {[
                    { label: "New Harvest", icon: Plus, href: "/dashboard/supplier/products/new", color: "bg-primary text-white" },
                    { label: "Withdraw Funds", icon: Wallet, href: "/dashboard/supplier/cashout", color: "bg-white text-primary border border-primary/5" },
                    { label: "Analyze Soil", icon: Activity, href: "/dashboard/supplier/monitoring", color: "bg-white text-primary border border-primary/5" },
                    { label: "Go Live", icon: Camera, href: "/dashboard/supplier/stories", color: "bg-white text-primary border border-primary/5" },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all whitespace-nowrap ${action.color}`}
                    >
                        <action.icon size={16} /> {action.label}
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* 🚜 LIVE HARVEST TRACKING */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">Live <span className="text-secondary italic">Harvest Tracking</span></h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Sector 4A & 2B Sensory Mesh</p>
                        </div>
                        <Link href="/dashboard/supplier/monitoring" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline underline-offset-8 transition-all flex items-center gap-2">
                            View Precision Node <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { crop: "Yellow Maize", stage: "Late Growing", progress: 85, health: "Optimal", location: "Sector 4A", detail: "Satellite Lock active" },
                            { crop: "Bulk Onions", stage: "Seedling", progress: 15, health: "Monitoring", location: "Sector 2B", detail: "NDVI Index: 0.64" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-primary/5 shadow-2xl group hover:border-secondary transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                            <Sprout size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">{item.crop}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <MapPin size={10} className="text-primary/20" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{item.location} • {item.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-black font-serif text-primary italic leading-none">{item.progress}%</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic mt-1">{item.stage}</p>
                                    </div>
                                </div>
                                <div className="w-full h-3.5 bg-neutral-50 rounded-full overflow-hidden border border-primary/5 p-0.5 shadow-inner">
                                    <div className="h-full bg-secondary rounded-full transition-all duration-[3000ms] shadow-sm" style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Oracle Snippet */}
                    <div className="bg-primary p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl border border-white/5">
                        <Zap className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12 opacity-40" />
                        <div className="space-y-8 relative z-10 max-w-xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <TrendingUp size={14} /> Market Surge Alert
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black font-serif italic leading-none uppercase tracking-tighter">Kido <span className="text-secondary italic">Price Oracle</span></h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">Neural market surge detected for Root Tubers in Lagos Node. Recommendation: Initiate early listing protocols for Premium Yam harvests to maximize sovereign yield.</p>
                            <Link href="/dashboard/supplier/horizon?sub=oracle" className="inline-flex bg-secondary text-primary px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl">Enter Oracle Portal</Link>
                        </div>
                        <div className="relative z-10 hidden xl:block">
                            <div className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center animate-spin-slow">
                                <div className="w-32 h-32 rounded-full border-2 border-secondary/20 flex items-center justify-center animate-reverse-spin">
                                    <TrendingUp size={48} className="text-secondary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🛡️ SYSTEM VITALS SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                        <h3 className="text-xl font-black font-serif uppercase tracking-tighter italic border-b border-primary/5 pb-6">Node Vitals</h3>
                        <div className="space-y-8">
                            {[
                                { label: "Network Health", value: "98.4%", icon: ShieldCheck, color: "text-green-500" },
                                { label: "Vault Occupancy", value: "42%", icon: Box, color: "text-blue-500" },
                                { label: "Soil Activity", value: "Optimal", icon: Sprout, color: "text-secondary" },
                                { label: "Sensory Sync", value: "Active", icon: Activity, color: "text-secondary" },
                            ].map((vital, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-neutral-50 ${vital.color} flex items-center justify-center border border-primary/5 group-hover:scale-110 transition-transform`}>
                                            <vital.icon size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 font-sans">{vital.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-primary font-sans">{vital.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-neutral-50 p-10 rounded-[3.5rem] border border-primary/5 shadow-inner space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black font-serif uppercase tracking-tighter italic">Precision Node</h3>
                            <Activity size={18} className="text-secondary animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                                <p className="text-[9px] font-black uppercase text-primary/30 mb-2 font-sans tracking-widest">Moisture</p>
                                <p className="text-2xl font-black font-serif italic text-primary">{getSensorVal('moisture')}%</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                                <p className="text-[9px] font-black uppercase text-primary/30 mb-2 font-sans tracking-widest">Temperature</p>
                                <p className="text-2xl font-black font-serif italic text-primary">{getSensorVal('temperature')}°C</p>
                            </div>
                        </div>
                        <Link href="/dashboard/supplier/monitoring" className="block w-full text-center bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans">
                            Expand Sensor Matrix
                        </Link>
                    </div>

                    <div className="bg-secondary p-10 rounded-[3.5rem] text-primary space-y-6 shadow-2xl relative overflow-hidden group">
                        <Wallet className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform" />
                        <h4 className="text-2xl font-black font-serif uppercase tracking-tighter leading-none italic">Sovereign <br />Payout Registry</h4>
                        <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest italic">All nodes are synchronized for next-batch settlement.</p>
                        <Link href="/dashboard/supplier/financials" className="block w-full text-center bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl font-sans">
                            Review Ledger
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
