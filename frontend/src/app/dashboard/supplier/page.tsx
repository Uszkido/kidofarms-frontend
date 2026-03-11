"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Sprout,
    ShoppingBag,
    TrendingUp,
    Plus,
    ArrowRight,
    Search,
    Brain,
    Loader2,
    ShieldCheck,
    QrCode,
    Mic,
    Building2,
    Globe,
    RefreshCw,
    GraduationCap,
    Warehouse,
    Activity,
    DollarSign,
    Box,
    Clock,
    BarChart3,
    Wallet,
    MapPin,
    Package,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    Calendar,
    ThermometerSun,
    Droplets,
    Zap,
    Camera
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function SupplierDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // Stats State
    const [stats, setStats] = useState({
        totalRevenue: "₦1.8M",
        activeOrders: 15,
        stockItems: 52,
        harvestProgress: "64%",
        growth: "+22%"
    });

    // Modules/UI States
    const [activeTab, setActiveTab] = useState("overview");
    const [isAgronomistOpen, setIsAgronomistOpen] = useState(false);
    const [isVoiceListingOpen, setIsVoiceListingOpen] = useState(false);

    // Dynamic Role Detection
    const isFarmer = userRole === 'farmer' || userRole === 'admin'; // Admin sees all
    const isVendor = userRole === 'vendor' || userRole === 'admin';

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <header className="relative py-16 px-12 bg-primary rounded-[4rem] overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-secondary/10 -skew-x-12 translate-x-1/2 group-hover:bg-secondary/20 transition-all duration-1000" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-20 animate-pulse" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl">
                                        <Sparkles size={14} className="animate-pulse" /> Production & Supply Command
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-black font-serif text-white tracking-tighter leading-none">
                                        Supplier <br />
                                        <span className="text-secondary italic">Hub</span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/dashboard/supplier/products/new" className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                                            <Plus size={18} /> Add Listing
                                        </Link>
                                        <button onClick={() => setIsVoiceListingOpen(true)} className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 backdrop-blur-md">
                                            <Mic size={18} /> Voice Listing
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 w-full max-w-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Wallet Node Balance</p>
                                                <p className="text-4xl font-black font-serif text-white leading-none">₦{stats.totalRevenue}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                                <Wallet size={24} />
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest">
                                            <span>Cycle Status: Optimized</span>
                                            <span className="text-secondary">{stats.growth}</span>
                                        </div>
                                        <button onClick={() => handleAction("Withdraw")} className="w-full bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl">
                                            Instant Settlement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Critical Stats Stream */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Revenue", value: stats.totalRevenue, icon: TrendingUp, color: "text-green-500 bg-green-50" },
                                { label: "Active Orders", value: stats.activeOrders, icon: ShoppingBag, color: "text-blue-500 bg-blue-50" },
                                { label: "Stock Items", value: stats.stockItems, icon: Box, color: "text-purple-500 bg-purple-50" },
                                { label: "Harvest Ready", value: stats.harvestProgress, icon: Sprout, color: "text-secondary bg-secondary/10" },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <s.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "overview", label: "Overview", icon: LayoutDashboard },
                                { id: "products", label: "Inventory & Listings", icon: ShoppingBag },
                                { id: "harvest", label: "Farm & Harvests", icon: Sprout, hidden: !isFarmer },
                                { id: "orders", label: "Order Vault", icon: Clock },
                                { id: "pricing", label: "Price Oracle", icon: Zap },
                                { id: "storage", label: "Warehouse Node", icon: Warehouse },
                                { id: "analytics", label: "Intelligence Reports", icon: BarChart3 }
                            ].map(tab => !tab.hidden && (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-widest transition-all relative shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Content */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Main Feed */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "overview" && (
                                    <>
                                        {/* Activity Log */}
                                        <section className="space-y-8">
                                            <div className="flex justify-between items-center px-4">
                                                <h2 className="text-3xl font-black font-serif uppercase italic tracking-tighter">Recent <span className="text-secondary">Stream</span></h2>
                                                <button className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary underline underline-offset-8 transition-colors">View All Logs</button>
                                            </div>
                                            <div className="grid gap-6">
                                                {[
                                                    { type: "order", label: "New Order", title: "40kg Grains Node", price: "₦120,000", time: "2h ago", status: "Awaiting Pickup" },
                                                    { type: "harvest", label: "Harvest Milestone", title: "Maize Plot Alpha - Ready in 4 days", price: null, time: "5h ago", status: "Optimal" },
                                                    { type: "payout", label: "Instant Payout", title: "Settlement #KD-882-X", price: "₦450,000", time: "Yesterday", status: "Completed" }
                                                ].map((item, i) => (
                                                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-secondary transition-all">
                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="w-16 h-16 bg-cream rounded-[2.2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0">
                                                                {item.type === 'order' ? <Package size={28} /> : item.type === 'harvest' ? <Sprout size={28} /> : <Wallet size={28} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{item.label}</p>
                                                                <h3 className="text-2xl font-black font-serif text-primary">{item.title}</h3>
                                                                {item.price && <p className="text-sm font-bold text-primary/40 mt-1 uppercase tracking-widest">{item.price}</p>}
                                                            </div>
                                                        </div>
                                                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0 border-primary/5">
                                                            <span className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">{item.status}</span>
                                                            <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest mt-3 italic">{item.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Smart Pricing Insight Snippet */}
                                        <section className="bg-primary p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
                                            <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                                <div className="space-y-4 max-w-lg text-center md:text-left">
                                                    <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Price <span className="text-secondary">Oracle</span></h3>
                                                    <p className="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-widest">Market demand for <span className="text-secondary font-bold">Maize</span> is surging. Consider increasing supply listed on the B2B portal by 15% for optimal revenue capture.</p>
                                                </div>
                                                <button onClick={() => setActiveTab('pricing')} className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl shrink-0">
                                                    Market Insights
                                                </button>
                                            </div>
                                        </section>
                                    </>
                                )}

                                {activeTab === "products" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif uppercase tracking-tighter">Inventory <span className="text-secondary">Vault</span></h2>
                                            <Link href="/dashboard/supplier/products/new" className="bg-primary text-white p-4 rounded-2xl shadow-xl hover:bg-secondary hover:text-primary transition-all">
                                                <Plus size={20} />
                                            </Link>
                                        </div>
                                        {/* Product List Content */}
                                        <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden p-10 space-y-8 text-center text-primary/30 italic font-black uppercase tracking-widest">
                                            No active listings found. Synchronize inventory to begin.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar - Advanced Systems */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Horizon 5.0 Toolbox */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black font-serif uppercase italic tracking-tight">Horizon <span className="text-secondary">5.0</span></h3>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 leading-relaxed italic">Advanced Production & Security Protocols</p>
                                    </div>

                                    <div className="grid gap-6">
                                        {[
                                            { label: "AI Agronomist", icon: Brain, color: "text-blue-500 bg-blue-50", action: () => setIsAgronomistOpen(true) },
                                            { label: "Yield-Shield", icon: ShieldCheck, color: "text-green-500 bg-green-50", action: () => handleAction("Yield-Shield") },
                                            { label: "Global Bridge", icon: Globe, color: "text-purple-500 bg-purple-50", action: () => handleAction("Global Bridge") },
                                            { label: "Mastery Node", icon: GraduationCap, color: "text-secondary bg-secondary/10", action: () => handleAction("Mastery Academy") },
                                        ].map((tool, i) => (
                                            <button key={i} onClick={tool.action} className="flex items-center justify-between p-6 rounded-3xl border border-primary/5 hover:border-secondary/20 hover:bg-cream/20 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                        <tool.icon size={20} />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest">{tool.label}</span>
                                                </div>
                                                <ArrowUpRight size={16} className="text-primary/10 group-hover:text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Network Status */}
                                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                    <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white animate-pulse" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-black font-serif italic uppercase">Node <span className="text-secondary underline decoration-2">Status</span></h4>
                                            <div className="flex gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Latency</p>
                                                <p className="text-sm font-black text-secondary">14ms</p>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Chain Health</p>
                                                <p className="text-sm font-black text-secondary">99.8%</p>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Verification</p>
                                                <p className="text-sm font-black text-secondary uppercase italic">Sovereign</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* AI Agronomist Modal (From Farmer) */}
            {isAgronomistOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsAgronomistOpen(false)} className="absolute top-10 right-10 text-primary/20 hover:text-primary transition-colors">
                            <X size={32} />
                        </button>
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-4xl font-black font-serif uppercase tracking-tight leading-none italic">AI <span className="text-secondary underline decoration-4">Agronomist</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mt-6 leading-relaxed">Neural analysis node for plant health & soil intelligence</p>
                        </div>
                        <div className="bg-cream/10 border-4 border-dashed border-primary/5 rounded-[3rem] p-16 text-center space-y-6 group hover:border-secondary transition-all cursor-pointer">
                            <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-primary/10 group-hover:text-secondary group-hover:scale-110 shadow-inner overflow-hidden relative">
                                <Camera size={40} />
                                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors" />
                            </div>
                            <div>
                                <p className="font-black text-lg uppercase tracking-widest">Capture Crop Node</p>
                                <p className="text-xs text-primary/30 font-bold mt-2 uppercase">Instant disease identification & treatment protocol</p>
                            </div>
                        </div>
                        <button className="w-full mt-10 bg-primary text-white py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-secondary hover:text-primary transition-all">
                            Initialize Global Brain Scan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}

function X({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
