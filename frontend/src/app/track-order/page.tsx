"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Loader2, Package, MapPin, Truck, AlertTriangle, ShieldCheck, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Map to avoid SSR errors with Leaflet
// Dynamically import Maps to avoid SSR errors
const OsmMap = dynamic(() => import("@/components/OsmAdvancedTrackingMap"), {
    ssr: false,
    loading: () => <div className="p-10 flex items-center justify-center bg-white/5 rounded-[3rem]">
        <Loader2 className="animate-spin text-secondary" />
    </div>
});

const GoogleMap = dynamic(() => import("@/components/AdvancedTrackingMap"), {
    ssr: false,
    loading: () => <div className="p-10 flex items-center justify-center bg-white/5 rounded-[3rem]">
        <Loader2 className="animate-spin text-secondary" />
    </div>
});

interface Shipment {
    id: string;
    orderId: string;
    status: 'pending' | 'shipped' | 'in_transit' | 'delivered';
    origin: string;
    destination: string;
    currentLat: number;
    currentLng: number;
    temperatureAlert: boolean;
    updatedAt: string;
}

export default function TrackOrderPage() {
    const { data: session } = useSession();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapEngine, setMapEngine] = useState<'osm' | 'google'>('osm');
    const [aftershipData, setAftershipData] = useState<any>(null);

    useEffect(() => {
        if (selectedShipment && session) {
            fetch(getApiUrl(`/api/shipments/${selectedShipment.id}/aftership`), {
                headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.data?.tracking) {
                        setAftershipData(data.data.tracking);
                    }
                }).catch(console.error);
        }
    }, [selectedShipment, session]);

    useEffect(() => {
        const fetchShipments = async () => {
            if (!session) return;
            try {
                const res = await fetch(getApiUrl("/api/shipments"), {
                    headers: { "Authorization": `Bearer ${(session as any).accessToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setShipments(data);
                    if (data.length > 0) setSelectedShipment(data[0]);
                }
            } catch (error) {
                console.error("Logistics sync failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShipments();
    }, [session]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-primary">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-32">
                    <div className="flex flex-col items-center gap-6">
                        <Loader2 className="animate-spin text-secondary w-12 h-12" />
                        <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">Ping Logistics Node...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary">
            <Header />

            <main className="flex-grow pt-32 pb-40">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto space-y-16">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-16">
                            <div className="space-y-6">
                                <span className="bg-secondary/10 text-secondary px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-secondary/20 shadow-xl">Orbit v5.2 Logistics Node</span>
                                <h1 className="text-5xl md:text-8xl font-black font-serif text-white tracking-tighter leading-none">
                                    Track Your <br />
                                    <span className="text-secondary italic">Provision.</span>
                                </h1>
                                <p className="text-white/40 text-xl font-medium max-w-xl">Real-time satellite trajectory and cold-chain monitoring for your premium harvest orders.</p>
                            </div>
                            <div className="h-40 w-40 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                                <Truck size={80} className="text-white/10 group-hover:text-secondary/20 group-hover:scale-125 transition-all duration-1000" />
                                <div className="absolute inset-x-0 bottom-0 py-2 bg-secondary text-primary text-[8px] font-black uppercase tracking-widest text-center">Node Active</div>
                            </div>
                        </div>

                        {shipments.length === 0 ? (
                            <div className="p-20 md:p-40 rounded-[4rem] bg-white/5 border-2 border-white/10 text-center space-y-10 flex flex-col items-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent pointer-events-none" />
                                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:text-secondary transition-all">
                                    <Package size={64} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black font-serif text-white uppercase italic">Zero Active Carriers</h3>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] max-w-xs mx-auto">No orders are currently in transit to your coordinates.</p>
                                </div>
                                <button className="bg-secondary text-primary px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl active:scale-95">Go to Market Hub</button>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-12 gap-10 items-start">
                                {/* Left Sidebar - Current Shipments */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/50" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Active Vectors</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {shipments.map(shipment => (
                                            <button
                                                key={shipment.id}
                                                onClick={() => setSelectedShipment(shipment)}
                                                className={`w-full p-8 rounded-[2.5rem] border transition-all text-left flex items-center justify-between group relative overflow-hidden ${selectedShipment?.id === shipment.id ? 'bg-white border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                            >
                                                {selectedShipment?.id === shipment.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none" />
                                                )}
                                                <div className="space-y-3 relative z-10">
                                                    <p className={`text-[9px] font-black uppercase tracking-widest ${selectedShipment?.id === shipment.id ? 'text-primary/40' : 'text-white/20'}`}>Ref: #{shipment.id.slice(0, 8).toUpperCase()}</p>
                                                    <h4 className={`text-2xl font-black font-serif italic uppercase ${selectedShipment?.id === shipment.id ? 'text-primary' : 'text-white'}`}>To {shipment.destination}</h4>
                                                    <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${selectedShipment?.id === shipment.id ? 'text-secondary bg-primary px-3 py-1 rounded-full border border-primary/20' : 'text-secondary'}`}>
                                                        <Truck size={12} /> {shipment.status}
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedShipment?.id === shipment.id ? 'bg-primary text-secondary' : 'bg-white/10 text-white/20 group-hover:text-white'}`}>
                                                    <Package size={20} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Content - Tracking Interface */}
                                <div className="lg:col-span-8 space-y-10">
                                    <AnimatePresence mode="wait">
                                        {selectedShipment && (
                                            <motion.div
                                                key={selectedShipment.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-10"
                                            >
                                                {/* Map Section */}
                                                <div className="relative group p-4 bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl">
                                                    <div className="absolute inset-x-0 top-0 px-10 pt-6 pb-20 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Tracking Engine</h4>
                                                        <button
                                                            onClick={() => setMapEngine(mapEngine === 'osm' ? 'google' : 'osm')}
                                                            className="pointer-events-auto bg-black border border-white/10 text-secondary px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl"
                                                        >
                                                            Switch to {mapEngine === 'osm' ? 'Google Maps' : 'OpenStreetMap'}
                                                        </button>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                                    {mapEngine === 'osm' ? (
                                                        <OsmMap
                                                            lat={selectedShipment.currentLat}
                                                            lng={selectedShipment.currentLng}
                                                            title={`Shipment #${selectedShipment.id.slice(0, 8)}`}
                                                            details={`Status: ${selectedShipment.status} | Temperature: Optimal`}
                                                            onClose={() => { }}
                                                            shipmentData={selectedShipment}
                                                        />
                                                    ) : (
                                                        <GoogleMap
                                                            lat={selectedShipment.currentLat}
                                                            lng={selectedShipment.currentLng}
                                                            title={`Shipment #${selectedShipment.id.slice(0, 8)}`}
                                                            details={`Status: ${selectedShipment.status} | Temperature: Optimal`}
                                                            onClose={() => { }}
                                                            shipmentData={selectedShipment}
                                                        />
                                                    )}

                                                    {selectedShipment.temperatureAlert && (
                                                        <div className="absolute top-10 left-10 z-20 flex items-center gap-4 bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] animate-pulse shadow-2xl">
                                                            <Thermometer size={16} /> Temperature Variance Alert
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Metrics & Sensors */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-all cursor-crosshair">
                                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-lg shadow-secondary/10">
                                                            <MapPin size={28} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">GPS Coordinates</h5>
                                                            <p className="text-2xl font-black text-white font-serif">{selectedShipment.currentLat.toFixed(4)}N, {selectedShipment.currentLng.toFixed(4)}E</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-all cursor-crosshair">
                                                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-lg shadow-secondary/10">
                                                            <ShieldCheck size={28} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Network Verification</h5>
                                                            <p className="text-2xl font-black text-white font-serif uppercase tracking-tighter">Chain Encrypted</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-10 rounded-[3rem] bg-secondary text-primary space-y-6 shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform">
                                                        <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
                                                            <AlertTriangle size={28} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Carrier Protocol</h5>
                                                            <p className="text-2xl font-black font-serif italic uppercase tracking-tighter">Fast-Track Mode</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Real-time Status Timeline */}
                                                <div className="p-12 md:p-16 rounded-[4rem] bg-neutral-950 border border-white/5 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
                                                    <div className="space-y-12">
                                                        <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                                            <h4 className="text-2xl font-black font-serif uppercase tracking-tight text-white">Transmission History</h4>
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Verified Ledger</span>
                                                        </div>
                                                        <div className="space-y-10">
                                                            {aftershipData?.checkpoints?.length > 0 ? (
                                                                aftershipData.checkpoints.map((cp: any, i: number) => (
                                                                    <div key={i} className={`flex gap-8 group ${i > 0 ? 'opacity-40' : ''}`}>
                                                                        <div className={`w-1 h-32 md:h-12 rounded-full relative overflow-hidden shrink-0 ${i === 0 ? 'bg-secondary/20' : 'bg-white/10'}`}>
                                                                            {i === 0 && <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary" />}
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary">{cp.city || 'Transit Node'} {cp.tag ? `[${cp.tag}]` : ''}</p>
                                                                            <p className="text-2xl font-medium text-white italic group-hover:text-secondary transition-colors leading-tight">{cp.message || "Carrier maintains satellite lock."}</p>
                                                                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{new Date(cp.created_at).toLocaleString()}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <div className="flex gap-8 group">
                                                                        <div className="w-1 h-32 md:h-12 bg-secondary/20 rounded-full relative overflow-hidden shrink-0">
                                                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-secondary" />
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Now Protocol</p>
                                                                            <p className="text-2xl font-medium text-white italic group-hover:text-secondary transition-colors leading-tight">{selectedShipment.status === 'in_transit' ? 'Carrier maintains satellite lock on destination vector.' : 'Verification sequence complete.'}</p>
                                                                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{new Date(selectedShipment.updatedAt).toLocaleTimeString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-8 group opacity-40">
                                                                        <div className="w-1 h-12 bg-white/10 rounded-full shrink-0" />
                                                                        <div className="space-y-2">
                                                                            <p className="text-[10px] font-medium text-white/40 italic">Previous Log: Dispatched from {selectedShipment.origin} Node</p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
