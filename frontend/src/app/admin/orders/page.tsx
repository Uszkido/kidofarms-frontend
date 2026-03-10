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
    TrendingUp
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await fetch(getApiUrl("/api/orders"));
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                setOrders([]);
                console.error("Expected array from /api/orders, got:", data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setOrders([]);
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

    const ordersList = Array.isArray(orders) ? orders : [];

    const stats = {
        pending: ordersList.filter(o => o?.orderStatus === 'processing').length,
        shipped: ordersList.filter(o => o?.orderStatus === 'shipped').length,
        delivered: ordersList.filter(o => o?.orderStatus === 'delivered').length,
    };

    const filteredOrders = ordersList.filter(o =>
        (o?.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (o?.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#0E1116] text-[#E6EDF3] px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary mb-4 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-4xl font-black font-serif uppercase tracking-tighter text-white">Order <span className="text-secondary italic">Pipeline</span></h1>
                            <p className="text-white/40 font-medium text-sm mt-2">Manage dispatch, track deliveries, and fulfill logic.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 hidden md:block">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search Order ID or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:ring-2 focus:ring-secondary/30 outline-none backdrop-blur-md"
                                />
                            </div>
                            <button className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2">
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white">{stats.pending}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Processing</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white">{stats.shipped}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">In Transit</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                                <PackageCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white">{stats.delivered}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <Loader2 size={48} className="animate-spin text-secondary mx-auto" />
                            </div>
                        ) : filteredOrders.map((order) => {
                            if (!order) return null;
                            const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date Unknown";
                            let statusColor = "bg-white/5 text-white/60";
                            let StatusIcon = Clock;

                            if (order.orderStatus === 'processing') { statusColor = "bg-amber-500/10 text-amber-500"; StatusIcon = Clock; }
                            if (order.orderStatus === 'shipped') { statusColor = "bg-blue-500/10 text-blue-400"; StatusIcon = Truck; }
                            if (order.orderStatus === 'delivered') { statusColor = "bg-green-500/10 text-green-400"; StatusIcon = PackageCheck; }
                            if (order.orderStatus === 'cancelled') { statusColor = "bg-red-500/10 text-red-500"; StatusIcon = XCircle; }

                            return (
                                <div key={order.id} className="bg-white/5 p-6 lg:p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-md hover:border-secondary/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
                                    <div className="flex items-start lg:items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${statusColor}`}>
                                            <StatusIcon size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-lg text-white">#{order.id?.substring(0, 8).toUpperCase() || "ORD"}</h3>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-none outline-none cursor-pointer ${statusColor} bg-[#161B22]`}
                                                >
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <p className="text-sm font-bold text-white/80">{order.user?.name || 'Unknown Customer'} &bull; <span className="text-white/20 font-medium">{date}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 pl-18 lg:pl-0">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Destination</p>
                                            <p className="text-sm font-bold flex items-center gap-1 text-white/60"><MapPin size={14} className="text-secondary" /> {order.city || 'Jos'}, {order.state || 'Plateau'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Value</p>
                                            <p className="font-black font-serif text-xl text-white">₦{(Number(order.totalAmount) || 0).toLocaleString()}</p>
                                        </div>
                                        <Link href={`/admin/orders/${order.id}`} className="bg-white/5 hover:bg-secondary hover:text-primary px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl">
                                            View Details <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filteredOrders.length === 0 && (
                            <div className="bg-white/5 p-20 rounded-[3rem] border border-white/5 text-center backdrop-blur-md">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                                    <PackageCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black font-serif text-white">No Orders Found</h3>
                                <p className="text-white/20 font-medium mt-2">Try a different search or wait for new harvests.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>

    );
}
