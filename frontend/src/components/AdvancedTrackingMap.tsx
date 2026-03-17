"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
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
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // User needs to provide this
    });

    const center = useMemo(() => ({ lat, lng }), [lat, lng]);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    if (!isLoaded) return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-secondary w-16 h-16" />
                <p className="text-white/20 font-black uppercase tracking-[0.6em] text-[10px]">Initializing Google Orbit Engine...</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[1000] flex overflow-hidden font-sans">
            {/* Main Map Area */}
            <div className="flex-grow relative bg-[#1a1a1a]">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={mapOptions}
                >
                    <Marker
                        position={center}
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/truck.png",
                            scaledSize: new window.google.maps.Size(40, 40)
                        }}
                    />
                </GoogleMap>

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

                {/* Floating Map Labels (Simulated because markers are inside GoogleMap) */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/3 p-4 bg-black/90 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-white font-black uppercase tracking-tighter text-xs">Lagos Central Hub</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-1/2 right-1/2 bg-secondary p-6 rounded-[2rem] shadow-[0_0_40px_rgba(197,160,89,0.3)] flex flex-col items-center gap-2 pointer-events-auto"
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
