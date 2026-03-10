"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Package,
    Truck,
    BarChart3,
    ArrowRight,
    Warehouse,
    Loader2,
    ShieldCheck,
    TrendingUp,
    Globe,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiUrl } from "@/lib/api";

export default function WholesalerDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        totalVolume: "45.2 Tons",
        activeShipments: 8,
        pendingQuotes: 12,
        savings: "₦1.2M"
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Hero Section */}
                        <div className="relative h-[400px] rounded-[4rem] overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2600&auto=format&fit=crop"
                                alt="Warehouse"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
                                <div className="space-y-4 text-white">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Warehouse className="w-3 h-3" /> Wholesaler Protocol
                                    </div>
                                    <h1 className="text-6xl font-black font-serif leading-tight">Bulk Supply <br /><span className="text-secondary italic">Command</span></h1>
                                </div>
                                <Link href="/shop" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center gap-3">
                                    Open Bulk Market <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Volume", value: stats.totalVolume, icon: BarChart3, color: "bg-blue-50 text-blue-600" },
                                { label: "In Transit", value: stats.activeShipments, icon: Truck, color: "bg-green-50 text-green-600" },
                                { label: "Open Quotes", value: stats.pendingQuotes, icon: FileText, color: "bg-secondary/20 text-secondary" },
                                { label: "Cost Savings", value: stats.savings, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Logistics Stream */}
                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Active <span className="text-secondary italic">Freight Stream</span></h2>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary underline underline-offset-8 transition-colors">Track All Routes</button>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { route: "Kano -> Lagos", load: "12.5 Tons Maize", status: "In Transit", eta: "4h 20m" },
                                        { route: "Benue -> Abuja", load: "3k Baskets Yams", status: "Loading", eta: "18h" },
                                        { route: "Jos -> Port Harcourt", load: "2 Tons Strawberries", status: "Cold-Chain Active", eta: "12h" }
                                    ].map((sh, i) => (
                                        <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-secondary/30 transition-all">
                                            <div className="flex gap-8 items-center w-full">
                                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                                    <Truck size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-2xl font-black font-serif">{sh.route}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{sh.load}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-secondary uppercase italic">{sh.status}</p>
                                                    <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">ETA: {sh.eta}</p>
                                                </div>
                                                <button className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary transition-all">
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Sidebar */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-primary rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden shadow-2xl">
                                    <Globe className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 rotate-12" />
                                    <div className="space-y-4 relative z-10">
                                        <h3 className="text-2xl font-black font-serif leading-tight">Global <span className="text-secondary italic">Trust Node</span></h3>
                                        <p className="text-cream/40 text-xs font-medium leading-relaxed">Your account is undergoing <span className="text-secondary font-bold font-serif italic uppercase">Export-Grade</span> verification. Complete the checklist to unlock EU/US supply nodes.</p>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        {[
                                            { label: "Business Registration", done: true },
                                            { label: "Warehouse Inspection", done: true },
                                            { label: "Phytosanitary Cert", done: false },
                                            { label: "Credit Trust Score", done: true }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-secondary text-primary' : 'bg-white/10 text-white/20 border border-white/10'}`}>
                                                    <ShieldCheck size={12} strokeWidth={3} />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.done ? 'text-white' : 'text-white/20'}`}>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full bg-secondary text-primary py-4 rounded-xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:bg-white transition-all shadow-xl">Complete Onboarding</button>
                                </div>

                                <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl space-y-6">
                                    <h3 className="text-xl font-black font-serif uppercase italic">Market <span className="text-secondary">Watch</span></h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Maize (Kano)", price: "₦850k/Ton", change: "+12%" },
                                            { name: "Sorghum (Kaduna)", price: "₦920k/Ton", change: "-2%" },
                                            { name: "White Beans (Jos)", price: "₦1.1M/Ton", change: "+5%" }
                                        ].map((m, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0">
                                                <span className="text-xs font-bold">{m.name}</span>
                                                <div className="text-right">
                                                    <p className="text-xs font-black">{m.price}</p>
                                                    <p className={`text-[8px] font-bold ${m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{m.change}</p>
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
        </div>
    );
}
