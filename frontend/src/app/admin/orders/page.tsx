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
            // Wait, I might need to check if I implemented GET in admin/orders API.
            // In the previous turn I implemented a server component for orders.
            // I'll convert it to a client component for real-time status updates.
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Since I'm converting a server component to client, I need a GET API.
        // Let me first check if /api/admin/orders exists.
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
                setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const stats = {
        pending: orders.filter(o => o.orderStatus === 'processing').length,
        shipped: orders.filter(o => o.orderStatus === 'shipped').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 px-6">
            <main className="flex-grow py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary mb-4 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </Link>
                            <h1 className="text-4xl font-black font-serif uppercase tracking-tighter">Order <span className="text-secondary italic">Pipeline</span></h1>
                            <p className="text-primary/40 font-medium text-sm mt-2">Manage dispatch, track deliveries, and fulfill logic.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 hidden md:block">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                                <input
                                    type="text"
                                    placeholder="Search Order ID or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 bg-white border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/30 outline-none shadow-sm"
                                />
                            </div>
                            <button className="bg-white border border-primary/10 px-6 py-4 rounded-2xl text-primary font-black text-sm uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-sm flex items-center gap-2">
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black">{stats.pending}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Processing</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black">{stats.shipped}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">In Transit</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                                <PackageCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black">{stats.delivered}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Delivered</p>
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
                            const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                            let statusColor = "bg-primary/5 text-primary";
                            let StatusIcon = Clock;

                            if (order.orderStatus === 'processing') { statusColor = "bg-amber-100 text-amber-600"; StatusIcon = Clock; }
                            if (order.orderStatus === 'shipped') { statusColor = "bg-blue-100 text-blue-600"; StatusIcon = Truck; }
                            if (order.orderStatus === 'delivered') { statusColor = "bg-green-100 text-green-600"; StatusIcon = PackageCheck; }
                            if (order.orderStatus === 'cancelled') { statusColor = "bg-red-100 text-red-600"; StatusIcon = XCircle; }

                            return (
                                <div key={order.id} className="bg-white p-6 lg:p-8 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
                                    <div className="flex items-start lg:items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${statusColor}`}>
                                            <StatusIcon size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-lg">#{order.id.substring(0, 8).toUpperCase()}</h3>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-none outline-none cursor-pointer ${statusColor}`}
                                                >
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <p className="text-sm font-bold text-primary">{order.user?.name || 'Unknown Customer'} &bull; <span className="text-primary/40 font-medium">{date}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 pl-18 lg:pl-0">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Destination</p>
                                            <p className="text-sm font-bold flex items-center gap-1"><MapPin size={14} className="text-secondary" /> {order.city || 'Jos'}, {order.state || 'Plateau'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Total Value</p>
                                            <p className="font-black font-serif text-xl">₦{(Number(order.totalAmount) || 0).toLocaleString()}</p>
                                        </div>
                                        <Link href={`/admin/orders/${order.id}`} className="bg-neutral-50 hover:bg-primary hover:text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                                            View Details <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filteredOrders.length === 0 && (
                            <div className="bg-white p-20 rounded-[3rem] border border-primary/5 text-center">
                                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary/20">
                                    <PackageCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black font-serif">No Orders Found</h3>
                                <p className="text-primary/40 font-medium mt-2">Try a different search or wait for new harvests.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
