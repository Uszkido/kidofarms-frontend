"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Package,
    Truck,
    Clock,
    Heart,
    Search,
    Filter,
    ArrowRight,
    CreditCard,
    ShieldCheck,
    Plus,
    X,
    Loader2,
    Globe,
    Calendar,
    Settings,
    Leaf,
    RefreshCw,
    ChevronRight,
    AlertCircle,
    Building2,
    Briefcase,
    FileText,
    BarChart3,
    Dna,
    Activity,
    Zap,
    Wallet,
    ShoppingBag,
    Star
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function BuyerDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // States
    const [activeTab, setActiveTab] = useState("overview");
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Role Logic
    const isSubscriber = userRole === 'subscriber' || userRole === 'admin';
    const isBusiness = ['business', 'wholesale_buyer', 'retailer', 'hotel', 'admin'].includes(userRole);
    const isWholesaler = userRole === 'wholesale_buyer' || userRole === 'admin';

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchDashboardData();
        }
    }, [(session?.user as any)?.id]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/wallet?userId=${(session?.user as any)?.id}`));
            const data = await res.json();
            setWallet(data.wallet);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (label: string) => {
        alert(`${label} protocol initiated. Node synchronization in progress.`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Dynamic Hero Section */}
                        <header className={`relative py-16 px-12 rounded-[4rem] overflow-hidden shadow-2xl group transition-all duration-700 ${isBusiness ? 'bg-primary' : 'bg-secondary'}`}>
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-white/5 -skew-x-12 translate-x-1/2 group-hover:bg-white/10 transition-all duration-1000" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl ${isBusiness ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
                                        {isBusiness ? <Building2 size={14} /> : <Heart size={14} />}
                                        {isBusiness ? 'B2B Procurement Node' : 'Direct Consumer Access'}
                                    </div>
                                    <h1 className={`text-5xl md:text-8xl font-black font-serif tracking-tighter leading-none ${isBusiness ? 'text-white' : 'text-primary'}`}>
                                        Hello, <br />
                                        <span className={`italic ${isBusiness ? 'text-secondary' : 'text-white'}`}>
                                            {isWholesaler ? 'Partner' : isBusiness ? 'Client' : isSubscriber ? 'Member' : 'Shopper'}
                                        </span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/shop" className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3 hover:scale-105 ${isBusiness ? 'bg-secondary text-primary hover:bg-white' : 'bg-primary text-white hover:bg-white hover:text-primary'}`}>
                                            <ShoppingBag size={18} /> Browse Harvest
                                        </Link>
                                        {isWholesaler && (
                                            <button onClick={() => handleAction("Request RFQ")} className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-3 backdrop-blur-md">
                                                <FileText size={18} /> Request RFQ
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 w-full max-w-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isBusiness ? 'text-secondary' : 'text-primary'}`}>Consumption Balance</p>
                                                <p className="text-4xl font-black font-serif text-white leading-none">₦{wallet?.balance || "0.00"}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isBusiness ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
                                                <Wallet size={24} />
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/10 flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest">
                                            <span>Tier: {userRole?.toUpperCase()}</span>
                                            {isSubscriber && <span className="text-secondary">Next Delivery: 72h</span>}
                                        </div>
                                        <button onClick={() => handleAction("Fund Wallet")} className="w-full bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl">
                                            Recharge Node
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "overview", label: "Overview", icon: LayoutDashboard },
                                { id: "subscriptions", label: "Farm Baskets", icon: Leaf, hidden: !isSubscriber },
                                { id: "procurements", label: "B2B Procurement", icon: Briefcase, hidden: !isBusiness },
                                { id: "orders", label: "Order Vault", icon: Clock },
                                { id: "payments", label: "Billing & Cards", icon: CreditCard },
                                { id: "oracle", label: "Pricing Engine", icon: Zap }
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

                        {/* Content Area */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Main Column */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "overview" && (
                                    <>
                                        {/* Tracking Section */}
                                        <section className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-xl space-y-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                                    <Truck size={28} />
                                                </div>
                                                <h3 className="text-3xl font-black font-serif italic uppercase">Live <span className="text-secondary underline decoration-2">Tracking</span></h3>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    placeholder="Enter Shipment ID (e.g. KIDO-SHP-X)"
                                                    className="w-full bg-cream/10 border border-primary/10 rounded-[2rem] px-8 py-6 outline-none focus:border-secondary transition-all font-bold text-sm text-primary"
                                                />
                                                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-secondary transition-all shadow-xl">
                                                    Sync Mesh
                                                </button>
                                            </div>
                                        </section>

                                        {/* Recent Activity */}
                                        <section className="space-y-8">
                                            <div className="flex justify-between items-center px-4">
                                                <h2 className="text-3xl font-black font-serif uppercase italic tracking-tighter">Recent <span className="text-secondary">Stream</span></h2>
                                                <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary underline underline-offset-8 transition-colors">Full History</button>
                                            </div>
                                            <div className="grid gap-6">
                                                {[
                                                    { id: "ORD-991", title: "Fresh Veggie Cluster", price: "₦12,400", status: "Delivered", date: "Oct 24" },
                                                    { id: "ORD-882", title: "Bulk Grain Node", price: "₦402,000", status: "In Transit", date: "Oct 22" }
                                                ].map((order, i) => (
                                                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-secondary transition-all">
                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="w-16 h-16 bg-cream rounded-[2.2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0">
                                                                <Package size={28} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-1">{order.id} • {order.date}</p>
                                                                <h3 className="text-2xl font-black font-serif text-primary">{order.title}</h3>
                                                                <p className="text-sm font-bold text-primary/40 mt-1 uppercase tracking-widest">{order.price}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0 border-primary/5">
                                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-secondary text-primary'}`}>{order.status}</span>
                                                            <button className="text-primary/20 hover:text-secondary mt-3 hidden md:block transition-colors"><ChevronRight size={24} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </>
                                )}

                                {activeTab === "subscriptions" && isSubscriber && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-primary p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Elite <span className="text-secondary">Farm Basket</span></h3>
                                                    <p className="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-widest">Customized weekly deliveries directly from the heart of the farm.</p>
                                                </div>
                                                <Link href="/dashboard/buyer/basket" className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl shrink-0">
                                                    Configure Basket
                                                </Link>
                                            </div>
                                        </div>
                                        {/* Subscription detail cards */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl space-y-6">
                                                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                                    <Calendar size={28} />
                                                </div>
                                                <h4 className="text-2xl font-black font-serif">Delivery Schedule</h4>
                                                <p className="text-sm text-primary/40 font-bold uppercase tracking-widest">Every Tuesday Morning</p>
                                                <button onClick={() => handleAction("Manage Schedule")} className="text-primary font-black text-[9px] uppercase tracking-[0.2em] border-b-2 border-secondary pb-1">Modify Frequency</button>
                                            </div>
                                            <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-xl space-y-6">
                                                <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-primary">
                                                    <RefreshCw size={28} />
                                                </div>
                                                <h4 className="text-2xl font-black font-serif">Skip Management</h4>
                                                <p className="text-sm text-primary/40 font-bold uppercase tracking-widest">Going on vacation? Skip next week easily.</p>
                                                <button onClick={() => handleAction("Skip Next Delivery")} className="text-red-500 font-black text-[9px] uppercase tracking-[0.2em] border-b-2 border-red-200 pb-1">Skip Cycle</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Area */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Trust & DNA Nodes */}
                                <div className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <h3 className="text-2xl font-black font-serif uppercase italic tracking-tight">Buyer <span className="text-secondary">Protocols</span></h3>

                                    <div className="grid gap-6">
                                        {[
                                            { label: "Provenance Registry", icon: Dna, color: "text-blue-500 bg-blue-50", detail: "Verify legacy batch DNA" },
                                            { label: "Price Transparency", icon: Zap, color: "text-secondary bg-secondary/10", detail: "Oracle-verified rates" },
                                            { label: "Secure Escrow", icon: ShieldCheck, color: "text-green-500 bg-green-50", detail: "Funds protected via Echelon II" },
                                            { label: "Verified Member", icon: Star, color: "text-amber-500 bg-amber-50", detail: "Status: Active Sovereign" },
                                        ].map((node, i) => (
                                            <div key={i} className="flex items-start gap-5 p-5 border border-primary/5 rounded-3xl hover:bg-cream/20 transition-all cursor-pointer group">
                                                <div className={`w-12 h-12 rounded-2xl ${node.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                    <node.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest">{node.label}</p>
                                                    <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mt-1">{node.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Hub Quick Access */}
                                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => handleAction("Support Hub")}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                                            <Activity size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black font-serif italic uppercase">Support <span className="text-secondary underline underline-offset-4 decoration-2">Protocol</span></h4>
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-relaxed">Instant terminal access for dispute resolution and order assistance.</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                            Initialize Channel <ArrowRight size={14} />
                                        </button>
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

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}
