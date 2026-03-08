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
                                    <div key={harvest.id} className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />

                                        <div className="grid md:grid-cols-3 gap-10 items-center relative z-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:bg-secondary group-hover:scale-110 transition-all">
                                                        <Leaf size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black font-serif">{harvest.cropName}</h3>
                                                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">at {harvest.farmName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-bold text-primary/60">
                                                    <div className="flex items-center gap-1"><MapPin size={14} className="text-secondary" /> {harvest.region}</div>
                                                    <div className="flex items-center gap-1"><Calendar size={14} className="text-secondary" /> Est. Ready: {new Date(harvest.estimatedReadyDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(harvest.status)}`}>
                                                        {harvest.status}
                                                    </span>
                                                    <span className="text-3xl font-black font-serif text-primary">{harvest.progress}%</span>
                                                </div>
                                                <div className="w-full h-4 bg-cream rounded-full overflow-hidden border border-primary/5 p-1 shadow-inner">
                                                    <div
                                                        className="h-full bg-secondary rounded-full transition-all duration-[2000ms] ease-out shadow-lg"
                                                        style={{ width: `${harvest.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button className="bg-primary text-white p-6 rounded-[2rem] hover:bg-secondary hover:text-primary transition-all shadow-xl flex flex-col items-center gap-2 group/btn">
                                                    <ShieldCheck size={32} strokeWidth={1.5} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-10 pt-10 border-t border-primary/5 flex flex-wrap gap-8 justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-cream flex items-center justify-center text-[10px] font-black">👤</div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Registered Farmers Monitoring</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={16} className="text-green-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Yield Optimization Active</span>
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
