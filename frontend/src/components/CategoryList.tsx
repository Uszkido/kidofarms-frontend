"use client";

import { motion } from "framer-motion";

const CATEGORIES = [
    { name: "Fruits", icon: "🍎" },
    { name: "Vegetables", icon: "🥬" },
    { name: "Wholesale", icon: "📦" },
    { name: "Fishes", icon: "🐟" },
    { name: "Grain Hub", icon: "🌾" },
    { name: "Artisan", icon: "🍯" },
];

export default function CategoryList() {
    return (
        <div className="flex justify-center gap-6 md:gap-20 flex-wrap overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-sm flex items-center justify-center text-3xl md:text-4xl group-hover:bg-secondary group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                        {cat.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-secondary transition-colors">
                        {cat.name}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
