"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Package, User, Star, Info, Loader2, CheckCircle2, Zap, LayoutGrid, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function NotificationBell() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    const userId = (session?.user as any)?.id;

    const fetchNotifications = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const token = (session as any)?.accessToken || (session as any)?.token;
            const headers: any = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            // 1. Fetch real DB notifications
            const res = await fetch(getApiUrl(`/api/notifications?userId=${userId}`), { headers });
            const dbData = await res.json();

            // 2. Fetch Low Stock Alerts
            const stockRes = await fetch(getApiUrl("/api/admin/products/low-stock"), { headers });
            const lowStockData = await stockRes.json();

            const stockAlerts = (Array.isArray(lowStockData) ? lowStockData : []).map((p: any) => ({
                id: `stock-${p.id}`,
                type: 'alert',
                title: 'Low Stock Alert',
                body: `${p.name} is running low (${p.stock} remaining)`,
                link: `/admin/inventory`,
                createdAt: new Date().toISOString(),
                isRead: false
            }));

            // 3. Fetch Stats-derived alerts as fallback/addition
            const statsRes = await fetch(getApiUrl("/api/admin/stats"), { headers });
            const stats = await statsRes.json();

            const statsAlerts: any[] = [];
            if (stats.pending > 0) {
                statsAlerts.push({
                    id: 'pending-orders-stat',
                    type: 'order',
                    title: 'Pending Orders',
                    body: `You have ${stats.pending} orders awaiting processing`,
                    link: '/admin/orders',
                    createdAt: new Date().toISOString(),
                    isRead: false
                });
            }

            const combined = [...(Array.isArray(dbData) ? dbData : []), ...stockAlerts, ...statsAlerts];
            // Unique by ID
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            setNotifs(unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 120_000); // Pulse every 2 mins
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = async () => {
        try {
            const token = (session as any)?.accessToken || (session as any)?.token;
            await fetch(getApiUrl(`/api/notifications/read-all`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) { console.error(err); }
    };

    const unreadCount = notifs.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package size={16} className="text-secondary" />;
            case 'user': return <User size={16} className="text-blue-400" />;
            case 'review': return <Star size={16} className="text-amber-400" />;
            case 'alert': return <ShieldAlert size={16} className="text-red-400" />;
            default: return <Info size={16} className="text-white/40" />;
        }
    };

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-3 rounded-2xl transition-all duration-500 group ${isOpen ? 'bg-secondary text-primary' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'}`}
            >
                <Bell size={20} className={unreadCount > 0 ? "animate-swing" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#040d0a] animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-6 w-[400px] bg-[#0b1612] border border-white/10 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">Pulse Monitor</h4>
                            <p className="text-[9px] text-white/20 uppercase font-bold mt-1 tracking-widest">Network Telemetry Notifications</p>
                        </div>
                        <button onClick={markAllRead} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-secondary transition-colors">
                            Purge Unread
                        </button>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {loading && notifs.length === 0 ? (
                            <div className="p-20 flex flex-col items-center gap-4 opacity-20">
                                <Loader2 size={32} className="animate-spin text-secondary" />
                            </div>
                        ) : notifs.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {notifs.map((n) => (
                                    <Link
                                        key={n.id}
                                        href={n.link || "#"}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex gap-5 p-6 transition-all hover:bg-white/[0.03] group relative ${!n.isRead ? 'bg-secondary/5' : ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${!n.isRead ? 'bg-secondary/10 border-secondary/20' : 'bg-white/5 border-white/5'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="space-y-1 pr-6 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-xs font-black uppercase tracking-tight group-hover:text-secondary transition-colors ${!n.isRead ? 'text-white' : 'text-white/40'}`}>
                                                    {n.title}
                                                </p>
                                                <span className="text-[8px] font-mono text-white/10 shrink-0">
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-white/30 leading-relaxed line-clamp-2 italic font-medium">
                                                {n.body || n.message}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-24 text-center space-y-4 opacity-20">
                                <Zap size={48} className="mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Channel Silent</p>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block p-5 bg-white/[0.02] border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-secondary hover:bg-white/[0.05] transition-all"
                    >
                        Access Command Hub
                    </Link>
                </div>
            )}
        </div>
    );
}
