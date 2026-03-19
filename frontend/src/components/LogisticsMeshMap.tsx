"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Navigation, MapPin, Truck, ShieldCheck, Zap, Radio, CheckCircle2, AlertTriangle, ArrowRight, User, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LogisticsMeshMapProps {
    isOpen: boolean;
    onClose: () => void;
    trackingId: string;
    productName: string;
}

export function LogisticsMeshMap({ isOpen, onClose, trackingId, productName }: LogisticsMeshMapProps) {
    const [status, setStatus] = useState("Synchronizing Node...");
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const intervals = [
                { time: 1000, msg: "Geoapify Signal Lock..." },
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

    // Lagos coordinates roughly
    const center: [number, number] = [6.5244, 3.3792];

    // Custom Icons
    const hubIcon = useMemo(() => L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center animate-pulse"><div class="w-3 h-3 bg-secondary rounded-full"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    }), []);

    const truckIcon = useMemo(() => L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl animate-bounce"><svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="none" class="animate-pulse"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h4"/><circle cx="17" cy="18" r="2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-3h-3.5"/><path d="M16 10v4h6"/></svg></div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
    }), []);

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
                    {/* Map Area */}
                    <div className="flex-grow relative bg-neutral-950 overflow-hidden">
                        {isMounted && isOpen && (
                            <MapContainer
                                center={center}
                                zoom={12}
                                scrollWheelZoom={true}
                                className="h-full w-full z-10"
                                zoomControl={false}
                            >
                                <TileLayer
                                    attribution='&copy; Geoapify'
                                    url={`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}@2x.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
                                />

                                {/* Hub Marker */}
                                <Marker position={center} icon={hubIcon}>
                                    <Popup className="premium-popup">
                                        <div className="p-3">
                                            <p className="text-[10px] font-black uppercase text-secondary">Lagos Central Hub</p>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Simulated Truck Marker */}
                                <Marker position={[6.53, 3.39]} icon={truckIcon}>
                                    <Popup className="premium-popup">
                                        <div className="p-3">
                                            <p className="text-[10px] font-black uppercase text-secondary">Node {trackingId}</p>
                                            <p className="text-[12px] font-black text-primary uppercase">{productName}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )}

                        <div className="absolute inset-0 bg-primary/20 pointer-events-none z-20" />

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none z-30" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Stats Overlay */}
                        <div className="absolute top-8 left-8 space-y-4 z-40">
                            <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <Radio className="text-secondary animate-pulse" size={16} />
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{status}</p>
                                </div>
                                <div className="h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(255,184,74,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={onClose} className="absolute top-8 right-8 w-14 h-14 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20 hover:bg-secondary hover:text-primary transition-all z-[60] shadow-2xl">
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
