"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, Loader2, RefreshCw, DollarSign, Search,
    CheckCircle, Clock, AlertTriangle, CreditCard, HelpCircle,
    ChevronDown, ChevronUp, Wallet, Send, X
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface PayoutEntry {
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    balance: string;
    totalEarned: string;
    pendingPayout: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
}

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<PayoutEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);
    const [modal, setModal] = useState<PayoutEntry | null>(null);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/payouts"));
            if (res.ok) setPayouts(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPayouts(); }, []);

    const initiatePayout = async () => {
        if (!modal || !amount) return;
        setProcessing(modal.userId);
        try {
            const res = await fetch(getApiUrl("/api/admin/payouts/initiate"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: modal.userId, amount: parseFloat(amount), note })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Payout of ₦${Number(amount).toLocaleString()} to ${modal.userName} initiated successfully.`);
                setModal(null); setAmount(""); setNote("");
                fetchPayouts();
            } else {
                alert(data.error || "Payout failed.");
            }
        } finally { setProcessing(null); }
    };

    const filtered = payouts.filter(p =>
        (!search || p.userName?.toLowerCase().includes(search.toLowerCase()) || p.userEmail?.toLowerCase().includes(search.toLowerCase())) &&
        (!roleFilter || p.role === roleFilter)
    );

    const totalPending = payouts.reduce((s, p) => s + parseFloat(p.pendingPayout || "0"), 0);
    const totalBalance = payouts.reduce((s, p) => s + parseFloat(p.balance || "0"), 0);
    const allRoles = [...new Set(payouts.map(p => p.role))];

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Financial Disbursement</h2>
                        </div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Payout <span className="text-secondary block">Control</span>
                        </h1>
                    </div>
                    <button onClick={fetchPayouts} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-secondary hover:text-secondary transition-all">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Wallet Balances", value: `₦${totalBalance.toLocaleString()}`, icon: <Wallet size={24} />, color: "text-secondary" },
                        { label: "Pending Payouts", value: `₦${totalPending.toLocaleString()}`, icon: <Clock size={24} />, color: "text-orange-400" },
                        { label: "Eligible Accounts", value: payouts.filter(p => parseFloat(p.balance) > 0).length, icon: <CheckCircle size={24} />, color: "text-green-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex items-center gap-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</p>
                                <p className={`text-3xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 flex-wrap">
                    <div className="relative group flex-1 min-w-[240px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                        <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm" />
                    </div>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 outline-none focus:border-secondary transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer text-white/40">
                        <option value="">All Roles</option>
                        {allRoles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={48} className="animate-spin text-secondary/30" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Decrypting Wallet Ledger...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Account Holder</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Role</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Wallet Balance</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Bank Details</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 font-black uppercase tracking-widest text-xs">No eligible accounts found</td></tr>
                                    ) : filtered.map(p => (
                                        <tr key={p.userId} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-sm text-white uppercase tracking-tight">{p.userName}</p>
                                                <p className="text-[10px] text-white/30 font-mono">{p.userEmail}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40">{p.role}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className={`text-xl font-black font-serif italic ${parseFloat(p.balance) > 0 ? 'text-green-400' : 'text-white/20'}`}>
                                                    ₦{Number(p.balance || 0).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {p.bankName ? (
                                                    <div>
                                                        <p className="text-xs font-bold text-white/60">{p.bankName}</p>
                                                        <p className="text-[10px] font-mono text-white/20">{p.accountNumber} — {p.accountName}</p>
                                                    </div>
                                                ) : <span className="text-[10px] text-white/20 italic">No bank details</span>}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    disabled={parseFloat(p.balance) <= 0 || !p.bankName || processing === p.userId}
                                                    onClick={() => { setModal(p); setAmount(p.balance); }}
                                                    className="flex items-center gap-2 px-6 py-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
                                                >
                                                    {processing === p.userId ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                    Initiate Payout
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* PAYOUT MODAL */}
            {modal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setModal(null)} />
                    <div className="bg-[#0b1612] border-2 border-secondary/20 rounded-[3rem] p-12 max-w-lg w-full relative z-10 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Authorize Disbursement</p>
                                <h3 className="text-4xl font-black font-serif italic uppercase text-white mt-2">{modal.userName}</h3>
                                <p className="text-white/30 text-xs font-mono mt-1">{modal.bankName} · {modal.accountNumber}</p>
                            </div>
                            <button onClick={() => setModal(null)} className="p-3 hover:bg-white/10 rounded-2xl text-white/30 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Available Balance</span>
                            <span className="text-2xl font-black font-serif text-green-400">₦{Number(modal.balance).toLocaleString()}</span>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Payout Amount (₦)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} max={modal.balance}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-secondary transition-all font-black text-xl text-white" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Internal Note (optional)</label>
                            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Weekly harvest earnings..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all font-bold text-sm text-white/80" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setModal(null)} className="py-5 bg-white/5 text-white/30 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                            <button onClick={initiatePayout} disabled={!amount || processing === modal.userId}
                                className="py-5 bg-secondary text-primary hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl">
                                {processing === modal.userId ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Authorize</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
