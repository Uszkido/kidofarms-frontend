"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    ShieldCheck,
    Zap,
    Droplet,
    Sun,
    Wind,
    FileText,
    Download,
    Lock,
    Search,
    Satellite
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const protocols = [
    {
        title: "Soil Biology V5",
        desc: "Advanced microbial deployment strategies for Jos High-Plateau regions.",
        category: "Soil Health",
        icon: <Droplet className="text-secondary" />,
        status: "Verified",
        difficulty: "Intermmediate"
    },
    {
        title: "Drip-Nexus Irrigation",
        desc: "Zero-waste water management using IoT-linked solar pumps.",
        category: "Technology",
        icon: <Zap className="text-secondary" />,
        status: "Optimized",
        difficulty: "Advanced"
    },
    {
        title: "Organic Yield Shield",
        desc: "Biological pest control without the use of synthetic neurotoxins.",
        category: "Protection",
        icon: <ShieldCheck className="text-secondary" />,
        status: "Mastered",
        difficulty: "Beginner"
    },
    {
        title: "Regen-Cycle Tillage",
        desc: "Zero-till farming methods designed for maximum carbon sequestration.",
        category: "Sustainability",
        icon: <Sun className="text-secondary" />,
        status: "Global Parity",
        difficulty: "Intermmediate"
    }
];

export default function VaultPage() {
    return (
        <div className="min-h-screen bg-[#040d0a] text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-6 sm:px-12 max-w-[1600px] mx-auto w-full space-y-24">
                {/* 🛡️ VAULT HEADER */}
                <header className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-1 bg-secondary rounded-full" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Citizen Knowledge Access</h2>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <h1 className="text-7xl lg:text-[10rem] font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Sovereign <br />
                            <span className="text-secondary tracking-tighter">Vault</span>
                        </h1>
                        <div className="max-w-md space-y-6">
                            <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-widest">
                                Peer-to-peer agricultural intelligence and certified organic protocols for the modern biotic producer.
                            </p>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    placeholder="Search Knowledge Nodes..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-secondary transition-all font-black uppercase text-[10px] tracking-widest"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* 📊 GRID CATEGORIES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {["Protocol Alpha", "Case Studies", "Soil Metadata", "Audit Reports"].map((cat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex items-center justify-between group hover:bg-secondary hover:text-primary transition-all cursor-pointer">
                            <span className="text-[11px] font-black uppercase tracking-widest">{cat}</span>
                            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                                <Lock size={16} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 📜 MASTER PROTOCOLS */}
                <section className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/10 pb-8">
                        <h3 className="text-3xl font-black font-serif italic text-white uppercase tracking-tighter">Master Protocols</h3>
                        <Link href="/academy" className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 hover:translate-x-2 transition-transform">
                            Full Academy Access <BookOpen size={14} />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {protocols.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] space-y-10 group hover:border-secondary/20 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -translate-y-20 translate-x-20" />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                                        {p.icon}
                                    </div>
                                    <div className="bg-white/5 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40">
                                        {p.status}
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-4xl font-black font-serif uppercase tracking-tighter text-white">{p.title}</h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                        {p.desc}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end relative z-10">
                                    <div className="space-y-2">
                                        <h5 className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">Citizen Level</h5>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{p.difficulty}</p>
                                    </div>
                                    <button className="bg-white/5 p-5 rounded-2xl hover:bg-secondary hover:text-primary transition-all group/btn">
                                        <Download size={24} className="group-hover/btn:translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 🛰️ GLOBAL DATA PARITY */}
                <section className="bg-secondary p-20 rounded-[5rem] text-primary space-y-12 relative overflow-hidden">
                    <Satellite className="absolute top-10 right-10 opacity-10" size={300} strokeWidth={0.5} />
                    <div className="max-w-2xl space-y-10 relative z-10">
                        <h3 className="text-6xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter">
                            Live Multispectral <br /> Data Feeds
                        </h3>
                        <p className="text-sm font-black uppercase tracking-widest leading-relaxed opacity-60">
                            Our network maintains persistent parity with Global Agritech Node Jos-402, delivering NDVI imagery and biomass telemetry to every decentralized farm plot.
                        </p>
                        <div className="flex gap-6 pt-4">
                            <button className="bg-primary text-secondary px-10 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                                Access GIS Dashboard
                            </button>
                            <button className="border-2 border-primary/20 px-10 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-primary transition-all">
                                Hardware Specs
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
