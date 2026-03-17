"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Default Icon Issue
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

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

    const center: [number, number] = [lat || 9.0820, lng || 8.6753]; // Default to Nigeria Center if coords are null

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl relative z-10">
            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={center} icon={icon}>
                    <Popup className="font-sans">
                        <div className="p-2">
                            <h4 className="font-bold text-primary">{title}</h4>
                            <p className="text-[10px] text-primary/60">{details}</p>
                        </div>
                    </Popup>
                </Marker>
                <MapUpdater center={center} />
            </MapContainer>
        </div>
    );
}
