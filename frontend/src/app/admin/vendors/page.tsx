"use client";

import { useState, useEffect } from "react";
import { Users, Shield, ShieldAlert, CheckCircle, XCircle, ArrowLeft, Loader2, Database, Ghost, Mail, UserCircle } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/vendors"));
            const data = await res.json();
            setVendors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/vendors/${id}/status`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchVendors();
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
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Node Verification Protocol</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Vendor <span className="text-secondary block">Guild Control</span>
                        </h1>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl flex items-center gap-6 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                            <Users size={32} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Verified Guilds</h4>
                            <p className="text-4xl font-black font-serif italic text-white">{vendors.filter(v => v.status === 'approved').length}</p>
                        </div>
                    </div>
                </header>

                {/* 📊 GUILD LEDGER */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Commercial Nodes...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Guild Entity (Business)</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Commercial Focus</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Verification Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Goverance Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {vendors.map((vendor) => (
                                        <tr key={vendor.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                        <UserCircle size={40} />
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black font-serif italic text-white uppercase tracking-tight leading-none mb-2">{vendor.businessName}</p>
                                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                            <Mail size={12} className="text-secondary" /> {vendor.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex flex-wrap gap-2 max-w-64">
                                                    {vendor.categories?.map((cat: string) => (
                                                        <span key={cat} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">{cat}</span>
                                                    )) || <span className="text-[9px] font-black text-white/10 italic font-serif">Awaiting Definition</span>}
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${vendor.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        vendor.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {vendor.status === 'approved' ? <CheckCircle size={12} /> :
                                                        vendor.status === 'pending' ? <Shield size={12} className="animate-pulse" /> :
                                                            <ShieldAlert size={12} />}
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    {vendor.status !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'approved')}
                                                            className="h-12 px-6 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl"
                                                        >
                                                            <CheckCircle size={16} /> Authorize
                                                        </button>
                                                    )}
                                                    {vendor.status !== 'suspended' && (
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'suspended')}
                                                            className="h-12 px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <XCircle size={16} /> Decommission
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

                {/* 🌌 GUILD FOOTER */}
                <div className="bg-secondary rounded-[4rem] p-12 text-primary shadow-[0_0_100px_rgba(197,160,89,0.1)] relative overflow-hidden group">
                    <Database className="absolute -bottom-20 -right-20 text-primary/10 w-96 h-96 -rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter">Guild <span className="text-primary italic">Governance</span></h3>
                            <p className="max-w-xl text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-60">
                                Authorized vendors gain direct access to the Sovereign Supply Network, enabling them to fulfill orders, manage cold-vault assets, and list digital harvests.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary/40 group-hover:scale-110 transition-transform">
                                <Ghost size={40} />
                            </div>
                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-12 py-6 bg-primary text-secondary rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all shadow-2xl">
                                Back to Apex
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
