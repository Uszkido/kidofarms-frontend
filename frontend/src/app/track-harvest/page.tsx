"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import { MapPin, Calendar, Leaf, Loader2, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Image from "next/image";

interface Harvest {
    id: string;
    cropName: string;
    farmName: string;
    region: string;
    status: 'planted' | 'growing' | 'harvesting' | 'ready';
    progress: number;
    estimatedReadyDate: string;
    updatedAt: string;
}

export default function TrackHarvestPage() {
    const [harvests, setHarvests] = useState<Harvest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHarvests = async () => {
            try {
                const res = await fetch(getApiUrl("/api/harvests"));
                if (res.ok) {
                    const data = await res.json();
                    setHarvests(data);
                }
            } catch (error) {
                console.error("Failed to fetch harvests:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHarvests();
    }, []);

    const getStatusColor = (status: Harvest['status']) => {
        switch (status) {
            case 'planted': return 'bg-brown-500 text-white';
            case 'growing': return 'bg-blue-500 text-white';
            case 'harvesting': return 'bg-secondary text-primary';
            case 'ready': return 'bg-primary text-white';
            default: return 'bg-cream text-primary';
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-32 pb-24 bg-cream/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <span className="bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Transparency Node</span>
                            <h1 className="text-6xl font-black font-serif">Track The <span className="text-secondary italic">Harvest</span></h1>
                            <p className="text-primary/60 text-lg max-w-2xl mx-auto">Real-time visibility into our fields. Monitor crop growth from seed to shelf across West Africa's premium farm network.</p>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="animate-spin text-secondary" size={48} />
                                <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">Connecting to Field Sensors...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {harvests.map((harvest) => (
                                    <div key={harvest.id} className="bg-white rounded-[4rem] border border-primary/5 shadow-xl hover:shadow-2xl transition-all group overflow-hidden flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden shrink-0">
                                            <img
                                                src={harvest.cropName.includes('Maize')
                                                    ? "file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/track_harvest_maize_field_1772965531213.png"
                                                    : harvest.cropName.includes('Habanero')
                                                        ? "file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/track_harvest_habanero_peppers_1772965549394.png"
                                                        : "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80"}
                                                alt={harvest.cropName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5000ms]"
                                            />
                                            <div className="absolute top-6 left-6">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl ${getStatusColor(harvest.status)}`}>
                                                    {harvest.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-10 flex-grow space-y-8">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl font-black font-serif text-primary">{harvest.cropName}</h3>
                                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40">
                                                        <div className="flex items-center gap-1"><MapPin size={12} className="text-secondary" /> {harvest.region} Node</div>
                                                        <div className="flex items-center gap-1"><Calendar size={12} className="text-secondary" /> Ready: {new Date(harvest.estimatedReadyDate).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-4xl font-black font-serif text-primary">{harvest.progress}%</span>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Growth Cycle</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="w-full h-4 bg-cream rounded-full overflow-hidden border border-primary/5 p-1 shadow-inner">
                                                    <div
                                                        className="h-full bg-secondary rounded-full transition-all duration-[2000ms] shadow-lg"
                                                        style={{ width: `${harvest.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-6 border-t border-primary/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary shadow-lg">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Kido Verified <br />Organic Origin</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={16} className="text-green-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-green-600">Cycle Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black font-serif">Kido Farms Quality Guarantee</h2>
                                    <p className="text-cream/40 max-w-lg font-medium leading-relaxed">Every harvest listed on our network undergoes double-blind verification for organic purity and nutrient density.</p>
                                </div>
                                <button className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all shadow-2xl flex items-center gap-3">
                                    Learn More <ArrowRight size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
