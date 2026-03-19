"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { Truck, MapPin, Activity, Box } from "lucide-react";

// Custom Icons for different vehicle types
const truckIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface FleetUnit {
    id: string;
    userName: string;
    vehicleType: string;
    vehiclePlate: string;
    status: string;
    currentLat?: number;
    currentLng?: number;
}

interface FleetOverviewMapProps {
    units: FleetUnit[];
}

export default function FleetOverviewMap({ units }: FleetOverviewMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Center on Nigeria by default
    const center: [number, number] = [9.0820, 8.6753];

    if (!isMounted) return (
        <div className="w-full h-[600px] bg-primary/5 rounded-[3rem] animate-pulse flex items-center justify-center">
            <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">Loading Fleet Matrix...</p>
        </div>
    );

    return (
        <div className="w-full h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
            {/* Legend Overlay */}
            <div className="absolute top-6 left-6 z-20 space-y-2">
                <div className="bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Active Fleet: {units.length} Units</span>
                    </div>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                className="h-full w-full z-10"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
                    url={`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}@2x.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
                />

                {units.map((unit) => {
                    const lat = unit.currentLat || 9.0820 + (Math.random() - 0.5) * 2; // Demo random if not set
                    const lng = unit.currentLng || 8.6753 + (Math.random() - 0.5) * 2;

                    return (
                        <Marker key={unit.id} position={[lat, lng]} icon={truckIcon}>
                            <Popup className="premium-popup">
                                <div className="p-3 space-y-2 min-w-[180px]">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black uppercase text-[11px] tracking-widest text-primary">{unit.userName}</h4>
                                        <span className="text-[8px] font-black uppercase bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{unit.status}</span>
                                    </div>
                                    <p className="text-[10px] text-primary/60 font-bold uppercase">{unit.vehicleType} • {unit.vehiclePlate}</p>
                                    <div className="pt-2 border-t border-primary/5 flex items-center gap-2">
                                        <Activity size={12} className="text-secondary" />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">Lat: {lat.toFixed(4)} Lng: {lng.toFixed(4)}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Bottom Controls UI */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 pointer-events-auto">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Fleet Engine: GEOAPIFY-CORE-ORBIT</span>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                    <div className="bg-secondary p-4 rounded-2xl text-primary shadow-xl">
                        <MapPin size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}
