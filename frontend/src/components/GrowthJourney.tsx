"use client";

import React, { useState } from 'react';
import { Calendar, Sprout, ShoppingBag, Droplets, Sun, Wind } from 'lucide-react';
import Image from 'next/image';

interface GrowthStage {
    date: string;
    stage: string;
    image: string;
    moisture?: string;
    sunlight?: string;
    temp?: string;
}

const defaultStages: GrowthStage[] = [
    {
        date: "March 01, 2026",
        stage: "Germination",
        image: "https://images.unsplash.com/photo-1523348837708-31652175b058?w=800",
        moisture: "72%", sunlight: "8h", temp: "22°C"
    },
    {
        date: "March 20, 2026",
        stage: "Seedling",
        image: "https://images.unsplash.com/photo-1416870213414-459f444853a5?w=800",
        moisture: "68%", sunlight: "10h", temp: "24°C"
    },
    {
        date: "April 05, 2026",
        stage: "Vegetative",
        image: "https://images.unsplash.com/photo-1592398633469-80ac9034ed8d?w=800",
        moisture: "65%", sunlight: "11h", temp: "25°C"
    },
    {
        date: "April 10, 2026",
        stage: "Harvest Ready",
        image: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?w=800",
        moisture: "60%", sunlight: "12h", temp: "26°C"
    }
];

export const GrowthJourney: React.FC<{ stages?: any[] }> = ({ stages }) => {
    const [stageIndex, setStageIndex] = useState(0);

    const activeStages = React.useMemo(() => {
        if (stages && stages.length > 0) {
            return stages.map(s => ({
                date: s.date,
                stage: s.milestone,
                image: s.imageUrl || "https://images.unsplash.com/photo-1523348837708-31652175b058?w=800",
                moisture: "N/A", sunlight: "N/A", temp: "N/A"
            }));
        }
        return defaultStages;
    }, [stages]);

    // Ensure stageIndex is within bounds if activeStages length changes
    const displayIndex = Math.min(stageIndex, activeStages.length - 1);
    const current = activeStages[displayIndex] || activeStages[0];

    return (
        <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sprout size={120} />
            </div>

            <div className="space-y-8 relative">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black font-serif italic text-primary">Seed-to-Sale <span className="text-secondary tracking-tighter">Timeline</span></h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mt-1">Verified Growth Journey</p>
                    </div>
                    <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> {current.date}
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-primary/5 shadow-inner">
                    <Image
                        src={current.image}
                        alt={current.stage}
                        fill
                        className="object-cover transition-opacity duration-500"
                        unoptimized
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
                        <div className="flex justify-between items-center text-white">
                            <div>
                                <p className="text-[10px] font-black uppercase text-secondary/80">Stage {displayIndex + 1}</p>
                                <h4 className="text-xl font-bold uppercase italic">{current.stage}</h4>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <Droplets size={14} className="mx-auto text-secondary mb-1" />
                                    <p className="text-[8px] font-black uppercase">{current.moisture}</p>
                                </div>
                                <div className="text-center">
                                    <Sun size={14} className="mx-auto text-yellow-400 mb-1" />
                                    <p className="text-[8px] font-black uppercase">{current.sunlight}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max={activeStages.length - 1}
                        value={displayIndex}
                        onChange={(e) => setStageIndex(parseInt(e.target.value))}
                        className="w-full h-2 bg-cream rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/30 px-2">
                        <span>Planting</span>
                        <span>Harvesting</span>
                    </div>
                </div>

                <div className="p-6 bg-cream/30 rounded-2xl border border-primary/5 text-center">
                    <p className="text-xs font-bold text-primary/60 italic leading-relaxed">
                        "This batch was monitored by <span className="text-secondary">Node PH-09</span>. Soil integrity maintained at 98% efficiency."
                    </p>
                </div>
            </div>
        </div>
    );
};
