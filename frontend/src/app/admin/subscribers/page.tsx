"use client";

import { useState, useEffect } from "react";
import {
    Check, X, Search, ArrowLeft, Loader2, Mail, CircleDashed, ShieldCheck,
    RefreshCw, Trash2, ArrowUpCircle, ArrowDownCircle, Filter, Zap
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
    const [broadcastModal, setBroadcastModal] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState({ title: "", message: "", type: "system" });
    const [sendingBroadcast, setSendingBroadcast] = useState(false);
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

    const sendBroadcast = async () => {
        if (!broadcastMsg.title || !broadcastMsg.message) return;
        setSendingBroadcast(true);
        try {
            const res = await fetch(getApiUrl("/api/admin/broadcast"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(broadcastMsg)
            });
            if (res.ok) {
                alert("Pulse broadcast sent successfully.");
                setBroadcastModal(false);
                setBroadcastMsg({ title: "", message: "", type: "system" });
            }
        } catch (err) { console.error(err); }
        finally { setSendingBroadcast(false); }
    };

    const openEdit = (sub: any) => {
        setEditModal(sub);
        setNewPlan(sub.plan);
        setNewStatus(sub.status);
    };

    const filtered = subs.filter(s => {
        const matchesSearch = (s.email || "").toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || s.status === filter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: subs.length,
        active: subs.filter(s => s.status === 'active').length,
        pending: subs.filter(s => s.status === 'pending').length,
        cancelled: subs.filter(s => s.status === 'cancelled').length,
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-12">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Subscription Registry</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Sub <span className="text-secondary block">Matrix</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setBroadcastModal(true)}
                            className="bg-secondary/10 border border-secondary/20 text-secondary px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 shadow-2xl"
                        >
                            <Mail size={18} /> Broadcast Pulse
                        </button>
                    </div>
                </header>

                {/* STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Nodes", value: stats.total, color: "text-white" },
                        { label: "Active Biotics", value: stats.active, color: "text-green-400" },
                        { label: "Awaiting Sync", value: stats.pending, color: "text-amber-400" },
                        { label: "De-Synced", value: stats.cancelled, color: "text-red-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl group hover:border-white/20 transition-all">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">{s.label}</p>
                            <p className={`text-4xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            placeholder="Scan by email address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                        />
                    </div>
                    <div className="flex bg-white/5 border border-white/10 rounded-[2rem] p-2">
                        {["all", "active", "pending", "cancelled"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-secondary text-primary shadow-xl' : 'text-white/30 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl relative">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Registry Nodes...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Entity</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Current Protocol</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Node Status</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-right">Goverance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((sub: any) => (
                                    <tr key={sub.id} className="group hover:bg-white/[0.03] transition-all">
                                        <td className="px-12 py-10 font-bold text-white group-hover:text-secondary transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20 group-hover:bg-secondary/10 group-hover:text-secondary group-hover:scale-110 transition-all">
                                                    <Mail size={18} />
                                                </div>
                                                {sub.email}
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-xs font-black uppercase tracking-widest text-white/40 italic">{sub.plan}</td>
                                        <td className="px-12 py-10">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${STATUS_META[sub.status]?.color || ""}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[sub.status]?.dot || ""}`} />
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => openEdit(sub)} className="h-12 px-6 bg-white/5 text-white/60 hover:text-white border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Update Node</button>
                                                {sub.status === 'pending' && <button onClick={() => updateSub(sub.id, { status: 'active' })} className="h-12 px-6 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white">Activate</button>}
                                                <button onClick={() => deleteSub(sub.id)} className="h-12 w-12 flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* EDIT MODAL */}
                {editModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditModal(null)} />
                        <div className="bg-[#0b1612] border border-white/10 rounded-[3rem] p-12 max-w-xl w-full relative z-10 space-y-8 animate-in zoom-in duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-3xl font-black font-serif italic uppercase text-white">Manual <span className="text-secondary">Override</span></h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Assigned Harvest Protocol</label>
                                    <select
                                        value={newPlan}
                                        onChange={e => setNewPlan(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-secondary transition-all text-xs font-black uppercase tracking-widest appearance-none cursor-pointer"
                                    >
                                        {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Node Status Authorization</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {STATUSES.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setNewStatus(s)}
                                                className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${newStatus === s ? 'bg-secondary text-primary border-secondary shadow-xl shadow-secondary/10' : 'bg-white/5 text-white/20 border-white/5'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setEditModal(null)} className="py-5 bg-white/5 text-white/30 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                                <button
                                    onClick={() => updateSub(editModal.id, { plan: newPlan, status: newStatus })}
                                    disabled={!!updating}
                                    className="py-5 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updating === editModal.id ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Finalize Sync</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* BROADCAST MODAL */}
                {broadcastModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setBroadcastModal(false)} />
                        <div className="bg-[#0b1612] border border-white/10 rounded-[3rem] p-12 max-w-xl w-full relative z-10 space-y-8 animate-in zoom-in duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black font-serif italic uppercase text-white leading-none">Broadcast <span className="text-secondary">Pulse</span></h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-1">Send global notification to all nodes</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Pulse Header</label>
                                    <input
                                        value={broadcastMsg.title}
                                        onChange={e => setBroadcastMsg({ ...broadcastMsg, title: e.target.value })}
                                        placeholder="e.g. SYSTEM MAINTENANCE"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Internal Payload</label>
                                    <textarea
                                        rows={4}
                                        value={broadcastMsg.message}
                                        onChange={e => setBroadcastMsg({ ...broadcastMsg, message: e.target.value })}
                                        placeholder="Enter your message to all subscribers..."
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-secondary transition-all text-sm font-medium resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['system', 'alert', 'info'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setBroadcastMsg({ ...broadcastMsg, type: t })}
                                            className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${broadcastMsg.type === t ? 'bg-secondary text-primary border-secondary' : 'bg-white/5 text-white/20 border-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setBroadcastModal(false)} className="py-5 bg-white/5 text-white/30 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                <button
                                    onClick={sendBroadcast}
                                    disabled={sendingBroadcast || !broadcastMsg.title || !broadcastMsg.message}
                                    className="py-5 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sendingBroadcast ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Authorize Pulse</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
