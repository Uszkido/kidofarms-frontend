"use client";

import { useState } from "react";
import {
    Zap,
    TrendingUp,
    ArrowLeft,
    Activity,
    DollarSign,
    Scale,
    Edit3,
    BarChart3,
    RefreshCw,
    Check
} from "lucide-react";
import Link from "next/link";

export default function PricingOraclePage() {
    const [commodities, setCommodities] = useState([
        { name: "Sorghum", current: "₦420/kg", change: "+12%", health: "Optimal" },
        { name: "Maize (White)", current: "₦380/kg", change: "-2%", health: "Syncing" },
        { name: "Soybeans", current: "₦550/kg", change: "+4%", health: "Optimal" },
        { name: "Wheat", current: "₦610/kg", change: "+18%", health: "High Volatility" },
    ]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleEditStart = (index: number, currentVal: string) => {
        setEditingIndex(index);
        setEditValue(currentVal.split('/')[0].replace('₦', ''));
    };

    const handleEditSave = (index: number) => {
        const newComs = [...commodities];
        newComs[index].current = `₦${editValue}/kg`;
        setCommodities(newComs);
        setEditingIndex(null);
    };

    return (
        <div className="min-h-screen bg-[#040d0a] text-white p-6 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link href="/admin/market" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Market Nexus
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black font-serif uppercase tracking-tighter leading-none italic">
                            Pricing <br /><span className="text-secondary">Oracle</span>
                        </h1>
                    </div>
                    <button className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                        <RefreshCw size={20} /> Re-Sync Neural Indices
                    </button>
                </div>

                {/* Market Intelligence Grid */}
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-10 overflow-hidden backdrop-blur-3xl shadow-2xl">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black font-serif uppercase italic text-white text-white">Live <span className="text-secondary">Indices</span></h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {commodities.map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl flex items-center justify-between group hover:border-secondary transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black font-serif italic text-white uppercase">{item.name}</h4>
                                                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Global Sync Health: {item.health}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-1 flex justify-end mr-6">
                                            <div className="flex flex-col items-end">
                                                {editingIndex === i ? (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-white font-serif italic text-2xl">₦</span>
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-24 bg-white/5 border border-secondary/50 rounded-xl px-3 py-1 text-white font-serif italic text-xl outline-none focus:border-secondary transition-all"
                                                            autoFocus
                                                            onKeyDown={(e) => e.key === 'Enter' && handleEditSave(i)}
                                                        />
                                                        <span className="text-white/40 font-serif italic text-lg">/kg</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-2xl font-black font-serif text-white italic">{item.current}</p>
                                                )}
                                                <p className={`text-[10px] font-black tracking-widest ${item.change.startsWith('+') ? 'text-green-500' : 'text-secondary'}`}>{item.change} (Last 24h)</p>
                                            </div>
                                        </div>
                                        <div className="w-16 flex justify-end">
                                            {editingIndex === i ? (
                                                <button onClick={() => handleEditSave(i)} className="p-4 bg-secondary text-primary rounded-2xl transition-all hover:scale-110 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                                                    <Check size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleEditStart(i, item.current)} className="p-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary hover:text-primary">
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-secondary rounded-[3.5rem] p-10 text-primary space-y-6 relative overflow-hidden group">
                            <BarChart3 className="absolute -bottom-10 -right-10 text-primary/10 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-3xl font-black font-serif italic uppercase leading-tight">Neural <br />Market Analysis</h3>
                            <p className="text-primary/60 text-[10px] font-black uppercase leading-relaxed tracking-widest italic">Kido AI predicts a 4.2% surge in grain prices across internal nodes in the next 72 hours.</p>
                            <button className="w-full bg-primary text-secondary py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Download Forecast</button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Volatility Index</h4>
                            <div className="flex items-baseline gap-4">
                                <span className="text-6xl font-black font-serif italic text-white">0.32</span>
                                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">● Stabilizing</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[32%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
