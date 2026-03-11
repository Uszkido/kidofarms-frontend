"use client";

import { useState, useEffect } from "react";
import { Sprout, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2, MapPin, Phone, Database, Ghost, Mail, UserCircle } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function FarmersAdminPage() {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/farmers"));
            const data = await res.json();
            setFarmers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/farmers/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchFarmers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-left">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Biotic Asset Governance</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Grower <span className="text-secondary block">Vault Hub</span>
                        </h1>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                            <Sprout size={32} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Soil Nodes</h4>
                            <p className="text-4xl font-black font-serif italic text-white">{farmers.filter(f => f.status === 'approved').length}</p>
                        </div>
                    </div>
                </header>

                {/* 📊 GROWER LEDGER */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Soil Records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Harvest Entity (Farm)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Geo-Location State</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Network Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {farmers.map((farmer) => (
                                        <tr key={farmer.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                        <Sprout size={40} />
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-2">{farmer.farmName}</p>
                                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-4">
                                                            <UserCircle size={12} className="text-secondary" /> {farmer.userName}
                                                            <Phone size={12} className="text-secondary ml-2" /> {farmer.phone || 'NO COMM'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-3 text-white/60">
                                                    <MapPin size={18} className="text-secondary" />
                                                    <span className="text-lg font-black font-serif italic uppercase">{farmer.farmLocationState}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${farmer.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        farmer.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {farmer.status === 'approved' ? <CheckCircle size={14} /> :
                                                        farmer.status === 'pending' ? <Shield size={14} className="animate-pulse" /> :
                                                            <ShieldAlert size={14} />}
                                                    {farmer.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    {farmer.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'approved')}
                                                            className="h-12 px-8 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl"
                                                        >
                                                            <CheckCircle size={18} /> Approve Yield
                                                        </button>
                                                    )}
                                                    {farmer.status !== 'suspended' && (
                                                        <button
                                                            onClick={() => updateStatus(farmer.id, 'suspended')}
                                                            className="h-12 px-8 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <XCircle size={18} /> Restrict Node
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 🌌 GROWER FOOTER */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-secondary/5 rounded-full blur-[150px] -translate-y-48 translate-x-48 group-hover:bg-secondary/10 transition-colors" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 text-center lg:text-left">
                            <h3 className="text-4xl lg:text-5xl font-black font-serif italic text-white uppercase tracking-tighter">Harvest <span className="text-secondary italic">Infrastructure</span></h3>
                            <p className="max-w-2xl text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed text-white/30 italic">
                                GROWERS APPROVED HERE GAIN DEEP-COMM ACCESS TO THE KIDO NETWORK. THEY ARE THE FOUNDATION OF OUR SOVEREIGN FOOD HUB. VERIFY DOCUMENTS AND LIVE HARVEST DATA BEFORE AUTHORIZATION.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 hover:text-secondary group-hover:scale-110 transition-all border border-white/5">
                                <Database size={40} />
                            </div>
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/10 hover:text-white group-hover:scale-110 transition-all border border-white/5">
                                <Ghost size={40} />
                            </div>
                            <Link href="/admin" className="px-14 py-8 bg-white text-primary rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-secondary transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center whitespace-nowrap">
                                Apex Command
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
