"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Truck,
    MapPin,
    Package,
    Navigation,
    Activity,
    ShieldCheck,
    Clock,
    Box,
    ArrowRight,
    QrCode,
    Loader2,
    Globe,
    ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogisticsDashboard() {
    const [loading, setLoading] = useState(true);
    const [deliveries, setDeliveries] = useState([
        { id: "NODE-LGS-42", origin: "Jos Node", dest: "Lagos Hub", status: "In Transit", eta: "4h 20m", items: "20kg Grains", temp: "21°C" },
        { id: "NODE-LGS-88", origin: "Kano Node", dest: "Abuja Store", status: "Sorting", eta: "1d 2h", items: "50kg Onions", temp: "24°C" },
        { id: "NODE-LGS-12", origin: "Owerri Node", dest: "P/H Node", status: "Delivered", eta: "Done", items: "15kg Tubers", temp: "22°C" }
    ]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#06120e] flex flex-col items-center justify-center gap-8">
            <Truck size={64} className="text-secondary animate-bounce" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Broadcasting Logistics Mesh</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-cream/10">
            <Header />
            <main className="flex-grow pt-40 pb-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto space-y-16">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    <Globe className="w-3 h-3" strokeWidth={3} />
                                    Last-Mile Global Mesh
                                </div>
                                <h1 className="text-5xl md:text-8xl font-black font-serif italic text-primary uppercase tracking-tighter leading-none">
                                    Logistics <span className="text-secondary">Node</span>
                                </h1>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-primary/30 mb-1">Active Mesh Nodes</p>
                                    <p className="text-4xl font-black font-serif text-primary">124 <span className="text-secondary tracking-widest text-sm">LIVE</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Mesh Map Mock */}
                        <div className="h-[400px] bg-primary rounded-[4rem] relative overflow-hidden shadow-2xl group">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[10000ms]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

                            {/* Animated Pulse Points */}
                            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-secondary rounded-full animate-ping" />
                            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-secondary rounded-full animate-ping" />
                            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full animate-ping" />

                            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Activity size={20} className="text-secondary animate-pulse" />
                                        <h3 className="text-2xl font-black font-serif italic text-white">Sovereign Asset Tracking</h3>
                                    </div>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Real-time IoT telemetry from Citizen Cold-Vaults.</p>
                                </div>
                                <button className="bg-secondary text-primary px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">Sync Telemetry</button>
                            </div>
                        </div>

                        {/* Shipment Grid */}
                        <div className="grid lg:grid-cols-3 gap-10">

                            {/* Live Stats */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white p-12 rounded-[4rem] border border-primary/5 shadow-xl space-y-10">
                                    <h4 className="text-2xl font-black font-serif italic text-primary uppercase">Flow <span className="text-secondary">Metrics</span></h4>

                                    <div className="space-y-8">
                                        <Metric label="Total Distance Logged" value="12,402 km" progress={80} />
                                        <Metric label="Emission Offset" value="420 kg CO2" progress={45} />
                                        <Metric label="Cold-Vault Integrity" value="99.9%" progress={99} />
                                    </div>

                                    <div className="pt-10 border-t border-primary/5">
                                        <div className="flex items-center gap-4 text-primary mb-6">
                                            <ShieldCheck size={32} className="text-secondary" />
                                            <div>
                                                <p className="text-xs font-black uppercase">Asset Guard Active</p>
                                                <p className="text-[9px] text-primary/30 font-bold uppercase tracking-widest">Insurance Node #SHIELD-X</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-secondary p-12 rounded-[4rem] text-primary space-y-8 shadow-2xl relative overflow-hidden">
                                    <QrCode className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                                    <h4 className="text-2xl font-black font-serif italic leading-tight">Generate <br />Manifest QR</h4>
                                    <button className="bg-primary text-white w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Encrypt & Broadcast</button>
                                </div>
                            </div>

                            {/* Shipment List */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="flex justify-between items-center px-4">
                                    <h3 className="text-3xl font-black font-serif italic text-primary">Sovereign <span className="text-secondary">Shipments</span></h3>
                                    <div className="flex gap-4">
                                        <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary">Active</button>
                                        <button className="text-[10px] font-black uppercase text-primary/30 hover:text-secondary">Completed</button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {deliveries.map((d, i) => (
                                        <motion.div
                                            key={d.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white p-10 rounded-[3.5rem] border border-primary/5 shadow-lg hover:border-secondary transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-cream rounded-[2rem] flex items-center justify-center text-primary group-hover:bg-secondary transition-all">
                                                        <Box size={28} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h5 className="text-xl font-black font-serif">{d.items}</h5>
                                                        <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">{d.id}</p>
                                                    </div>
                                                </div>

                                                <div className="flex-grow flex items-center justify-center gap-8 group-hover:gap-12 transition-all">
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black uppercase text-primary/30 mb-1">Origin</p>
                                                        <p className="text-xs font-black uppercase">{d.origin}</p>
                                                    </div>
                                                    <ArrowRight size={20} className="text-secondary" />
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black uppercase text-primary/30 mb-1">Destination</p>
                                                        <p className="text-xs font-black uppercase">{d.dest}</p>
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-1">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'In Transit' ? 'bg-secondary text-primary' :
                                                            d.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-primary/5 text-primary/40'
                                                        }`}>
                                                        {d.status}
                                                    </span>
                                                    <p className="text-xs font-black font-serif mt-3 italic text-primary">ETA: {d.eta}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Metric({ label, value, progress }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/40">{label}</p>
                <p className="text-xl font-black font-serif text-primary">{value}</p>
            </div>
            <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-secondary"
                />
            </div>
        </div>
    );
}
