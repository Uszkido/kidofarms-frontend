"use client";

import { useState, useEffect } from "react";
import {
    Users,
    ShoppingCart,
    Activity,
    ArrowRight,
    Globe,
    ImagePlus,
    Loader2,
    TrendingUp,
    FileText,
    Zap,
    DollarSign,
    Box,
    KeyRound,
    Bell,
    Map,
    Sprout,
    ShieldAlert,
    Package,
    Settings2,
    Star,
    LayoutDashboard,
    Sliders,
    Warehouse,
    ShieldCheck,
    Briefcase,
    Building2,
    BookOpen,
    Truck
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(getApiUrl("/api/admin/stats"));
                if (res.ok) setStats(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#06120e] text-[#E6EDF3] p-6 lg:p-10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <h1 className="text-6xl font-black font-serif uppercase tracking-tighter text-white leading-none">
                            Network <span className="text-secondary italic">Command</span>
                        </h1>
                        <p className="text-white/40 font-bold text-sm tracking-widest uppercase mt-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            Core Systems Online • Kano North Hub Active
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black shadow-xl">
                            {session?.user?.name?.[0] || "A"}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-white font-bold text-sm">{session?.user?.name || "Admin"}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Chief Administrator</p>
                        </div>
                    </div>
                </div>

                {/* 1. KEY PERFORMANCE METRICS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <MetricCard
                        label="Total Revenue"
                        value={`₦${(stats?.revenue || 0).toLocaleString()}`}
                        icon={<DollarSign size={20} />}
                        color="bg-primary text-secondary"
                        loading={loading}
                    />
                    <MetricCard
                        label="Order Volume"
                        value={stats?.orders || 0}
                        icon={<ShoppingCart size={20} />}
                        color="bg-white/5 text-secondary border border-white/5"
                        loading={loading}
                    />
                    <MetricCard
                        label="Citizen Base"
                        value={stats?.users || 0}
                        icon={<Users size={20} />}
                        color="bg-white/5 text-blue-400 border border-white/5"
                        loading={loading}
                    />
                    <MetricCard
                        label="Product Range"
                        value={stats?.totalProducts || 120}
                        icon={<Box size={20} />}
                        color="bg-white/5 text-green-400 border border-white/5"
                        loading={loading}
                    />
                </div>

                {/* 2. MASTER COMMAND PALETTE (CORE FUNCTIONS) */}
                <div className="mb-16">
                    <div className="flex justify-between items-end mb-8 border-l-4 border-secondary pl-4">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Master Utility Rack</h2>
                            <p className="text-[10px] text-white/20 uppercase font-black mt-1">12+ Functional Internal Nodes Active</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <SmallMenuLink href="/admin/vendors" label="Vendors" icon={<Users size={20} />} />
                        <SmallMenuLink href="/admin/farmers" label="Farmers" icon={<Sprout size={20} />} />
                        <SmallMenuLink href="/admin/otps" label="OTP Gate" icon={<KeyRound size={20} />} />
                        <SmallMenuLink href="/admin/promotions" label="Promos" icon={<Zap size={20} />} />
                        <SmallMenuLink href="/admin/payments" label="Finance" icon={<DollarSign size={20} />} />
                        <SmallMenuLink href="/admin/landing" label="Landing CMS" icon={<Settings2 size={20} />} />
                        <SmallMenuLink href="/admin/reviews" label="Reviews" icon={<Star size={20} />} />
                        <SmallMenuLink href="/admin/reports" label="Intel" icon={<Activity size={20} />} />
                        <SmallMenuLink href="/admin/settings" label="Global Setup" icon={<Map size={20} />} />
                        <SmallMenuLink href="/admin/subscribers" label="Subs" icon={<Globe size={20} />} />
                        <SmallMenuLink href="/admin/orders" label="Tracking" icon={<Truck size={20} />} />
                        <SmallMenuLink href="/admin/users" label="User Registry" icon={<Users size={20} />} />
                    </div>
                </div>

                {/* 3. QUICK ACTIONS (ADD/EDIT) */}
                <div className="mb-16 bg-[#1a3c34]/40 p-8 md:p-12 rounded-[3.5rem] border border-secondary/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
                    <div className="flex justify-between items-center mb-8 relative z-10 w-full">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary border-l-4 border-secondary pl-4">Direct Action Protocols</h2>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black hidden md:block">Instant Entry Points</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
                        <ActionBtn href="/admin/products/new" icon={<Package size={20} />} label="Add Product" />
                        <ActionBtn href="/admin/users/new" icon={<Users size={20} />} label="Add Citizen" />
                        <ActionBtn href="/admin/landing" icon={<ImagePlus size={20} />} label="Edit UI" />
                        <ActionBtn href="/admin/inventory" icon={<Warehouse size={20} />} label="Update Stock" />
                        <ActionBtn href="/admin/orders" icon={<ShoppingCart size={20} />} label="Review Orders" />
                        <ActionBtn href="/admin/promotions/new" icon={<TrendingUp size={20} />} label="Deploy Promo" />
                    </div>
                </div>

                {/* 4. CORE INFRASTRUCTURE GRID */}
                <div className="grid xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 space-y-10">
                        <section>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary mb-8 border-l-4 border-secondary pl-4">System Infrastructure</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InfrastructureCard
                                    href="/admin/users"
                                    title="Citizen Directory"
                                    sub="Farmer, Vendor, B2B, Team profiles"
                                    icon={<Users size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/otps"
                                    title="OTP Master Recall"
                                    sub="Intercept verification codes"
                                    icon={<ShieldAlert size={24} />}
                                    warning
                                />
                                <InfrastructureCard
                                    href="/admin/inventory"
                                    title="Global Stock Node"
                                    sub="Real-time multi-depot inventory"
                                    icon={<Warehouse size={24} />}
                                />
                                <InfrastructureCard
                                    href="/admin/orders"
                                    title="Logistics Node"
                                    sub="Satellite tracking & transit logs"
                                    icon={<Truck size={24} />}
                                />
                            </div>
                        </section>

                        <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 backdrop-blur-md shadow-2xl space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-white">Recent <span className="text-secondary italic">Operations</span></h2>
                                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">Full Audit Log</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Operation ID</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Status</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(stats?.recentOrders || []).map((order: any) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-4 text-xs font-bold text-white/60 tracking-mono">{order.id}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-400' : 'bg-secondary/10 text-secondary'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-xs font-black text-right text-white">₦{Number(order.totalAmount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {(!stats?.recentOrders || stats?.recentOrders.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="py-10 text-center text-white/20 text-xs italic font-medium tracking-widest">No recent operations logged in heartbeat feed.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-8">
                        <div className="bg-secondary rounded-[3rem] p-10 text-primary shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                            <Warehouse className="absolute -bottom-10 -right-10 text-primary/5 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-black font-serif leading-none italic uppercase">Logistics Hub</h3>
                                <p className="text-primary/60 text-xs font-medium leading-relaxed uppercase tracking-widest">You have <span className="font-black text-primary">12 infrastructure alerts</span> pending. Satellite uplink stable.</p>
                                <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">Audit Nodes</button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl space-y-6 text-[#E6EDF3]">
                            <h3 className="text-2xl font-black font-serif uppercase italic">Protocol <span className="text-secondary">Alerts</span></h3>
                            <div className="space-y-4">
                                {[
                                    { msg: "Moisture deviation in Central Hub 4", type: "warning" },
                                    { msg: "B2B certification pending approval", type: "info" },
                                    { msg: "OTP rate limit surge detected", type: "urgent" }
                                ].map((alert, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${alert.type === 'warning' ? 'bg-orange-400' :
                                                alert.type === 'urgent' ? 'bg-red-400' : 'bg-blue-400'
                                            }`} />
                                        <p className="text-[10px] font-bold text-white/40 tracking-tight leading-snug">{alert.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, color, loading }: any) {
    return (
        <div className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-40 transition-all border border-white/5 ${color.includes('bg-white') ? color : color + ' shadow-xl shadow-secondary/10'}`}>
            <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg bg-white/10`}>{icon}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{label}</span>
            </div>
            <div>
                <h3 className="text-3xl font-black font-serif tracking-tight text-white uppercase">
                    {loading ? <Loader2 className="animate-spin text-secondary" size={24} /> : value}
                </h3>
            </div>
        </div>
    );
}

function SmallMenuLink({ href, label, icon }: any) {
    return (
        <Link href={href} className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-secondary transition-all group text-white hover:text-primary shadow-xl cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#1a3c34] group-hover:bg-white/20 flex items-center justify-center transition-colors">
                {icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-primary leading-tight text-center">{label}</span>
        </Link>
    );
}

function ActionBtn({ href, icon, label }: any) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-secondary border border-white/5 hover:border-secondary p-6 rounded-3xl transition-all group text-white hover:text-primary shadow-lg cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-[#1a3c34] group-hover:bg-white/20 flex items-center justify-center transition-colors shadow-inner">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{label}</span>
        </Link>
    );
}

function InfrastructureCard({ href, title, sub, icon, warning }: any) {
    return (
        <Link href={href} className={`group p-8 rounded-[2.5rem] border ${warning ? 'bg-red-500/5 border-red-500/20 hover:border-red-500' : 'bg-white/5 border-white/5 hover:border-secondary'
            } transition-all shadow-xl backdrop-blur-md`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${warning ? 'bg-red-500/20 text-red-500' : 'bg-[#1a3c34] text-secondary'
                }`}>
                {icon}
            </div>
            <h3 className="text-xl font-black font-serif text-white uppercase italic mb-2 tracking-tight">{title}</h3>
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-secondary group-hover:gap-6 transition-all">
                {sub} <ArrowRight size={14} />
            </div>
        </Link>
    );
}
