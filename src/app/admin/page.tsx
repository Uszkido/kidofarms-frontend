import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Map,
    AlertCircle,
    ArrowUpRight,
    TrendingDown,
    Clock,
    Plus
} from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Dashboard Header */}
                    <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-5xl font-black font-serif uppercase tracking-tighter">Ops <span className="text-secondary italic">Center</span></h1>
                            <p className="text-primary/40 font-black uppercase tracking-widest text-xs mt-2">Kido Farms Network &bull; Global Operations Manager</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-white border border-primary/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-sm">
                                Export Report
                            </button>
                            <Link href="/admin/inventory" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
                                <Plus size={18} /> New Listing
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {[
                            { label: "Total Revenue", value: "₦14.2M", trend: "+22%", icon: TrendingUp, color: "text-green-500", href: "/admin/orders" },
                            { label: "Active Orders", value: "1,240", trend: "+5%", icon: ShoppingCart, color: "text-blue-500", href: "/admin/orders" },
                            { label: "Active Users", value: "842", trend: "+12", icon: Users, color: "text-purple-500", href: "/admin/users" },
                            { label: "Inventory Alert", value: "12 Items", trend: "Critical", icon: AlertCircle, color: "text-red-500", href: "/admin/inventory" },
                        ].map((stat, i) => (
                            <Link href={stat.href} key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all group cursor-pointer block">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <stat.icon size={24} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-50 ${stat.color}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-black font-serif">{stat.value}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{stat.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Activity Chart Area Placeholder */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-sm space-y-10 min-h-[500px] relative overflow-hidden">
                                <div className="flex justify-between items-center relative z-10">
                                    <h3 className="text-3xl font-black font-serif uppercase tracking-tighter">Network <span className="text-secondary italic">Velocity</span></h3>
                                    <div className="flex gap-4">
                                        {["Daily", "Weekly", "Monthly"].map(t => (
                                            <button key={t} className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-primary transition-colors">{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-64 flex items-end gap-4 relative z-10 pt-10">
                                    {[40, 70, 45, 90, 65, 80, 50, 95, 100].map((h, i) => (
                                        <div key={i} className="flex-grow bg-neutral-50 rounded-2xl relative group overflow-hidden" style={{ height: '100%' }}>
                                            <div
                                                className="absolute bottom-0 w-full bg-primary/10 group-hover:bg-secondary transition-all rounded-2xl"
                                                style={{ height: `${h}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-8 pt-10 border-t border-primary/5 relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-primary/30 uppercase tracking-[0.2em]">Peak Region</p>
                                        <p className="text-xl font-black">Kano North</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-primary/30 uppercase tracking-[0.2em]">Top Produce</p>
                                        <p className="text-xl font-black">Catfish (L)</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-primary/30 uppercase tracking-[0.2em]">Logistics Sat.</p>
                                        <p className="text-xl font-black">94.5%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders List */}
                            <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-sm space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black font-serif uppercase tracking-tighter">Recent <span className="text-secondary italic">Dispatches</span></h3>
                                    <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">View Pipeline</Link>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: "#KF-1029", customer: "John Doe", items: "12kg Tomatoes", status: "In Transit", color: "text-blue-500" },
                                        { id: "#KF-1028", customer: "Sarah Smith", items: "5x Catfish", status: "Delivered", color: "text-green-500" },
                                        { id: "#KF-1027", customer: "The Grand Hotel", items: "Bulk Maize (500kg)", status: "Processing", color: "text-amber-500" },
                                    ].map((order, i) => (
                                        <div key={i} className="flex justify-between items-center p-6 border border-neutral-50 rounded-3xl hover:bg-neutral-50 transition-all cursor-pointer">
                                            <div className="flex gap-6 items-center">
                                                <span className="text-xs font-black text-primary/20">{order.id}</span>
                                                <div>
                                                    <p className="font-black text-lg">{order.customer}</p>
                                                    <p className="text-xs font-medium text-primary/40">{order.items}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-8 items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${order.color}`}>{order.status}</span>
                                                <ArrowUpRight size={18} className="text-primary/10" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <div className="bg-primary p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-20" />
                                <h3 className="text-2xl font-black font-serif leading-tight">Farmer <br /><span className="text-secondary italic">Onboarding Hub</span></h3>
                                <p className="text-cream/40 text-sm font-medium leading-relaxed">
                                    There are <span className="text-white font-black underline decoration-secondary">14 pending</span> farmer applications awaiting verification and soil report review.
                                </p>
                                <button className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                    Review Applications
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
                </div>
            </main>

            <Footer />
        </div>
    );
}
