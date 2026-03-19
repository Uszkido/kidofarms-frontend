"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { X, Box, Activity, ShieldCheck, Zap, AlertTriangle, Loader2 } from "lucide-react";



function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

interface OsmAdvancedTrackingMapProps {
    lat: number;
    lng: number;
    title: string;
    details: string;
    onClose?: () => void;
    shipmentData?: any;
}

export default function OsmAdvancedTrackingMap({ lat, lng, title, details, onClose, shipmentData }: OsmAdvancedTrackingMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const center: [number, number] = useMemo(() => [lat || 9.0820, lng || 8.6753], [lat, lng]);

    const customIcon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }, []);

    if (!isMounted) return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-secondary w-16 h-16" />
                <p className="text-white/20 font-black uppercase tracking-[0.6em] text-[10px]">Initializing Geoapify Vector Engine...</p>
            </div>
        </div>
    );

    const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}@2x.png?apiKey=${geoapifyApiKey}`;

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[1000] flex overflow-hidden font-sans">
            {/* Main Map Area */}
            <div className="flex-grow relative bg-[#1a1a1a]">
                <MapContainer
                    center={center}
                    zoom={12}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    className="h-full w-full z-10"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
                        url={tileUrl}
                    />
                    {customIcon && (
                        <Marker position={center} icon={customIcon}>
                            <Popup>
                                <div className="p-2 text-black">
                                    <h4 className="font-bold uppercase text-[10px] tracking-widest">{title}</h4>
                                    <p className="text-[9px] mt-1">{details}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                    <MapUpdater center={center} />
                </MapContainer>

                {/* Top Left Overlay: Node Status */}
                <div className="absolute top-10 left-10 space-y-4 pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/80 backdrop-blur-2xl p-8 rounded-[2rem] border-2 border-white/5 shadow-2xl min-w-[300px] pointer-events-auto"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <Activity size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px]">Node Hub #402 Locked</h3>
                                <p className="text-white/30 text-[9px] uppercase font-bold tracking-widest leading-none">Signal Stability: 94%</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-secondary shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Floating Map Labels */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/3 p-4 bg-black/90 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-white font-black uppercase tracking-tighter text-xs">Lagos Central Hub</span>
                    </motion.div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-10 right-10 w-16 h-16 bg-white/10 hover:bg-secondary hover:text-primary backdrop-blur-2xl rounded-full flex items-center justify-center text-white transition-all shadow-2xl border border-white/10 group active:scale-95 z-30"
                >
                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Sidebar: Logistics Pulse */}
            <div className="w-[450px] bg-black p-12 flex flex-col border-l border-white/5 relative z-30 shrink-0">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px]">OpenStreetMap Pulse Node</span>
                        <h2 className="text-6xl font-black font-serif italic text-white leading-none tracking-tighter uppercase">
                            NOD-9921-TRK <br />
                            <span className="text-white/40">{shipmentData?.destination || "JOS GRADE-A"}</span> <br />
                            <span className="text-secondary underline decoration-4 underline-offset-8 decoration-secondary/30">SAFFRON</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: Zap, label: "Carrier Node", value: shipmentData?.vehicleInfo || "Tunde Logistics" },
                            { icon: ShieldCheck, label: "Cargo Integrity", value: "99.9% Oxygen Sync" },
                            { icon: Activity, label: "Network Band", value: "OSM Network Core" },
                            { icon: AlertTriangle, label: "Potential Lag", value: "Minimal (3 Mins)" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/10 transition-all cursor-default"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-white/20 font-black uppercase tracking-widest text-[9px] mb-1">{stat.label}</p>
                                    <p className="text-lg font-black text-white uppercase tracking-tight">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                        <span>Status: Operational (OSM)</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Live Secure Stream</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
