"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Sprout,
    ShoppingBag,
    TrendingUp,
    Plus,
    Wallet,
    Droplets,
    Activity,
    Box,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [sensors, setSensors] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalSales: "₦1.8M",
        activeOrders: 15,
        stockItems: 52,
        growth: "+22%"
    });

    const [farmProfile] = useState({
        name: "Kido Alpha Node",
        profileImg: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80"
    });

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch(getApiUrl("/api/sensors"));
                if (res.ok) setSensors(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        fetchSensors();
    }, []);

    const getSensorVal = (type: string) => sensors.find(s => s.type === type)?.value || "--";

    const tabs = [
        { id: "overview", label: "Command Center", icon: LayoutDashboard, href: "/dashboard/supplier" },
        { id: "inventory", label: "Inventory Vault", icon: ShoppingBag, href: "/dashboard/supplier/inventory" },
        { id: "horizon", label: "Horizon 5.0", icon: Sparkles, href: "/dashboard/supplier/horizon" },
        { id: "monitoring", label: "Precision Node", icon: Activity, href: "/dashboard/supplier/monitoring" },
        { id: "financials", label: "Payout Registry", icon: Wallet, href: "/dashboard/supplier/financials" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <header className="relative py-12 md:py-16 px-6 md:px-10 bg-primary rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-secondary/10 -skew-x-12 translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-[3000ms]" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-20 animate-pulse" />

                            <img
                                src={farmProfile.profileImg}
                                alt="Farm Profile"
                                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[5000ms]"
                            />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center text-white">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Sprout size={14} /> {farmProfile.name} • Sovereign Node
                                    </div>
                                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-serif leading-none tracking-tighter">
                                        Supplier <br />
                                        <span className="text-secondary italic">Console</span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link href="/dashboard/supplier/products/new" className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-2">
                                            <Plus size={16} /> New Harvest Listing
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 w-full max-w-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Available Payout</p>
                                                <p className="text-4xl font-black font-serif text-white leading-none">{stats.totalSales}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                                <Wallet size={24} />
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest">
                                            <span>Network Sync: High</span>
                                            <span className="text-secondary">{stats.growth}</span>
                                        </div>
                                        <Link href="/dashboard/supplier/cashout" className="block w-full text-center bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans">
                                            Access Funds Node
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Mixed Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Yield", value: "2.4 Tons", icon: Sprout, color: "bg-green-500", detail: "+12% vs last cycle" },
                                { label: "Moisture Node", value: getSensorVal('moisture') + (getSensorVal('moisture') !== '--' ? '%' : ''), icon: Droplets, color: "bg-secondary", detail: "Sector 4A Optimal" },
                                { label: "Active Orders", value: stats.activeOrders, icon: ShoppingBag, color: "bg-blue-500", detail: "Awaiting Logistics" },
                                { label: "Stock Items", value: stats.stockItems, icon: Box, color: "bg-orange-500", detail: "Warehouse Active" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={26} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif text-primary uppercase">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{stat.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[8px] font-black uppercase text-primary/60">
                                        <CheckCircle2 size={10} className="text-secondary" /> {stat.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {tabs.map(tab => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${pathname === tab.href || (tab.id === 'overview' && pathname === '/dashboard/supplier') ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                    {(pathname === tab.href || (tab.id === 'overview' && pathname === '/dashboard/supplier')) && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full" />}
                                </Link>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-12">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}
