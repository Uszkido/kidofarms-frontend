"use client";

import { useState, useEffect } from "react";
import {
    Check, X, Search, ArrowLeft, Loader2, Mail, CircleDashed, ShieldCheck,
    RefreshCw, Trash2, ArrowUpCircle, ArrowDownCircle, Filter
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

const PLANS = ["Weekly Farm Basket", "Bi-Weekly Harvest Box", "Monthly Agro Pack", "Premium Organic Bundle"];
const STATUSES = ["pending", "active", "cancelled"];

const STATUS_META: Record<string, { color: string; dot: string }> = {
    pending: { color: "bg-amber-500/10 text-amber-400 border border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
    active: { color: "bg-green-500/10 text-green-400 border border-green-500/20", dot: "bg-green-400" },
    cancelled: { color: "bg-red-500/10 text-red-400 border border-red-500/20", dot: "bg-red-400" },
};

export default function SubscriberManagementPage() {
    const [subs, setSubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [updating, setUpdating] = useState<string | null>(null);
    const [editModal, setEditModal] = useState<any | null>(null);
    const [newPlan, setNewPlan] = useState("");
    const [newStatus, setNewStatus] = useState("");

    const fetchSubs = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/subscribers"));
            const data = await res.json();
            setSubs(Array.isArray(data) ? data : []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSubs(); }, []);

    const updateSub = async (id: string, patch: object) => {
        setUpdating(id);
        try {
            const res = await fetch(getApiUrl(`/api/subscribers/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch)
            });
            if (res.ok) { fetchSubs(); setEditModal(null); }
        } finally { setUpdating(null); }
    };

    const deleteSub = async (id: string) => {
        if (!confirm("Remove this subscriber from the network?")) return;
        setUpdating(id);
        try {
            await fetch(getApiUrl(`/api/subscribers/${id}`), { method: "DELETE" });
            fetchSubs();
        } finally { setUpdating(null); }
    };

    const openEdit = (sub: any) => {
        setEditModal(sub);
        setNewPlan(sub.plan);
        setNewStatus(sub.status);
    };

    const filtered = subs.filter(s =>
        (filter === "all" || s.status === filter) &&
        ((s.email || "").toLowerCase().includes(search.toLowerCase()) || (s.plan || "").toLowerCase().includes(search.toLowerCase()))
    );

    const stats = {
        total: subs.length,
        active: subs.filter(s => s.status === "active").length,
        pending: subs.filter(s => s.status === "pending").length,
        cancelled: subs.filter(s => s.status === "cancelled").length,
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-12">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4"><span className="w-16 h-1.5 bg-secondary rounded-full" /><h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Membership Registry</h2></div>
                        <h1 className="text-6xl lg:text-[8rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Basket <span className="text-secondary block">Subscribers</span>
                        </h1>
                    </div>
                    <button onClick={fetchSubs} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-secondary hover:text-secondary transition-all">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Members", value: stats.total, color: "text-white" },
                        { label: "Active", value: stats.active, color: "text-green-400" },
                        { label: "Pending", value: stats.pending, color: "text-amber-400" },
                        { label: "Cancelled", value: stats.cancelled, color: "text-red-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                            <p className={`text-4xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 flex-wrap">
                    <div className="relative group flex-1 min-w-[240px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                        <input placeholder="Search by email or plan..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm" />
                    </div>
                    <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                        {["all", "pending", "active", "cancelled"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-secondary text-primary' : 'text-white/30 hover:text-white'}`}>{f}</button>
                        ))}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
                    {loading ? (
                        <div className="p-24 flex justify-center"><Loader2 size={40} className="animate-spin text-secondary/30" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-white/20">Subscriber</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-white/20">Plan</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-white/20">Status</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-white/20">Joined</th>
                                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={5} className="py-16 text-center text-white/20 font-black uppercase tracking-widest text-xs">No subscribers match</td></tr>
                                    ) : filtered.map(sub => {
                                        const sm = STATUS_META[sub.status] || STATUS_META.pending;
                                        return (
                                            <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Mail size={16} /></div>
                                                        <div>
                                                            <p className="font-bold text-sm text-white/70">{sub.email}</p>
                                                            {sub.phone && <p className="text-[10px] text-white/30 font-mono">{sub.phone}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-sm text-white/50">{sub.plan}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${sm.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-mono text-white/30">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {sub.status === "pending" && (
                                                            <button onClick={() => updateSub(sub.id, { status: "active" })} disabled={updating === sub.id}
                                                                className="px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center gap-2">
                                                                <Check size={12} /> Activate
                                                            </button>
                                                        )}
                                                        {sub.status === "active" && (
                                                            <button onClick={() => updateSub(sub.id, { status: "cancelled" })} disabled={updating === sub.id}
                                                                className="px-5 py-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
                                                                <X size={12} /> Cancel
                                                            </button>
                                                        )}
                                                        {sub.status === "cancelled" && (
                                                            <button onClick={() => updateSub(sub.id, { status: "active" })} disabled={updating === sub.id}
                                                                className="px-5 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
                                                                <ArrowUpCircle size={12} /> Renew
                                                            </button>
                                                        )}
                                                        <button onClick={() => openEdit(sub)}
                                                            className="px-5 py-2.5 bg-white/5 text-white/30 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">
                                                            Edit Plan
                                                        </button>
                                                        <button onClick={() => deleteSub(sub.id)} disabled={updating === sub.id}
                                                            className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
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

            {/* EDIT MODAL */}
            {editModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditModal(null)} />
                    <div className="bg-[#0b1612] border-2 border-secondary/20 rounded-[3rem] p-12 max-w-md w-full relative z-10 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Modify Membership</p>
                            <h3 className="text-3xl font-black font-serif italic uppercase text-white mt-2">{editModal.email}</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Plan</label>
                            <select value={newPlan} onChange={e => setNewPlan(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all font-bold text-sm text-white appearance-none cursor-pointer">
                                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Status</label>
                            <div className="flex gap-3">
                                {STATUSES.map(s => (
                                    <button key={s} onClick={() => setNewStatus(s)}
                                        className={`flex-1 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest border transition-all ${newStatus === s ? `${STATUS_META[s].color} opacity-100` : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setEditModal(null)} className="py-5 bg-white/5 text-white/30 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                            <button onClick={() => updateSub(editModal.id, { plan: newPlan, status: newStatus })} disabled={updating === editModal.id}
                                className="py-5 bg-secondary text-primary hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl">
                                {updating === editModal.id ? <Loader2 className="animate-spin" size={16} /> : <>Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
