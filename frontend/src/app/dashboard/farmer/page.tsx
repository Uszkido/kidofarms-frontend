"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    LayoutDashboard,
    Sprout,
    Droplets,
    ThermometerSun,
    TrendingUp,
    ShoppingBag,
    Plus,
    ArrowRight,
    CheckCircle2,
    Calendar,
    MapPin
} from "lucide-react";
import Link from "next/link";

export default function FarmerDashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Hero Section */}
                        <div className="relative h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl group">
                            <img
                                src="file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/farm_harvest_dashboard_hero_1772965399553.png"
                                alt="Farm Harvest"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Sprout className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
                                        Soil Integrity Verified
                                    </div>
                                    <h1 className="text-3xl md:text-6xl font-black font-serif text-white leading-tight">Farmer <br /><span className="text-secondary italic">Command Center</span></h1>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <Link href="/admin/inventory/new" className="bg-white text-primary px-6 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-3 w-full md:w-auto">
                                        <Plus className="w-4 h-4 md:w-5 md:h-5" /> List New Harvest
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Critical Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Yield", value: "2.4 Tons", icon: Sprout, color: "bg-green-500", detail: "+12% vs last cycle" },
                                { label: "Est. Revenue", value: "₦4.8M", icon: TrendingUp, color: "bg-secondary", detail: "Next payout: Friday" },
                                { label: "Soil Moisture", value: "68%", icon: Droplets, color: "bg-blue-500", detail: "Optimal range: 60-75%" },
                                { label: "Direct Orders", value: "142", icon: ShoppingBag, color: "bg-primary", detail: "8 orders pending dispatch" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black font-serif text-primary">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">{stat.label}</p>
                                    </div>
                                    <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[10px] font-bold text-primary/60">
                                        <CheckCircle2 size={12} className="text-secondary" />
                                        {stat.detail}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory & Tracking Grid */}
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Live Harvest Status */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <h2 className="text-3xl font-black font-serif text-primary">Live <span className="text-secondary italic">Harvest Tracking</span></h2>
                                    <Link href="/track-harvest" className="text-xs font-black uppercase tracking-widest text-secondary hover:underline underline-offset-8 transition-all">View Public Node</Link>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { crop: "Yellow Maize", stage: "Late Growing", progress: 85, health: "Optimal", location: "Sector 4A" },
                                        { crop: "Bulk Onions", stage: "Seedling", progress: 15, health: "Monitoring", location: "Sector 2B" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-lg group hover:border-secondary transition-all">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                        <Sprout size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black font-serif">{item.crop}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{item.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black font-serif text-primary">{item.progress}%</span>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic">{item.stage}</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5">
                                                <div
                                                    className="h-full bg-secondary rounded-full transition-all duration-[2000ms]"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications & Action Center */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black font-serif px-4">Farm <span className="text-secondary italic">Alerts</span></h2>
                                <div className="bg-primary rounded-[3rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
                                    {[
                                        { title: "Price Surge: Grains", desc: "Regional demand for maize rose 15% today.", icon: TrendingUp },
                                        { title: "Weather Alert", desc: "Heavy rainfall expected in Jos district.", icon: ThermometerSun },
                                    ].map((alert, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all">
                                                <alert.icon size={18} />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="font-black text-sm">{alert.title}</h5>
                                                <p className="text-[10px] text-white/40 font-medium leading-relaxed">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full bg-white/10 border border-white/10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                                        Clear All Notifications
                                    </button>
                                </div>

                                <div className="bg-secondary rounded-[3rem] p-8 text-primary space-y-4 shadow-xl">
                                    <h4 className="text-xl font-black font-serif leading-tight">Need Support <br />From the Network?</h4>
                                    <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Connect with agronomists and supply chain experts.</p>
                                    <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
                                        Open Support Ticket <ArrowRight size={14} />
                                    </button>
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

