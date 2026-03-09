"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X, ShoppingCart, Search, Info, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

export default function KidoConcierge() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: ShoppingCart, label: "View Cart", link: "/cart", color: "bg-primary text-white" },
        { icon: Search, label: "Search Store", link: "/shop", color: "bg-secondary text-primary" },
        { icon: Leaf, label: "Track Harvest", link: "/track-harvest", color: "bg-green-100 text-green-700" },
        { icon: Info, label: "Our Story", link: "/about", color: "bg-cream text-primary" },
    ];

    return (
        <div className="fixed bottom-12 right-12 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-72 bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl border border-primary/5 space-y-8"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Kido Concierge</span>
                            </div>
                            <h4 className="text-2xl font-black font-serif text-primary">How can we help you today?</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {menuItems.map((item, i) => (
                                <Link key={i} href={item.link} onClick={() => setIsOpen(false)}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 hover:bg-white transition-colors border border-primary/5 group"
                                    >
                                        <div className={`p-2.5 rounded-xl ${item.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-sm font-black text-primary uppercase tracking-tight">{item.label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-primary/5">
                            <div className="bg-secondary/10 p-5 rounded-[2rem] space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                                    <Leaf size={12} /> Daily Freshness Tip
                                </p>
                                <p className="text-xs font-bold text-primary/70 leading-relaxed">
                                    "Keep your tomatoes at room temperature for maximum flavor. Cold storage kills the organic aroma!"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? "bg-primary text-white" : "bg-secondary text-primary"
                    }`}
            >
                {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={28} strokeWidth={2.5} />}
            </motion.button>
        </div>
    );
}
