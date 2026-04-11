"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Satellite, Wifi, Battery, AlertTriangle, ShieldCheck, Thermometer, Droplets, Wind } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function SensorsDashboard() {
    const [loading, setLoading] = useState(true);
    const [sensors, setSensors] = useState<any[]>([]);

    useEffect(() => {
        // Mock data fetch representing IoT sensor integration
        setTimeout(() => {
            setSensors([
                { id: "S-1002", name: "Greenhouse Array Alpha", type: "Soil Moisture", value: "45%", location: "Jos Plateau, Block A", battery: 92, signal: "Strong", status: "optimal" },
                { id: "S-1003", name: "Hydroponic Bay 7", type: "pH Level", value: "6.2", location: "Kano, Sector B", battery: 45, signal: "Medium", status: "warning" },
                { id: "S-1004", name: "Cold Chain Transport #12", type: "Temperature", value: "2.4°C", location: "In Transit - Lokoja", battery: 100, signal: "Strong", status: "optimal" },
                { id: "S-1005", name: "Open Field Tracker", type: "GPS Tracking", value: "Active", location: "Ogun, Plot 14", battery: 12, signal: "Weak", status: "critical" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-[#040d0a] text-[#E6EDF3] p-10 font-sans selection:bg-secondary selection:text-primary">
            <div className="max-w-[1500px] mx-auto space-y-16">
                {/* 🌌 HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="space-y-6">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-secondary group transition-all mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back To Hub
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="w-16 h-1.5 bg-secondary rounded-full" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-secondary/60">IoT Infrastructure</h2>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black font-serif italic uppercase leading-[0.85] tracking-tighter text-white flex flex-col">
                            Crop & GPS <span className="text-secondary">Sensors</span>
                        </h1>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-3xl shadow-2xl flex items-center justify-between gap-10">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Active Mesh Network</p>
                            <p className="text-2xl font-black font-serif italic text-white flex items-center gap-3">
                                <Satellite className="text-secondary absolute opacity-20 blur-sm scale-[2]" />
                                ONLINE
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20">
                            <Wifi size={24} className="text-secondary" />
                        </div>
                    </div>
                </header>

                {/* 📡 SENSORS ARRAY */}
                <div className="bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden p-8 md:p-16">
                    <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-50 pointer-events-none" />

                    {loading ? (
                        <div className="p-32 flex flex-col items-center gap-6 text-center">
                            <Loader2 size={64} className="animate-spin text-secondary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Establishing Satellite Uplink...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {sensors.map((sensor) => (
                                <div key={sensor.id} className="bg-[#0b1612] p-8 rounded-3xl border border-white/5 group hover:border-secondary/30 transition-all shadow-xl space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-secondary/10 group-hover:text-secondary group-hover:border-secondary/20 transition-all">
                                            {sensor.type.includes("Moisture") ? <Droplets size={24} /> :
                                                sensor.type.includes("Temperature") ? <Thermometer size={24} /> :
                                                    sensor.type.includes("Wind") ? <Wind size={24} /> : <MapPin size={24} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest border shadow-lg ${sensor.status === 'optimal' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                sensor.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {sensor.status}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{sensor.id}</p>
                                        <h3 className="text-xl font-black font-serif uppercase tracking-tight text-white mb-2 leading-none">{sensor.name}</h3>
                                        <p className="text-[11px] font-mono text-white/40">{sensor.location}</p>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60 mb-1">Current Value</p>
                                            <p className="text-2xl font-black font-serif italic text-white">{sensor.value}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30">
                                                <Battery size={12} className={sensor.battery < 20 ? 'text-red-400' : 'text-green-400'} /> {sensor.battery}%
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30">
                                                <Wifi size={12} className="text-white/60" /> {sensor.signal}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

