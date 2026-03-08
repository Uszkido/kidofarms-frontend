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
                        <div className="text-center space-y-3 md:space-y-4">
                            <span className="bg-secondary/20 text-secondary px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">Transparency Node</span>
                            <h1 className="text-3xl md:text-6xl font-black font-serif">Track The <span className="text-secondary italic">Harvest</span></h1>
                            <p className="text-primary/60 text-sm md:text-lg max-w-2xl mx-auto">Real-time visibility into our fields. Monitor crop growth from seed to shelf across West Africa's premium farm network.</p>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-4">
                                <Loader2 className="animate-spin text-secondary w-8 h-8 md:w-12 md:h-12" />
                                <p className="text-primary/40 font-bold uppercase tracking-widest text-[10px]">Connecting to Field Sensors...</p>
                            </div>
                        ) : (
                            <div className="space-y-6 md:space-y-8">
                                {harvests.map((harvest) => (
                                    <div key={harvest.id} className="bg-white rounded-[2rem] md:rounded-[4rem] border border-primary/5 shadow-xl hover:shadow-2xl transition-all group overflow-hidden flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden shrink-0">
                                            <img
                                                src={harvest.cropName.includes('Maize')
                                                    ? "file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/track_harvest_maize_field_1772965531213.png"
                                                    : harvest.cropName.includes('Habanero')
                                                        ? "file:///C:/Users/COMPUTER 13/.gemini/antigravity/brain/f50ad5b6-b585-4325-b0d1-e6ba4ca4dbbf/track_harvest_habanero_peppers_1772965549394.png"
                                                        : "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80"}
                                                alt={harvest.cropName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5000ms]"
                                            />
                                            <div className="absolute top-4 md:top-6 left-4 md:left-6">
                                                <span className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl ${getStatusColor(harvest.status)}`}>
                                                    {harvest.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 md:p-10 flex-grow space-y-6 md:space-y-8">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl md:text-3xl font-black font-serif text-primary">{harvest.cropName}</h3>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/40">
                                                        <div className="flex items-center gap-1"><MapPin className="text-secondary w-2.5 h-2.5 md:w-3 md:h-3" /> {harvest.region} Node</div>
                                                        <div className="flex items-center gap-1"><Calendar className="text-secondary w-2.5 h-2.5 md:w-3 md:h-3" /> Ready: {new Date(harvest.estimatedReadyDate).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-2xl md:text-4xl font-black font-serif text-primary">{harvest.progress}%</span>
                                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/20">Growth</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 md:space-y-4">
                                                <div className="w-full h-3 md:h-4 bg-cream rounded-full overflow-hidden border border-primary/5 p-0.5 md:p-1 shadow-inner">
                                                    <div
                                                        className="h-full bg-secondary rounded-full transition-all duration-[2000ms] shadow-lg"
                                                        style={{ width: `${harvest.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-primary/5">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-secondary shadow-lg">
                                                        <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                                                    </div>
                                                    <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-primary/60">Kido Verified <br />Organic Origin</p>
                                                </div>
                                                <div className="flex items-center gap-1 md:gap-2">
                                                    <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                                                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-green-600">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-black font-serif">Kido Farms Quality Guarantee</h2>
                                    <p className="text-cream/40 text-sm md:text-base max-w-lg font-medium leading-relaxed">Every harvest listed on our network undergoes double-blind verification for organic purity and nutrient density.</p>
                                </div>
                                <button className="w-full md:w-auto bg-secondary text-primary px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3">
                                    Learn More <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
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

