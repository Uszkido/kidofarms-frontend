"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, MapPin, Calendar, ThermometerSun, Droplets, Info, Loader2 } from "lucide-react";
import Image from "next/image";

export default function TracePage() {
    const params = useParams();
    const id = params.id as string;
    const [status, setStatus] = useState("Authentic");

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-32 pb-24 bg-cream/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-primary/5">
                            {/* Header Status */}
                            <div className="bg-primary p-12 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                                    <ShieldCheck className="w-96 h-96 absolute -top-20 -left-20" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl text-primary">
                                        <ShieldCheck size={40} strokeWidth={3} />
                                    </div>
                                    <h1 className="text-4xl font-black font-serif text-white uppercase tracking-tight">Kido <span className="text-secondary italic">Authentic</span></h1>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Harvest Node: {id}</p>
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="p-12 space-y-12">
                                <div className="flex gap-8 items-center">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden relative shadow-xl">
                                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="object-cover w-full h-full" alt="Product" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black font-serif">Organic Red Bell Peppers</h2>
                                        <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                            <MapPin size={12} className="text-secondary" /> Jos Highlands, Plateau State
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/30">Harvest Life Cycle</h3>
                                    <div className="space-y-6 border-l-2 border-primary/5 pl-8">
                                        {[
                                            { label: "Planted", date: "Jan 12, 2026", details: "Organic non-GMO seeds, Sector 4B", status: "completed" },
                                            { label: "Soil Check", date: "Feb 20, 2026", details: "Nutrient levels: Optimal (pH 6.4)", status: "completed" },
                                            { label: "Harvested", date: "March 08, 2026", details: "Morning harvest, temperature-controlled", status: "active" },
                                            { label: "Processing", date: "Pending", details: "Drying and packaging", status: "upcoming" }
                                        ].map((step, i) => (
                                            <div key={i} className={`relative ${step.status === 'upcoming' ? 'opacity-30' : 'opacity-100'}`}>
                                                <div className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-md ${step.status === 'active' ? 'bg-secondary animate-pulse' : step.status === 'completed' ? 'bg-primary' : 'bg-cream'}`} />
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-black text-sm uppercase tracking-widest">{step.label}</p>
                                                        <p className="text-[8px] font-black text-primary/30">{step.date}</p>
                                                    </div>
                                                    <p className="text-xs text-primary/50 font-medium">{step.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Environment Data */}
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-primary/5">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30">
                                            <ThermometerSun size={12} className="text-secondary" /> Avg Temperature
                                        </div>
                                        <p className="text-2xl font-black font-serif">21.4 °C</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30">
                                            <Droplets size={12} className="text-blue-400" /> Soil Moisture
                                        </div>
                                        <p className="text-2xl font-black font-serif">68.2 %</p>
                                    </div>
                                </div>

                                <div className="bg-cream/30 p-8 rounded-[2rem] flex items-center gap-6">
                                    <div className="p-4 bg-white rounded-2xl shadow-xl">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://kidofarms.vercel.app/trace/${id}`} alt="QR" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Share Node</p>
                                        <p className="text-xs font-medium text-primary/60">Others can scan this to see the life cycle of this specific harvest.</p>
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
