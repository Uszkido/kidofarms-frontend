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
    Star,
    PlusCircle,
    Download
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function BuyerDashboard() {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    // States from Consumer
    const [cards, setCards] = useState<any[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [trackingId, setTrackingId] = useState("");
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [wallet, setWallet] = useState<any>(null);
    const [walletTxs, setWalletTxs] = useState<any[]>([]);
    const [loadingWallet, setLoadingWallet] = useState(true);

    // B2B States
    const [rfqs, setRfqs] = useState<any[]>([]);

    // Tab State
    const [activeTab, setActiveTab] = useState("overview");

    // Role Logic
    const isSubscriber = userRole === 'subscriber' || userRole === 'admin';
    const isBusiness = ['business', 'wholesale_buyer', 'retailer', 'hotel', 'admin'].includes(userRole);
    const isWholesaler = userRole === 'wholesale_buyer' || userRole === 'admin';

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchWallet();
            fetchCards();
            if (isBusiness) fetchRFQs();
        }
    }, [(session?.user as any)?.id, isBusiness]);

    const fetchWallet = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/wallet?userId=${(session?.user as any)?.id}`));
            const data = await res.json();
            setWallet(data.wallet);
            setWalletTxs(data.transactions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingWallet(false);
        }
    };

    const fetchCards = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/cards?userId=${(session?.user as any)?.id}`));
            const data = await res.json();
            if (Array.isArray(data)) setCards(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCards(false);
        }
    };

    const fetchRFQs = async () => {
        // Placeholder for RFQ fetch
        setRfqs([
            { id: "RFQ-902", product: "Bulk Maize Nodes", volume: "2.4 Tons", status: "Negotiating", date: "Oct 28" },
            { id: "RFQ-881", product: "Industrial Yam Batch", volume: "500kg", status: "Contracted", date: "Oct 22" }
        ]);
    };

    const handleTrack = async () => {
        if (!trackingId) return;
        setTrackingLoading(true);
        setTimeout(() => {
            setTrackingResult({
                id: trackingId,
                status: "In Transit",
                location: "Kano Dispatch Hub",
                oxygen: "98%",
                temp: "18°C",
                eta: "Tomorrow, 2:00 PM"
            });
            setTrackingLoading(false);
        }, 1500);
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

                        {/* Mixed Dynamic Hero Section */}
                        <header className={`relative py-12 md:py-16 px-6 md:px-12 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group transition-all duration-[2000ms] ${isBusiness ? 'bg-primary' : isSubscriber ? 'bg-[#102018]' : 'bg-secondary'}`}>
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-white/5 -skew-x-12 translate-x-1/2 group-hover:bg-white/10 transition-all duration-1000" />
                            <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-10 animate-pulse" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 shadow-2xl ${isBusiness ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
                                        {isBusiness ? <Building2 size={14} /> : isSubscriber ? <Leaf size={14} className="text-secondary" /> : <Heart size={14} />}
                                        {isBusiness ? 'B2B Procurement Command' : isSubscriber ? 'Elite Harvest Membership' : 'Standard Consumption Node'}
                                    </div>
                                    <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black font-serif tracking-tighter leading-none ${isBusiness || isSubscriber ? 'text-white' : 'text-primary'}`}>
                                        Hello, <br />
                                        <span className={`italic ${isBusiness ? 'text-secondary' : isSubscriber ? 'text-secondary' : 'text-white'}`}>
                                            {isWholesaler ? 'Partner' : isBusiness ? 'Client' : isSubscriber ? 'Member' : 'Shopper'}
                                        </span>
                                    </h1>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/shop" className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3 hover:scale-105 ${isBusiness || isSubscriber ? 'bg-secondary text-primary hover:bg-white' : 'bg-primary text-white hover:bg-white hover:text-primary'}`}>
                                            <ShoppingBag size={18} /> Access Harvest Nodes
                                        </Link>
                                    </div>
                                </div>

                                <div className="hidden md:flex justify-end">
                                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 w-full max-w-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isBusiness || isSubscriber ? 'text-secondary' : 'text-primary'}`}>Consumption Credits</p>
                                                <p className="text-4xl font-black font-serif text-white leading-none">₦{Number(wallet?.balance || 0).toLocaleString()}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isBusiness || isSubscriber ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
                                                <Wallet size={24} />
                                            </div>
                                        </div>
                                        {isSubscriber && (
                                            <div className="pt-6 border-t border-white/10 flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest italic text-center w-full">
                                                <div className="flex flex-col gap-1 items-center w-full">
                                                    <p className="text-[8px] opacity-40">Next Premium Basket Sync In</p>
                                                    <p className="text-3xl font-black font-serif text-secondary leading-none">72h</p>
                                                </div>
                                            </div>
                                        )}
                                        <button onClick={() => handleAction("Fund Wallet")} className="w-full bg-white text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl font-sans mt-auto">
                                            Refill Node Credits
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Sustainability Impact Bar */}
                        <div className="bg-white border border-primary/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-10 shadow-lg">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary shadow-lg">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black font-serif italic text-primary uppercase leading-tight">Your Kido <span className="text-secondary tracking-tighter">Impact Score</span></h4>
                                    <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest leading-relaxed">Sovereign consumption has saved <span className="text-primary font-bold">12kg of CO2</span> and supported <span className="text-primary font-bold">3 farm families</span>.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center px-8 py-2 border-l border-primary/10">
                                    <p className="text-3xl font-black font-serif text-primary italic font-sans leading-none">12kg</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/20 mt-1">CO2 Saved</p>
                                </div>
                                <div className="text-center px-8 py-2 border-l border-primary/10">
                                    <p className="text-3xl font-black font-serif text-primary italic font-sans leading-none">84%</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/20 mt-1">Sustainability</p>
                                </div>
                            </div>
                        </div>

                        {/* Module Navigator */}
                        <div className="flex border-b border-primary/5 gap-8 overflow-x-auto no-scrollbar scroll-smooth">
                            {[
                                { id: "overview", label: "Commerce Node", icon: LayoutDashboard },
                                { id: "subscriptions", label: "Elite Baskets", icon: Leaf, hidden: !isSubscriber },
                                { id: "procurement", label: "B2B Procurement", icon: Briefcase, hidden: !isBusiness },
                                { id: "orders", label: "Order Vault", icon: Clock },
                                { id: "wallet", label: "Financial Registry", icon: CreditCard },
                                { id: "oracle", label: "Market Oracle", icon: Zap },
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

                        {/* Dynamic Feed Content */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Main Display Area */}
                            <div className="lg:col-span-8 space-y-12">
                                {activeTab === "overview" && (
                                    <>
                                        {/* Tracking Module */}
                                        <section className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 right-0 w-full h-full opacity-5">
                                                <Search className="w-80 h-80 absolute -top-20 -right-20 rotate-12" />
                                            </div>
                                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                                <div className="space-y-6">
                                                    <h2 className="text-2xl md:text-3xl font-black font-serif leading-none italic uppercase">Where is my <br /><span className="text-secondary italic">Harvest?</span></h2>
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">Enter tracking node ID to see real-time oxygen/cold-chain metrics.</p>
                                                    <div className="flex gap-2 p-2 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                                        <input
                                                            className="bg-transparent border-none outline-none flex-grow px-4 py-2 text-white placeholder:text-white/20 font-sans text-xs font-black uppercase tracking-widest"
                                                            placeholder="KIDO-NODE-XXXX"
                                                            value={trackingId}
                                                            onChange={(e) => setTrackingId(e.target.value)}
                                                        />
                                                        <button
                                                            onClick={handleTrack}
                                                            disabled={trackingLoading}
                                                            className="bg-secondary text-primary px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                                                        >
                                                            {trackingLoading ? <Loader2 size={16} className="animate-spin" /> : "Sync Node"}
                                                        </button>
                                                    </div>
                                                </div>

                                                {trackingResult ? (
                                                    <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 space-y-6 animate-in fade-in slide-in-from-right-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-secondary">Real-time Telemetry</p>
                                                                <p className="text-xl font-black font-serif italic text-white uppercase">{trackingResult.location}</p>
                                                            </div>
                                                            <button onClick={() => setTrackingResult(null)}><X size={18} className="text-white/20 hover:text-white transition-colors" /></button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-white/30 mb-1">Cold-Chain Temp</p>
                                                                <p className="text-sm font-black text-secondary uppercase font-sans">{trackingResult.temp}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase text-white/30 mb-1">O2 Saturation</p>
                                                                <p className="text-sm font-black text-secondary uppercase font-sans">{trackingResult.oxygen}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center py-10 opacity-10">
                                                        <Globe size={120} className="animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Activity Log */}
                                        <section className="space-y-8">
                                            <div className="flex justify-between items-center px-4">
                                                <h2 className="text-3xl font-black font-serif uppercase italic tracking-tighter">Recent <span className="text-secondary">Stream</span></h2>
                                                <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-secondary underline underline-offset-8 transition-colors">Vault History</button>
                                            </div>
                                            <div className="grid gap-6">
                                                {[
                                                    { id: "ORD-ALPHA", title: "Premium Saffron Node", price: "₦42,000", status: "In Transit", date: "Oct 28", items: "2 Units" },
                                                    { id: "ORD-BETA", title: "Cold Pressed Olive Oil", price: "₦12,800", status: "Delivered", date: "Oct 24", items: "1 Unit" }
                                                ].map((order, i) => (
                                                    <div key={i} className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-secondary transition-all">
                                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                                            <div className="w-16 h-16 bg-cream rounded-[2.2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-colors shrink-0">
                                                                <Package size={28} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-1">{order.id} • {order.items}</p>
                                                                <h3 className="text-2xl font-black font-serif text-primary uppercase italic">{order.title}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0 border-primary/5">
                                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>{order.status}</span>
                                                            <p className="text-xl font-black font-serif italic text-primary mt-3">{order.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </>
                                )}

                                {activeTab === "subscriptions" && isSubscriber && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-[#102018] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-white space-y-10 relative overflow-hidden shadow-2xl">
                                            <Leaf className="absolute -bottom-10 -right-10 w-80 h-80 text-secondary/5 rotate-12" />
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                                <div className="space-y-6">
                                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                        Elite Harvest Node
                                                    </div>
                                                    <h3 className="text-3xl md:text-5xl font-black font-serif leading-none italic uppercase tracking-tighter">Your Weekly <br /><span className="text-secondary italic">Farm Basket</span></h3>
                                                    <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-relaxed italic max-w-sm">Synchronized with Jos Regional Node. Next premium harvest batch scheduled for preparation on Monday.</p>
                                                </div>
                                                <div className="text-center md:text-right space-y-6">
                                                    <div className="inline-block p-10 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl relative group">
                                                        <div className="absolute inset-0 border-4 border-secondary/20 rounded-full animate-spin duration-[5000ms] border-t-secondary" />
                                                        <p className="text-[9px] font-black uppercase text-secondary/40 italic">ETA</p>
                                                        <p className="text-5xl font-black font-serif mt-1">72h</p>
                                                    </div>
                                                    <button onClick={() => handleAction("Skip Week")} className="block w-full bg-secondary text-primary py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl">Skip Next Delivery Cycle</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl space-y-8 group hover:border-secondary transition-all">
                                                <div className="w-16 h-16 bg-cream rounded-3xl flex items-center justify-center text-primary shadow-inner">
                                                    <RefreshCw size={32} />
                                                </div>
                                                <h4 className="text-3xl font-black font-serif italic uppercase tracking-tighter">Basket <span className="text-secondary">Logic</span></h4>
                                                <p className="text-primary/30 text-[9px] font-black uppercase tracking-widest">Currently optimized for Root Tubers & Exotic Spices.</p>
                                                <Link href="/dashboard/buyer/basket" className="inline-block pt-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 border-secondary">Configure Node Contents</Link>
                                            </div>
                                            <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-2xl space-y-8 group hover:border-secondary transition-all">
                                                <div className="w-16 h-16 bg-cream rounded-3xl flex items-center justify-center text-primary shadow-inner">
                                                    <Calendar size={32} />
                                                </div>
                                                <h4 className="text-3xl font-black font-serif italic uppercase tracking-tighter">Delivery <span className="text-secondary">Nodes</span></h4>
                                                <p className="text-primary/30 text-[9px] font-black uppercase tracking-widest">Scheduled Node Sync: Tuesdays @ 09:00 AM</p>
                                                <button onClick={() => handleAction("Modify Schedule")} className="inline-block pt-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 border-secondary">Update Delivery Frequency</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "procurement" && isBusiness && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex justify-between items-center px-4">
                                            <h2 className="text-3xl font-black font-serif text-primary uppercase italic tracking-tighter">B2B <span className="text-secondary">Procurement Node</span></h2>
                                            <button onClick={() => handleAction("New RFQ Batch")} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">Initiate New RFQ</button>
                                        </div>
                                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl overflow-hidden p-6 md:p-10">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px]">
                                                    <thead>
                                                        <tr className="border-b border-primary/5 text-[9px] font-black uppercase tracking-[0.3em] text-primary/20 text-left">
                                                            <th className="px-6 py-6 font-black">Contract Node</th>
                                                            <th className="px-6 py-6 font-black">Batch Vol</th>
                                                            <th className="px-6 py-6 text-right font-black">Terminal Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-primary/5">
                                                        {rfqs.map((rfq, i) => (
                                                            <tr key={i} className="group hover:bg-cream/30 transition-all cursor-pointer">
                                                                <td className="px-6 py-8">
                                                                    <p className="font-black font-serif text-2xl italic uppercase tracking-tighter text-primary">{rfq.product}</p>
                                                                    <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1">Registry Ref: {rfq.id}</p>
                                                                </td>
                                                                <td className="px-6 py-8">
                                                                    <span className="bg-neutral-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-primary/5">{rfq.volume}</span>
                                                                </td>
                                                                <td className="px-6 py-8 text-right">
                                                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${rfq.status === 'Contracted' ? 'bg-green-500 text-white shadow-lg' : 'bg-primary text-white animate-pulse'}`}>{rfq.status}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "wallet" && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                        {/* Financial Node Snapshot */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] border border-primary/5 shadow-2xl space-y-10">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-2xl md:text-3xl font-black font-serif italic uppercase tracking-tighter text-primary">Kido <span className="text-secondary italic">Wallet</span></h3>
                                                    <div className="w-16 h-16 bg-secondary text-primary rounded-3xl flex items-center justify-center shadow-2xl shrink-0">
                                                        <Wallet size={32} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Active Liquid Node Balance</p>
                                                    <p className="text-3xl sm:text-5xl md:text-6xl font-black font-serif text-primary italic font-sans leading-none tracking-tighter">₦{Number(wallet?.balance || 0).toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => handleAction("Recharge Protocol")} className="w-full bg-primary text-secondary py-6 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:bg-secondary hover:text-primary transition-all font-sans">Initialize Credit Refill</button>
                                            </div>
                                            <div className="bg-primary p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] shadow-2xl text-white space-y-10 relative overflow-hidden group">
                                                <Download className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:rotate-12 transition-transform duration-1000" />
                                                <h3 className="text-2xl md:text-3xl font-black font-serif italic uppercase tracking-tighter leading-none">Access <br /><span className="text-secondary">Financial Registry</span></h3>
                                                <div className="space-y-6">
                                                    {[
                                                        { label: "Annual Tax Ledger", status: "Ready" },
                                                        { label: "B2B Requisition History", status: "Generated" }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                                                            <span className="text-secondary text-[8px] font-black uppercase tracking-widest">{item.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="w-full py-5 border-4 border-dashed border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white transition-all">Download Audit Node</button>
                                            </div>
                                        </div>

                                        {/* Transaction Ledger */}
                                        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-primary/5 shadow-2xl p-6 md:p-10 space-y-8">
                                            <div className="flex justify-between items-center px-4">
                                                <h3 className="text-2xl md:text-3xl font-black font-serif italic uppercase text-primary">Transaction <span className="text-secondary">Telemetry</span></h3>
                                                <Clock size={24} className="text-primary/10 hidden md:block" />
                                            </div>
                                            <div className="space-y-4">
                                                {walletTxs.length > 0 ? walletTxs.map((tx, i) => (
                                                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 md:p-8 bg-neutral-50 rounded-[2rem] md:rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all group gap-4 border border-transparent hover:border-secondary/20">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500 text-white' : 'bg-primary text-white'} shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                                                                {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-lg md:text-xl font-black font-serif italic uppercase text-primary leading-tight">{tx.description}</p>
                                                                <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1 italic">{new Date(tx.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <p className={`text-xl md:text-2xl font-black font-serif italic ${tx.type === 'credit' ? 'text-green-600' : 'text-primary'}`}>
                                                            {tx.type === 'credit' ? '+' : '-'} ₦{Number(tx.amount).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )) : (
                                                    <div className="py-24 text-center">
                                                        <Activity className="mx-auto text-primary/5 mb-6" size={64} />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 italic">No Registry Data Detected.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Section */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Saved Cards Node */}
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-10">
                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-2xl font-black font-serif italic uppercase text-primary">Card <span className="text-secondary underline underline-offset-4 decoration-2">Nodes</span></h3>
                                        <button onClick={() => setIsAddCardOpen(true)} className="p-3 bg-primary text-secondary rounded-2xl hover:scale-110 transition-all shadow-xl"><Plus size={18} /></button>
                                    </div>
                                    <div className="space-y-6">
                                        {cards.length > 0 ? cards.map((card, i) => (
                                            <div key={i} className="bg-gradient-to-br from-[#102018] to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                                                <div className="space-y-8 relative z-10">
                                                    <div className="flex justify-between items-start">
                                                        <CreditCard className="text-secondary" size={24} />
                                                        <p className="text-[10px] font-black italic uppercase tracking-[0.2em]">{card.cardBrand}</p>
                                                    </div>
                                                    <p className="text-lg font-sans font-black tracking-[0.3em]">•••• •••• •••• {card.last4}</p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[7px] font-black uppercase text-white/30 italic">Expiry</p>
                                                            <p className="text-[10px] font-black uppercase">{card.expiry}</p>
                                                        </div>
                                                        <Fingerprint size={24} className="text-secondary opacity-40" />
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-16 text-center bg-cream/20 border-4 border-dashed border-primary/5 rounded-[3rem] group hover:border-secondary transition-all cursor-pointer" onClick={() => setIsAddCardOpen(true)}>
                                                <PlusCircle className="mx-auto text-primary/5 group-hover:text-secondary group-hover:scale-110 transition-all" size={48} />
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/20 mt-4 italic">Initialize Card Registry</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Refer & Earn Node */}
                                <div className="bg-secondary rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-primary space-y-10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black font-serif italic uppercase leading-none">Refer & <br /><span className="underline decoration-4">Earn Credits</span></h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed italic opacity-60">Broadcast your referral node ID. Get ₦500 for every active member node you materialize.</p>
                                    </div>
                                    <div className="p-6 bg-white/40 rounded-2xl border border-white/60 text-center relative z-10">
                                        <p className="font-sans font-black tracking-[0.3em] text-sm uppercase">KIDO-REF-2026</p>
                                    </div>
                                    <button onClick={() => handleAction("Broadcast Referral")} className="w-full bg-primary text-secondary py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-white hover:text-primary transition-all">Broadcast Node ID</button>
                                </div>

                                {/* Security Notification Console */}
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-2xl space-y-8">
                                    <h3 className="text-xl font-black font-serif italic uppercase px-2 text-primary">Security <span className="text-secondary">Alerts</span></h3>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Device Sync", desc: "Hardware lock active on Node #SH-XX.", type: "security" },
                                            { title: "Escrow Released", desc: "Batch #KB-902 settlement complete.", type: "financial" }
                                        ].map((alert, i) => (
                                            <div key={i} className="flex gap-4 p-4 border-b border-primary/5 last:border-0 pb-6">
                                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary shrink-0">
                                                    {alert.type === 'security' ? <ShieldCheck size={18} /> : <Zap size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-tight text-primary leading-none italic">{alert.title}</p>
                                                    <p className="text-[9px] font-medium text-primary/30 leading-relaxed uppercase">{alert.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Modals Bridge */}
            {isAddCardOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-primary/95 backdrop-blur-2xl">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => setIsAddCardOpen(false)} className="absolute top-12 right-12 text-primary/10 hover:text-primary transition-colors">
                            <X size={32} />
                        </button>
                        <div className="text-center mb-10 space-y-4">
                            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-4xl font-black font-serif italic uppercase tracking-tighter leading-none">Card <span className="text-secondary">Registry</span></h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 italic">Authorized Secure Protocol Gateway</p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddCardOpen(false); alert("Financial Node Securely Linked."); }}>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Registry Name</label>
                                <input required placeholder="J. DOE" className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black uppercase tracking-widest text-xs" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Primary Node Identifier</label>
                                <input required placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-sans font-black tracking-widest text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">Entropy Expiry</label>
                                    <input required placeholder="MM/YY" className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/30 ml-6 italic">CVV Vector</label>
                                    <input required placeholder="***" className="w-full bg-neutral-50 border border-primary/5 rounded-2xl px-6 py-4 outline-none focus:border-secondary font-black text-xs" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary text-secondary py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-secondary hover:text-primary transition-all font-sans font-sans">
                                Authorize Sovereign Linking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function LayoutDashboard({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
}

function Fingerprint({ size, className }: any) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 10a2 2 0 0 0-2 2c0 .245.044.48.125.7a2 2 0 0 0 3.75 0c.081-.22.125-.455.125-.7a2 2 0 0 0-2-2Z" /><path d="M12 2a10 10 0 0 0-10 10c0 1.25.21 2.45.6 3.6" /><path d="M12 22a10 10 0 0 0 10-10c0-1.25-.21-2.45-.6-3.6" /><path d="M12 14v4" /><path d="M8 12v2" /><path d="M16 12v2" /><path d="M12 6a6 6 0 0 1 6 6c0 .82-.16 1.6-.47 2.3" /><path d="M6.47 9.7A6 6 0 0 1 12 6" /></svg>;
}
