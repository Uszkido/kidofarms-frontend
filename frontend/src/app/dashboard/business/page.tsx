"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Building2,
    FileText,
    Truck,
    BarChart3,
    Clock,
    ShieldCheck,
    Plus,
    ArrowRight,
    Search,
    CreditCard,
    Briefcase
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BusinessDashboard() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-12">
                        {/* Corporate Header */}
                        <div className="bg-primary rounded-[4rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                            <Building2 className="absolute -bottom-10 -right-10 text-white/5 w-80 h-80 -rotate-12" />
                            <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
                                <span className="bg-secondary text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Corporate Entity</span>
                                <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter leading-none italic">
                                    B2B <span className="text-secondary">Procurement</span>
                                </h1>
                                <p className="text-white/40 font-bold text-sm tracking-widest uppercase italic">Client ID: BUSINESS-{(session?.user as any)?.id?.substring(0, 8) || "8842-X"}</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center md:items-end gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 text-center">
                                    <p className="text-4xl font-black font-serif text-secondary leading-none">₦4.2M</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Cycle Spend</p>
                                </div>
                                <button className="bg-secondary text-primary px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                    RFQ Request
                                </button>
                            </div>
                        </div>

                        {/* Top Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Standing Contracts", value: "3", icon: FileText },
                                { label: "Pending Deliveries", value: "12", icon: Truck },
                                { label: "Loyalty Points", value: "450k", icon: BarChart3 },
                                { label: "Last Audit", value: "Mar 08", icon: ShieldCheck },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-xl space-y-4 hover:border-secondary/20 transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-secondary transition-colors">
                                        <s.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Orders & Invoices */}
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Procurement Feed */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black font-serif uppercase italic tracking-tighter">Active <span className="text-secondary">Procurements</span></h2>
                                    <Link href="/shop" className="text-xs font-black uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors flex items-center gap-2">
                                        Bulk Catalog <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: "PRO-4921", vendor: "Kano Tomato Node", volume: "400kg", status: "In Transit", date: "Mar 10" },
                                        { id: "PRO-4882", vendor: "Grain Alliance", volume: "1.2 Tons", status: "Processing", date: "Mar 09" },
                                        { id: "PRO-4712", vendor: "Fish-Tech Hub", volume: "50kg Fillet", status: "Delivered", date: "Mar 07" }
                                    ].map((order, i) => (
                                        <div key={i} className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:scale-[1.02] transition-all">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-cream/30 rounded-3xl flex items-center justify-center text-primary shadow-inner">
                                                    <Briefcase size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{order.id} • {order.date}</p>
                                                    <h3 className="text-2xl font-black font-serif">{order.vendor}</h3>
                                                    <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">{order.volume}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <p className={`text-sm font-black uppercase italic ${order.status === 'Delivered' ? 'text-green-500' : 'text-secondary'}`}>{order.status}</p>
                                                    <p className="text-[10px] font-black text-primary/20 uppercase">Track Logistics</p>
                                                </div>
                                                <button className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                                    <ArrowRight size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Billing & Tax Docs */}
                            <div className="lg:col-span-4 space-y-10">
                                <div className="bg-white rounded-[4rem] p-10 border border-primary/5 shadow-2xl space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-black font-serif uppercase">Tax <span className="text-secondary italic">Invoices</span></h3>
                                        <button className="p-2 hover:bg-primary/5 rounded-xl text-primary/30 transition-all"><Search size={18} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { month: "February 2026", amount: "₦1.2M", id: "INV-02-26" },
                                            { month: "January 2026", amount: "₦0.8M", id: "INV-01-26" },
                                            { month: "December 2025", amount: "₦2.1M", id: "INV-12-25" }
                                        ].map((inv, i) => (
                                            <div key={i} className="flex justify-between items-center p-6 bg-cream/10 rounded-2xl group hover:bg-secondary/5 transition-all">
                                                <div>
                                                    <p className="text-xs font-black uppercase text-primary">{inv.month}</p>
                                                    <p className="text-[10px] font-bold text-primary/30">{inv.id}</p>
                                                </div>
                                                <button className="text-primary/20 group-hover:text-secondary transition-colors">
                                                    <FileText size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 border-2 border-dashed border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/20 hover:text-secondary hover:border-secondary transition-all">Download All Statements</button>
                                </div>

                                <div className="bg-secondary rounded-[4rem] p-10 text-primary shadow-2xl space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <CreditCard size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Corporate Credit</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-5xl font-black font-serif italic leading-none truncate">₦2,500,000</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Available Credit Line</p>
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-primary" />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-primary/40">Utilization: 33% • Payment Due: Mar 15</p>
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
