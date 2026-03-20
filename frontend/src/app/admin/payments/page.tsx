"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Search, Loader2, RefreshCw, Download, Filter, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
    credit: { label: "Credit", color: "text-green-400", icon: ArrowUpRight },
    debit: { label: "Debit", color: "text-red-400", icon: ArrowDownRight },
    payout: { label: "Payout", color: "text-orange-400", icon: ArrowDownRight },
    payment: { label: "Payment", color: "text-blue-400", icon: ArrowUpRight },
    refund: { label: "Refund", color: "text-purple-400", icon: ArrowUpRight },
};

export default function AdminPaymentsPage() {
    const [txns, setTxns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setFilter] = useState("all");

    const fetch_ = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/payments"));
            if (res.ok) setTxns(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, []);

    const filtered = txns.filter(t =>
        (typeFilter === "all" || t.type === typeFilter) &&
        (!search || (t.description || "").toLowerCase().includes(search.toLowerCase()) || (t.userName || "").toLowerCase().includes(search.toLowerCase()))
    );

    const totalCredit = txns.filter(t => t.type === "credit").reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalDebit = txns.filter(t => t.type !== "credit").reduce((s, t) => s + parseFloat(t.amount), 0);

    const exportCSV = () => {
        const rows = [["Date", "Type", "User", "Amount", "Description"]];
        filtered.forEach(t => rows.push([
            new Date(t.createdAt).toLocaleString(),
            t.type, t.userName || "—",
            `₦${parseFloat(t.amount).toLocaleString()}`,
            t.description || "—"
        ]));
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `kido-payments-${Date.now()}.csv`; a.click();
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4"><span className="w-16 h-1.5 bg-secondary rounded-full" /><h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Financial Ledger</h2></div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Payments <span className="text-secondary block">Ledger</span>
                        </h1>
                        <p className="text-white/30 text-sm font-mono">{txns.length.toLocaleString()} transactions recorded</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={exportCSV} className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">
                            <Download size={16} /> Export CSV
                        </button>
                        <button onClick={fetch_} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary hover:text-secondary transition-all">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Credits In", value: `₦${totalCredit.toLocaleString()}`, icon: <TrendingUp size={24} />, color: "text-green-400" },
                        { label: "Total Debits Out", value: `₦${totalDebit.toLocaleString()}`, icon: <TrendingDown size={24} />, color: "text-red-400" },
                        { label: "Net Balance", value: `₦${(totalCredit - totalDebit).toLocaleString()}`, icon: <DollarSign size={24} />, color: "text-secondary" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-6">
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
                    <div className="relative group flex-1 min-w-[220px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                        <input placeholder="Search by user name or description..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm" />
                    </div>
                    <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                        {["all", "credit", "debit", "payout", "payment", "refund"].map(t => (
                            <button key={t} onClick={() => setFilter(t)}
                                className={`px-5 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-secondary text-primary' : 'text-white/30 hover:text-white'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={48} className="animate-spin text-secondary/30" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Decrypting Financial Stream...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-20 text-center">
                            <CreditCard size={48} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-xs">No transactions match this filter</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Timestamp</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Type</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Account</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Description</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map(t => {
                                        const meta = TYPE_META[t.type] || { label: t.type, color: "text-white/40", icon: CreditCard };
                                        const Icon = meta.icon;
                                        return (
                                            <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-[10px] font-mono text-white/30">{new Date(t.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-mono text-white/20">{new Date(t.createdAt).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className={`flex items-center gap-2 ${meta.color}`}>
                                                        <Icon size={14} />
                                                        <span className="font-black text-[10px] uppercase tracking-widest">{meta.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-sm text-white/70">{t.userName || "System"}</p>
                                                    <p className="text-[10px] text-white/30 font-mono">{t.userEmail || "—"}</p>
                                                </td>
                                                <td className="px-8 py-5 text-white/30 text-[10px] font-mono max-w-[200px] truncate">{t.description || "—"}</td>
                                                <td className={`px-8 py-5 text-right font-black text-lg font-serif italic ${meta.color}`}>
                                                    {t.type === "credit" || t.type === "refund" ? "+" : "-"}₦{parseFloat(t.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
