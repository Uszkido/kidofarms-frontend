"use client";

import { useState, useEffect } from "react";
import { KeyRound, Loader2, RefreshCcw, User, Mail, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function AdminOtpsPage() {
    const [otps, setOtps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOtps = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/auth/otps"));
            const data = await res.json();
            setOtps(data);
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
        <div className="min-h-screen bg-[#FDFCF9] pb-24 px-6 md:px-10">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                            <KeyRound size={14} /> Security Management
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-serif text-primary leading-none">OTP <br /><span className="text-secondary italic">Recovery Center</span></h1>
                    </div>
                    <button
                        onClick={fetchOtps}
                        className="bg-primary text-secondary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl"
                    >
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh Codes
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden p-8 md:p-12">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-primary/20">
                            <Loader2 className="animate-spin" size={48} />
                            <p className="font-black text-[10px] uppercase tracking-widest">Synchronizing Vault...</p>
                        </div>
                    ) : otps.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-primary/20 border-2 border-dashed border-primary/5 rounded-[2rem]">
                            <ShieldCheck size={48} />
                            <p className="font-black text-[10px] uppercase tracking-widest">No active OTP requests</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-primary/5">
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/20 text-left">Recipient</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/20 text-center">Security Code</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/20 text-right">Expires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {otps.map((otp) => (
                                        <tr key={otp.id} className="group hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-secondary transition-all">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black font-serif text-primary leading-tight">{otp.userName || 'Anonymous User'}</p>
                                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                            <Mail size={12} /> {otp.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8">
                                                <div className="flex justify-center">
                                                    <div className="bg-primary/5 border border-primary/10 px-8 py-4 rounded-3xl font-mono text-3xl font-black text-primary tracking-[0.2em] shadow-inner flex items-center gap-4 group-hover:border-secondary/30 transition-all">
                                                        {otp.code}
                                                        <CheckCircle2 size={16} className="text-secondary" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 text-right">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-primary uppercase">
                                                        {new Date(otp.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">
                                                        {new Date(otp.expiresAt) > new Date() ? 'Active Request' : <span className="text-red-400">Expired</span>}
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

                {/* Footer Info */}
                <div className="bg-primary text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-10 -translate-y-32 translate-x-32 group-hover:opacity-20 transition-opacity" />
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative">
                        <div className="max-w-xl space-y-4 text-center md:text-left">
                            <h3 className="text-2xl font-black font-serif">Administrative Instruction</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 leading-relaxed italic">
                                Verified OTPs are requested by users when they cannot access their account. Provide these codes only after confirming identity via phone or off-platform communication. Manual resets bypass the security automation layer.
                            </p>
                        </div>
                        <Link href="/admin" className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl">
                            Return to Command
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
