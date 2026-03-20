"use client";

import { useState, useEffect } from "react";
import { Ticket, Percent, Plus, XCircle, ArrowLeft, Loader2, Tag, Zap, Clock, ShieldCheck, Database, Ghost } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function PromotionsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "0",
        usageLimit: "100",
        isFlashSale: false,
        endsAt: ""
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/promotions"));
            const data = await res.json();
            setCoupons(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(getApiUrl("/api/promotions"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCoupon)
            });
            if (res.ok) {
                setIsAdding(false);
                setNewCoupon({
                    code: "",
                    discountType: "percentage",
                    discountValue: "",
                    minOrderAmount: "0",
                    usageLimit: "100",
                    isFlashSale: false,
                    endsAt: ""
                });
                fetchCoupons();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deactivateCoupon = async (id: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/promotions/${id}/deactivate`), { method: "PATCH" });
            if (res.ok) fetchCoupons();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Sovereign Marketing Infrastructure</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Marketing <span className="text-secondary block">Vault</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-14 py-8 bg-secondary text-primary rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 border-b-4 border-black/20"
                        >
                            <Plus size={20} /> Forge New Protocol
                        </button>
                    </div>
                </header>

                {/* 🏗️ FORGE PANEL */}
                {isAdding && (
                    <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-12 animate-in fade-in slide-in-from-top-10 duration-700">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl">
                                <Ticket size={32} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black font-serif italic text-white uppercase tracking-tighter">Forge New <span className="text-secondary italic">Discount Node</span></h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Protocol Authorization Required</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Protocol ID (Code)</label>
                                <input
                                    required
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm text-white"
                                    placeholder="e.g. ALPHA_HARVEST"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Discount Type</label>
                                <select
                                    value={newCoupon.discountType}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                                >
                                    <option value="percentage">Quantum % Deduct</option>
                                    <option value="fixed">Fixed Global ₦ Transfer</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Discount Magnitude</label>
                                <input
                                    required
                                    type="number"
                                    value={newCoupon.discountValue}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm text-white"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Minimum Order Floor</label>
                                <input
                                    type="number"
                                    value={newCoupon.minOrderAmount}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm text-white"
                                />
                            </div>

                            {/* ⚡ FLASH SALE MODIFIER */}
                            <div className="md:col-span-2 bg-secondary/5 rounded-[2.5rem] border border-secondary/10 p-8 flex flex-col md:flex-row items-center gap-10">
                                <div className="flex items-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setNewCoupon({ ...newCoupon, isFlashSale: !newCoupon.isFlashSale })}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${newCoupon.isFlashSale ? 'bg-secondary text-primary' : 'bg-white/5 text-white/20 border border-white/10'}`}
                                    >
                                        <Zap size={24} />
                                    </button>
                                    <div>
                                        <h4 className="font-black font-serif italic uppercase text-white tracking-widest">Pulse Sale Protocol</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Enable terminal countdown & high-vis badges</p>
                                    </div>
                                </div>
                                {newCoupon.isFlashSale && (
                                    <div className="flex-grow flex items-center gap-4">
                                        <Clock size={20} className="text-secondary" />
                                        <input
                                            type="datetime-local"
                                            value={newCoupon.endsAt}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, endsAt: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary text-xs font-mono text-white"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-3 flex gap-6 pt-10 border-t border-white/5">
                                <button type="submit" className="flex-grow bg-secondary text-primary py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                    Finalize Protocol Authorization
                                </button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-14 py-7 bg-white/5 text-white/40 hover:text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs border border-white/5 transition-all">
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 💳 VAULT LEDGER */}
                <div className="grid grid-cols-1 gap-8">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Marketing Nodes...</p>
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon.id} className={`bg-white/5 p-12 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-10 group hover:bg-white/[0.03] transition-all relative overflow-hidden ${!coupon.isActive && 'opacity-30'}`}>
                                {coupon.isFlashSale && (
                                    <div className="absolute top-0 right-0 py-2 px-10 bg-secondary text-primary text-[8px] font-black uppercase tracking-widest -rotate-0 -translate-y-0 rounded-bl-3xl flex items-center gap-2 shadow-2xl">
                                        <Zap size={10} fill="currentColor" /> Pulse Sale Active
                                    </div>
                                )}

                                <div className="flex items-center gap-10">
                                    <div className={`w-24 h-24 rounded-[2rem] border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${coupon.isActive ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                                        {coupon.discountType === 'percentage' ? <Percent size={40} /> : <Ticket size={40} />}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-4xl font-black font-serif italic text-white uppercase tracking-tighter group-hover:text-secondary transition-colors leading-none">{coupon.code}</h3>
                                            <span className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {coupon.discountType === 'percentage' ? `${Math.floor(Number(coupon.discountValue))}% QUANTUM DEDUCT` : `₦${Number(coupon.discountValue).toLocaleString()} GLOBAL CREDIT`}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <ShieldCheck size={14} className="text-secondary" /> MINTED: {new Date(coupon.createdAt).toLocaleDateString()} &bull; FLOOR: ₦{(Number(coupon.minOrderAmount)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-10 lg:gap-16">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center">Node Saturation</p>
                                        <div className="w-56 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                            <div
                                                className="h-full bg-secondary transition-all duration-1000"
                                                style={{ width: `${Math.min((coupon.usedCount / (coupon.usageLimit || 100)) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between px-2">
                                            <span className="text-[9px] font-black uppercase text-secondary">{coupon.usedCount} PULSED</span>
                                            <span className="text-[9px] font-black uppercase text-white/20">{coupon.usageLimit || '∞'} LIMIT</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {coupon.isActive ? (
                                            <button
                                                onClick={() => deactivateCoupon(coupon.id)}
                                                className="h-16 px-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-3"
                                            >
                                                <XCircle size={18} /> Decommission
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">Node Inactive</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && coupons.length === 0 && (
                        <div className="p-40 text-center space-y-8 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-3xl">
                            <Tag size={80} className="mx-auto text-white/5" />
                            <h3 className="text-4xl font-black font-serif italic text-white/20 uppercase">No Active Campaigns</h3>
                            <Link href="/admin" className="inline-flex px-14 py-7 bg-white/5 text-secondary border border-secondary/20 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all">
                                Return to Command
                            </Link>
                        </div>
                    )}
                </div>

                {/* 📊 FOOTER STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl group relative overflow-hidden">
                        <Database className="absolute -bottom-8 -right-8 text-white/5 w-40 h-40 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Saturation Index</h4>
                        <div className="text-4xl font-black font-serif italic text-white">92.4% <span className="text-[10px] font-sans not-italic text-secondary block font-bold uppercase tracking-widest mt-2">+4.2% Growth Node</span></div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl group relative overflow-hidden lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Protocol</h4>
                            <p className="max-w-xl text-[11px] font-black uppercase tracking-widest leading-relaxed text-white/40 italic">
                                ALL COUPON PROTOCOLS ARE SYNCED ACROSS THE GLOBAL BRIDGE. PULSE SALES (FLASH SALES) AUTOMATICALLY TRIGGER TERMINAL COUNTDOWNS ON DISTRIBUTED ENDPOINTS.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10 group-hover:text-secondary group-hover:scale-110 transition-all">
                                <Ghost size={32} />
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10 group-hover:text-white group-hover:scale-110 transition-all">
                                <Zap size={32} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
