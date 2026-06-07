"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

interface AdvantageItem {
    title: string;
    desc: string;
}

interface AdvantageData {
    title: string;
    titleItalic: string;
    subtitle: string;
    items: AdvantageItem[];
}

export default function AdvantageSection({ data }: { data: AdvantageData }) {
    const advantageItems = (data.items || []).map((item) => {
        let Icon = Leaf;
        if (item.title === "Smart Logistics") Icon = Truck;
        if (item.title === "Direct Verification") Icon = ShieldCheck;
        return { ...item, icon: Icon };
    });

    return (
        <section className="py-20 md:py-40 bg-primary/20">
            <div className="container-sovereign">
                <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-10 mb-16 md:mb-32">
                    <span className="text-secondary font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">The Kido Advantage</span>
                    <h2 className="responsive-text-title font-black font-serif uppercase tracking-tighter leading-[0.95] md:leading-none text-white">
                        {data.title} <br />
                        <span className="text-secondary italic underline decoration-secondary/30 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
                            {data.titleItalic}
                        </span>
                    </h2>
                    <p className="text-base md:text-2xl text-white/40 font-medium leading-relaxed">{data.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                    {advantageItems.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-8 md:space-y-10 text-center group"
                        >
                            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                                <div className="absolute inset-0 bg-secondary/10 rounded-[2.5rem] md:rounded-[3.5rem] rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-700" />
                                <div className="relative w-full h-full rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-700">
                                    <item.icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                <h4 className="text-2xl md:text-3xl font-black font-serif tracking-tight text-white">{item.title}</h4>
                                <p className="text-sm md:text-lg text-white/60 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
