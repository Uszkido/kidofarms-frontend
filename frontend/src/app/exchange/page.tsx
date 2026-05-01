"use client";

import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Share2, Search, User, Filter, MessageCircle, Sprout, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const advisories = [
    {
        id: 1,
        title: "Early Blight Mitigation Protocol",
        author: "Farmer Daniel",
        role: "Master Producer",
        time: "2h ago",
        content: "Observing early signs of Alternaria solani in the northern quadrant of Plateau Hub. Recommend immediate application of Trichoderma viride biological spray.",
        likes: 24,
        replies: 8,
        tags: ["Soil Health", "Alert"]
    },
    {
        id: 2,
        title: "Post-Harvest Cold Chain Sync",
        author: "Logistics Lead",
        role: "Regional Admin",
        time: "5h ago",
        content: "New solar-powered cold storage node operational in JOS-402. Farmers can now sync batch temperatures directly to the Kido Trace registry.",
        likes: 112,
        replies: 15,
        tags: ["Logistics", "IoT"]
    },
    {
        id: 3,
        title: "Organic Yield Optimization",
        author: "Dr. Sarah",
        role: "Kido Agronomist",
        time: "1d ago",
        content: "Latest GIS data shows nitrogen parity in central regions. Suggest reducing organic compost volume by 10% to prevent luxury consumption by tubers.",
        likes: 89,
        replies: 34,
        tags: ["Research", "Registry"]
    }
];

export default function ForumPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-[#040d0a] text-white flex flex-col">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-6 sm:px-12 max-w-[1600px] mx-auto w-full space-y-20">
                {/* FORUM HEADER */}
                <header className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-1 bg-secondary rounded-full" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Sovereignty Intelligence Network</h2>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white">
                            Intelligence <br />
                            <span className="text-secondary tracking-tighter">Exchange</span>
                        </h1>
                        <div className="max-w-md space-y-6">
                            <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-widest">
                                Peer-reviewed agricultural advisories, real-time crop alerts, and communal protocol refinement.
                            </p>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    placeholder="Search Advisories..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-secondary transition-all font-black uppercase text-[10px] tracking-widest"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* ASIDE: CATEGORIES */}
                    <aside className="lg:col-span-3 space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-white/30">Intelligence Nodes</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "Crop Advisories", count: 124, icon: <Sprout size={14} /> },
                                    { label: "Regional Alerts", count: 12, icon: <Zap size={14} /> },
                                    { label: "Logistics Sync", count: 48, icon: <MessageSquare size={14} /> },
                                    { label: "Soil Research", count: 96, icon: <ShieldCheck size={14} /> },
                                ].map((cat, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-secondary hover:text-primary transition-all">
                                        <div className="flex items-center gap-4">
                                            {cat.icon}
                                            <span className="text-[11px] font-black uppercase">{cat.label}</span>
                                        </div>
                                        <span className="text-[9px] font-bold opacity-30 group-hover:opacity-100">{cat.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-secondary p-8 rounded-[3rem] text-primary space-y-6 shadow-2xl">
                            <h4 className="text-xl font-black font-serif italic uppercase tracking-tighter leading-none">Contribute <br /> Intelligence</h4>
                            <p className="text-[10px] font-bold uppercase leading-relaxed opacity-60">Verified nodes can submit crop advisories to the community registry.</p>
                            <button className="w-full bg-primary text-secondary py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">Broadcast Advisory</button>
                        </div>
                    </aside>

                    {/* MAIN: FEED */}
                    <div className="lg:col-span-9 space-y-8">
                        {advisories.map((ad, i) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/5 p-10 md:p-14 rounded-[3.5rem] space-y-10 group hover:border-secondary/20 transition-all"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black font-serif italic text-white uppercase tracking-tighter">{ad.author}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">{ad.role} • {ad.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {ad.tags.map(tag => (
                                            <span key={tag} className="bg-white/5 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black font-serif uppercase tracking-tighter text-white group-hover:text-secondary transition-colors line-clamp-1">{ad.title}</h3>
                                    <p className="text-white/60 text-lg leading-relaxed font-medium">
                                        {ad.content}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-8 text-white/40">
                                        <button className="flex items-center gap-3 text-[10px] font-black uppercase hover:text-secondary transition-all">
                                            <ThumbsUp size={16} /> {ad.likes}
                                        </button>
                                        <button className="flex items-center gap-3 text-[10px] font-black uppercase hover:text-secondary transition-all">
                                            <MessageCircle size={16} /> {ad.replies}
                                        </button>
                                        <button className="flex items-center gap-3 text-[10px] font-black uppercase hover:text-secondary transition-all">
                                            <Share2 size={16} /> Share Batch
                                        </button>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 hover:translate-x-2 transition-transform">
                                        Unlock Full Protocol <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

import { ArrowRight } from "lucide-react";
