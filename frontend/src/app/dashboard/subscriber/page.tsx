"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, CreditCard, Settings, Truck, Leaf, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";

export default function SubscriberDashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Membership Header */}
                        <div className="bg-primary rounded-[4rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20 shadow-lg">
                                        <Leaf size={12} strokeWidth={3} />
                                        Elite Harvest Member
                                    </div>
                                    <h1 className="text-6xl font-black font-serif leading-tight">Your Weekly <br /><span className="text-secondary italic">Farm Basket</span></h1>
                                    <p className="text-cream/40 font-medium max-w-lg leading-relaxed">Currently active for <span className="text-white">Jos Branch Delivery</span>. Your next premium harvest selection is scheduled for preparation.</p>
                                </div>
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="w-40 h-40 rounded-full border-4 border-secondary/20 flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl shadow-2xl relative">
                                        <div className="absolute inset-0 border-t-4 border-secondary rounded-full animate-spin duration-[3000ms]" style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent' }} />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">Next Delivery In</p>
                                        <p className="text-5xl font-black font-serif">72h</p>
                                    </div>
                                    <button className="bg-secondary text-primary px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                        Skip This Week
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subscriber Content */}
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Management Links */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black font-serif px-4">Manage <span className="text-secondary italic">Plan</span></h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "Basket Configuration", icon: RefreshCw, detail: "Sweet Potatoes, Carrots, Onions" },
                                        { label: "Payment Method", icon: CreditCard, detail: "Visa ending in 4029" },
                                        { label: "Delivery Schedule", icon: Calendar, detail: "Every Tuesday Morning" },
                                        { label: "Account Settings", icon: Settings, detail: "Manage profile and password" },
                                    ].map((item, i) => (
                                        <button key={i} className="w-full bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                    <item.icon size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-black text-sm tracking-tight group-hover:text-secondary transition-colors">{item.label}</p>
                                                    <p className="text-[10px] font-medium text-primary/30 uppercase tracking-wide">{item.detail}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-primary/10 group-hover:text-secondary" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Basket History */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <h2 className="text-3xl font-black font-serif">Basket <span className="text-secondary italic">Log</span></h2>
                                </div>
                                <div className="bg-white rounded-[4rem] border border-primary/5 shadow-2xl p-10 md:p-16 space-y-10">
                                    {[1, 2].map((log) => (
                                        <div key={log} className="group cursor-pointer">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                                        <Truck size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Shipment Delivered</p>
                                                        <h4 className="font-black text-xl font-serif">Harvest Batch #KB-902{log}</h4>
                                                    </div>
                                                </div>
                                                <span className="font-black font-serif text-lg">Oct {24 - log * 7}, 2026</span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-cream/10 rounded-[2.5rem] border border-primary/5 opacity-60 group-hover:opacity-100 transition-all group-hover:bg-cream/30">
                                                {["Cherry Tomatoes", "Plantain", "Garden Egg", "Wild Honey"].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                        View Full Consumption History
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Support Banner */}
                        <div className="bg-cream border border-primary/5 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-secondary shadow-lg">
                                    <AlertCircle size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black font-serif">Need to Pause?</h4>
                                    <p className="text-xs text-primary/40 font-medium">Vacation mode allows you to pause your deliveries for up to 4 weeks with zero fees.</p>
                                </div>
                            </div>
                            <button className="bg-white border-2 border-primary/5 text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                Enable Vacation Mode
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
