"use client";

import { useState, useEffect } from "react";
import { X, Navigation, MapPin, Truck, ShieldCheck, Zap, Radio, CheckCircle2, AlertTriangle, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogisticsMeshMapProps {
    isOpen: boolean;
    onClose: () => void;
    trackingId: string;
    productName: string;
}

export function LogisticsMeshMap({ isOpen, onClose, trackingId, productName }: LogisticsMeshMapProps) {
    const [status, setStatus] = useState("Synchronizing Node...");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            const intervals = [
                { time: 1000, msg: "Triangulating GPS Sigils..." },
                { time: 2500, msg: "Node Hub #402 Locked" },
                { time: 4000, msg: "Streaming Real-time Mesh Data" }
            ];

            intervals.forEach((step, i) => {
                setTimeout(() => {
                    setStatus(step.msg);
                    setProgress((i + 1) * 33);
                }, step.time);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-primary/60 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative w-full max-w-5xl h-[80vh] bg-neutral-900 rounded-[4rem] overflow-hidden shadow-2xl border-2 border-white/10 flex flex-col md:flex-row"
                >
                    {/* Map Simulation Area */}
                    <div className="flex-grow relative bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center">
                        <div className="absolute inset-0 bg-primary/40 backdrop-contrast-125" />

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Tracking Pulses */}
                        <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 bg-secondary/30 rounded-full animate-ping" />
                            <div className="absolute inset-0 m-auto w-4 h-4 bg-secondary rounded-full shadow-[0_0_20px_rgba(255,184,74,1)]" />
                            <div className="absolute top-full mt-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/10 whitespace-nowrap">
                                <MapPin size={10} className="inline mr-2 text-secondary" /> Lagos Central Hub
                            </div>
                        </div>

                        <div className="absolute top-[60%] left-[70%] -translate-x-1/2 -translate-y-1/2">
                            <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 animate-pulse" />
                            <Truck size={32} className="text-white absolute inset-0 m-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-secondary text-primary px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl animate-bounce">
                                Active Node in Transit
                            </div>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute top-8 left-8 space-y-4">
                            <div className="bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Radio className="text-secondary animate-pulse" size={16} />
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{status}</p>
                                </div>
                                <div className="h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-secondary rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={onClose} className="absolute top-8 right-8 w-14 h-14 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-secondary hover:text-primary transition-all z-20">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Info Sidebar */}
                    <div className="w-full md:w-96 bg-black p-10 md:p-12 space-y-10 flex flex-col justify-between shrink-0">
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <p className="text-secondary font-black uppercase text-[10px] tracking-[0.3em]">Live Logistics Pulse</p>
                                <h3 className="text-white text-3xl font-black font-serif italic uppercase tracking-tighter leading-none">{trackingId} <br /><span className="text-white/40">{productName}</span></h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: User, label: "Carrier Node", value: "Tunde Logistics" },
                                    { icon: ShieldCheck, label: "Cargo Integrity", value: "99.9% Oxygen Sync" },
                                    { icon: Zap, label: "Network Band", value: "5G Mesh Active" },
                                    { icon: AlertTriangle, label: "Potential Lag", value: "Minimal (3 mins)" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <item.icon size={20} className="text-secondary shrink-0" />
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                                            <p className="text-[11px] font-black text-white uppercase">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-secondary/20 to-transparent p-6 rounded-3xl border border-secondary/20">
                                <p className="text-[9px] font-black uppercase tracking-widest text-secondary mb-2">Arrival Probability</p>
                                <p className="text-4xl font-black font-serif italic text-white">92% <span className="text-sm font-sans uppercase not-italic opacity-40">On Time</span></p>
                            </div>
                            <button className="w-full py-5 bg-secondary text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3">
                                Contact Carrier Hub <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
