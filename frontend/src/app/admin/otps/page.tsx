"use client";

import { useState, useEffect } from "react";
import { KeyRound, Loader2, RefreshCcw, UserCircle, Mail, ShieldCheck, CheckCircle2, ArrowLeft, Ghost, Database } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminOtpsPage() {
    const [otps, setOtps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOtps = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/otps"));
            const data = await res.json();
            setOtps(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch OTPs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOtps();
    }, []);

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1400px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6 text-left">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Security Governance</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            OTP <span className="text-secondary block">Recall Hub</span>
                        </h1>
                    </div>

                    <button
                        onClick={fetchOtps}
                        className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} /> Sync Security Vault
                    </button>
                </header>

                {/* 📊 OTP TABLE */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Accessing Encrypted Nodes...</p>
                        </div>
                    ) : otps.length === 0 ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <ShieldCheck size={64} className="text-white/10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No Security Intercepts Active</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Target Identity</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Protocol Code</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Expiration Aura</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {otps.map((otp) => (
                                        <tr key={otp.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                        <UserCircle size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black font-serif italic text-white uppercase tracking-tight">{otp.userName || 'Anonymous citizen'}</p>
                                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                            <Mail size={12} className="text-secondary" /> {otp.userEmail || 'REDACTED'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex justify-center">
                                                    <div className="bg-secondary/10 border border-secondary/20 px-8 py-4 rounded-[2rem] font-mono text-3xl font-black text-secondary tracking-[0.4em] shadow-[inset_0_0_20px_rgba(197,160,89,0.1)] flex items-center gap-4 group-hover:scale-110 transition-transform">
                                                        {otp.code}
                                                        <CheckCircle2 size={16} className="text-secondary animate-pulse" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="space-y-2">
                                                    <p className="text-lg font-black text-white italic">
                                                        {new Date(otp.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${new Date(otp.expiresAt) > new Date() ? 'text-secondary' : 'text-red-500'}`}>
                                                        {new Date(otp.expiresAt) > new Date() ? 'Neural Link Active' : 'Protocol Expired'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 🛡️ SECURITY ADVISORY */}
                <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-48 translate-x-48 group-hover:bg-secondary/10 transition-colors" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 justify-between">
                        <div className="space-y-4 text-center md:text-left">
                            <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tight">Security <span className="text-secondary">Directives</span></h3>
                            <p className="max-w-2xl text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed italic">
                                Intercepted security keys are provided for emergency administration only. Use these codes to assist citizens who have lost access to their biometric or neural credentials. Shared keys bypass standard automation.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/10">
                                <Ghost size={32} />
                            </div>
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/10">
                                <Database size={32} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
