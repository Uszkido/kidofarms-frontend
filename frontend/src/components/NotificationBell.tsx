"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info, ShoppingCart, Users, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";

const ICONS: Record<string, any> = {
    order: ShoppingCart,
    user: Users,
    review: Star,
    alert: AlertTriangle,
    info: Info,
    system: Info,
};

const COLORS: Record<string, string> = {
    order: "text-secondary bg-secondary/10",
    user: "text-blue-400 bg-blue-500/10",
    review: "text-yellow-400 bg-yellow-500/10",
    alert: "text-red-400 bg-red-500/10",
    info: "text-white/40 bg-white/5",
    system: "text-white/40 bg-white/5",
};

export default function NotificationBell() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const userId = (session?.user as any)?.id;
    const token = (session as any)?.token;

    const fetchNotifs = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const headers: any = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(getApiUrl(`/api/notifications?userId=${userId}`), { headers });
            if (res.ok) {
                const data = await res.json();
                setNotifs(Array.isArray(data) ? data : []);
            } else {
                // Fallback: derive from stats when no dedicated notifications exist yet
                const statsRes = await fetch(getApiUrl("/api/admin/stats"), { headers });
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    const fallback: any[] = [];
                    if ((stats?.pendingOrders || 0) > 0) fallback.push({ id: "ord-stat", type: "order", title: `${stats.pendingOrders} Orders Pending`, body: "Customer orders awaiting processing or dispatch.", link: "/admin/orders", isRead: false, createdAt: new Date().toISOString() });
                    if ((stats?.farmers?.pending || 0) > 0) fallback.push({ id: "far-stat", type: "user", title: `${stats.farmers?.pending} Farmers Awaiting Verification`, body: "New farmer accounts in the AI review queue.", link: "/admin/farmers", isRead: false, createdAt: new Date().toISOString() });
                    setNotifs(fallback);
                }
            }
        } catch { /* silent */ } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 60_000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const unread = notifs.filter(n => !n.isRead && !n.read).length;

    const markRead = async (id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
        try {
            const headers: any = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            await fetch(getApiUrl(`/api/notifications/${id}/read`), { method: "PATCH", headers });
        } catch { /* silent */ }
    };

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, isRead: true, read: true })));

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary hover:text-secondary transition-all"
                title="Command Alerts"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-[#0b1612] border border-secondary/20 rounded-[2rem] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.9)] z-[200] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Command Alerts</h3>
                            <p className="text-[10px] text-white/30 font-mono mt-1">{unread} unread • auto-refreshed</p>
                        </div>
                        <div className="flex gap-2">
                            {unread > 0 && <button onClick={markAllRead} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors px-3 py-1.5 bg-secondary/10 rounded-xl">Mark all read</button>}
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/30"><X size={14} /></button>
                        </div>
                    </div>
                    <div className="max-h-[420px] overflow-y-auto">
                        {loading ? (
                            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-secondary/40" /></div>
                        ) : notifs.length === 0 ? (
                            <div className="p-10 text-center">
                                <CheckCircle size={32} className="mx-auto text-green-400/30 mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">All Systems Clear</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifs.map(n => {
                                    const isRead = n.isRead || n.read;
                                    const type = n.type || "info";
                                    const Icon = ICONS[type] || Info;
                                    const color = COLORS[type] || "text-white/40 bg-white/5";
                                    return (
                                        <div key={n.id} className={`p-5 flex gap-4 hover:bg-white/[0.02] transition-colors ${!isRead ? 'bg-secondary/[0.03]' : ''}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-xs text-white uppercase tracking-wide leading-tight">{n.title || n.message}</p>
                                                <p className="text-[10px] text-white/30 mt-1 leading-relaxed">{n.body || n.message}</p>
                                                {n.link && (
                                                    <Link href={n.link} onClick={() => { markRead(n.id); setOpen(false); }} className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline mt-2 inline-block">
                                                        View →
                                                    </Link>
                                                )}
                                                <p className="text-[9px] text-white/20 font-mono mt-2">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                            {!isRead && <div className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0 animate-pulse" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
