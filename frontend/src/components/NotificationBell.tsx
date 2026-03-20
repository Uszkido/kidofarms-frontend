"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info, ShoppingCart, Users, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

interface Notif {
    id: string;
    type: "order" | "user" | "review" | "alert" | "info";
    title: string;
    body: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

const ICONS: Record<string, any> = {
    order: ShoppingCart,
    user: Users,
    review: Star,
    alert: AlertTriangle,
    info: Info,
};

const COLORS: Record<string, string> = {
    order: "text-secondary bg-secondary/10",
    user: "text-blue-400 bg-blue-500/10",
    review: "text-yellow-400 bg-yellow-500/10",
    alert: "text-red-400 bg-red-500/10",
    info: "text-white/40 bg-white/5",
};

// Mock real-time notifications derived from live admin stats
function generateNotifs(stats: any): Notif[] {
    const out: Notif[] = [];
    if (stats?.pendingOrders > 0) out.push({
        id: "ord-1", type: "order",
        title: `${stats.pendingOrders} Orders Awaiting`,
        body: "New customer orders need confirmation or dispatch.",
        link: "/admin/orders", read: false,
        createdAt: new Date().toISOString()
    });
    if (stats?.farmers?.pending > 0) out.push({
        id: "far-1", type: "user",
        title: `${stats.farmers?.pending || 0} Farmers Pending Verification`,
        body: "Farmer registration requests are in the AI review queue.",
        link: "/admin/farmers", read: false,
        createdAt: new Date().toISOString()
    });
    if (stats?.pendingReviews > 0) out.push({
        id: "rev-1", type: "review",
        title: `${stats.pendingReviews} Reviews Awaiting Moderation`,
        body: "Product reviews need your approval before going live.",
        link: "/admin/reviews", read: false,
        createdAt: new Date().toISOString()
    });
    return out;
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await fetch(getApiUrl("/api/admin/stats"));
                if (res.ok) {
                    const stats = await res.json();
                    setNotifs(generateNotifs(stats));
                }
            } catch { /* silent */ } finally { setLoading(false); }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 60_000); // refresh every 60s
        return () => clearInterval(interval);
    }, []);

    // Close panel on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const unread = notifs.filter(n => !n.read).length;
    const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary hover:text-secondary transition-all"
                title="Notifications"
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
                            <p className="text-[10px] text-white/30 font-mono mt-1">{unread} unread • live</p>
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
                                    const Icon = ICONS[n.type] || Info;
                                    const color = COLORS[n.type] || "text-white/40 bg-white/5";
                                    return (
                                        <div key={n.id} className={`p-5 flex gap-4 hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-secondary/[0.03]' : ''}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-xs text-white uppercase tracking-wide leading-tight">{n.title}</p>
                                                <p className="text-[10px] text-white/30 mt-1 leading-relaxed">{n.body}</p>
                                                {n.link && (
                                                    <Link href={n.link} onClick={() => { markRead(n.id); setOpen(false); }} className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline mt-2 inline-block">
                                                        View →
                                                    </Link>
                                                )}
                                            </div>
                                            {!n.read && <div className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0 animate-pulse" />}
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
