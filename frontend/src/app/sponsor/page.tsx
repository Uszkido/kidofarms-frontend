"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Users,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Sprout,
    MapPin,
    Layers,
    Zap,
    Globe,
    Heart,
    HandHelping,
    Scale,
    Activity,
    QrCode
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SponsorMarketplace() {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const farms = [
        {
            id: 'SPR-01',
            name: "The Kano Alpha Node",
            farmer: "Aminu Jos",
            goal: "₦5.0M",
            raised: "₦3.2M",
            backers: 124,
            status: "Active",
            type: "Grains",
            roi: "15-20%",
            img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
        },
        {
            id: 'SPR-02',
            name: "Plateau Bio-Digital Hub",
            farmer: "Esther Kwara",
            goal: "₦2.5M",
            raised: "₦1.8M",
            backers: 89,
            status: "Prime",
            type: "Tubers",
            roi: "12-18%",
            img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800"
        },
        {
            id: 'SPR-03',
            name: "Lagos Vertical Node",
            farmer: "Chef Kido",
            goal: "₦10.0M",
            raised: "₦1.2M",
            backers: 42,
            status: "Emerging",
            type: "Hydroponics",
            roi: "20-25%",
            img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />
            <main className="flex-grow pt-40 pb-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-16">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    <HandHelping className="w-3 h-3" strokeWidth={3} />
                                    Crowdfunded Food Sovereignty
                                </div>
                                <h1 className="text-6xl md:text-[10rem] font-black font-serif italic text-primary uppercase leading-none tracking-tighter">
                                    Farm <span className="text-secondary italic">Sponsor</span>
                                </h1>
                            </div>
                            <div className="bg-primary p-10 rounded-[3.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden shrink-0">
                                <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 animate-pulse" />
                                <div className="relative">
                                    <p className="text-[10px] font-black uppercase text-secondary mb-1">Total Sovereign Liquidity</p>
                                    <p className="text-5xl font-black font-serif italic text-white leading-none">₦420.8M</p>
                                </div>
                                <button className="bg-secondary text-primary w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Connect Wallet</button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex bg-white p-2 rounded-[2.5rem] border border-primary/5 shadow-xl w-fit">
                            {['all', 'Grains', 'Tubers', 'Hydroponics', 'Livestock'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:bg-neutral-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Marketplace Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {farms.map((farm, i) => (
                                <motion.div
                                    key={farm.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[4rem] border border-primary/5 shadow-xl overflow-hidden group hover:border-secondary transition-all"
                                >
                                    <div className="h-64 relative overflow-hidden">
                                        <img src={farm.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute top-6 right-6">
                                            <span className="bg-secondary text-primary px-4 py-2 rounded-full text-[9px] font-black uppercase italic shadow-2xl">{farm.roi} Est. ROI</span>
                                        </div>
                                        <div className="absolute bottom-6 left-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                    <Users size={18} />
                                                </div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{farm.backers} Citizen Backers</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] font-black uppercase text-secondary tracking-widest">{farm.type} Node</p>
                                                <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">{farm.id}</p>
                                            </div>
                                            <h3 className="text-3xl font-black font-serif italic text-primary uppercase leading-tight group-hover:text-secondary transition-colors">{farm.name}</h3>
                                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={10} /> Directed by {farm.farmer}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-primary/30 mb-1">Raised</p>
                                                    <p className="text-2xl font-black font-serif text-primary italic">{farm.raised}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase text-primary/30 mb-1">Target</p>
                                                    <p className="text-2xl font-black font-serif text-primary/20 italic">{farm.goal}</p>
                                                </div>
                                            </div>
                                            <div className="h-3 w-full bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5">
                                                <div className="h-full bg-secondary rounded-full" style={{ width: '64%' }} />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="flex-grow bg-primary text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl">Activate Support</button>
                                            <button className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-primary hover:bg-red-50 hover:text-red-500 transition-all">
                                                <Heart size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="bg-primary rounded-[5rem] p-20 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] -mr-100 -mt-100 animate-pulse" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
                                <div className="space-y-6 text-center md:text-left">
                                    <h2 className="text-5xl md:text-7xl font-black font-serif italic uppercase leading-none">Become a <span className="text-secondary">Sovereign Sponsor</span></h2>
                                    <p className="text-white/40 text-lg font-medium max-w-2xl leading-relaxed">Directly fund the nodes of production. Own a share of the harvest. Secure the food supply for your community through the blockchain.</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full md:w-auto">
                                    <button className="bg-secondary text-primary px-16 py-6 rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 transition-transform duration-500">Apply as Farmer Node</button>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 text-center">Verify Heritage ID First</p>
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
