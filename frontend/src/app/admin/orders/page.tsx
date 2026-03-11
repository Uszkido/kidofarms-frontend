"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    ArrowLeft,
    Truck,
    PackageCheck,
    Clock,
    XCircle,
    ArrowUpRight,
    MapPin,
    Loader2,
    Database,
    ShieldCheck
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/orders"));
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch(getApiUrl(`/api/orders/${orderId}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: status })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const stats = {
        pending: orders.filter(o => o?.orderStatus === 'processing').length,
        shipped: orders.filter(o => o?.orderStatus === 'shipped').length,
        delivered: orders.filter(o => o?.orderStatus === 'delivered').length,
    };

    const filteredOrders = orders.filter(o =>
        (o?.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (o?.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1600px] mx-auto space-y-16">

                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">Logistics Infrastructure</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Fleet <span className="text-secondary block">Command</span>
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                placeholder="Search transits by ID or Client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-96 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm"
                            />
                        </div>
                        <button className="bg-white/5 border border-white/10 px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-3">
                            <Filter size={18} /> Protocol Filter
                        </button>
                    </div>
                </header>

                {/* 📊 SUMMARY Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <VitalCard label="Processing" value={stats.pending} icon={<Clock size={28} />} color="text-amber-500" />
                    <VitalCard label="In Transit" value={stats.shipped} icon={<Truck size={28} />} color="text-blue-400" />
                    <VitalCard label="Delivered" value={stats.delivered} icon={<PackageCheck size={28} />} color="text-green-400" />
                    <div className="bg-secondary p-10 rounded-[3rem] text-primary shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                        <Database className="absolute -bottom-8 -right-8 text-primary/10 w-40 h-40 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Fleet Efficiency</h4>
                        <p className="text-4xl font-black font-serif italic uppercase">94.8%</p>
                    </div>
                </div>

                {/* 🚚 LOGISTICS LEDGER */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Accessing Logistics Grid...</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => {
                            let statusColor = "bg-white/5 text-white/60";
                            let StatusIcon = Clock;
                            if (order.orderStatus === 'processing') { statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/20"; StatusIcon = Clock; }
                            if (order.orderStatus === 'shipped') { statusColor = "bg-blue-500/10 text-blue-400 border-blue-400/20"; StatusIcon = Truck; }
                            if (order.orderStatus === 'delivered') { statusColor = "bg-green-500/10 text-green-400 border-green-400/20"; StatusIcon = PackageCheck; }
                            if (order.orderStatus === 'cancelled') { statusColor = "bg-red-500/10 text-red-500 border-red-500/20"; StatusIcon = XCircle; }

                            return (
                                <div key={order.id} className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl group hover:bg-white/[0.03] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-20 h-20 rounded-[2rem] border flex items-center justify-center shrink-0 ${statusColor} group-hover:scale-110 transition-transform`}>
                                            <StatusIcon size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tight leading-none group-hover:text-secondary transition-colors">#{order.id?.substring(0, 8).toUpperCase()}</h3>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 bg-[#0b1612] text-white/60 focus:border-secondary outline-none cursor-pointer transition-all`}
                                                >
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <p className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-3">
                                                <ShieldCheck size={14} className="text-secondary" /> {order.user?.name || 'Citizen Alpha'} &bull; {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-10 lg:gap-20">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Target Hub</p>
                                            <p className="text-lg font-black italic flex items-center gap-2 text-white/80"><MapPin size={16} className="text-secondary" /> {order.city || 'Jos'}, {order.state || 'NG'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Total Liquidity</p>
                                            <p className="text-3xl font-black font-serif italic text-white leading-none">₦{(Number(order.totalAmount)).toLocaleString()}</p>
                                        </div>
                                        <Link href={`/admin/orders/${order.id}`} className="px-10 py-6 bg-white/5 text-white/80 hover:bg-secondary hover:text-primary rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group-hover:shadow-2xl active:scale-95">
                                            Audit Details <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {filteredOrders.length === 0 && !loading && (
                    <div className="p-32 text-center bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl">
                        <Truck size={64} className="mx-auto text-white/10 mb-6" />
                        <h3 className="text-3xl font-black font-serif italic text-white uppercase">No Transits Found</h3>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Expand search parameters or await new harvests</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function VitalCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl flex items-center justify-between group">
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">{label}</h4>
                <p className="text-5xl font-black font-serif italic text-white leading-none">{value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-white/[0.02] ${color} group-hover:bg-white/5 transition-colors`}>
                {icon}
            </div>
        </div>
    );
}
