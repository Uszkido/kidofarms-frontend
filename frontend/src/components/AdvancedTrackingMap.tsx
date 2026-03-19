"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { X, Box, Activity, ShieldCheck, Zap, AlertTriangle, Loader2 } from "lucide-react";

interface AdvancedTrackingMapProps {
    lat: number;
    lng: number;
    title: string;
    details: string;
    onClose?: () => void;
    shipmentData?: any;
}

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        { "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#523735" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f1e6" }] },
        { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9b2a6" }] },
        { "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [{ "color": "#dcd2be" }] },
        { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#ae9e90" }] },
        { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
        { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#93817c" }] },
        { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a5b076" }] },
        { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#447530" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#f5f1e6" }] },
        { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#fdfcf8" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#f8c967" }] },
        { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#e9bc62" }] },
        { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#e98d58" }] },
        { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "color": "#db8555" }] },
        { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#806b63" }] },
        { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
        { "featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{ "color": "#8f7d77" }] },
        { "featureType": "transit.line", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ebe3cd" }] },
        { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
        { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#b9d3c2" }] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#92998d" }] }
    ]
};

export default function AdvancedTrackingMap({ lat, lng, title, details, onClose, shipmentData }: AdvancedTrackingMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const center: [number, number] = useMemo(() => [lat, lng], [lat, lng]);

    const truckIcon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.5)] animate-bounce text-primary"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h4"/><circle cx="17" cy="18" r="2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-3h-3.5"/><path d="M16 10v4h6"/></svg></div>`,
            iconSize: [48, 48],
            iconAnchor: [24, 48]
        });
    }, []);

    const hubIcon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-8 h-8 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl"><div class="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(197,160,89,1)]"></div></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }, []);

    if (!isMounted) return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-secondary w-16 h-16" />
                <p className="text-white/20 font-black uppercase tracking-[0.6em] text-[10px]">Initializing Orbit Engine...</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[1000] flex overflow-hidden font-sans">
            {/* Main Map Area */}
            <div className="flex-grow relative bg-[#1a1a1a]">
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

                    {/* Active Shipment Marker */}
                    {truckIcon && (
                        <Marker position={center} icon={truckIcon}>
                            <Popup className="premium-popup">
                                <div className="p-3">
                                    <p className="text-[10px] font-black uppercase text-secondary">In Transit</p>
                                    <p className="text-[12px] font-black text-primary uppercase">{title}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Hub Marker */}
                    {hubIcon && (
                        <Marker position={[lat + 0.02, lng - 0.03]} icon={hubIcon}>
                            <Popup className="premium-popup">
                                <div className="p-3">
                                    <p className="text-[10px] font-black uppercase text-secondary">Lagos Central Hub</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Top Left Overlay: Node Status */}
                <div className="absolute top-10 left-10 space-y-4 pointer-events-none">
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

                {/* Floating Map Labels Overlay (Higher Z-Index than MapContainer) */}
                <div className="absolute inset-0 pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/3 p-4 bg-black/90 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                        <span className="text-white font-black uppercase tracking-tighter text-xs">Lagos Central Hub</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-[60%] right-1/2 bg-secondary p-6 rounded-[2rem] shadow-[0_0_40px_rgba(197,160,89,0.3)] flex flex-col items-center gap-2 pointer-events-auto"
                    >
                        <span className="text-primary font-black uppercase tracking-widest text-[10px]">Active Node</span>
                        <span className="text-primary font-black uppercase tracking-widest text-[10px]">In Transit</span>
                        <div className="mt-2 w-10 h-10 bg-primary text-secondary rounded-xl flex items-center justify-center">
                            <Box size={20} />
                        </div>
                    </motion.div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-10 right-10 w-16 h-16 bg-white/10 hover:bg-secondary hover:text-primary backdrop-blur-2xl rounded-full flex items-center justify-center text-white transition-all shadow-2xl border border-white/10 group active:scale-95"
                >
                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Sidebar: Logistics Pulse */}
            <div className="w-[450px] bg-black p-12 flex flex-col border-l border-white/5 relative z-10 shrink-0">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px]">Live Logistics Pulse</span>
                        <h2 className="text-6xl font-black font-serif italic text-white leading-none tracking-tighter uppercase">
                            NOD-9921-TRK <br />
                            <span className="text-white/40">{shipmentData?.destination || "JOS GRADE-A"}</span> <br />
                            <span className="text-secondary underline decoration-4 underline-offset-8 decoration-secondary/30">SAFFRON</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: Zap, label: "Carrier Node", value: "Tunde Logistics" },
                            { icon: ShieldCheck, label: "Cargo Integrity", value: "99.9% Oxygen Sync" },
                            { icon: Activity, label: "Network Band", value: "5G Mesh Active" },
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
                        <span>Status: Operational</span>
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
