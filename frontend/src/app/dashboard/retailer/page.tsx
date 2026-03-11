"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Store, ShoppingCart, ArrowRight, Tag, BarChart3,
    Package, TrendingUp, ShieldCheck, MapPin, ChevronRight,
    RotateCcw, Bell, Star, X, Check
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ReportIssueModal from "@/components/ReportIssueModal";
import { motion, AnimatePresence } from "framer-motion";

const restocks = [
    { id: "RET-101", item: "Organic Tomato Crate", qty: "12 Units", price: "₦45,000", status: "In Transit", category: "Vegetables" },
    { id: "RET-102", item: "Fresh Cabbage Mix", qty: "5 Bags", price: "₦12,500", status: "Delivered", category: "Vegetables" },
    { id: "RET-103", item: "White Onion (Sacks)", qty: "10 Sacks", price: "₦120,000", status: "Processing", category: "Root Crops" }
];

export default function RetailerDashboard() {
    const { data: session } = useSession();
    const [showRestock, setShowRestock] = useState(false);

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
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setShowRestock(true)}
                                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-2xl inline-flex items-center gap-4"
                                    >
                                        Restock Inventory <ArrowRight size={20} />
                                    </button>
                                    <Link href="/shop" className="bg-cream text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-xl inline-flex items-center gap-4">
                                        Browse Market
                                    </Link>
                                </div>
                            </div>
                            <div className="relative z-10 shrink-0">
                                <div className="w-48 h-48 md:w-64 md:h-64 bg-secondary rounded-[3rem] shadow-2xl flex items-center justify-center text-primary hover:rotate-3 transition-transform">
                                    <Store size={80} />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Monthly Spend", value: "₦1.4M", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
                                { label: "Stock Levels", value: "78%", icon: Package, color: "bg-green-50 text-green-600" },
                                { label: "Active Orders", value: String(restocks.filter(r => r.status !== 'Delivered').length), icon: ShoppingCart, color: "bg-secondary/10 text-secondary" },
                                { label: "Profit Delta", value: "+22%", icon: BarChart3, color: "bg-purple-50 text-purple-600" },
                            ].map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-xl space-y-4 hover:shadow-2xl transition-all">
                                    <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center`}>
                                        <s.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif uppercase">{s.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Restocks */}
                            <div className="lg:col-span-8 bg-white/50 backdrop-blur-md border border-white rounded-[4rem] p-12 shadow-2xl space-y-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black font-serif uppercase italic tracking-tight">Active <span className="text-secondary">Restocks</span></h2>
                                    <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors flex items-center gap-2">
                                        Order More <ChevronRight size={14} />
                                    </Link>
                                </div>
                                <div className="space-y-6">
                                    {restocks.map((order, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                            className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm group hover:border-secondary/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                                                    <Tag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black font-serif">{order.item}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{order.qty} • {order.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-500 border border-green-100' : order.status === 'In Transit' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-secondary/20 text-secondary border border-secondary/20'}`}>
                                                    {order.status}
                                                </span>
                                                {order.status === 'Delivered' && (
                                                    <button className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all">
                                                        <RotateCcw size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Badges Sidebar */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-primary rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                                    <ShieldCheck className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 rotate-12" />
                                    <div className="space-y-6 relative z-10">
                                        <h3 className="text-4xl font-black font-serif leading-none italic uppercase">Retailer <br />Trust Badges</h3>
                                        <p className="text-cream/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Display these on your storefront to show your customers you source directly from the Kido Farm Network.</p>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                                <ShieldCheck className="text-secondary" />
                                            </div>
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                                <Star className="text-secondary" />
                                            </div>
                                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                                <MapPin className="text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href="/assets/kido-retailer-kit.zip"
                                        download
                                        className="block w-full bg-secondary text-primary py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center relative z-10 hover:bg-white transition-all shadow-xl mt-8"
                                    >
                                        Download Marketing Kit
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ReportIssueModal />

            {/* Restock Modal */}
            <AnimatePresence>
                {showRestock && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowRestock(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[4rem] p-12 max-w-lg w-full relative z-10 space-y-8 shadow-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-3xl font-black font-serif italic uppercase">Quick <span className="text-secondary">Restock</span></h3>
                                <button onClick={() => setShowRestock(false)} className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
                            </div>
                            <p className="text-primary/40 text-sm font-medium">Choose a category to browse the wholesale market and place a restock order.</p>
                            <div className="grid grid-cols-2 gap-4">
                                {['Vegetables', 'Fruits', 'Grains', 'Root Crops', 'Dairy', 'Livestock'].map(cat => (
                                    <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`} onClick={() => setShowRestock(false)}
                                        className="bg-cream/30 hover:bg-secondary hover:text-primary transition-all p-6 rounded-2xl font-black text-xs uppercase tracking-widest text-primary border border-primary/5 hover:border-secondary flex items-center justify-between">
                                        {cat} <ChevronRight size={14} />
                                    </Link>
                                ))}
                            </div>
                            <Link href="/shop" onClick={() => setShowRestock(false)} className="block w-full bg-primary text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-center hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                Browse All Products
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
