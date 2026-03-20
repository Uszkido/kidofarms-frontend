"use client";

import { useState, useEffect } from "react";
import { Bell, Search, ArrowLeft, Loader2, RefreshCw, CheckCheck, Trash2, Info, ShoppingCart, Users, Star, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

const TYPE_META: Record<string, { color: string; Icon: any }> = {
    order: { color: "text-secondary bg-secondary/10", Icon: ShoppingCart },
    user: { color: "text-blue-400 bg-blue-500/10", Icon: Users },
    review: { color: "text-yellow-400 bg-yellow-500/10", Icon: Star },
    alert: { color: "text-red-400 bg-red-500/10", Icon: AlertTriangle },
    system: { color: "text-white/30 bg-white/5", Icon: Info },
    info: { color: "text-white/30 bg-white/5", Icon: Info },
};

export default function AdminNotificationsPage() {
    const { data: session } = useSession();
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const userId = (session?.user as any)?.id;
    const token = (session as any)?.token;

    const fetchNotifs = async () => {
        setLoading(true);
        try {
            const headers: any = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const res = await fetch(getApiUrl(`/api/notifications?userId=${userId}`), { headers });
            if (res.ok) setNotifs(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (userId) fetchNotifs(); }, [userId]);

    const markRead = async (id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            const headers: any = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            await fetch(getApiUrl(`/api/notifications/${id}/read`), { method: "PATCH", headers });
        } catch { /* silent */ }
    };

    const markAllRead = async () => {
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const filtered = notifs.filter(n =>
        (filter === "all" || (filter === "unread" ? !n.isRead : n.type === filter)) &&
        (!search || (n.title || n.message || "").toLowerCase().includes(search.toLowerCase()))
    );

    const unread = notifs.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-6 lg:p-10 font-sans">
            <div className="max-w-[1000px] mx-auto space-y-12">

                <header className="space-y-4">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                    </Link>
                    <div className="flex items-center gap-4"><span className="w-16 h-1.5 bg-secondary rounded-full" /><h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Command Broadcasts</h2></div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <h1 className="text-6xl lg:text-[7rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Alerts <span className="text-secondary block">Hub</span>
                        </h1>
                        <div className="flex gap-3">
                            {unread > 0 && (
                                <button onClick={markAllRead} className="flex items-center gap-2 px-6 py-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all">
                                    <CheckCheck size={16} /> Mark All Read
                                </button>
                            )}
                            <button onClick={fetchNotifs} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary hover:text-secondary transition-all">
                                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Alerts", value: notifs.length, color: "text-white" },
                        { label: "Unread", value: unread, color: "text-secondary" },
                        { label: "Read", value: notifs.length - unread, color: "text-white/30" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center">
                            <p className={`text-4xl font-black font-serif italic ${s.color}`}>{s.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 flex-wrap">
                    <div className="relative group flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                        <input placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-secondary transition-all font-bold text-sm" />
                    </div>
                    <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                        {["all", "unread", "order", "user", "review", "alert", "system"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-secondary text-primary' : 'text-white/30 hover:text-white'}`}>{f}</button>
                        ))}
                    </div>
                </div>

                {/* NOTIFICATIONS LIST */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-6">
                            <Loader2 size={48} className="animate-spin text-secondary/30" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center bg-white/5 rounded-[3rem] border border-white/5">
                            <Bell size={48} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-xs">No alerts found</p>
                        </div>
                    ) : filtered.map(n => {
                        const meta = TYPE_META[n.type] || TYPE_META.info;
                        return (
                            <div key={n.id} onClick={() => markRead(n.id)} className={`flex gap-5 p-6 rounded-[2rem] border cursor-pointer transition-all ${n.isRead ? 'bg-white/[0.02] border-white/5 hover:border-white/10' : 'bg-secondary/5 border-secondary/20 hover:border-secondary/40'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                                    <meta.Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className={`font-black text-sm uppercase tracking-wide leading-tight ${n.isRead ? 'text-white/50' : 'text-white'}`}>{n.title || n.message}</p>
                                        {!n.isRead && <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-1.5 animate-pulse" />}
                                    </div>
                                    {n.body && <p className="text-[11px] text-white/30 mt-1 leading-relaxed">{n.body}</p>}
                                    <div className="flex items-center gap-3 mt-3">
                                        <Clock size={10} className="text-white/20" />
                                        <span className="text-[9px] font-mono text-white/20">{new Date(n.createdAt).toLocaleString()}</span>
                                        {n.link && (
                                            <Link href={n.link} onClick={e => e.stopPropagation()} className="text-[9px] font-black text-secondary uppercase tracking-widest hover:underline ml-auto">View →</Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
