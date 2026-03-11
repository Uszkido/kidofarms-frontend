"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Star, Loader2, CheckCircle2, XCircle, Trash2, Search, ThumbsUp, Eye, RefreshCcw, MessageSquare, Filter } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import StarRating from "@/components/StarRating";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selected, setSelected] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/reviews/admin/all"));
            if (res.ok) setReviews(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const updateReview = async (id: string, patch: object) => {
        setSaving(true);
        try {
            const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (res.ok) {
                fetchReviews();
                setSelected(null);
            }
        } finally { setSaving(false); }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Delete this review permanently?")) return;
        await fetch(getApiUrl(`/api/reviews/${id}`), { method: "DELETE" });
        fetchReviews();
        setSelected(null);
    };

    const filtered = reviews.filter(r => {
        const matchSearch = (r.productName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
            || (r.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
            || (r.comment?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === "pending").length,
        approved: reviews.filter(r => r.status === "approved").length,
        rejected: reviews.filter(r => r.status === "rejected").length,
        avgRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—",
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-8 md:p-12 font-sans">
            <div className="max-w-[1500px] mx-auto space-y-14">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Sovereign Voice Governance</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Product <span className="text-secondary block">Reviews</span>
                        </h1>
                    </div>
                    <button onClick={fetchReviews}
                        className="bg-secondary text-primary px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} /> Sync Network
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { label: "Total Reviews", value: stats.total, color: "text-white" },
                        { label: "Pending", value: stats.pending, color: "text-amber-400" },
                        { label: "Approved", value: stats.approved, color: "text-green-400" },
                        { label: "Rejected", value: stats.rejected, color: "text-red-400" },
                        { label: "Avg Rating", value: `${stats.avgRating} ★`, color: "text-secondary" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
                            <p className={`text-4xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative group flex-grow">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            placeholder="Search by product, user, or comment..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                        />
                    </div>
                    <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                        {["all", "pending", "approved", "rejected"].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-secondary text-primary shadow-lg' : 'text-white/30 hover:text-white'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Voice Registry...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Product / Citizen</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Star Score</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Comment</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map(r => (
                                        <tr key={r.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="px-10 py-8">
                                                <p className="font-black font-serif text-white uppercase tracking-tight text-lg">{r.productName || "Unknown Product"}</p>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{r.userName} • {r.userEmail}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <StarRating value={r.rating} size={18} readonly />
                                            </td>
                                            <td className="px-10 py-8 max-w-xs">
                                                <p className="text-sm text-white/50 font-medium line-clamp-2">{r.comment || <span className="text-white/20 italic">No comment</span>}</p>
                                                {r.adminNote && <p className="text-[10px] font-black text-secondary/60 mt-1 uppercase tracking-widest">Note: {r.adminNote}</p>}
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${r.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        r.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                                    }`}>{r.status}</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => { setSelected(r); setAdminNote(r.adminNote || ""); }}
                                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-secondary hover:text-primary text-white/30 flex items-center justify-center transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                    {r.status !== 'approved' && (
                                                        <button onClick={() => updateReview(r.id, { status: 'approved' })}
                                                            className="w-10 h-10 rounded-xl bg-green-500/10 hover:bg-green-500 text-green-400 flex items-center justify-center transition-all">
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                    {r.status !== 'rejected' && (
                                                        <button onClick={() => updateReview(r.id, { status: 'rejected' })}
                                                            className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 flex items-center justify-center transition-all">
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteReview(r.id)}
                                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-900 text-white/20 hover:text-red-400 flex items-center justify-center transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && !loading && (
                                <div className="p-24 text-center space-y-4">
                                    <Star size={64} className="mx-auto text-white/10" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No reviews match this filter</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelected(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0b1612] border-2 border-secondary/20 rounded-[4rem] p-12 max-w-xl w-full relative z-10 space-y-8 shadow-2xl">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/60">Review Detail</p>
                                <h3 className="text-4xl font-black font-serif italic uppercase text-white">{selected.productName}</h3>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{selected.userName} · {selected.userEmail}</p>
                                <StarRating value={selected.rating} size={24} readonly />
                            </div>
                            {selected.comment && (
                                <div className="bg-white/5 rounded-2xl p-6">
                                    <p className="text-white/70 font-medium text-sm leading-relaxed">"{selected.comment}"</p>
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Admin Note (optional)</label>
                                <textarea
                                    rows={3}
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    placeholder="Internal moderation notes..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-secondary transition-all text-sm text-white/80 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => updateReview(selected.id, { status: 'approved', adminNote })} disabled={saving}
                                    className="bg-green-500/10 text-green-400 border border-green-500/20 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <CheckCircle2 size={16} /> Approve
                                </button>
                                <button onClick={() => updateReview(selected.id, { status: 'rejected', adminNote })} disabled={saving}
                                    className="bg-red-500/10 text-red-400 border border-red-500/20 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <XCircle size={16} /> Reject
                                </button>
                            </div>
                            <button onClick={() => updateReview(selected.id, { adminNote })} disabled={saving}
                                className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                {saving ? "Saving..." : "Save Note Only"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
