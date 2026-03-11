"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getApiUrl } from "@/lib/api";
import { Loader2 } from "lucide-react";
import TeamSection from "@/components/TeamSection";

export default function AboutPage() {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<any>({
        founded: "2020",
        title: "Born From Passion & Purpose",
        description: "Kido Farms & Orchard was founded in 2020 with a bold vision — connecting Nigeria's most talented farmers directly with consumers through technology. What started as a single orchard has grown into the Kido Farms Network, one of Nigeria's most trusted farm-to-table platforms.",
        missionTitle: "Our Mission & Vision",
        missionSubtitle: "Rooted in history, growing for the future. We believe in food that heals the body and respects the land.",
        pillars: [
            { title: "Farmer Empowerment", desc: "Equipping Nigerian farmers with technology, market access, and fair pricing to grow their businesses." },
            { title: "Tech Innovation", desc: "Leveraging modern greenhouse technology, hydroponics, and smart logistics to deliver freshness at scale." },
            { title: "Community Access", desc: "Making premium, organic farm produce affordable and accessible to every household across Nigeria." },
        ]
    });

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        try {
            const res = await fetch(getApiUrl("/api/landing"));
            const data = await res.json();
            if (data.about) {
                setContent(data.about);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={64} />
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-secondary selection:text-white">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                                <Image
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop"
                                    alt="Farmer in the field"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="w-12 h-1 bg-secondary rounded-full" />
                                        <span className="text-secondary font-black uppercase tracking-[0.3em] text-xs">Founded {content.founded}</span>
                                    </div>
                                    <h1 className="text-6xl lg:text-8xl font-black font-serif italic leading-[0.85] tracking-tighter text-primary">{content.title}</h1>
                                </div>
                                <p className="text-xl text-primary/70 leading-relaxed font-medium">
                                    {content.description}
                                </p>
                                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-primary/5">
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-black font-serif text-secondary italic">100%</h3>
                                        <p className="text-[10px] font-black uppercase text-primary/40 tracking-[0.4em]">Organic Grown</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-black font-serif text-secondary italic">Since '{content.founded.substring(2)}</h3>
                                        <p className="text-[10px] font-black uppercase text-primary/40 tracking-[0.4em]">Built in Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-primary rounded-[4rem] mx-6 my-12 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-[150px] group-hover:bg-secondary/20 transition-all duration-[2000ms]" />
                    <div className="container mx-auto px-6 text-center space-y-20 relative z-10">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black font-serif italic text-white leading-none tracking-tighter uppercase">{content.missionTitle}</h2>
                            <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto italic">"{content.missionSubtitle}"</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            {(content.pillars || []).map((item: any, i: number) => (
                                <div key={i} className="bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 hover:border-secondary transition-all group/card">
                                    <div className="w-12 h-1 bg-secondary mb-8 group-hover/card:w-20 transition-all" />
                                    <h3 className="text-2xl font-black font-serif italic text-white mb-6 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-sm font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <TeamSection />
            </main>
            <Footer />
        </div>
    );
}
