"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Map,
    FileText,
    ArrowLeft,
    Loader2,
    Activity,
    AlertCircle,
    DollarSign,
    Bell,
    Box,
    Globe,
    Sprout,
    KeyRound,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

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
        <div className="min-h-screen bg-[#0E1116] text-[#E6EDF3]">
            {/* Header */}
            <header className="bg-[#0E1116]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                            <LayoutDashboard className="text-primary h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-black font-serif tracking-tight text-white uppercase leading-tight md:leading-normal">Kido Farms</h1>
                            <p className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-[0.2em] leading-none">& Orchards</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-black text-white/60 hover:text-secondary uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                            <ArrowLeft size={12} /> Exit to Store
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-black text-white leading-none uppercase">Chief Farmer</p>
                            <p className="text-[9px] text-secondary font-bold mt-1 uppercase tracking-widest">Administrator</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10">
                {/* 1. KEY PERFORMANCE METRICS */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            label="Total Revenue"
                            value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
                            icon={<DollarSign size={20} />}
                            color="bg-secondary text-primary"
                            loading={loading}
                        />
                        <MetricCard
                            label="Order Volume"
                            value={stats?.totalSales || 0}
                            icon={<ShoppingCart size={20} />}
                            color="bg-white/5 text-secondary border-white/5"
                            loading={loading}
                        />
                        <MetricCard
                            label="Customer Base"
                            value={stats?.totalCustomers || 0}
                            icon={<Users size={20} />}
                            color="bg-white/5 text-blue-400 border-white/5"
                            loading={loading}
                        />
                        <MetricCard
                            label="Product Range"
                            value={stats?.totalProducts || 0}
                            icon={<Box size={20} />}
                            color="bg-white/5 text-green-400 border-white/5"
                            loading={loading}
                        />
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* LEFT COLUMN: Operations & Management */}
                    <div className="xl:col-span-8 space-y-10">
                        {/* 2. PRIMARY NAVIGATION grid (2-column tight) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <NavCard
                                href="/admin/inventory"
                                icon={<Package size={24} />}
                                title="Inventory"
                                sub="Manage stock & pricing"
                                color="primary"
                            />
                            <NavCard
                                href="/admin/farmers"
                                icon={<Sprout size={24} />}
                                title="Farmers"
                                sub="Scale farm businesses"
                                color="blue"
                            />
                            <NavCard
                                href="/admin/orders"
                                icon={<ShoppingCart size={24} />}
                                title="Orders"
                                sub="Dispatch & fullfilment"
                                color="secondary"
                            />
                            <NavCard
                                href="/admin/categories"
                                icon={<LayoutDashboard size={24} />}
                                title="Categories"
                                sub="Department organization"
                                color="blue"
                            />
                            <NavCard
                                href="/admin/blog"
                                icon={<FileText size={24} />}
                                title="Farm Blog"
                                sub="Content & engagement"
                                color="purple"
                            />
                            <NavCard
                                href="/admin/market"
                                icon={<Briefcase size={24} />}
                                title="Market & Buyers"
                                sub="Wholesale & Distrib."
                                color="secondary"
                            />
                        </div>

                        {/* 3. ACTIVITY FEED */}
                        <div className="bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl p-8 space-y-6 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black font-serif uppercase tracking-tight text-white">Recent <span className="text-secondary italic">Harvests</span></h3>
                                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-secondary transition-all">All Orders</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/10 text-left">Ref</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/10 text-left">Status</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/10 text-right">Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stats?.recentOrders?.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 text-xs font-bold text-white/60 truncate max-w-[100px]">{order.id}</td>
                                                <td className="py-4 font-black">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest ${order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-400' :
                                                        order.orderStatus === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                                                            'bg-white/5 text-white/20'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-xs font-black text-white text-right">₦{Number(order.totalAmount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Insights */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* QUICK ACCESS MENU */}
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-sm space-y-6 backdrop-blur-md">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Operations</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <SmallMenuLink href="/admin/vendors" label="Vendors" icon={<Users size={14} />} />
                                <SmallMenuLink href="/admin/farmers" label="Farmers" icon={<Sprout size={14} />} />
                                <SmallMenuLink href="/admin/otps" label="OTPs" icon={<KeyRound size={14} />} />
                                <SmallMenuLink href="/admin/promotions" label="Promos" icon={<TrendingUp size={14} />} />
                                <SmallMenuLink href="/admin/payments" label="Pay" icon={<DollarSign size={14} />} />
                                <SmallMenuLink href="/admin/reviews" label="Reviews" icon={<FileText size={14} />} />
                                <SmallMenuLink href="/admin/reports" label="Repo" icon={<Activity size={14} />} />
                                <SmallMenuLink href="/admin/settings" label="Setup" icon={<Map size={14} />} />
                                <SmallMenuLink href="/admin/subscribers" label="Subs" icon={<Globe size={14} />} />
                                <SmallMenuLink href="/admin/landing" label="Landing" icon={<LayoutDashboard size={14} />} />
                                <SmallMenuLink href="/admin/users" label="Users" icon={<Users size={14} />} />
                                <SmallMenuLink href="/admin/notifications" label="Alerts" icon={<Bell size={14} />} />
                                <SmallMenuLink href="/admin/team" label="Team" icon={<Users size={14} />} />
                                <SmallMenuLink href="/admin/impact" label="Impact" icon={<Activity size={14} />} />
                                <SmallMenuLink href="/admin/investments" label="Invest" icon={<DollarSign size={14} />} />
                                <SmallMenuLink href="/admin/stories" label="Stories" icon={<Activity size={14} />} />
                            </div>
                        </div>

                        {/* ALERTS */}
                        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary rounded-full blur-[60px] opacity-20" />
                            <div className="flex items-center gap-3 mb-6">
                                <AlertCircle size={18} className="text-secondary" />
                                <h4 className="text-xs font-black uppercase tracking-widest">Inventory Alerts</h4>
                            </div>
                            <div className="space-y-3">
                                {stats?.lowStock?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-[10px] py-2 border-b border-white/5 last:border-0">
                                        <span className="font-medium text-cream/60 truncate max-w-[120px]">{item.name}</span>
                                        <span className="font-black text-secondary">{item.stock} left</span>
                                    </div>
                                ))}
                                {!stats?.lowStock?.length && <p className="text-[10px] text-white/30 italic">All stocks are optimal.</p>}
                            </div>
                        </div>

                        {/* LOGISTICS */}
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-sm space-y-6 backdrop-blur-md">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                                <Activity size={12} /> Logistics Stream
                            </h4>
                            <div className="space-y-6">
                                <LogisticsNode label="Kano Depot" status="Operational" percent={85} color="bg-secondary" />
                                <LogisticsNode label="Lagos Hub" status="High Volume" percent={98} color="bg-secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MetricCard({ label, value, icon, color, loading }: any) {
    const isDark = color.includes('bg-white/5');
    return (
        <div className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-40 transition-all border ${isDark ? 'border-white/5 bg-white/5 backdrop-blur-md' : color + ' shadow-xl shadow-secondary/10'}`}>
            <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-secondary' : 'bg-white/10'}`}>{icon}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{label}</span>
            </div>
            <div>
                <h3 className="text-3xl font-black font-serif tracking-tight">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : value}
                </h3>
            </div>
        </div>
    );
}

function NavCard({ href, icon, title, sub, color }: any) {
    const colors: any = {
        primary: "bg-secondary text-primary",
        secondary: "bg-secondary/10 text-secondary border-secondary/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    };

    return (
        <Link href={href} className="group flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 transition-all hover:shadow-2xl hover:border-secondary/20 backdrop-blur-md">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-black font-serif uppercase tracking-tight text-white">{title}</h4>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{sub}</p>
            </div>
        </Link>
    );
}

function SmallMenuLink({ href, label, icon }: any) {
    return (
        <Link href={href} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/5 hover:bg-white/5 transition-all group backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-secondary transition-colors">
                {icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60">{label}</span>
        </Link>
    );
}

function LogisticsNode({ label, status, percent, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <p className="font-black text-[10px] uppercase tracking-widest">{label}</p>
                <span className={`text-[8px] font-black uppercase ${status === 'Operational' ? 'text-green-500' : 'text-amber-500'}`}>{status}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-1000`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
