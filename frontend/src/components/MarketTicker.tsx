"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

const FALLBACK_DATA = [
    { crop: "Sweet Maize", price: "₦450/kg", change: "+12.4%", trend: "up", region: "Jos" },
    { crop: "Red Peppers", price: "₦1,200/bag", change: "-2.1%", trend: "down", region: "Kano" },
    { crop: "Catfish (Live)", price: "₦2,800/kg", change: "+5.8%", trend: "up", region: "Lagos" },
    { crop: "Organic Onions", price: "₦850/kg", change: "+8.2%", trend: "up", region: "Abuja" },
    { crop: "Habanero", price: "₦3,400/crate", change: "-1.5%", trend: "down", region: "Kaduna" },
    { crop: "Palm Oil", price: "₦18,000/25L", change: "+4.2%", trend: "up", region: "Ogun" },
];

export default function MarketTicker() {
    const [marketData, setMarketData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTicker() {
            try {
                const data = await fetcher('/api/landing');
                if (data?.ticker?.items && data.ticker.items.length > 0) {
                    setMarketData(data.ticker.items);
                } else {
                    setMarketData(FALLBACK_DATA);
                }
            } catch (error) {
                console.error("Ticker Load Error:", error);
                setMarketData(FALLBACK_DATA);
            } finally {
                setLoading(false);
            }
        }
        loadTicker();
    }, []);

    const displayData = marketData.length > 0 ? marketData : FALLBACK_DATA;

    return (
        <div className="w-full bg-white/40 backdrop-blur-xl border-y border-primary/5 py-3 relative z-40 overflow-hidden select-none">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex whitespace-nowrap items-center gap-8 md:gap-12"
            >
                {/* Duplicate the list to create a seamless loop */}
                {[...displayData, ...displayData].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 group">
                        <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-secondary/60" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">
                                {item.region}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-primary uppercase tracking-tight">
                                {item.crop}
                            </span>
                            <span className="text-sm font-bold text-primary/60 font-mono">
                                {item.price}
                            </span>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${item.trend === "up"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-red-500/10 text-red-500"
                                }`}>
                                {item.trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {item.change}
                            </div>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-primary/10" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
