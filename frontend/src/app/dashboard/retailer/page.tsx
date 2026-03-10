"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Store,
    ShoppingCart,
    ArrowRight,
    LayoutDashboard,
    Tag,
    BarChart3,
    Package,
    TrendingUp,
    ShieldCheck,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function RetailerDashboard() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Hero */}
                        <div className="bg-white rounded-[4rem] p-12 md:p-16 border border-primary/5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-32 translate-x-32" />
                            <div className="space-y-6 relative z-10 max-w-xl">
                                <span className="bg-primary/5 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/5">Retail Protocol Active</span>
                                <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter leading-none">
                                    Local <span className="text-secondary italic">Inventory</span> Command
                                </h1>
                                <p className="text-primary/40 font-bold text-sm tracking-widest uppercase italic">Node: {session?.user?.name || "Retail Partner"}</p>
                                <div className="pt-4">
                                    <Link href="/shop" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl inline-flex items-center gap-4">
                                        Restock Inventory <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                            <div className="relative z-10 shrink-0">
                                <div className="w-48 h-48 md:w-64 md:h-64 bg-secondary rounded-[3rem] shadow-2xl flex items-center justify-center text-primary group hover:rotate-3 transition-transform">
                                    <Store size={80} />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Monthly Spand", value: "₦1.4M", icon: TrendingUp },
                                { label: "Stock Levels", value: "78%", icon: Package },
                                { label: "Active Orders", value: "3", icon: ShoppingCart },
                                { label: "Profit Delta", value: "+22%", icon: BarChart3 },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-xl space-y-4 hover:shadow-2xl transition-all">
                                    <div className="w-12 h-12 bg-cream/30 rounded-2xl flex items-center justify-center text-primary">
                                        <s.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory & Marketplace Focus */}
                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 bg-white/50 backdrop-blur-md border border-white rounded-[4rem] p-12 shadow-2xl space-y-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black font-serif uppercase italic tracking-tight">Active <span className="text-secondary">Restocks</span></h2>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary underline underline-offset-8 transition-colors">Order History</button>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { item: "Organic Tomato Crate", qty: "12 Units", price: "₦45,000", status: "In Transit" },
                                        { item: "Fresh Cabbage Mix", qty: "5 Bags", price: "₦12,500", status: "Delivered" },
                                        { item: "White Onion (Sacks)", qty: "10 Sacks", price: "₦120,000", status: "Processing" }
                                    ].map((order, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm group hover:border-secondary/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                                                    <Tag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black font-serif">{order.item}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{order.qty} • {order.price}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-500' : 'bg-secondary/20 text-secondary'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-primary rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between min-h-[400px]">
                                    <ShieldCheck className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 rotate-12" />
                                    <div className="space-y-6 relative z-10">
                                        <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Retailer <br />Trust Badges</h3>
                                        <p className="text-cream/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Display these on your storefront to show your customers you source directly from the Kido Farm Network.</p>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><ShieldCheck className="text-secondary" /></div>
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><MapPin className="text-secondary" /></div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-secondary text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest relative z-10 hover:bg-white transition-all shadow-xl">Get Marketing Kit</button>
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
