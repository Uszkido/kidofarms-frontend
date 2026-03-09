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
        <div className="flex justify-center gap-10 md:gap-20 flex-wrap">
            {CATEGORIES.map((cat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                    <div className="w-20 h-20 rounded-[2rem] bg-neutral-50 border border-primary/5 shadow-sm flex items-center justify-center text-4xl group-hover:bg-secondary group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                        {cat.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 group-hover:text-primary transition-colors">
                        {cat.name}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
