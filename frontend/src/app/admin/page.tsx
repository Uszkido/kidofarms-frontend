"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Map,
    ArrowUpRight,
    Clock,
    FileText,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";
import { useEffect } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(getApiUrl("/api/analytics/overview"));
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-cream/30">
            {/* Header */}
            <header className="bg-white border-b border-primary/5 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <LayoutDashboard className="text-secondary" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black font-serif tracking-tight text-primary">Farm Command</h1>
                            <p className="text-sm font-medium text-primary/40 leading-none">Admin Dashboard Overview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-black text-primary hover:text-secondary uppercase tracking-widest transition-colors flex items-center gap-2">
                            <ArrowLeft size={16} /> Exit to Store
                        </Link>
                        <div className="h-8 w-px bg-primary/10" />
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-black text-primary leading-none">Chief Farmer</p>
                            <p className="text-xs text-secondary font-medium mt-1">Super Admin Role</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border-2 border-secondary overflow-hidden">
                            <Image src="/logo.svg" alt="Admin" width={24} height={24} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inventory */}
                            <Link href="/admin/inventory" className="group">
                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-all -translate-y-16 translate-x-16" />
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Package size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Produce <span className="text-secondary italic">Inventory</span></h3>
                                    <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Manage products, stock levels, and daily prices.</p>
                                </div>
                            </Link>

                            {/* Orders */}
                            <Link href="/admin/orders" className="group">
                                <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <ShoppingCart size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Harvest <span className="text-secondary italic">Orders</span></h3>
                                    <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">View incoming requests and dispatch logistics.</p>
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group relative">
                                <Link href="/admin/categories" className="block">
                                    <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <LayoutDashboard size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Product <span className="text-blue-500 italic">Categories</span></h3>
                                        <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Manage food categories like Fruits, Veggies, Grains.</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={async () => {
                                        const res = await fetch(getApiUrl("/api/admin/init-categories"), { method: "POST" });
                                        if (res.ok) alert("Categories Synced!");
                                        else alert("Sync Failed");
                                    }}
                                    className="absolute bottom-6 right-6 p-2 bg-blue-100 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    Sync Now
                                </button>
                            </div>

                            <div className="group relative">
                                <Link href="/admin/blog" className="block">
                                    <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FileText size={28} />
                                        </div>
                                        <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Farm <span className="text-purple-500 italic">Blog</span></h3>
                                        <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Publish updates, recipes, and community stories.</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={async () => {
                                        const res = await fetch(getApiUrl("/api/admin/init-blog"), { method: "POST" });
                                        if (res.ok) alert("Blog Seeded!");
                                        else alert("Seed Failed");
                                    }}
                                    className="absolute bottom-6 right-6 p-2 bg-purple-100 text-purple-600 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    Sync Now
                                </button>
                            </div>
                        </div>

                        <Link href="/admin/subscribers" className="group block">
                            <div className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm hover:shadow-2xl transition-all h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-all -translate-y-16 translate-x-16" />
                                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Network <span className="text-green-500 italic">Members</span></h3>
                                <p className="text-primary/40 font-medium text-sm mt-3 leading-relaxed">Manage newsletter subscribers and marketing list.</p>
                            </div>
                        </Link>

                        {/* Recent Orders Table Component */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black font-serif uppercase tracking-tight">Recent <span className="text-secondary italic">Harvests</span></h3>
                                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors">View All</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-primary/5">
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Order ID</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Status</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/20 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {stats?.recentOrders?.map((order: any) => (
                                            <tr key={order.id} className="group hover:bg-neutral-50 transition-colors">
                                                <td className="py-4 text-xs font-bold text-primary truncate max-w-[120px]">{order.id}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                                                            order.orderStatus === 'processing' ? 'bg-amber-100 text-amber-600' :
                                                                'bg-neutral-100 text-neutral-600'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-xs font-black text-primary text-right">₦{Number(order.totalAmount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {!stats?.recentOrders?.length && (
                                            <tr>
                                                <td colSpan={3} className="py-8 text-center text-xs text-primary/20 font-medium italic">No recent orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Summary View */}
                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/20">Operations Menu</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <MenuLink href="/admin/vendors" icon={<Users size={16} />} label="Vendors" color="text-secondary" />
                                <MenuLink href="/admin/promotions" icon={<TrendingUp size={16} />} label="Promos" color="text-green-500" />
                                <MenuLink href="/admin/payments" icon={<ShoppingCart size={16} />} label="Payments" color="text-blue-500" />
                                <MenuLink href="/admin/reviews" icon={<FileText size={16} />} label="Reviews" color="text-purple-500" />
                                <MenuLink href="/admin/reports" icon={<TrendingUp size={16} />} label="Reports" color="text-red-500" />
                                <MenuLink href="/admin/settings" icon={<Map size={16} />} label="Settings" color="text-primary" />
                            </div>
                        </div>

                        <div className="bg-primary p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-20" />
                            <h3 className="text-2xl font-black font-serif leading-tight">Low Stock <br /><span className="text-secondary italic">Alerts</span></h3>
                            <div className="space-y-4">
                                {stats?.lowStock?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-cream/60 truncate max-w-[140px]">{item.name}</span>
                                        <span className="font-black text-secondary">{item.stock} left</span>
                                    </div>
                                ))}
                                {!stats?.lowStock?.length && <p className="text-xs text-cream/20">Inventory healthy.</p>}
                            </div>
                            <button className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                Restock Hub
                            </button>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-sm space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/20 flex items-center gap-2">
                                <Map size={14} /> Logistics Network
                            </h4>
                            <div className="space-y-6">
                                <div className="p-6 bg-neutral-50 rounded-2xl border border-primary/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-black text-sm uppercase tracking-widest">Kano Depot</p>
                                        <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                                        <div className="w-[85%] h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(190,160,78,0.5)]" />
                                    </div>
                                    <p className="text-[10px] font-black text-primary/30 uppercase mt-4">85% Capacity Used</p>
                                </div>
                                <div className="p-6 bg-neutral-50 rounded-2xl border border-primary/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-black text-sm uppercase tracking-widest">Lagos Hub</p>
                                        <span className="text-[10px] font-black text-amber-500 uppercase">High Volume</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-neutral-200 rounded-full">
                                        <div className="w-[98%] h-full bg-primary rounded-full shadow-[0_0_10px_rgba(10,21,11,0.5)]" />
                                    </div>
                                    <p className="text-[10px] font-black text-primary/30 uppercase mt-4">98% Capacity Used</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MenuLink({ href, icon, label, color }: any) {
    return (
        <Link href={href} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-primary/5 hover:bg-neutral-50 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-neutral-100 ${color} flex items-center justify-center`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{label}</span>
        </Link>
    );
}
