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
        <section className="py-40 bg-primary/20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto space-y-10 mb-32">
                    <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">The Kido Advantage</span>
                    <h2 className="text-6xl md:text-8xl font-black font-serif uppercase tracking-tighter leading-none text-white">
                        {data.title} <br />
                        <span className="text-secondary italic underline decoration-secondary/30 decoration-8 underline-offset-8">
                            {data.titleItalic}
                        </span>
                    </h2>
                    <p className="text-2xl text-white/40 font-medium leading-relaxed">{data.subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-20">
                    {advantageItems.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-10 text-center group"
                        >
                            <div className="relative w-40 h-40 mx-auto">
                                <div className="absolute inset-0 bg-secondary/10 rounded-[3.5rem] rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-700" />
                                <div className="relative w-full h-full rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-700">
                                    <item.icon size={64} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-3xl font-black font-serif tracking-tight text-white">{item.title}</h4>
                                <p className="text-lg text-white/60 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
