"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Package, Truck, Clock, Heart, Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ConsumerDashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Welcome Header & Hero */}
                        <div className="relative h-[400px] rounded-[4rem] overflow-hidden shadow-2xl group mb-12">
                            <img
                                src="file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/consumer_dashboard_organic_basket_1772965456413.png"
                                alt="Organic Harvest"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        <Heart size={12} strokeWidth={3} className="fill-current" />
                                        Farm-to-Table Fresh
                                    </div>
                                    <h1 className="text-6xl font-black font-serif text-white leading-tight">Hello, <br /><span className="text-secondary italic">Shopper</span></h1>
                                </div>
                                <Link href="/shop" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-sm hover:bg-secondary hover:text-primary transition-all shadow-2xl flex items-center gap-3">
                                    Browse Today's Harvest <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Orders", value: "12", icon: Package, color: "bg-blue-50 text-blue-600" },
                                { label: "In Transit", value: "2", icon: Truck, color: "bg-green-50 text-green-600" },
                                { label: "Hours Saved", value: "48h", icon: Clock, color: "bg-secondary/20 text-secondary" },
                                { label: "Saved Items", value: "24", icon: Heart, color: "bg-red-50 text-red-600" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4 group hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black font-serif">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black font-serif">Recent <span className="text-secondary italic">Orders</span></h2>
                                <button className="text-sm font-black text-primary/40 hover:text-secondary underline underline-offset-8">View All History</button>
                            </div>

                            <div className="bg-white rounded-[3rem] border border-primary/5 shadow-xl overflow-hidden">
                                <div className="p-8 border-b border-primary/5 bg-cream/20 flex justify-between items-center">
                                    <div className="flex gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Order Number</p>
                                            <p className="font-bold text-sm">#KD-9028-X</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Date Placed</p>
                                            <p className="font-bold text-sm">Oct 24, 2026</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Delivered</span>
                                </div>
                                <div className="p-10 space-y-8">
                                    {[
                                        { name: "Organic Strawberries", qty: "2kg", price: "₦24,000" },
                                        { name: "Bulk Maize (50kg)", qty: "1 Bag", price: "₦15,000" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center font-black text-primary/20">📦</div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-secondary transition-colors">{item.name}</h4>
                                                    <p className="text-xs text-primary/40 font-medium">Quantity: {item.qty}</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-lg">{item.price}</span>
                                        </div>
                                    ))}
                                    <div className="pt-8 border-t border-primary/5 flex justify-between items-center">
                                        <button className="text-primary font-black text-sm flex items-center gap-2 hover:text-secondary">
                                            Track Shipment <ArrowRight size={16} />
                                        </button>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Total Paid</p>
                                            <p className="text-2xl font-black font-serif">₦39,000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Tracking Mini-Widget */}
                        <div className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <Search className="w-80 h-80 absolute -top-20 -right-20 rotate-12" />
                            </div>
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-black font-serif leading-tight">Where's my <br /><span className="text-secondary italic">Harvest?</span></h2>
                                    <p className="text-cream/40 font-medium">Enter your tracking ID to see real-time oxygen levels and transit status of your perishables.</p>
                                    <div className="flex gap-2 p-2 bg-white/10 rounded-2xl border border-white/10">
                                        <input className="bg-transparent border-none outline-none flex-grow px-4 py-2 text-white placeholder:text-white/20 font-mono" placeholder="KD-XXXX-XXXX" />
                                        <button className="bg-secondary text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Track</button>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="space-y-4 py-6 border-l-2 border-secondary/20 pl-10">
                                        {[
                                            { label: "Shipment Picked Up", time: "08:30 AM", active: false },
                                            { label: "Out for Delivery", time: "10:15 AM", active: true },
                                            { label: "Delivered", time: "Pending", active: false },
                                        ].map((step, i) => (
                                            <div key={i} className={`flex items-start gap-4 ${step.active ? "opacity-100" : "opacity-30"}`}>
                                                <div className={`w-3 h-3 rounded-full mt-1 ${step.active ? "bg-secondary" : "bg-white"}`} />
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">{step.label}</p>
                                                    <p className="text-[10px] font-medium">{step.time}</p>
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
