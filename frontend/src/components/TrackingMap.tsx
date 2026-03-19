"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

interface TrackingMapProps {
    lat: number;
    lng: number;
    title: string;
    details: string;
}

export default function TrackingMap({ lat, lng, title, details }: TrackingMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[400px] bg-primary/5 rounded-3xl animate-pulse flex items-center justify-center text-primary/20 font-black uppercase tracking-widest text-[10px]">Initializing Map Node...</div>;

    const center: [number, number] = [lat || 9.0820, lng || 8.6753];

    const icon = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
    }, []);
    const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}@2x.png?apiKey=${geoapifyApiKey}`;

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative z-10 bg-[#161616]">
            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={false}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
                    url={tileUrl}
                />
                {icon && (
                    <Marker position={center} icon={icon}>
                        <Popup className="font-sans">
                            <div className="p-2 text-black">
                                <h4 className="font-bold uppercase text-[10px] tracking-widest">{title}</h4>
                                <p className="text-[9px] mt-1 text-black/60">{details}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                <MapUpdater center={center} />
            </MapContainer>
        </div>
    );
}
