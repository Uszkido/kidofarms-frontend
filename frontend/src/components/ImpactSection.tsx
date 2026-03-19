"use client";
import { TrendingUp, Users, MapPin, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ImpactSection() {
    const [metrics, setMetrics] = useState({
        acresCultivated: 0,
        farmersSupported: 0,
        productionCapacity: "0 Tons"
    });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/impact`)
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object' && !data.error) {
                    setMetrics(prev => ({ ...prev, ...data }));
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="py-24 bg-primary overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col mb-16">
                    <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Our Footprint</span>
                    <h2 className="text-5xl md:text-8xl font-black font-serif text-white leading-none uppercase tracking-tighter">
                        Tangible <span className="text-secondary italic">Impact</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-6xl font-black text-white mb-2">{metrics.acresCultivated}+</h3>
                        <p className="text-white/40 uppercase font-black tracking-widest text-xs">Acres Cultivated</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                            <Users size={32} />
                        </div>
                        <h3 className="text-6xl font-black text-white mb-2">{metrics.farmersSupported}+</h3>
                        <p className="text-white/40 uppercase font-black tracking-widest text-xs">Farmers Supported</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                            <BarChart3 size={32} />
                        </div>
                        <h3 className="text-6xl font-black text-white mb-2">{metrics.productionCapacity}</h3>
                        <p className="text-white/40 uppercase font-black tracking-widest text-xs">Production Capacity</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
