"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ShieldCheck, Database, MapPin, Calendar, Thermometer, Droplets, ArrowRight, X, Fingerprint, Activity } from "lucide-react";
import { useState } from "react";

interface KidoTraceQRProps {
    batchId: string;
    productName: string;
    farmSource: string;
}

export default function KidoTraceQR({ batchId = "NOD-9921-TRK", productName = "Premium Saffron", farmSource = "Jos Plateau Hub" }: KidoTraceQRProps) {
    const [isOpen, setIsOpen] = useState(false);

    const stages = [
        { label: "Sowing", date: "Jan 12, 2026", status: "Verified", icon: <Database size={14} /> },
        { label: "Irrigation", date: "Feb 15, 2026", status: "IoT Monitored", icon: <Droplets size={14} /> },
        { label: "Harvest", date: "April 10, 2026", status: "Peak Ripeness", icon: <ShieldCheck size={14} /> },
        { label: "Quality Hub", date: "April 11, 2026", status: "A+ Grade", icon: <Fingerprint size={14} /> },
        { label: "Transit", date: "April 12, 2026", status: "Cold Chain Active", icon: <MapPin size={14} /> },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-secondary hover:bg-secondary hover:text-primary px-6 py-3 rounded-2xl transition-all group shadow-xl"
            >
                <QrCode size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-inherit">Trace Origin Node</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-[#040d0a]/90 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(20px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(20px)" }}
                            className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/5"
                        >
                            {/* LEFT: TECH STACK (QR DOCK) */}
                            <div className="md:w-1/3 bg-[#0a1a14] p-10 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 opacity-5"
                                >
                                    <QrCode size={400} />
                                </motion.div>

                                <div className="relative z-10 w-full aspect-square bg-secondary rounded-[2rem] flex items-center justify-center p-6 shadow-[0_20px_50px_rgba(196,255,1,0.3)] border-4 border-white/5 group">
                                    <QrCode size={120} className="text-primary group-hover:scale-95 transition-transform" />
                                    <motion.div
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute -bottom-4 right-4 bg-primary text-white p-3 rounded-xl shadow-2xl"
                                    >
                                        <Activity size={18} />
                                    </motion.div>
                                </div>
                                <div className="text-center space-y-2 relative z-10">
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-secondary">Batch Identity</p>
                                    <p className="text-sm font-black text-white font-mono uppercase tracking-widest">{batchId}</p>
                                </div>
                            </div>

                            {/* RIGHT: DATA FEED */}
                            <div className="flex-1 p-10 md:p-14 space-y-10 overflow-y-auto max-h-[80vh] bg-white">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Biotic Batch Certificate</h4>
                                        <h3 className="text-3xl font-black font-serif italic text-primary uppercase tracking-tighter">{productName}</h3>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-3 bg-neutral-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pb-8 border-b border-primary/5">
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-primary/5 flex items-center gap-4">
                                        <Thermometer size={20} className="text-secondary" />
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30">Node Temp</p>
                                            <p className="text-sm font-black text-primary">14.2°C</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-primary/5 flex items-center gap-4">
                                        <Droplets size={20} className="text-secondary" />
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-primary/30">Hydration</p>
                                            <p className="text-sm font-black text-primary">Optimal</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-primary italic underline underline-offset-4 decoration-2 decoration-secondary">Chronology Protocol</h5>
                                        <span className="text-[8px] font-black text-secondary uppercase animate-pulse">Live Link Active</span>
                                    </div>

                                    <div className="relative space-y-8 pl-8 border-l border-primary/5">
                                        {stages.map((stage, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
                                                    {stage.icon}
                                                </div>
                                                <div>
                                                    <h6 className="text-[11px] font-black uppercase text-primary mb-1">{stage.label}</h6>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[9px] font-bold text-primary/30 uppercase">{stage.date}</p>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-secondary">{stage.status}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary p-8 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer hover:bg-secondary hover:text-primary transition-all shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <ShieldCheck size={24} />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">Verify Batch Hash</p>
                                            <p className="text-[8px] font-mono opacity-40 uppercase truncate w-32">KIDO.V5.SHA256.402.JOS</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
