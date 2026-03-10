"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    ShieldCheck,
    MapPin,
    Sprout,
    Video,
    Calendar,
    ChevronRight,
    Leaf,
    Dna,
    Activity,
    QrCode
} from "lucide-react";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function TraceabilityVerification() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDNA = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/horizon/dna/${id}`));
                if (res.ok) setData(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDNA();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9]">
            <Activity className="animate-spin text-secondary" size={48} />
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF9]">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl space-y-12">
                    {/* Header DNA Badge */}
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <ShieldCheck size={40} className="text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-serif uppercase tracking-tighter">
                            Heritage <span className="text-secondary italic">Passport</span>
                        </h1>
                        <p className="text-primary/40 font-bold text-xs uppercase tracking-widest">Digital Twin ID: {id?.toString().toUpperCase()}</p>
                    </div>

                    {/* Product & Farmer Profile */}
                    <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-primary/5 grid md:grid-cols-2 gap-12 relative overflow-hidden">
                        <Dna className="absolute -bottom-10 -right-10 text-primary/5 w-64 h-64 rotate-12" />
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase">
                                <Leaf size={14} /> Certified Organic
                            </div>
                            <h2 className="text-5xl font-black font-serif text-primary leading-none uppercase italic">{data?.productName || "Product"}</h2>
                            <div className="space-y-2 pt-4">
                                <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">Cultivated By</p>
                                <p className="text-2xl font-black font-serif text-primary">{data?.farmerName || "Verified Farmer"}</p>
                                <p className="text-sm font-bold text-secondary flex items-center gap-2">
                                    <MapPin size={16} /> {data?.location || "Kano North Node"}
                                </p>
                            </div>
                        </div>
                        <div className="bg-cream/20 rounded-[3rem] p-8 flex flex-col justify-center gap-6 border border-primary/5">
                            <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Soil Health Score</span>
                                <span className="text-2xl font-black font-serif text-primary">{data?.soilHealthScore || "98"}/100</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">DNA Hash Verification</span>
                                <span className="text-[8px] font-mono text-secondary truncate ml-4 max-w-[150px]">{data?.dnaHash || "KH-772-X9"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Pesticide Protocol</span>
                                <span className="text-[10px] font-black uppercase text-green-500">Zero Detected</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Provenance */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 space-y-4">
                            <Calendar size={32} className="text-secondary" />
                            <h4 className="text-xl font-black font-serif italic">Harvest Date</h4>
                            <p className="text-[10px] font-bold text-primary/40 uppercase">March 08, 2026</p>
                        </div>
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 space-y-4">
                            <Video size={32} className="text-secondary" />
                            <h4 className="text-xl font-black font-serif italic">Harvest Feed</h4>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-2">
                                PLAY REPLAY <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="bg-primary p-10 rounded-[3rem] shadow-xl text-white space-y-4 flex flex-col justify-between">
                            <QrCode size={32} className="text-secondary" />
                            <div>
                                <h4 className="text-xl font-black font-serif italic">Verify Sync</h4>
                                <p className="text-[8px] font-bold text-white/40 uppercase leading-relaxed">Immutable link to the Sovereign Blockchain.</p>
                            </div>
                        </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="bg-primary rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <Activity className="absolute -bottom-10 -right-10 text-white/5 w-80 h-80 -rotate-12" />
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-3xl font-black font-serif uppercase italic tracking-tighter">Environmental <span className="text-secondary">Footprint</span></h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: "Water Saved", val: "420L" },
                                    { label: "Carbon Offset", val: "1.2kg" },
                                    { label: "Net Positive", val: "Yes" },
                                    { label: "Eco Grade", val: "A+" }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">{stat.label}</p>
                                        <p className="text-3xl font-black font-serif text-secondary leading-none">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
